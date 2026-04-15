<script setup lang="ts">
import ThemedIcon from "./ThemedIcon.vue";
import backPageIcon from "../assets/window-icons/last-page-icon.svg?raw";
import forwardPageIcon from "../assets/window-icons/next-page-icon.svg?raw";
import refreshPageIcon from "../assets/window-icons/refresh-icon.svg?raw";
import homeIcon from "../assets/window-icons/home-icon.svg?raw";

const props = defineProps<{
	url: string;
	isPdf: boolean;
	objectUrl?: string;
}>();
</script>

<template>
	<div class="browser-window">
		<div class="browser-navigation-bar">
			<div class="browser-navigation-buttons">
				<button class="browser-nav-button" type="button" aria-label="Go back">
					<ThemedIcon class="browser-nav-icon" :svg="backPageIcon" />
				</button>
				<button class="browser-nav-button" type="button" aria-label="Go forward">
					<ThemedIcon class="browser-nav-icon" :svg="forwardPageIcon" />
				</button>
				<button class="browser-nav-button" type="button" aria-label="Refresh page">
					<ThemedIcon class="browser-nav-icon" :svg="refreshPageIcon" />
				</button>
				<button class="browser-nav-button browser-nav-button--home" type="button" aria-label="Go home">
					<ThemedIcon class="browser-nav-icon" :svg="homeIcon" />
				</button>
			</div>

			<div class="browser-navigation-address-bar">
				<input type="text" class="browser-url-input" :value="props.url" disabled />
			</div>

			<div class="browser-navigation-menu">
				<button class="browser-menu-button" type="button" aria-label="Browser menu">
					<span class="browser-menu-dots" aria-hidden="true">•••</span>
				</button>
			</div>
		</div>

		<div class="browser-content">
			<object v-if="props.isPdf" :data="props.objectUrl || props.url" type="application/pdf" class="browser-frame">
				<p class="browser-fallback">
					Content not available.
					<a :href="props.objectUrl || props.url" target="_blank" rel="noopener">Open content</a>
				</p>
			</object>
			<iframe v-else :src="props.url" title="Embedded browser content" class="browser-frame" />
		</div>
	</div>
</template>

<style scoped>
.browser-window {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.browser-navigation-bar {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr) auto;
	align-items: center;
	gap: var(--space-3);
	padding: var(--space-2) 0;
}

.browser-navigation-buttons {
	display: flex;
	align-items: center;
	gap: var(--space-2);
}

.browser-nav-button,
.browser-menu-button {
	display: inline-grid;
	place-items: center;
	width: 2rem;
	height: 2rem;
	padding: 0;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-md);
	background: rgba(255, 255, 255, 0.82);
	color: var(--color-ink-soft);
	cursor: pointer;
	box-shadow: 0 0.35rem 0.85rem rgba(90, 61, 43, 0.08);
	transition:
		transform 140ms ease,
		background-color 140ms ease,
		box-shadow 140ms ease,
		color 140ms ease;
}

.browser-nav-button:hover,
.browser-menu-button:hover {
	transform: translateY(-0.0625rem);
	background: var(--color-surface);
	color: var(--color-ink);
	box-shadow: 0 0.5rem 1rem rgba(90, 61, 43, 0.12);
}

.browser-nav-button--home {
	background: rgba(244, 200, 111, 0.3);
}

.browser-nav-icon {
	width: 0.9rem;
	height: 0.9rem;
}

.browser-navigation-address-bar {
	min-width: 0;
	padding: 0.55rem 0.75rem;
	border-radius: var(--radius-pill);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.1);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.15)),
		var(--color-surface-muted);
	box-shadow: inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.3);
}

.browser-url-input {
	width: 100%;
	padding: 0;
	border: none;
	background: transparent;
	color: var(--color-ink);
	font-size: var(--text-sm);
	font-weight: 500;
	outline: none;
	box-shadow: none;
}

.browser-url-input:focus {
	outline: none;
	box-shadow: none;
}

.browser-menu-dots {
	font-family: var(--font-display);
	font-size: var(--text-sm);
	font-weight: 700;
	line-height: 1;
	letter-spacing: 0.05em;
}

.browser-content {
	flex: 1;
	min-height: 0;
	overflow: hidden;
	border-radius: var(--radius-lg);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.1);
	background: rgba(255, 255, 255, 0.62);
	box-shadow: inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.28);
}

.browser-frame {
	width: 100%;
	height: 100%;
	border: 0;
	background: var(--color-surface);
}

.browser-fallback {
	padding: var(--space-4);
	color: var(--color-ink);
}

.browser-fallback a {
	color: var(--color-accent-red);
	font-weight: 600;
}
</style>
