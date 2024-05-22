import {GET_ERRORS, SET_CURRENT_USER, GET_PROFILE, PROFILE_LOADING} from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import {getErrors} from './errorActions';
import {SERVER_URL} from '../../config';
import {Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';


export const registerUser = (newUser, history) => dispatch => {
  axios.post(SERVER_URL + '/api/users/register', newUser)
  .then(result =>history.push('/Login'))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}


export const logoutUser = () => dispatch => {
  setAuthToken(false);
  setCurrentUser({});
  
  // window.location.href = '/';
}

export const setCurrentUser = data  => {

  // Alert.alert(typeOf(data));
  // dispatch({
  //   type: SET_CURRENT_USER,
  //   payload: data
  // })
  return {
    type: SET_CURRENT_USER,
    payload: data
  }
}

export const setProfileLoading = () =>{
  return {
    type: PROFILE_LOADING
  }
}

