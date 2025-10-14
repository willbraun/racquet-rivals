<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import { rankingDescriptions } from '$lib/data'
	import { currentUser, drawNavUrl, isAuth } from '$lib/store'

	const scoreFormatting =
		'font-bold bg-green-400 rounded-full md:w-9 md:h-9 w-6 h-6 mx-auto shadow-sm'
</script>

<Header />
<main class="bg-stone-100">
	<div class="mx-auto flex max-w-(--breakpoint-lg) flex-col gap-8 px-4 pb-8">
		<section>
			<h1 class="text-4xl font-bold sm:text-6xl">About Racquet Rivals</h1>
		</section>
		<section>
			<p class="md:text-2xl">
				Welcome! Racquet Rivals is a platform for tennis fans to compete against each other in a fun
				and friendly environment. <br /><br />We follow the four major professional tennis
				tournaments (Australian Open, French Open, Wimbledon, and US Open) for men's and women's
				singles. Once the Round of 16 is set, you'll predict the winners of the remaining matches in
				the draw, like a March Madness bracket. If your players win, you'll gain points and move up
				the leaderboard!
			</p>
		</section>
		<section>
			<h2 class="mb-4 text-4xl font-bold">How To Play</h2>
			<ol class="flex list-decimal flex-col gap-8 px-8 md:text-2xl">
				<li>
					Create an account. Choose a username, as well as an email address to receive
					notifications.
				</li>
				<li>
					When the Round of 16 has been filled for a draw, you'll be notified via email that you
					have 12 hours to create your bracket for the <span class="font-bold"
						>entire rest of the tournament</span
					>. After this time, you <span class="font-bold">cannot</span> add any more predictions. You
					may choose your players before this point for any that are available in the Round of 16.
				</li>
				<li>
					There will be a link to the draw in your email. Open the draw and make your predictions.
					See other draws <a href={$drawNavUrl} class="text-blue-500 underline">here</a>.
				</li>
				<li>As matches are completed, you'll win points if your predictions are correct.</li>
				<table
					class="mx-auto w-full max-w-(--breakpoint-sm) overflow-hidden rounded-xl text-center"
				>
					<thead class="bg-primary-700 h-12 text-white">
						<tr>
							<th>Round</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						<tr class="bg-primary-100 h-12 font-semibold">
							<td>Quarterfinals</td>
							<td><div class={scoreFormatting}>1</div></td>
						</tr>
						<tr class="bg-primary-50 h-12 font-semibold">
							<td>Semifinals</td>
							<td><div class={scoreFormatting}>2</div></td>
						</tr>
						<tr class="bg-primary-100 h-12 font-semibold">
							<td>Final</td>
							<td><div class={scoreFormatting}>4</div></td>
						</tr>
						<tr class="bg-primary-50 h-12 font-semibold">
							<td>Champion</td>
							<td><div class={scoreFormatting}>8</div></td>
						</tr>
					</tbody>
				</table>
				<li>
					View the draw's leaderboard to see how you stack up against other players. You can compare
					draws by selecting other users from the leaderboard, or by entering their username in the
					Users menu on the draw page.
				</li>
				<li>Good luck! 💪</li>
			</ol>
		</section>
		<section class="flex flex-col gap-4">
			<h2 class="text-4xl font-bold">Your Profile</h2>
			<p class="md:text-2xl">
				You can find various insights into your performance on your
				{#if $isAuth}
					<a href={`/profile/${$currentUser?.username}`} class="text-blue-500 underline">profile</a>
				{:else}
					profile
				{/if}
				page.
			</p>
			<h3 class="text-3xl font-bold">Stats</h3>
			<p class="md:text-2xl">
				Your scores and predictions will be tallied in a few ways to display how well you're doing.
				In addition, you'll be ranked against all other users for each category.
			</p>
			<table class="mx-auto w-full overflow-hidden rounded-xl text-center">
				<thead class="bg-primary-700 h-12 text-white md:text-2xl">
					<tr>
						<th style="width:25%">Stat</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody class="md:text-xl [&>tr>td]:p-4">
					<tr class="bg-primary-100 h-12">
						<td class="font-bold">Overall Ranking</td>
						<td>{rankingDescriptions.overall}</td>
					</tr>
					<tr class="bg-primary-50 h-12">
						<td class="font-bold">Average Points</td>
						<td>{rankingDescriptions.averagePoints}</td>
					</tr>
					<tr class="bg-primary-100 h-12">
						<td class="font-bold">Prediction Accuracy</td>
						<td>{rankingDescriptions.predictionAccuracy}</td>
					</tr>
				</tbody>
			</table>
			<p class="md:text-2xl">
				You can see the full <a href="/rankings" class="text-blue-500 underline">rankings</a> page as
				well.
			</p>
			<h3 class="text-3xl font-bold">Results</h3>
			<p class="md:text-2xl">View your past draws and see your performance in each one.</p>
		</section>
	</div>
</main>
