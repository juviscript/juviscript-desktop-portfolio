<script setup lang="ts">
const strengths = ["Frontend architecture", "TypeScript", "UX-minded development", "Playful interfaces"];
const currentFocus = ["Building memorable portfolio experiences", "Sharpening Vue skills", "Shipping clean UI systems"];
const funFacts = ["Corgi fan", "Retro desktop enthusiast", "Enjoys turning ideas into interactive experiences"];
</script>

<template>
	<div class="about-window">
		<aside class="profile-panel">
			<div class="avatar-frame">
				<div class="avatar-core">JP</div>
			</div>
			<h1 class="profile-name">Juvilane Panaguiton</h1>
			<p class="profile-role">Developer Profile</p>

			<div class="status-card">
				<div class="status-heading">System Status</div>
				<div class="status-row">
					<span class="status-label">Mode</span>
					<span class="status-value online">Online</span>
				</div>
				<div class="status-row">
					<span class="status-label">Focus</span>
					<span class="status-value">Building polished web apps</span>
				</div>
				<div class="status-row">
					<span class="status-label">Theme</span>
					<span class="status-value">Retro desktop, modern code</span>
				</div>
			</div>
		</aside>

		<section class="details-panel">
			<div class="details-header">
				<div>
					<p class="eyebrow">System Properties</p>
					<h2 class="section-title">About This Developer</h2>
				</div>
				<div class="header-badge">v1.0 Human Edition</div>
			</div>

			<div class="info-grid">
				<section class="info-card intro-card">
					<h3 class="card-title">Overview</h3>
					<p class="card-copy">
						I'm a full-stack developer with a Bachelor's in Software Engineering and a professional background building web solutions in PHP, JavaScript, Java, and CMS platforms like WordPress. In my current role as a Solutions Developer
						II, I focus on creating practical, maintainable solutions while keeping the user experience in mind. I like work that sits at the intersection of clean engineering and thoughtful design, which is a big part of why I built this
						portfolio in Vue.
					</p>
					<p>
						I like to call myself a lifelong learner - I'm always exploring new technologies and approaches to find better ways to solve problems and create engaging digital experiences. When I'm not coding, you can find me playing games,
						spending time with my family, or indulging my love of all things retro tech and corgis.
					</p>
				</section>

				<section class="info-card">
					<h3 class="card-title">What I Bring</h3>
					<div class="tag-list">
						<span v-for="strength in strengths" :key="strength" class="tag-chip">{{ strength }}</span>
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
	display: grid;
	grid-template-columns: 240px minmax(0, 1fr);
	background: linear-gradient(180deg, #f5f6fa 0%, #ebeef8 100%);
	color: #1d2640;
}

.profile-panel {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.9rem;
	padding: 1.25rem 1rem;
	background: linear-gradient(180deg, #d9e3ff 0%, #c5d3f7 100%);
	border-right: 1px solid #9eacd0;
}

.avatar-frame {
	width: 132px;
	height: 132px;
	padding: 8px;
	background: linear-gradient(135deg, #ffffff 0%, #c6d3f5 100%);
	border: 2px solid #7b8db6;
	box-shadow: inset 1px 1px 0 #ffffff;
}

.avatar-core {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	color: #24407c;
	background: radial-gradient(circle at 30% 30%, #ffffff 0%, #dbe7ff 45%, #a9bbeb 100%);
	border: 1px solid #8aa1d6;
}

.profile-name {
	margin: 0;
	font-size: 1.15rem;
	text-align: center;
}

.profile-role {
	margin: 0;
	font-size: 0.82rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #4d5f8d;
}

.status-card {
	width: 100%;
	padding: 0.85rem;
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid #9eacd0;
	box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.8);
}

.status-heading {
	margin-bottom: 0.7rem;
	font-size: 0.78rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	color: #44557f;
}

.status-row {
	display: flex;
	justify-content: space-between;
	gap: 0.75rem;
	padding: 0.35rem 0;
	border-top: 1px solid rgba(125, 142, 184, 0.25);
	font-size: 0.82rem;
}

.status-row:first-of-type {
	border-top: 0;
	padding-top: 0;
}

.status-label {
	color: #56688e;
}

.status-value {
	text-align: right;
	font-weight: 600;
}

.status-value.online {
	color: #2d7a3e;
}

.details-panel {
	padding: 1.25rem;
	overflow: auto;
}

.details-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	margin-bottom: 1.1rem;
	padding-bottom: 0.9rem;
	border-bottom: 1px solid #bcc7e6;
}

.eyebrow {
	margin: 0 0 0.25rem;
	font-size: 0.76rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #6377a7;
}

.section-title {
	margin: 0;
	font-size: 1.4rem;
}

.header-badge {
	padding: 0.35rem 0.65rem;
	font-size: 0.78rem;
	font-weight: 700;
	color: #26467f;
	background: #dde8ff;
	border: 1px solid #9ab1df;
}

.info-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.info-card {
	padding: 1rem;
	background: rgba(255, 255, 255, 0.8);
	border: 1px solid #b6c2e1;
	box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.85);
}

.intro-card {
	grid-column: 1 / -1;
}

.card-title {
	margin: 0 0 0.65rem;
	font-size: 0.95rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: #33466f;
}

.card-copy {
	margin: 0;
	line-height: 1.6;
}

.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.tag-chip {
	padding: 0.35rem 0.55rem;
	font-size: 0.82rem;
	background: #eef3ff;
	border: 1px solid #b8c8ef;
}

.fact-list {
	margin: 0;
	padding-left: 1.1rem;
	line-height: 1.7;
}

@media (max-width: 720px) {
	.about-window {
		grid-template-columns: 1fr;
	}

	.profile-panel {
		align-items: flex-start;
	}

	.details-header {
		flex-direction: column;
	}

	.info-grid {
		grid-template-columns: 1fr;
	}
}
</style>
