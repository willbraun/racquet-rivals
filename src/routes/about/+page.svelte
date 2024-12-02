<script lang="ts">
	import Header from '$lib/components/Header.svelte'
	import { drawNavUrl } from '$lib/store'

	const scoreFormatting = 'font-bold bg-green-400 rounded-full w-8 mx-auto shadow'
</script>

<Header />
<main class="bg-stone-100">
	<div class="mx-auto flex max-w-screen-lg flex-col gap-8 px-4">
		<section>
			<h1 class="mb-4 text-4xl font-bold md:text-7xl">About Racquet Rivals</h1>
		</section>
		<section>
			<p class="text-2xl">
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
			<p class="text-2xl"></p>
			<ol class="flex list-decimal flex-col gap-8 px-8 text-2xl">
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
					See other draws <a href={$drawNavUrl} class="underline">here</a>.
				</li>
				<li>As matches are completed, you'll win points if your predictions are correct.</li>
				<table class="mx-auto w-full max-w-screen-sm overflow-hidden rounded-xl text-center">
					<thead class="h-12 bg-primary-700 text-white">
						<tr>
							<th>Round</th>
							<th>Points</th>
						</tr>
					</thead>
					<tbody>
						<tr class="h-12 bg-primary-50 font-semibold">
							<td>Quarterfinals</td>
							<td><div class={scoreFormatting}>1</div></td>
						</tr>
						<tr class="h-12 bg-primary-200 font-semibold">
							<td>Semifinals</td>
							<td><div class={scoreFormatting}>2</div></td>
						</tr>
						<tr class="h-12 bg-primary-50 font-semibold">
							<td>Final</td>
							<td><div class={scoreFormatting}>4</div></td>
						</tr>
						<tr class="h-12 bg-primary-200 font-semibold">
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
		<section>
			<h2 class="mb-4 text-4xl font-bold">Stats</h2>
		</section>
		<section>
			<h2 class="mb-4 text-4xl font-bold">Rankings</h2>
		</section>
	</div>
</main>
