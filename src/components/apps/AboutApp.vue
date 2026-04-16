<script setup lang="ts">
const strengths = ["Frontend architecture", "TypeScript", "UX-minded development", "Playful interfaces"];
const toolkit = ["PHP", "JavaScript", "Vue", "Java", "WordPress", "CMS platforms"];
const currentFocus = ["Building memorable portfolio experiences", "Sharpening Vue skills", "Shipping clean UI systems"];
const funFacts = ["Corgi fan", "Retro desktop enthusiast", "Enjoys turning ideas into interactive experiences"];
</script>

<template>
	<div class="about-window">
		<aside class="profile-panel">
			<div class="avatar-shell">
				<div class="avatar-frame">
					<div class="avatar-core">JP</div>
				</div>
			</div>

			<div class="profile-copy">
				<h1 class="profile-name">Juvilane Panaguiton</h1>
				<p class="profile-role">Full-Stack Developer</p>
			</div>

			<div class="profile-meta">
				<span class="meta-chip">Solutions Developer II</span>
				<span class="meta-chip meta-chip--soft">B.S. Software Engineering</span>
			</div>

			<p class="profile-summary">Builds maintainable web products with a strong frontend eye and a practical full-stack foundation.</p>

			<div class="status-card">
				<div class="status-heading">System Snapshot</div>
				<div class="status-row">
					<span class="status-label">Mode</span>
					<span class="status-value online">Online</span>
				</div>
				<div class="status-row">
					<span class="status-label">Focus</span>
					<span class="status-value">Polished web apps</span>
				</div>
				<div class="status-row">
					<span class="status-label">Theme</span>
					<span class="status-value">Retro shell, modern code</span>
				</div>
			</div>
		</aside>

		<section class="details-panel">
			<div class="mobile-profile-tile">
				<p class="mobile-profile-kicker">Developer Profile</p>
				<h1 class="mobile-profile-name">Juvilane Panaguiton</h1>
				<p class="mobile-profile-role">Full-Stack Developer</p>
				<div class="mobile-profile-meta">
					<span class="meta-chip">Solutions Developer II</span>
					<span class="meta-chip meta-chip--soft">B.S. Software Engineering</span>
				</div>
				<p class="mobile-profile-summary">
					Builds maintainable web products with a strong frontend eye and a practical full-stack foundation.
				</p>
			</div>

			<div class="details-header">
				<div>
					<p class="eyebrow">System Properties</p>
					<h2 class="section-title">About This Developer</h2>
				</div>
				<div class="header-badge">Solutions Developer II</div>
			</div>

			<div class="info-grid">
				<section class="info-card intro-card">
					<h3 class="card-title">Overview</h3>
					<p class="card-copy">
						I'm a full-stack developer with a Bachelor's in Software Engineering and a professional background building web solutions in PHP, JavaScript, Java, and CMS platforms like WordPress. In my current role as a Solutions Developer II,
						I focus on creating practical, maintainable solutions while keeping the user experience in mind. I like work that sits at the intersection of clean engineering and thoughtful design, which is a big part of why I built this
						portfolio in Vue.
					</p>
					<p class="card-copy secondary-copy">
						I like to call myself a lifelong learner. I'm always exploring new technologies and approaches to find better ways to solve problems and create engaging digital experiences. When I'm not coding, you can find me playing games,
						spending time with family, or indulging my love of retro tech and corgis.
					</p>
				</section>

				<section class="info-card">
					<h3 class="card-title">What I Bring</h3>
					<div class="tag-list">
						<span v-for="strength in strengths" :key="strength" class="tag-chip">{{ strength }}</span>
					</div>
				</section>

				<section class="info-card">
					<h3 class="card-title">Toolkit</h3>
					<div class="tag-list">
						<span v-for="tool in toolkit" :key="tool" class="tag-chip tag-chip--warm">{{ tool }}</span>
					</div>
				</section>

				<section class="info-card">
					<h3 class="card-title">Current Focus</h3>
					<ul class="fact-list">
						<li v-for="item in currentFocus" :key="item">{{ item }}</li>
					</ul>
				</section>

				<section class="info-card">
					<h3 class="card-title">Fun Facts</h3>
					<ul class="fact-list">
						<li v-for="fact in funFacts" :key="fact">{{ fact }}</li>
					</ul>
				</section>
			</div>
		</section>
	</div>
</template>

<style scoped>
.about-window {
	height: 100%;
	min-height: 0;
	display: grid;
	grid-template-columns: minmax(18rem, 25%) minmax(0, 1fr);
	gap: var(--space-4);
	overflow: auto;
}

.profile-panel,
.details-panel {
	min-height: 0;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-xl);
	box-shadow: var(--shadow-card);
}

.profile-panel {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	padding: var(--space-5);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.18)),
		linear-gradient(180deg, var(--color-surface-strong), var(--color-surface-muted));
}

.avatar-shell {
	display: flex;
	justify-content: center;
}

.avatar-frame {
	width: 8.75rem;
	height: 8.75rem;
	padding: var(--space-2);
	border-radius: 2.25rem;
	background: linear-gradient(145deg, var(--color-accent-red), var(--color-accent-orange), var(--color-accent-gold));
	box-shadow: 0 1rem 2rem rgba(222, 107, 72, 0.18);
}

.avatar-core {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 1.75rem;
	background: linear-gradient(180deg, #fffdf9 0%, var(--color-surface) 100%);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	color: var(--color-ink);
	font-family: var(--font-display);
	font-size: 3rem;
	font-weight: 700;
	letter-spacing: 0.08em;
}

.profile-copy {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
	text-align: center;
}

.profile-kicker {
	margin: 0;
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.profile-name {
	margin: 0;
	font-family: var(--font-display);
	font-size: var(--text-xl);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.profile-role {
	margin: 0;
	font-size: var(--text-sm);
	font-weight: 600;
	color: var(--color-ink-soft);
}

.profile-meta {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: var(--space-2);
}

.meta-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.45rem 0.8rem;
	border-radius: var(--radius-pill);
	background: rgba(222, 107, 72, 0.16);
	border: var(--border-thin) solid rgba(222, 107, 72, 0.18);
	color: var(--color-ink);
	font-size: var(--text-xs);
	font-weight: 600;
}

.meta-chip--soft {
	background: rgba(191, 233, 255, 0.4);
	border-color: rgba(90, 61, 43, 0.1);
}

.profile-summary {
	margin: 0;
	padding: var(--space-3);
	border-radius: var(--radius-lg);
	background: rgba(255, 255, 255, 0.48);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.08);
	color: var(--color-ink);
	font-size: var(--text-sm);
	line-height: var(--line-normal);
}

.status-card {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	padding: var(--space-4);
	border-radius: var(--radius-lg);
	background: rgba(255, 249, 241, 0.9);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.1);
}

.status-heading {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.status-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--space-3);
	padding-top: var(--space-2);
	border-top: var(--border-thin) solid rgba(90, 61, 43, 0.08);
	font-size: var(--text-sm);
}

.status-row:first-of-type {
	padding-top: 0;
	border-top: none;
}

.status-label {
	color: var(--color-ink-soft);
}

.status-value {
	text-align: right;
	font-weight: 600;
	color: var(--color-ink);
}

.status-value.online {
	color: #2e7d4f;
}

.details-panel {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	padding: var(--space-5);
	overflow: auto;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.12)), var(--color-surface);
}

.mobile-profile-tile {
	display: none;
	flex-direction: column;
	gap: var(--space-2);
	padding: var(--space-4);
	border-radius: var(--radius-lg);
	background:
		linear-gradient(145deg, rgba(255, 255, 255, 0.58), rgba(255, 255, 255, 0.18)),
		linear-gradient(180deg, var(--color-surface-strong), var(--color-surface-muted));
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: 0 0.9rem 1.8rem rgba(90, 61, 43, 0.08);
}

.mobile-profile-kicker,
.mobile-profile-name,
.mobile-profile-role,
.mobile-profile-summary {
	margin: 0;
}

.mobile-profile-kicker {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-profile-name {
	font-family: var(--font-display);
	font-size: clamp(1.6rem, 5vw, 2rem);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.mobile-profile-role {
	font-size: var(--text-sm);
	font-weight: 600;
	color: var(--color-ink-soft);
}

.mobile-profile-meta {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-2);
}

.mobile-profile-summary {
	color: var(--color-ink);
	line-height: var(--line-normal);
}

.details-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: var(--space-3);
	padding-bottom: var(--space-4);
	border-bottom: var(--border-thin) solid rgba(90, 61, 43, 0.1);
}

.eyebrow {
	margin: 0 0 var(--space-1);
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.section-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: var(--text-xl);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.header-badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.45rem 0.85rem;
	border-radius: var(--radius-pill);
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
	color: var(--color-white);
	font-family: var(--font-chrome);
	font-size: var(--text-xs);
	font-weight: 600;
	box-shadow: 0 0.75rem 1.5rem rgba(222, 107, 72, 0.18);
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: var(--space-4);
}

.info-card {
	padding: var(--space-4);
	border-radius: var(--radius-lg);
	background: rgba(255, 255, 255, 0.72);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.1);
	box-shadow: 0 0.9rem 1.8rem rgba(90, 61, 43, 0.08);
}

.intro-card {
	grid-column: 1 / -1;
}

.card-title {
	margin: 0 0 var(--space-3);
	font-family: var(--font-chrome);
	font-size: var(--text-sm);
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--color-ink);
}

.card-copy {
	margin: 0;
	color: var(--color-ink);
	line-height: var(--line-loose);
}

.secondary-copy {
	margin-top: var(--space-3);
}

.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-2);
}

.tag-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.45rem 0.75rem;
	border-radius: var(--radius-pill);
	background: rgba(191, 233, 255, 0.34);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.1);
	color: var(--color-ink);
	font-size: var(--text-xs);
	font-weight: 600;
}

.tag-chip--warm {
	background: rgba(244, 200, 111, 0.28);
}

.fact-list {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.fact-list li {
	position: relative;
	padding-left: 1rem;
	color: var(--color-ink);
	line-height: var(--line-normal);
}

.fact-list li::before {
	content: "";
	position: absolute;
	left: 0;
	top: 0.55em;
	width: 0.4rem;
	height: 0.4rem;
	border-radius: 50%;
	background: var(--color-accent-orange);
}

@media (max-width: 64rem) {
	.about-window {
		grid-template-columns: 1fr;
	}

	.profile-panel {
		order: 1;
	}
}

@media (max-width: 48rem) {
	.profile-panel {
		display: none;
	}

	.mobile-profile-tile {
		display: flex;
	}

	.details-panel {
		padding: var(--space-4);
	}

	.details-header {
		flex-direction: column;
	}

	.info-grid {
		grid-template-columns: 1fr;
	}
}
</style>
