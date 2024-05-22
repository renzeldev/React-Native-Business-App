import {SEARCH_FRIENDS, GET_ERRORS, FRIENDS_LOADING, GET_FRIENDS, INVITE_FRIEND, AGREE_FRIEND, CHAT_ACTION, LOAD_CHATLOG, DEL_USER_CHAT_LOG, SAVE_MEETING_LOG, LOAD_MEETING_LOG, GET_NEW_EMAIL, GET_EMAILS, COUNT_EMAILS, FRESH_HISTORY} from './types';

import axios from 'axios';
// import {Config} from '../config/config';

export const searchFriends = (friends) => {
  return {
    type: SEARCH_FRIENDS,
    payload: friends
  }
}

export const getFriends = (friends) => {
  return {
    type: GET_FRIENDS,
    payload: friends
  }
}

export const inviteFriend = (friend) => {
  return {
    type: INVITE_FRIEND,
    payload: friend
  }
}

export const getOnlineFriends = (friends) => {
  return {
    type: 'ONLINE_FRIENDS',
    payload: friends,
  }
}

export const getChatText = (text, user) => {
  return {
    type: 'GET_CHAT_TEXT',
    payload: { user: user, message: text }
  }
}

export const defaultChatSetting = () => {
  return {
    type: 'DEFAULT_CHAT_SETTING',
  }
}

export const agreeFriend = (item) => dispatch => {
  axios.post('/main/discuss/agreefriend', item)
  .then(res => dispatch({
    type: GET_FRIENDS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const deleteFriend = (handle) => dispatch => {
  axios.post(`/main/discuss/erase/${handle}`)
  .then(res => dispatch({
    type: GET_FRIENDS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const cancelRequest = (handle) => dispatch => {
  axios.post(`/main/discuss/cancelRequest/${handle}`)
  .then(res => dispatch({
    type: GET_FRIENDS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const cancelInvite = (handle) => dispatch => {
  axios.post(`/main/discuss/cancelInvite/${handle}`)
  .then(res => dispatch({
    type: GET_FRIENDS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const saveChatLog = (Data) => dispatch => {
  axios.post('/main/chat/saveLog', Data)
  .then(res => dispatch({
    type: CHAT_ACTION,
    payload: res.data
  }))
  .catch(err => dispatch ({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const loadChatLog = () => dispatch => {
  axios.get('/main/chat/loadLog')
  .then(res => dispatch({
    type:LOAD_CHATLOG,
    payload:res.data
  }))
  .catch(err => dispatch({
    type:GET_ERRORS,
    payload:err.response.data
  }))
}

export const loadUserChatLog = (handle) => dispatch => {
  axios.get(`/main/chat/loadUserLog/${handle}`)
  .then(res => dispatch({
    type: LOAD_CHATLOG,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const delUserChatLog = (handle) => dispatch => {
  axios.post(`/main/chat/delUserLog/${handle}`)
  .then(res => dispatch({
    type: DEL_USER_CHAT_LOG,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const saveMeetingLog = (data) => dispatch => {
  axios.post('/main/chat/saveMeetingLog', data)
  .then(res => dispatch({
    type: SAVE_MEETING_LOG,
    payload: res.data
  }))
  .catch(err => dispatch({
    type:GET_ERRORS,
    payload: err.response.data
  }))
}

export const loadMeetingLog = () => dispatch => {
  axios.get('/main/chat/loadMeetingLog')
  .then(res => dispatch({
    type: LOAD_MEETING_LOG,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.resposne.data
  }))
}

export const keepAllSendingEmail = (data) => {
  axios.post('/main/chat/keepAllSendingEmail', data)
  .then(res => {})
}

export const keepAllNonReadEmail = (data) => {
  axios.post('/main/chat/keepAllNonReadEmail', data)
  .then(res => {});
}

export const keepNonReadEmail = (data) => {
  axios.post(`/main/chat/keepNonReadEmail`, data)
  .then(res => {})
}
export const keepSendingEmail = (data) => {
  axios.post(`/main/chat/keepSendingEmail`, data)
  .then(res => {})
}

export const keepReceivingEmail = (data) => {
  axios.post(`/main/chat/keepReceivingEmail`, data);
}

export const keepNonToReceivingEmail = (data) => dispatch => {
  console.log(data);
  axios.post(`/main/chat/keepNonToReceivingEmail`, data)
  .then(res => {
    dispatch({
      type: GET_NEW_EMAIL,
      payload: res.data
    })
  })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const keepAllNewMsgsToReceivingEmail = (data) => dispatch => {
  axios.post(`/main/chat/keepAllNewMsgsToReceivingEmail`, data)
  .then(res => {
    dispatch({
      type: GET_NEW_EMAIL,
      payload: res.data
    })
  })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const receiveNonReadEmail = (data) => dispatch => {

  axios.post(`/main/chat/receiveNonReadEmail`, data)
  .then(res => {
    dispatch({
      type: GET_NEW_EMAIL,
      payload: res.data
    })
  })
  .catch(err => {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  })
}

export const getNonReadEmail = () => dispatch => {
  axios.get(`/main/chat/getNonReadEmail`)
  .then(res => dispatch({
    type: GET_NEW_EMAIL,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const getSendEmail = (page_number, user) => dispatch => {
  if(user.length === 0) {
    axios.get(`/main/chat/getSendEmail/${page_number}`)
    .then(res => dispatch({
      type: GET_EMAILS,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
  } else {
    axios.get(`/main/chat/getUserSendEmail/${page_number}/${user}`)
    .then(res => dispatch({
      type: GET_EMAILS,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
  }
}

export const getReceiveEmail = (page_number, user) => dispatch => {

  if(user.length === 0) {
    axios.get(`/main/chat/getReceiveEmail/${page_number}`)
    .then(res => dispatch({
      type: GET_EMAILS,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
  } else {
    axios.get(`/main/chat/getUserReceiveEmail/${page_number}/${user}`)
    .then(res => dispatch({
      type: GET_EMAILS,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
  }
}

export const countEmails = (user) => dispatch => {
  if(user.length === 0) {
    axios.get('/main/chat/countEmails')
    .then(res => dispatch({
      type: COUNT_EMAILS,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
  } else {
    axios.get(`/main/chat/countUserEmails/${user}`)
    .then(res => dispatch({
      type: COUNT_EMAILS,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
  }
  
}

export const delEmail = (id) => dispatch => {
  axios.delete(`/main/chat/delEmail/${id}`)
  .then(res => {})
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const setSearchLoading = () => {
  return {
    type: FRIENDS_LOADING,
  }
}

export const freshHistory = () => dispatch => {
  return {
    type: FRESH_HISTORY,
  }
}