import type { SelectedUser } from './types'

export const mainColor = 'bg-blue-300'

export const selectColors = [
	'bg-red-300',
	'bg-yellow-300',
	'bg-green-300',
	'bg-purple-300',
	'bg-orange-300'
]

export const rankingDescriptions = {
	overall: `Your total points from the last year of play (8 major tournaments, men's and women's singles). This is how
    professional player rankings work. Points earned in a tournament apply to your ranking for one year.`,
	averagePoints: `Your average score across all tournaments you've played.`,
	predictionAccuracy: `How often you choose correctly across all tournaments you've played.`
}

export const exampleSelectedUsers: SelectedUser[] = [
	{
		selectorId: 'logged-out-user',
		id: 'gvi2dlpb8gltpvo',
		username: 'will',
		color: 'bg-blue-300'
	},
	{
		selectorId: 'logged-out-user',
		id: 'eycqioo1bkgb3fp',
		username: 'TereseM',
		color: 'bg-red-300'
	}
]
