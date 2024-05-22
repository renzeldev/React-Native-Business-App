const isEmpty = require('./is-empty');
const Validator = require('validator');

const registerValidation = (data) => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name:"";
  data.birthday = !isEmpty(data.name) ? data.birthday:"";
  data.handle = !isEmpty(data.handle) ? data.handle:"";
  // data.citizen_card = !isEmpty(data.citizen_card) ? data.citizen_card:"";
  data.password = !isEmpty(data.password) ? data.password:"";
  data.password2 = !isEmpty(data.password2) ? data.password2:"";

  if(Validator.isEmpty(data.name)) {
    errors.name = "이름을 반드시 입력하십시오."
  }

  if(Validator.isEmpty(data.birthday)) {
    errors.birthday = "생년월일을 반드시 입력하십시오."
  }

  if(Validator.isEmpty(data.handle)) {
    errors.handle = "식별자를 반드시 입력하십시오."
  }

  if(Validator.isEmpty(data.password)) {
    errors.password = "암호를 반드시 입력하십시오."
  }

  if(!Validator.isLength(data.password, {min:6})) {
    errors.password = "암호는 6글자이상 되여야 합니다."
  }

  if(Validator.isEmpty(data.password2)) {
    errors.password2 = "암호확인칸에 반드시 입력하십시오."
  }

  if(!Validator.equals(data.password, data.password2)) {
    errors.password = "암호가 맞지 않습니다. 암호를 확인하십시오."
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const editRegisterValidation = data => {
  let errors = {};
  data.birthday = !isEmpty(data.birthday) ? data.birthday:"";
  data.work = !isEmpty(data.work) ? data.work:"";
  data.password = !isEmpty(data.password) ? data.password:"";
  data.newpassword = !isEmpty(data.newpassword) ? data.newpassword:"";
  data.newpassword2 = !isEmpty(data.newpassword2) ? data.newpassword2:"";

  if(Validator.isEmpty(data.birthday)) {
    errors.birthday = "생년월일을 반드시 입력하십시오."
  }

  if(Validator.isEmpty(data.work)) {
    errors.work = "직장직위를 반드시 입력하십시오."
  }

  if(Validator.isEmpty(data.password)) {
    errors.password = "암호를 반드시 입력하십시오."
  }
  if(!(Validator.isEmpty(data.newpassword) && Validator.isEmpty(data.newpassword2))){
    if(!Validator.isLength(data.newpassword, {min:6})) {
      errors.newpassword = "암호는 6글자이상 되여야 합니다."
    }
  
    if(!Validator.equals(data.newpassword, data.newpassword2)) {
      errors.newpassword = "암호가 맞지 않습니다. 암호를 확인하십시오."
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}
module.exports = {registerValidation, editRegisterValidation};

