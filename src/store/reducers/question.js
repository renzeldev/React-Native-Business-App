import {GET_ALL_QUES_ANS, QUESTION_LOADING, ADD_QUESTION, DELETE_QUESTION, ADD_ANSWER} from '../actions/types';
import {Alert} from 'react-native';

const initialState = {
  QuesAnss: null,
  loading: false,
  answeredItem: {}
}

export default function(state= initialState, action) {
  switch(action.type) {
    case GET_ALL_QUES_ANS:
      return {
        ...state,
        QuesAnss: action.payload,
        loading: false
      }
    case QUESTION_LOADING: 
      return {
        ...state,
        loading: true
      }
    case ADD_QUESTION:
      // alert.alert(action.payload.question);
      return {
        ...state,
        QuesAnss: [action.payload, ...state.QuesAnss]
      }
    case ADD_ANSWER:
      return {
        ...state,
        // QuesAnss: [action.payload, ...(state.QuesAnss.filter(ques => ques._id !== action.payload._id))]
        answeredItem: action.payload
      }
    case DELETE_QUESTION:
      return {
        ...state,
        QuesAnss: state.QuesAnss.filter(ques => ques._id !== action.payload)
      }
    default: 
      return state;
  }
}