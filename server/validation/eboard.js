const isEmpty = require('./is-empty');
const Validator = require('validator');

const articleValidation = (data) => {
  let errors = {};
  data.title = isEmpty(data.title) ? "" : data.title;
  data.content = isEmpty(data.content) ? "" : data.content;
  data.type = isEmpty(data.type) ? "" : data.type;
  if(Validator.isEmpty(data.title)) {
    errors.notitle = "제목을 반드시 입력하여야 합니다."
  }
  if(Validator.isEmpty(data.content)) {
    errors.nocontent = "기사내용을 반드시 입력하여야 합니다."
  }
  if(Validator.isEmpty(data.type)) {
    errors.notype = "부류를 반드시 선택하여야 합니다."
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}

const commentValidation = (data) => {
  let errors = {};
  data.text = isEmpty(data.text) ? "" : data.text;
  if(Validator.isEmpty(data.text)) {
    errors.nocomment = "답변글을 반드시 입력하여야 합니다."
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = {articleValidation, commentValidation};