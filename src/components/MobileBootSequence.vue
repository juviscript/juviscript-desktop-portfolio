<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import ScreenPowerOn from "./ScreenPowerOn.vue";
import jsOsLogo from "../assets/jsOS Logo.png";

const emit = defineEmits<{
	complete: [];
}>();

const progress = ref(0);
const totalLoadingBlocks = 10;
const filledLoadingBlocks = computed(() => Math.round((progress.value / 100) * totalLoadingBlocks));

let progressTimeout: ReturnType<typeof setTimeout> | null = null;
let completeTimeout: ReturnType<typeof setTimeout> | null = null;
let hasCompleted = false;

function clearTimers() {
	if (progressTimeout) {
		clearTimeout(progressTimeout);
		progressTimeout = null;
	}

	if (completeTimeout) {
		clearTimeout(completeTimeout);
		completeTimeout = null;
	}
}

function finishSequence() {
	if (hasCompleted) {
		return;
	}

	hasCompleted = true;
	clearTimers();
	emit("complete");
}

function advanceProgress() {
	if (progress.value >= 100) {
		progress.value = 100;
		completeTimeout = setTimeout(() => {
			finishSequence();
		}, 450);
		return;
	}

	progress.value = Math.min(progress.value + (Math.floor(Math.random() * 2) + 1) * 8, 100);

	progressTimeout = setTimeout(() => {
		advanceProgress();
	}, Math.floor(Math.random() * 120) + 120);
}

onMounted(() => {
	advanceProgress();
});

onUnmounted(() => {
	clearTimers();
});
</script>

<template>
	<ScreenPowerOn>
		<div class="mobile-boot-sequence" @click="finishSequence">
			<div class="mobile-boot-card">
				<img :src="jsOsLogo" alt="jsOS logo" class="mobile-boot-logo" />
				<p class="mobile-boot-kicker">jsOS Mobile</p>
				<p class="mobile-boot-copy">Preparing your mobile workspace...</p>

				<div class="mobile-loading-blocks" aria-label="Loading progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
					<div v-for="block in totalLoadingBlocks" :key="block" class="mobile-loading-block" :class="{ active: block <= filledLoadingBlocks }"></div>
				</div>

				<p class="mobile-boot-skip">Tap to skip</p>
			</div>
		</div>
	</ScreenPowerOn>
</template>

<style scoped>
.mobile-boot-sequence {
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
	padding: var(--space-5);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0)),
		linear-gradient(180deg, #f7fcff 0%, #dcf3ff 40%, #bfe9ff 100%);
}

.mobile-boot-card {
	width: min(100%, 22rem);
	padding: var(--space-5);
	border-radius: var(--radius-xl);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	background: rgba(255, 249, 241, 0.88);
	box-shadow: var(--shadow-card);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-3);
	text-align: center;
}

.mobile-boot-logo {
	width: min(100%, 11rem);
	height: auto;
}

.mobile-boot-kicker {
	margin: 0;
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-boot-copy,
.mobile-boot-skip {
	margin: 0;
	color: var(--color-ink);
	font-size: var(--text-sm);
}

.mobile-boot-skip {
	color: var(--color-ink-soft);
}

.mobile-loading-blocks {
	display: flex;
	gap: var(--space-1);
	width: 100%;
}

.mobile-loading-block {
	flex: 1;
	height: 0.65rem;
	border-radius: var(--radius-pill);
	background: rgba(90, 61, 43, 0.12);
}

.mobile-loading-block.active {
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
}
</style>
