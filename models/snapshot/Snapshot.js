const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getSnapshot = require('./functions/getSnapshot');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e3;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;
const PRICE_UPDATE_INTERVAL = 1 * 60 * 1e3;
const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 20;

const Schema = mongoose.Schema;

const SnapshotSchema = new Schema({
  is_hour: {
    type: Boolean,
    required: true
  },
  is_day: {
    type: Boolean,
    required: true
  },
  is_month: {
    type: Boolean,
    required: true
  },
  is_year: {
    type: Boolean,
    required: true
  },
  chain_id: {
    type: mongoose.Types.ObjectId,
    trim: true,
    maxlenght: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  // full_time_chain_count: {
  //   //required: true,
  //   type: Number
  // },
  current_token_balance: {
    type: Number
  },
  each_day_token_balance: {
    type: Number
  },
  each_month_token_balance: {
    type: Number
  },
  each_year_token_balance: {
    type: Number
  },
  current_usd_balance: {
    type: Number
  },
  each_day_usd_balance: {
    type: Number
  },
  each_month_usd_balance: {
    type: Number
  },
  each_year_usd_balance: {
    type: Number
  },
  date: {
    type: Number,
    required: true
  }
});

SnapshotSchema.statics.findSnapshotById = function (id, callback) {
  const Snapshot = this;

  if(!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Snapshot.findById(id, (err, snapshot) => {
    if (err) return callback('database_error');
    if (!snapshot) return callback('document_not_found');

    return callback(null, snapshot)
  })
}

SnapshotSchema.statics.findSnapshotByIdAndFormat = function (id, callback) {
  const Snapshot = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

    Snapshot.findWalletById(id, (err, snapshot) => {
      if (err) return callback(err);

      getSnapshot(snapshot, (err, snapshot) => {
        if (err) return callback(err);

        return callback(null, snapshot);
      });
    });
};

SnapshotSchema.statics.createSnapshot = function (data, callback) {
  const Snapshot = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const newSnapshot = new Snapshot({
    is_hour: data.is_hour,
    is_day: data.is_day,
    is_month: data.is_month,
    is_year: data.is_year,
    chain_id: data.chain_id,
    //full_time_chain_count: data.full_time_chain_count,
    current_token_balance: data.current_token_balance,
    current_usd_balance: data.current_usd_balance,
    each_day_token_balance: data.each_day_token_balance,
    each_day_usd_balance: data.each_day_usd_balance,
    each_month_token_balance: data.each_month_token_balance,
    each_month_usd_balance: data.each_month_usd_balance,
    each_year_token_balance: data.each_year_token_balance,
    each_year_usd_balance: data.each_year_usd_balance,
    date: Date.now()
  });

  newSnapshot.save((err, snapshot) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err) {
      console.log(err)
      return callback('database_error');
    };
    return callback(null, snapshot);
  });
};

SnapshotSchema.statics.findSnapshotsByFilters = function (data, callback) {
  const Snapshot = this;

  let filters = {};
  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (data.chain_id && validator.isMongoId(data.chain_id.toString()))
    filters.chain_id = data.chain_id.toString();

  if (data.date && typeof data.date === 'object') {
    filters = data;
  }
  Snapshot
    .find(filters)
    .sort({ order: 1})
    .exec((err, snapshots) => {
      if (err) {
        return callback('database_error');
      }
      return callback(null, snapshots);
    });
};

SnapshotSchema.statics.findSnapshotsByIdAndDelete = function (id, callback) {
  const Snapshot = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Snapshot.findOneAndDelete({ _id: id }, (err, snapshot) => {
    if (err) return callback('database_error');
    if (!snapshot) return callback('document_not_found');

    return callback(null);
  })
};

SnapshotSchema.statics.findSnapshotsByFiltersAndMerge = function (data, callback) {
  const Snapshot = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  Snapshot.findSnapshotsByFilters(data, (err, snapshots) => {
    if (err) return callback(err);

    if (snapshots && snapshots.length > 0) {
      console.log(snapshots);
      let mergeData;

      if (!data.is_hour && !data.is_day && !data.is_month && !data.is_year) {
        mergeData = {
          is_hour: true,
          is_day: false,
          is_month: false,
          is_year: false,
          current_token_balance: snapshots[0].current_token_balance,
          current_usd_balance: snapshots[0].current_usd_balance
        };
      } else if (data.is_hour && !data.is_day && !data.is_month && !data.is_year) {
        mergeData = {
          is_hour: false,
          is_day: true,
          is_month: false,
          is_year: false,
          current_token_balance: snapshots[0].current_token_balance,
          current_usd_balance: snapshots[0].current_usd_balance
        };
      } else if (!data.is_hour && data.is_day && !data.is_month && !data.is_year) {
        mergeData = {
          is_hour: false,
          is_day: false,
          is_month: true,
          is_year: false,
          current_token_balance: snapshots[0].current_token_balance,
          current_usd_balance: snapshots[0].current_usd_balance
        };
      } else if (!data.is_hour && !data.is_day && data.is_month && !data.is_year) {
        mergeData = {
          is_hour: false,
          is_day: false,
          is_month: false,
          is_year: true,
          current_token_balance: snapshots[0].current_token_balance,
          current_usd_balance: snapshots[0].current_usd_balance
        };
      }

      Snapshot.createSnapshot(mergeData, (err, newSnapshot) => {
        if (err) return callback(err);
        console.log('************');
        console.log(newSnapshot);
        console.log('************');

        const filterData = {
          is_hour: data.is_hour,
          is_day: data.is_day,
          is_month: data.is_month,
          is_year: data.is_year,
          date: { $lte: Date.now() - (1 * 60 * 1000) } // dont forget to change it 15
        };
        console.log(filterData);

        Snapshot.findSnapshotsByFilters(filterData, (err, snapshotsToDelete) => {
          if (err) return callback(err);

          if (snapshotsToDelete && snapshotsToDelete.length > 0) {
            async.eachSeries(
              snapshotsToDelete,
              (snapshot, next) => {
                console.log(snapshot);
                Snapshot.findByIdAndDelete(snapshot._id, (err) => {
                  if (err) {
                    console.error('document_not_found', err);
                    return next(err);
                  }
                  console.log("deleted");
                  next(); // Move to the next iteration
                });
              },
              (err) => {
                if (err) {
                  console.error('document_not_found', err);
                  return callback(err);
                }

                return callback(null, newSnapshot);
              }
            );
          } else {
            return callback(null, newSnapshot);
          }
        });
      });
    } else {
      return callback(null, null);
    }
  });
};

// Snapshot.createSnapshot(mergeData, (err, snapshot) => {
//   if (err) return callback(err);

//   async.eachSeries(snapshots, (snapshot, next) => {
//     Snapshot.findSnapshotsByIdAndDelete(snapshot._id, (err) => {
//       if (err) {
//         console.error('document_not_found', err);
//         return next(err);
//       }
//       console.log("deleted");
//       next(); // Move to the next iteration
//     });
//   }, (err) => {
//     if (err) {
//       console.error('document_not_found', err);
//       return callback(err);
//     }

//     return callback(null, snapshot);
//   });
// });


module.exports = mongoose.model('Snapshot', SnapshotSchema);

// let totalTokenBalance = 0;
// let totalUsdBalance = 0;

// snapshots.forEach(snapshot => {
//   totalTokenBalance += snapshot.current_token_balance;
//   totalUsdBalance += snapshot.current_usd_balance;
// });

// // Calculate average USD balance
// const averageUsdBalance = totalUsdBalance / snapshots.length;
// const averageTokenBalance = totalTokenBalance / snapshots.length;