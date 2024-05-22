const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function notificationValidation (data)  {
  let errors = {};
  data.title = isEmpty(data.title) ? "" : data.title;
  data.content = isEmpty(data.content) ? "" : data.content;
  if(Validator.isEmpty(data.title)) {
    errors.notitle = "제목을 반드시 입력하여야 합니다."
  }
  if(Validator.isEmpty(data.content)) {
    errors.nocontent = "알림내용을 반드시 입력하여야 합니다."
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}