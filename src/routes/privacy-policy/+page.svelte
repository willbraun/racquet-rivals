<script>
	import Header from '$lib/components/Header.svelte'
</script>

<Header />
<main class="w-full bg-stone-100 p-4">
	<div class="mx-auto max-w-screen-lg">
		<header>
			<h1>Privacy Policy</h1>
			<p>Effective Date: Nov 26, 2024</p>
			<p>
				Racquet Rivals ("we," "us," or "our") respects your privacy and is committed to protecting
				your personal data. This Privacy Policy explains how we collect, use, and protect your
				information in compliance with the General Data Protection Regulation (GDPR).
			</p>
			<p>
				By using our website (racquetrivals.com), you consent to the practices described in this
				policy.
			</p>
		</header>
		<section>
			<h2>1. Information We Collect</h2>
			<h3>a. Personal Data</h3>
			<p>We may collect the following personal data:</p>
			<ul>
				<li>Email address</li>
				<li>Username</li>
				<li>Match predictions</li>
			</ul>
			<h3>b. Cookies and Tracking Technologies</h3>
			<p>
				We use cookies to enhance user experience. For detailed information, see our cookie policy
				below.
			</p>
		</section>
		<section>
			<h2>2. How We Use Your Data</h2>
			<p>We use the data we collect for the following purposes:</p>
			<ul>
				<li>To operate and maintain our website.</li>
				<li>To improve website functionality and user experience.</li>
				<li>To respond to inquiries and provide support.</li>
				<li>To comply with legal obligations.</li>
			</ul>
			<p>We do not sell your personal data to third parties.</p>
		</section>
		<section>
			<h2>3. GDPR Compliance</h2>
			<h3>Your Rights Under GDPR</h3>
			<p>
				If you are located in the European Union, you have the following rights regarding your
				personal data:
			</p>
			<ul>
				<li>
					<span class="font-bold">Right to Access:</span> You can request a copy of the data we hold
					about you.
				</li>
				<li>
					<span class="font-bold">Right to Rectification:</span> You can request corrections to inaccurate
					or incomplete data.
				</li>
				<li>
					<span class="font-bold">Right to Erasure:</span> You can request the deletion of your data.
				</li>
				<li>
					<span class="font-bold">Right to Data Portability:</span> You can request that your data be
					provided in a machine-readable format.
				</li>
				<li>
					<span class="font-bold">Right to Restrict Processing:</span> You can limit how your data is
					used.
				</li>
				<li>
					<span class="font-bold">Right to Object:</span> You can object to certain types of processing,
					such as marketing.
				</li>
				<li>
					<span class="font-bold">Right to Withdraw Consent:</span> You can withdraw your consent at
					any time.
				</li>
			</ul>
			<p>To exercise your rights, contact us at williamhbraun1@gmail.com.</p>
			<h3>Legal Basis for Processing Data</h3>
			<p>We process your personal data based on one or more of the following legal bases:</p>
			<ul>
				<li>Your consent.</li>
				<li>To fulfill a contract with you.</li>
				<li>To comply with legal obligations.</li>
				<li>To pursue legitimate business interests that do not override your privacy rights.</li>
			</ul>
		</section>
		<section>
			<h2>4. Data Retention</h2>
			<p>
				We will retain your personal data only for as long as necessary to fulfill the purposes
				outlined in this policy, unless a longer retention period is required by law.
			</p>
		</section>
		<section>
			<h2>5. Data Security</h2>
			<p>
				We implement appropriate technical and organizational measures to protect your personal data
				against unauthorized access, loss, or misuse. However, no system can guarantee complete
				security.
			</p>
		</section>
		<section>
			<h2>6. Data Sharing</h2>
			<p>We may share your information:</p>
			<ul>
				<li>With service providers to operate our website (e.g., hosting, analytics).</li>
				<li>When required by law or to protect our rights.</li>
			</ul>
			<p>
				We ensure that any data shared with third parties is protected under appropriate legal
				agreements.
			</p>
		</section>
		<section>
			<h2>7. Data Transfers</h2>
			<p>
				If we transfer your data outside the EU, we will ensure appropriate safeguards are in place
				to protect your data.
			</p>
		</section>
		<section>
			<h2>8. Cookies</h2>
			<p>We use cookies to:</p>
			<ul>
				<li>Manage user authentication.</li>
				<li>Remember user preferences.</li>
			</ul>
			<p>You can manage your cookie preferences through your browser settings.</p>
		</section>
		<section>
			<h2>9. Changes to This Privacy Policy</h2>
			<p>
				We may update this Privacy Policy from time to time. Changes will be posted on this page
				with the updated effective date.
			</p>
		</section>
		<section>
			<h2>10. Ezoic Privacy Policy</h2>
			<span id="ezoic-privacy-policy-embed"></span>
		</section>
		<section>
			<h2>11. Contact Us</h2>
			<p>
				If you have questions about this Privacy Policy or wish to exercise your rights, please
				contact us at:
			</p>
			<p>
				Will Braun<br />
				williamhbraun1@gmail.com<br />
			</p>
		</section>
	</div>
</main>

<style>
	h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	h2 {
		font-size: 2rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	h3 {
		font-size: 1.5rem;
		margin-top: 1.5rem;
		margin-bottom: 1rem;
	}

	h1,
	h2,
	h3 {
		font-weight: bold;
		line-height: normal;
	}

	p {
		margin-bottom: 1rem;
	}

	ul {
		margin-bottom: 1rem;
	}

	li {
		margin-bottom: 0.25rem;
		position: relative;
		padding-left: 1rem;
	}

	li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: black;
	}
</style>
