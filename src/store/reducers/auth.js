/*
const initialState = {
  isAuthenticated: false,
	userInfo: null
}
*/
import isEmpty from '../validation/is-empty';
import {Alert} from 'react-native';

const initialState = {
	isAuthenticated: false,
	user: null,
	profile: null,
	loading: false
}

export default function(state = initialState, action) {
	switch(action.type) {
	  case 'SET_CURRENT_USER':
		// Alert.alert(action.payload.handle);
		return {
		  ...state,
		  isAuthenticated: !isEmpty(action.payload),
		  user: action.payload,
		  loading: false
		}
  
	  case 'GET_PROFILE':
		return {
		  ...state,
		  profile: action.payload,
		  loading: false
		}
  
	  case 'PROFILE_LOADING':
		return {
		  ...state,
		  loading: true
		}
	  default:
		return state;
	}
  }
