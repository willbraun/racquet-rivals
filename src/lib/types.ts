export interface SelectedUser {
	id: string
	username: string
}

export interface AuthCookie {
	token: string
	userId: string
	username: string
}

export interface SelectUserResult {
	data: {
		user: SelectedUser
		error: string
	}
	status: number
	type: string
}

export interface DeselectUserResult {
	data: {
		deletedId: string
		error: string
	}
	status: number
	type: string
}
