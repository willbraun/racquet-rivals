import { type SelectedUser, TournamentName } from './types'

export const mainColor = 'bg-blue-300'

export const selectColors = [
	'bg-red-300',
	'bg-yellow-300',
	'bg-green-300',
	'bg-purple-300',
	'bg-orange-300'
]

export const bannerStyleMap: { [key in TournamentName]: string } = {
	[TournamentName.AUSTRALIAN_OPEN]: 'bg-gradient-to-r from-indigo-800 via-blue-500 to-cyan-300',
	[TournamentName.FRENCH_OPEN]: 'bg-gradient-to-r from-red-700 via-orange-500 to-amber-300',
	[TournamentName.WIMBLEDON]: 'bg-gradient-to-r from-green-600 via-blue-400 to-purple-600',
	[TournamentName.US_OPEN]: 'bg-gradient-to-r from-blue-700 via-orange-500 to-yellow-300'
}

export const pricingHeaderStyleMap: { [key in TournamentName]: string } = {
	[TournamentName.AUSTRALIAN_OPEN]: 'bg-[#02B2F2]',
	[TournamentName.FRENCH_OPEN]: 'bg-[#D44822]',
	[TournamentName.WIMBLEDON]: 'bg-[#598B2C]',
	[TournamentName.US_OPEN]: 'bg-[#2044D5]'
}

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
