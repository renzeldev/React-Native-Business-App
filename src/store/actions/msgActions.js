export const showMessageModal = title  => {
    return {
      type: 'SHOW_MESSAGE',
      payload: title
    }
  }
  
  export const hideMessageModal = () =>{
    return {
      type: 'HIDE_MESSAGE'
    }
  }