<script setup lang="ts">
withDefaults(defineProps<{
	title: string;
	subtitle?: string;
	accent?: "red" | "orange" | "gold" | "sky";
}>(), {
	subtitle: "",
	accent: "orange",
});
</script>

<template>
	<section class="widget-card" :class="`widget-card--${accent}`">
		<header class="widget-card__header">
			<div class="widget-card__header-copy">
				<p v-if="subtitle" class="widget-card__subtitle">{{ subtitle }}</p>
				<h3 class="widget-card__title">{{ title }}</h3>
			</div>
			<div class="widget-card__badge" aria-hidden="true"></div>
		</header>

		<div class="widget-card__body">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.widget-card {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	padding: var(--space-4);
	border-radius: var(--radius-xl);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.54), rgba(255, 255, 255, 0.16)),
		rgba(255, 249, 241, 0.92);
	box-shadow: var(--shadow-card);
	color: var(--color-ink);
}

.widget-card__header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: var(--space-3);
}

.widget-card__header-copy {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.widget-card__subtitle,
.widget-card__title {
	margin: 0;
}

.widget-card__subtitle {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.widget-card__title {
	font-family: var(--font-display);
	font-size: var(--text-lg);
	line-height: var(--line-tight);
}

.widget-card__badge {
	width: 0.8rem;
	height: 0.8rem;
	border-radius: 50%;
	flex: 0 0 auto;
	background: var(--widget-accent, var(--color-accent-orange));
	box-shadow: 0 0 0 0.18rem rgba(255, 255, 255, 0.4);
}

.widget-card__body {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.widget-card--red {
	--widget-accent: var(--color-accent-red);
}

.widget-card--orange {
	--widget-accent: var(--color-accent-orange);
}

.widget-card--gold {
	--widget-accent: var(--color-accent-gold);
}

.widget-card--sky {
	--widget-accent: #8dc9eb;
}
</style>
