const initialState = {
  personalInfo: null
}
const mypageReducer = (state=initialState, action)  => {
  switch(action.type) {
    case 'GOT_PERSONAL_INFO':
      const { personalInfo } = action.data
      return {
        ...state,
        personalInfo: personalInfo
      }
  }
  return state
}

export default mypageReducer