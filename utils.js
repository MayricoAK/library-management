const moment = require('moment');

function calculateDaysDifference(borrowedDate, returnedDate) {
  const borrowed = moment(borrowedDate);
  const returned = moment(returnedDate, 'DD-MM-YYYY');
  return returned.diff(borrowed);
}

const penaltyDate = (returnedDate) => {
  const date = moment(returnedDate, 'DD-MM-YYYY');
  return date.add(3, 'days').format('YYYY-MM-DD');
};
  
  module.exports = { calculateDaysDifference, penaltyDate };