/*
const initialState = {
  isAuthenticated: false,
	userInfo: null
}
*/
import isEmpty from '../validation/is-empty';
import {Alert} from 'react-native';

const initialState = {
	title: '',
	isOn: false,
}

export default function(state = initialState, action) {
	switch(action.type) {
	  case 'SHOW_MESSAGE':
		// Alert.alert(action.payload.handle);
		return {
		  ...state,
		  title: action.payload,
		  isOn: true
		}
  
	  case 'HIDE_MESSAGE':
		return {
		  ...state,
          title: '',
          isOn: false
		}
	  default:
		return state;
	}
  }
