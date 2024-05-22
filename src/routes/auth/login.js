import React, {Component} from 'react';

import LoginScene from '../../pages/auth/login/login';
import LoginFaceDetectScene from '../../pages/auth/login/face_detect';
import ResetPwdScene from '../../pages/auth/login/reset_pwd'
import ResetPwdFaceDetectBeforeScene from '../../pages/auth/login/reset_pwd_face_detect_before'
import ResetPwdFaceDetectScene from '../../pages/auth/login/reset_pwd_face_detect'
import ResetPwdSetPwdAfterFaceDetectScene from '../../pages/auth/login/reset_pwd_set_pwd_after_face_detect'

import {createStackNavigator} from 'react-navigation';

let headerOptions = {
	
}

const AuthRouter = createStackNavigator({
	login: {
		screen: LoginScene
	},
	'login-face_detect': {
		screen: LoginFaceDetectScene,
	},
	'login-reset_pwd': {
		screen: ResetPwdScene
	},
	'login-reset_pwd_face_detect_before': {
		screen: ResetPwdFaceDetectBeforeScene
	},
	'login-reset_pwd_face_detect': {
		screen: ResetPwdFaceDetectScene
	},
	'login-reset_pwd_set_pwd_after_face_detect': {
		screen: ResetPwdSetPwdAfterFaceDetectScene
	},
}, {
	initialRouteName: 'login'
})

export default AuthRouter;