import React, {Component} from 'react';

import PhoneVerifyScene from '../../pages/auth/signup/signup'
import IdCardUploadScene from '../../pages/auth/signup/id_card_upload'
import InputPersonalInfoScene from '../../pages/auth/signup/input_personal_info'
import PhotoUploadScene from '../../pages/auth/signup/photo_upload'
import PhotoWithIdUploadScene from '../../pages/auth/signup/photo_with_id_upload'
import UserSetScene from '../../pages/auth/signup/user_set'

import {createStackNavigator} from 'react-navigation';

let headerOptions = {
	
}

const SignupRouter = createStackNavigator({
	'signup-phone_verify': {
		screen: PhoneVerifyScene
	},
	'signup-id_card_upload': {
		screen: IdCardUploadScene
	},
	'signup-input_personal_info': {
		screen: InputPersonalInfoScene
	},
	'signup-photo_upload': {
		screen: PhotoUploadScene
	},
	'signup-photo_with_id_upload': {
		screen: PhotoWithIdUploadScene
	},
	'signup-user_set': {
		screen: UserSetScene
	},
}, {
	initialRouteName: 'signup-phone_verify'
})

export default SignupRouter;