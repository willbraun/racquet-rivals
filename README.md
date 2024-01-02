# Overview

This is the frontend repo for [racquetrivals.com](https://www.racquetrivals.com).

I am a huge tennis fan, and my wife and I like to create brackets for the final rounds of pro tournaments as a (somewhat) friendly competition, though it takes some time to set up each bracket by hand and make all your predictions. 

To streamline this, Racquet Rivals pulls in match results automatically and allows you to view current tournaments, pick who you think will win each round, earn points if you're correct, and compare with your friends. It's like March Madness for tennis tournaments. 

It only shows from the Round of 16 onwards to simplify the bracket-making process. Tennis tournaments can have up to 128 men and 128 women, and making picks for 254 matches per tournament is too much to deal with.

Points are awarded if your predicted player wins, in quantities based on the round your pick is in.

- Quarterfinals: 1
- Semifinals: 2
- Final: 4
- Champion: 8

Feel free to create an account and play along! You can view other players' predictions by entering their username, to see how you stack up. Have fun!

# Project Structure

- Frontend
  - this repo, hosted on Netlify 
- Backend
  - Pocketbase - self-hosted BaaS with a SQLite database and built-in APIs
  - Hosted on Digital Ocean Droplet VM running Linux Ubuntu
  - Extended with additional logic in this [repo](https://github.com/willbraun/tennis-bracket-pb-extend)
- Web Scraper
  - Run by cron job on Digital Ocean Droplet to gather tournament results ([repo](https://github.com/willbraun/tennis-bracket-scripts))

# Technologies Used (this repo)

Sveltekit, Skeleton UI, TypeScript, TailwindCSS, Netlify
