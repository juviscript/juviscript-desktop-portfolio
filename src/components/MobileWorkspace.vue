<template>
	<div class="mobile-workspace">
		<div class="mobile-workspace-card">
			<p class="mobile-workspace-kicker">jsOS Mobile</p>
			<h1 class="mobile-workspace-title">Mobile workspace is next.</h1>
			<p class="mobile-workspace-copy">This shell is reserved for the mobile-specific app launcher and full-screen app flow.</p>
		</div>
	</div>
</template>

<style scoped>
.mobile-workspace {
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
	padding: var(--space-5);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0)),
		linear-gradient(180deg, var(--color-surface-strong), var(--color-surface-muted));
}

.mobile-workspace-card {
	max-width: 28rem;
	padding: var(--space-5);
	border-radius: var(--radius-xl);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	background: rgba(255, 249, 241, 0.88);
	box-shadow: var(--shadow-card);
	text-align: center;
}

.mobile-workspace-kicker {
	margin: 0 0 var(--space-2);
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-workspace-title {
	margin: 0 0 var(--space-3);
	font-family: var(--font-display);
	font-size: var(--text-xl);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.mobile-workspace-copy {
	margin: 0;
	color: var(--color-ink);
	line-height: var(--line-loose);
}
</style>
