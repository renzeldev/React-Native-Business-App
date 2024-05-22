import {StyleSheet} from 'react-native'

import {em, W, H, fontSizes, colors} from './base'

export const textStyles = StyleSheet.create({
	default: {
		fontSize: fontSizes.default, color: colors.text
	},
	small: {
		fontSize: fontSizes.small, color: colors.text
	},
	primary: {
		fontSize: fontSizes.default, color: colors.primary
	},
	smallPrimary: {
		fontSize: fontSizes.small, color: colors.primary
	}
})

export const formStyles = StyleSheet.create({
	formWrapper: {
		backgroundColor: '#fff', marginTop: 10*em, height: H-90
	},
	formWithoutFieldsWrapper: {
    backgroundColor: '#fff', marginTop: 10*em, height: H-80, alignItems: 'center'
	},
	formInnerWrapper: {
		marginLeft: 20*em, marginRight: 20*em, width: 680*em
	},
	formField: {
		borderBottomWidth: 1, borderBottomColor: '#ccc',
		flexDirection: 'row', alignItems : 'flex-start',
		width: '100%'
	},
	fieldLabelWrapper: {
		width: '25%', height: em*90,
		justifyContent: 'center'
	},
	fieldLabel: {
		fontSize: fontSizes.default, color: colors.inputLabel,
	},
	fieldText: {
		width: '75%', height: em*90,
		fontSize: fontSizes.default, color: colors.text,
	}	
})
export const actionButtonStyles = StyleSheet.create({
	container: {
		position: 'absolute', bottom: 0, left:0,
		width: '100%',
		backgroundColor: '#f5f5f5',
		paddingLeft: em*20, paddingRight: em*20, paddingTop: em*20, paddingBottom: em*30
	}	
})

export const fixedFormStyles = StyleSheet.create({
	container: {
		marginLeft: 20*em, marginRight: 20*em,
	},
	formTitle: {
		height: 60*em, fontSize: 30*em, lineHeight: 60*em, backgroundColor: 'transparent'
	},
	vSpace: {
		height: 30*em, backgroundColor: 'transparent'
	},
  formField: {
    borderBottomWidth: 1, borderBottomColor: '#ccc',
    flexDirection: 'row', alignItems : 'flex-start',
    width: '100%'
  },
	fieldLabelWrapper: {
		width: '25%', height: 100*em, justifyContent: 'center'
	},
	fieldLabel: {
		fontSize: fontSizes.default,
	},
  fieldTextWrapper: {
    width: '75%', height: 100*em, justifyContent: 'center'
  },
	fieldText: {
		fontSize: fontSizes.default, color: colors.text,
		width: '100%', textAlign: 'right'
	},
	actionButton: {
		color: colors.primary, fontSize: fontSizes.default
	}
})