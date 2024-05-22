import {GET_ERRORS} from './types'
import {Alert} from 'react-native';
export const getErrors = (errors) => {
  // Alert.alert(errors.handle);
  return {
    type: GET_ERRORS,
    data: errors
  }
}

export const clearErrors = () => {
  return {
    type: GET_ERRORS,
    payload: {}
  }
}