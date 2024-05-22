import {GET_ARTICLE, GET_ALL_DRAFTARTICLES,  GET_ERRORS, ARTICLE_LOADING, GET_COMMENTS, GET_ARTICLES, KEEP_RECENT, DELETE_ARTICLE, COUNT_ARTICLES, AGREE_ARTICLE, DISAGREE_ARTICLE} from './types';

import axios from 'axios';

export const addArticle = (newArticle, history) => dispatch => {
  axios.post('/main/eboard', newArticle)
  .then(res => history.push('/Main/Eboard/Article/1___'))
  .catch(errors => dispatch({
    type: GET_ERRORS,
    payload: errors.response.data
  }))
} 

export const countArticles = (searchedItem) => dispatch =>{
  if(searchedItem.handle.length === 0 && searchedItem.title.length === 0 &&       searchedItem.content.length === 0) {
    axios.get('/main/eboard/count/articles')
    .then(res => dispatch({
      type: COUNT_ARTICLES,
      payload: res.data
    }))
  } else {
    // console.log(searchedItem);
    axios.post('/main/eboard/searched/count/articles', searchedItem)
    .then(res => dispatch({
      type: COUNT_ARTICLES,
      payload: res.data
    }))
  }
}

export const getAllDraftArticles = () => dispatch => {
  dispatch(setEboardLoading);
  axios.get('/main/eboard/draft')
  .then(res => dispatch({
    type: GET_ALL_DRAFTARTICLES,
    payload: res.data
  }))
  .catch(err => console.log(err));
}

export const getArticles = (data) => {
  return {
    type: GET_ARTICLES,
    payload: data
  }
}

export const getArticle = (id, history) => dispatch => {
  dispatch(setEboardLoading);
  axios.get(`/main/eboard/${id}`)
  .then(res => dispatch({
    type: GET_ARTICLE,
    payload: res.data
  }))
  .catch(err => {
    window.alert(err.response.data.noarticle);
    history.push('/Main/Eboard');
  });
}

export const submitComment = (data) => {
  return {
    type: GET_COMMENTS,
    payload: data
  }
}

export const allowArticle = (id) => dispatch =>{
  axios.post(`/main/eboard/allow/${id}`)
  .then(res => {
    dispatch({
    type: GET_ARTICLE,
    payload: res.data
    });
    //history.push('/Main/Eboard');
  })
  .catch(err => window.alert(err.response.data.notallowed));
}

export const agreeArticle = (id) => dispatch => {
  axios.post(`/main/eboard/agree/${id}`)
  .then(res => {
    dispatch({
      type: AGREE_ARTICLE,
      payload: res.data
    })
  })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }));
}

export const disagreeArticle = (id) => dispatch => {
  axios.post(`/main/eboard/disagree/${id}`)
  .then(res => {
    dispatch({
      type: DISAGREE_ARTICLE,
      payload: res.data
    })
  })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data
  }));
}

export const deleteArticle = (id, history, url) => dispatch => {
  axios.delete(`/main/eboard/${id}`)
  .then(res => {
    // dispatch({
    //   type: DELETE_ARTICLE,
    //   payload: res.data
    // })
    history.push(`/Main/Eboard/Article/${url}`);
  })
  .catch(err => window.alert(err.response.data));
}

export const keepRecent = (data) => {
  console.log(data);
  return {
    type: KEEP_RECENT,
    payload: data,
  }
}

export const setEboardLoading = () => {
  return {
    type: ARTICLE_LOADING,
  }
}