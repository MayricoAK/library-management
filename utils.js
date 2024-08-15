const moment = require('moment');

function calculateDaysDifference(borrowedDate, returnedDate) {
  const borrowed = moment(borrowedDate, 'YYYY-MM-DD');
  const returned = moment(returnedDate, 'YYYY-MM-DD');
  return returned.diff(borrowed, 'days');
}

function addPenaltyDays(returnedDate, days = 3) {
  const date = moment(returnedDate, 'YYYY-MM-DD');
  return date.add(days, 'days').format('YYYY-MM-DD');
}

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
  return { isValid: true };
}
  
module.exports = { calculateDaysDifference, addPenaltyDays, validateMember };