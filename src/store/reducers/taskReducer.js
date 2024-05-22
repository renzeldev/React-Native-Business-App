import {GET_TODAY_TASK, ADD_TODAY_TASK, SET_TASK_STATUS, GET_FAILED_TASKS, SET_FAILED_TASKS, GET_HISTORY_TASKS} from '../actions/types';

const initialState = {
  todayTask:[],
  failedTasks:[],
  historyTasks:[],
  statusChangedItem:''
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_TODAY_TASK:
      return {
        ...state,
        todayTask: action.payload
      }
    case ADD_TODAY_TASK:
      // if($("#year").val() == new Date().getFullYear() && $("month").val() == new Date().getMonth() +1)
      // state.historyTasks.map(item => {
      //   if(item.date.split('T')[0] == new Date().toISOString().split('T')[0]) {
      //     item.tasks = [action.payload[0], ...item.tasks];
      //   }
      // })
      return {
        ...state,
        todayTask: [action.payload[0], ...state.todayTask],
        // historyTasks: state.historyTasks
      }
    case SET_TASK_STATUS: 
      var changedTodayTask = [];
      state.todayTask.map(item => {
        if(item._id === action.payload._id) {
          changedTodayTask = [...changedTodayTask, action.payload];
        } else {
          changedTodayTask = [...changedTodayTask, item]
        }
      })
      //var changedHistoryTasks = [];
      state.historyTasks.map(item => {
        item.tasks.map(data => {
          if(data._id == action.payload._id) {
            data.status = !data.status;
          }
        })
      })
      return {
        ...state,
        todayTask: changedTodayTask,
        historyTasks: state.historyTasks
      }
    case GET_FAILED_TASKS:
      return {
        ...state,
        failedTasks: action.payload
      }
    case SET_FAILED_TASKS:
      var reFailedTasks = [];
      state.failedTasks.map(item => {
        if(item.date == action.payload.pre.date) {
          if(action.payload.pre.tasks.length != 0) {
            reFailedTasks = [...reFailedTasks, action.payload.pre];
          }
        } else {
          reFailedTasks = [...reFailedTasks, item];
        }
      })
      state.historyTasks.map(item => {
        item.tasks.map(data => {
          if(data._id == action.payload.id) {
            data.status = !data.status;
          }
        })
      })
      return {
        ...state,
        failedTasks: reFailedTasks,
        historyTasks: state.historyTasks
      }
    case GET_HISTORY_TASKS: 
      return {
        ...state,
        historyTasks: action.payload
      }
      
    default: 
      return state;
  }
}