import {Alert} from 'react-native';

const initialState = {
  errors: null
}

export default function (state = initialState, action) {
  switch(action.type) {
    case 'GET_ERRORS':
      // Alert.alert(action.data.handle, action.data.password)
      return {
        ...state,
        errors: action.data
      }
    default:
      return state;
  }
}