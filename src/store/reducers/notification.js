import {GET_ALL_NOTIFICATIONS, ADD_NOTIFICATION, GET_NOTIFICATIONS, COUNT_NOTIFICATIONS, NOTIFICATION_LOADING, EDIT_NOTIFICATION, DELETE_NOTIFICATION, GET_CURRENT_NOTIFICATION} from '../actions/types';

const initialState = {
  notifications: null,
  counts:0,
  addItem:null,
  editedItem: null,
  loading: false,
  currentNotification:null
}

export default function (state = initialState, action) {
  switch(action.type) {

    case GET_CURRENT_NOTIFICATION:
      return {
        ...state,
        currentNotification: action.payload
      }    
    case GET_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      }
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: action.payload
      }
    case COUNT_NOTIFICATIONS:
      return {
        ...state,
        counts: action.payload
      }
    case GET_NOTIFICATIONS:
      return {
        ...state,
        loading: false,
        notifications: action.payload
      }
    case NOTIFICATION_LOADING:
      return {
        ...state,
        loading: true
      }
    case EDIT_NOTIFICATION:
      return {
        ...state,
        editedItem: action.payload
      }
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(noti => noti._id !== action.payload)
      }
    default:
      return state
  }
}