export function setLoggedUser(userInfo) {
	return {
		type: 'SET_LOGGED_USER',
		data: {userInfo: userInfo}
	}
}

export function unsetLoggedUser() {
	return {
		type: 'UNSET_LOGGED_USER'
	}
}