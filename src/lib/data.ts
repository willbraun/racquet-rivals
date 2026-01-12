import { ScraperHealth, type SelectedUser, TournamentName } from './types'

export const mainColor = 'bg-blue-300'

export const selectColors = [
	'bg-red-300',
	'bg-yellow-300',
	'bg-green-300',
	'bg-purple-300',
	'bg-orange-300'
]

export const bannerStyleMap: { [key in TournamentName]: string } = {
	[TournamentName.AUSTRALIAN_OPEN]: 'bg-linear-to-r from-indigo-800 via-blue-500 to-cyan-300',
	[TournamentName.FRENCH_OPEN]: 'bg-linear-to-r from-red-700 via-orange-500 to-amber-300',
	[TournamentName.WIMBLEDON]: 'bg-linear-to-r from-green-600 via-blue-400 to-purple-600',
	[TournamentName.US_OPEN]: 'bg-linear-to-r from-blue-700 via-orange-500 to-yellow-300'
}

export const drawColorMap: { [key in TournamentName]: string } = {
	[TournamentName.AUSTRALIAN_OPEN]: 'bg-[#0BA3EA]',
	[TournamentName.FRENCH_OPEN]: 'bg-[#D44822]',
	[TournamentName.WIMBLEDON]: 'bg-[#199F79]',
	[TournamentName.US_OPEN]: 'bg-[#3772FF]'
}

export const scraperHealthColorMap: { [key in ScraperHealth]: string } = {
	[ScraperHealth.SUCCESS]: 'text-green-700 bg-green-100',
	[ScraperHealth.WAITING]: 'text-yellow-800 bg-yellow-200',
	[ScraperHealth.ERROR]: 'text-red-600 bg-red-100'
}

export const scraperHealthEmojiMap: { [key in ScraperHealth]: string } = {
	[ScraperHealth.SUCCESS]: '✅',
	[ScraperHealth.WAITING]: '⏳',
	[ScraperHealth.ERROR]: '❌'
}

export const scraperHealthAggregateTextMap: { [key in ScraperHealth]: string } = {
	[ScraperHealth.SUCCESS]: '',
	[ScraperHealth.WAITING]: 'Scrapers Waiting',
	[ScraperHealth.ERROR]: 'Scrapers Unhealthy'
}

export const scraperHealthSingleTextMap: { [key in ScraperHealth]: string } = {
	[ScraperHealth.SUCCESS]: 'Success',
	[ScraperHealth.WAITING]: 'Waiting',
	[ScraperHealth.ERROR]: 'Error'
}

export const scrapersHealthyWaitingErrors = ['not found', 'not started']

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

export const ROUND_COMPLETE = 'ROUND_COMPLETE'
