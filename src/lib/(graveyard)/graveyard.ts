// export const PlanName = {
// 	MEN: 'men',
// 	WOMEN: 'women',
// 	BOTH: 'both',
// 	SUBSCRIPTION: 'subscription'
// }
// export type PlanName = (typeof PlanName)[keyof typeof PlanName]

// export const UserAccess = {
// 	GRANDFATHERED: 'grandfathered',
// 	SUBSCRIPTION: PlanName.SUBSCRIPTION,
// 	MEN: PlanName.MEN,
// 	WOMEN: PlanName.WOMEN,
// 	BOTH: PlanName.BOTH,
// 	NONE: 'none',
// 	LOGGED_OUT: 'loggedOut'
// }
// export type UserAccess = (typeof UserAccess)[keyof typeof UserAccess]

// export interface Subscription {
// 	collectionId: string
// 	collectionName: 'subscription'
// 	id: string
// 	user_id: string
// 	paddle_subscription_id: string
// 	status: string
// 	current_billing_period_start: string
// 	current_billing_period_end: string
// 	created: string
// 	updated: string
// }

// const validatePaddleEnvironment = (env: string): Environments => {
// 	if (env !== 'sandbox' && env !== 'production') {
// 		throw new Error(`Invalid Paddle environment: ${env}. Must be 'sandbox' or 'production'.`)
// 	}
// 	return env as Environments
// }

// export const setupPaddle = async () => {
// 	try {
// 		const paddleInstance = await initializePaddle({
// 			environment: validatePaddleEnvironment(PUBLIC_PADDLE_ENVIRONMENT),
// 			token: PUBLIC_PADDLE_CLIENT_TOKEN,
// 			checkout: {
// 				settings: {
// 					displayMode: 'overlay'
// 				}
// 			}
// 		})
// 		return paddleInstance
// 	} catch (error) {
// 		logErrorInDev('Failed to initialize Paddle:', error)
// 	}
// }
