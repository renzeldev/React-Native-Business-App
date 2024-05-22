import {GET_ALL_QUES_ANS, QUESTION_LOADING, ADD_QUESTION, DELETE_QUESTION, GET_ERRORS,ADD_ANSWER} from './types';
import axios from 'axios';

export const getAllQuesAns = (data) => {
  return {
    type: GET_ALL_QUES_ANS,
    payload: data
  }
}

export const addQuestion = (question) => {
  // console.log(question);
  return {
    type: ADD_QUESTION,
    payload: question
  }
}

export const addAnswer = (QuesAns, id) => dispatch => {
  axios.post(`/main/quesandans/${id}`, QuesAns)
  .then(res => dispatch({
    type: ADD_ANSWER,
    payload: res.data
  }))
  .catch(err => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  });
}

export const deleteQuestion = (id) => dispatch => {
  axios.delete(`/main/quesandans/${id}`)
  .then(res => dispatch({
    type: DELETE_QUESTION,
    payload: id
  }))
  .catch(err => window.alert(err.response.data.notAllowed));
}

export const setQuestionLoading = () => {
  return {
    type: QUESTION_LOADING,
  }
}