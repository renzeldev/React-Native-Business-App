const isEmpty = require('./is-empty');
const Validator = require('validator');

module.exports = function loginValidation (data) {
  let errors = {};
  data.handle = !isEmpty(data.handle) ? data.handle:"";
  data.password = !isEmpty(data.password) ? data.password:"";

  if(Validator.isEmpty(data.handle)) {
    errors.handle = "식별자를 반드시 입력하십시오."
  }
  
  if(Validator.isEmpty(data.password)) {
    errors.password = "암호를 반드시 입력하십시오."
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
} 

