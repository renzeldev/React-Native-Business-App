const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function questionValidation (data) {
  let errors = {};
  data.question = isEmpty(data.question) ? "" : data.question;
  data.answer = isEmpty(data.answer) ? "" : data.answer;
  if(Validator.isEmpty(data.question)) {
    errors.noquestion = "질문을 반드시 입력하여야 합니다."
  }
  if(Validator.isEmpty(data.answer)) {
    errors.noanswer = "답변을 반드시 입력하여야 합니다."
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}