export interface SelectedUser {
	id: string
	username: string
	color: string
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
