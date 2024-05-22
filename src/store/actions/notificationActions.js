import {GET_ALL_NOTIFICATIONS, ADD_NOTIFICATION, GET_ERRORS, COUNT_NOTIFICATIONS, GET_NOTIFICATIONS, NOTIFICATION_LOADING, EDIT_NOTIFICATION, DELETE_NOTIFICATION, GET_CURRENT_NOTIFICATION} from './types';
import axios from 'axios';
import $ from 'jquery';
import {Config} from '../config/config';

export const currentNotificationCheck = () => {
  //window.alert("ssfdf");
  axios.post('/main/notification/currentNotification/check')
  .then(res => {});
}

export const clearCurrentNotification = () => dispatch => {
  return {
    type: GET_CURRENT_NOTIFICATION,
    payload: {}
  }
}

export const getCurrentNotification = () => dispatch => {
  //window.alert("get");
  axios.get('/main/notification/getCurrentNotification')
  .then(res => dispatch({
    type: GET_CURRENT_NOTIFICATION,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const getAllNotifications = () => dispatch => {
  axios.get('/main/notification')
  .then(res => dispatch({
    type: GET_ALL_NOTIFICATIONS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ALL_NOTIFICATIONS,
    payload:{}
  }))
}

export const addNotification = (newNotification) => dispatch => {
  axios.post('/main/notification', newNotification)
  .then(res => dispatch({
    type: ADD_NOTIFICATION,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const countNotifications = () => dispatch => {
  axios.get('/main/notification/counts/notifications')
  .then(res => dispatch({
    type:COUNT_NOTIFICATIONS,
    payload: res.data
  }))
}

export const getNotifications = (number) => dispatch => {
  dispatch(setNotificationLoading());
  axios.get(`/main/notification/show/${number}`)
  .then(res => dispatch({
    type: GET_NOTIFICATIONS,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_NOTIFICATIONS,
    payload: {}
  }));
}

export const editNotification = (editData, id) => dispatch => {
  axios.post(`/main/notification/edit/${id}`,editData) 
  .then(res => dispatch({
    type: EDIT_NOTIFICATION,
    payload: res.data
  }))
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }))
}

export const deleteNotification = (id) => dispatch =>{
  axios.delete(`/main/notification/${id}`)
  .then(res => dispatch({
    type:DELETE_NOTIFICATION,
    payload: res.data
  }))
  .catch(err => window.alert(err.response.data.notAllowed));
}

export const setNotificationLoading = () => {
  return {
    type: NOTIFICATION_LOADING,
  }
}

export const uploadHandle = (file) => {
  //window.alert(file.name);
  $("#sendmsgbtn").attr("disabled", true);
  $("#waitingModal").show();
  $("#bub1").addClass('fadeIn animated infinite');
  setTimeout(() => {
    $("#bub2").addClass('fadeIn animated infinite');
  },300);
  setTimeout(() => {
    $("#bub3").addClass('fadeIn animated infinite');
  },600);
  $('#upload').attr('disabled', true);
    let formData = new FormData();
    formData.append('file', file);
    let options = { headers: { 'Content-Type': 'multipart/form-data' } };
    // axios.post(`http://localhost:3000/main/notification/upload/${file.name}`,formData)
    // .then(res => ($('#upload').attr('disabled', false)));
    //console.log(`http://Localhost:5000/main/notification/upload/${this.state.file.name}`);
    $.ajax({
      url:`${Config.serverUrl}:5000/main/notification/upload/${file.name}`,
      type: 'POST',
      data: formData,
      async: true,
      processData: false,
      contentType: false,
      success: function(data) {
        console.log("killer", data);
      },
      error: function(xhr) {
        console.log("sdfdsf", xhr);
        window.alert(xhr.statusText);
        $('#upload').attr('disabled', false);
      },
      complete: function(xhr) {
        if(xhr.statusText === "OK")
        {
          $('#upload').attr('disabled', false);
          $("#bub1").removeClass('fadeIn animated infinite');
          $("#bub2").removeClass('fadeIn animated infinite');
          $("#bub3").removeClass('fadeIn animated infinite');
          $("#waitingModal").hide();
        }
      },
      beforeSend: function(xhr) {
        console.log("before send",xhr);
      },
      // dataFilter: function(data, type) {
      //   console.log(data, type);
      // }
      // xhr: function() {
      //   var xhr = new XMLHttpRequest();
      //   console.log('aaa')

      //   xhr.upload.addEventListener('progress', function(evt) {
          
      //     if(evt.lengthComputable) {
      //       var percentComplete = evt.loaded/evt.total;
      //       percentComplete = parseInt(percentComplete*100);
      //       if(percentComplete === 100) {
      //         window.alert("올리적재완료");
      //         $('#upload').attr('disabled', false);
      //       }
      //     }
      //   })
      // }
    });
    
}