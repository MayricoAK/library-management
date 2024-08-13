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

function validateMember(member) {
  if (!member) {
    return { isValid: false, status: 404, message: 'Member not found' };
  }
  if (member.borrowedBooks.length >= 2) {
    return { isValid: false, status: 400, message: 'Member cannot borrow more than 2 books' };
  }
  if (member.penaltyEndDate) {
    return { isValid: false, status: 400, message: 'Member is currently penalized', endPenalty: member.penaltyEndDate };
  }
  return { isValid: true, member };
}
  
module.exports = { calculateDaysDifference, penaltyDate, validateMember };