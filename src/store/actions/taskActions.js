import axios from 'axios';
import {GET_TODAY_TASK, ADD_TODAY_TASK, SET_TASK_STATUS, GET_FAILED_TASKS, GET_HISTORY_TASKS, SET_FAILED_TASKS, GET_ERRORS} from './types';

export const getTodayTask = () => dispatch => {
  //window.alert('get');
  axios.get('/task/task/getTodayTask')
  .then(res => dispatch({
    type: GET_TODAY_TASK,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_TODAY_TASK,
    payload: []
  }))
  // .catch(err => dispatch({
  //   type: GET_ERRORS,
  //   payload: err.response.data
  // }))
}

export const getTaskHistory = (data) => dispatch => {
  axios.post('task/task/getTaskHistory', data) 
  .then(res => dispatch({
    type: GET_HISTORY_TASKS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_HISTORY_TASKS,
    payload: []
  }))
}

export const addTodayTask = (title) => dispatch => {
  axios.post('/task/task/addTodayTask', title)
  .then(res => dispatch({
    type: ADD_TODAY_TASK,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: ADD_TODAY_TASK,
    payload: []
  }))
  // .catch(err => dispatch({
  //   type: GET_ERRORS,
  //   payload: err.response.data
  // }))
}

export const setTaskStatus = (id) => dispatch => {
  axios.get(`/task/task/setTaskStatus/${id}`)
  .then(res => dispatch({
    type: SET_TASK_STATUS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const setPreTaskStatus = (data) => dispatch => {
  axios.post('/task/task/setPreTaskStatus/', data)
  .then(res => dispatch({
    type: SET_FAILED_TASKS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const getFailedTasks = () => dispatch => {
  axios.get('/task/task/getFailedTasks')
  .then(res => dispatch({
    type: GET_FAILED_TASKS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}