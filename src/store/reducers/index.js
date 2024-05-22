import {combineReducers} from 'redux'

import auth from './auth'
import mypageReducer from './mypage'
import errorReducer from './error';
import ques from './question';
import eboard from './eboard';
import discuss from './discuss';
import msg from './msg';

const reducer = combineReducers({
  auth,
  errorReducer,
  mypageReducer,
  ques,
  eboard,
  discuss,
  msg
})

export default reducer