// //////////////////////////////////////////
// // PADDLE SETUP
// //////////////////////////////////////////

// let [mensDraw, womensDraw] = $derived.by(() => {
// 	let men: Draw | undefined
// 	let women: Draw | undefined

// 	const drawType =
// 		data.active.length === 2 ? 'active' : data.upcoming.length === 2 ? 'upcoming' : ''

// 	if (!drawType) {
// 		return [undefined, undefined]
// 	}

// 	data[drawType].forEach((draw) => {
// 		if (draw.event === Events.MENS_SINGLES) {
// 			men = draw
// 		} else {
// 			women = draw
// 		}
// 	})
// 	return [men, women]
// })
