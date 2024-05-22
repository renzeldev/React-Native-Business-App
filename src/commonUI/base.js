export const colors = {
	primary: '#2288ea',
	primaryBackground: '#2288ea',
	primaryForeground: '#fff',
	text: '#888',
	inputLabel: '#444',
	secondaryBackground: '#fff',
	secondaryForeground: '#2288ea',
	danger: '#f25c46',
	white: '#fff'
}

import Dimensions from 'Dimensions';
export const W = Dimensions.get('window').width;
export const H = Dimensions.get('window').height;
export const em = W/720

export const fontSizes = {
	default: 30*em,
	small: 25*em,
	button: 32*em,
}