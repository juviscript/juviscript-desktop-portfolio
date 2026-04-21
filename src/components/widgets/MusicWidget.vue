<script setup lang="ts">
import { computed, ref } from "vue";
import WidgetCard from "./WidgetCard.vue";

withDefaults(defineProps<{
	surface?: "desktop" | "mobile";
}>(), {
	surface: "desktop",
});

const tracks = [
	{ title: "Cloud Nine Compile", artist: "jsOS Radio", duration: "2:48" },
	{ title: "Nollie Afternoon Loop", artist: "Workspace Beats", duration: "3:12" },
	{ title: "Golden Hour Boot", artist: "Desktop Dreams", duration: "4:06" },
];

const currentTrackIndex = ref(0);
const isPlaying = ref(true);
const fallbackTrack = tracks[0]!;

const currentTrack = computed(() => tracks[currentTrackIndex.value] ?? fallbackTrack);

function previousTrack() {
	currentTrackIndex.value = currentTrackIndex.value === 0 ? tracks.length - 1 : currentTrackIndex.value - 1;
}

function nextTrack() {
	currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.length;
}

function togglePlayback() {
	isPlaying.value = !isPlaying.value;
}
</script>

<template>
	<WidgetCard title="Now Playing" subtitle="Music Widget" accent="red">
		<div class="music-widget">
			<div class="music-widget__cover" aria-hidden="true">
				<div class="music-widget__disc"></div>
			</div>

			<div class="music-widget__copy">
				<p class="music-widget__title">{{ currentTrack.title }}</p>
				<p class="music-widget__artist">{{ currentTrack.artist }}</p>
			</div>

			<div class="music-widget__progress">
				<div class="music-widget__progress-bar">
					<div class="music-widget__progress-fill"></div>
				</div>
				<div class="music-widget__timestamps">
					<span>{{ isPlaying ? "1:14" : "Paused" }}</span>
					<span>{{ currentTrack.duration }}</span>
				</div>
			</div>

			<div class="music-widget__controls">
				<button class="music-widget__button" type="button" @click="previousTrack">Prev</button>
				<button class="music-widget__button music-widget__button--primary" type="button" @click="togglePlayback">
					{{ isPlaying ? "Pause" : "Play" }}
				</button>
				<button class="music-widget__button" type="button" @click="nextTrack">Next</button>
			</div>
		</div>
	</WidgetCard>
</template>

<style scoped>
.music-widget {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.music-widget__cover {
	display: grid;
	place-items: center;
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: var(--radius-lg);
	background:
		linear-gradient(135deg, rgba(237, 109, 75, 0.22), rgba(241, 146, 73, 0.14)),
		radial-gradient(circle at top right, rgba(255, 255, 255, 0.42), transparent 38%),
		var(--color-surface-strong);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.08);
}

.music-widget__disc {
	width: 3.6rem;
	height: 3.6rem;
	border-radius: 50%;
	background:
		radial-gradient(circle, rgba(255, 255, 255, 0.76) 0 0.35rem, transparent 0.36rem),
		radial-gradient(circle, rgba(90, 61, 43, 0.16) 0 0.95rem, transparent 0.96rem),
		linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
	box-shadow: 0 0.8rem 1.2rem rgba(90, 61, 43, 0.12);
}

.music-widget__copy,
.music-widget__timestamps {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.music-widget__title,
.music-widget__artist,
.music-widget__timestamps span {
	margin: 0;
}

.music-widget__title {
	font-size: var(--text-md);
	font-weight: 700;
	color: var(--color-ink);
}

.music-widget__artist,
.music-widget__timestamps span {
	font-size: var(--text-xs);
	color: var(--color-ink-soft);
}

.music-widget__progress {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.music-widget__progress-bar {
	height: 0.55rem;
	border-radius: var(--radius-pill);
	background: rgba(90, 61, 43, 0.12);
	overflow: hidden;
}

.music-widget__progress-fill {
	width: 42%;
	height: 100%;
	border-radius: inherit;
	background: linear-gradient(90deg, var(--color-accent-red), var(--color-accent-orange));
}

.music-widget__timestamps {
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.music-widget__controls {
	display: flex;
	gap: var(--space-2);
}

.music-widget__button {
	flex: 1;
	min-height: 2.15rem;
	padding: 0.35rem 0.75rem;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-pill);
	background: rgba(255, 255, 255, 0.78);
	color: var(--color-ink);
	font-size: var(--text-2xs);
	font-weight: 700;
	cursor: pointer;
}

.music-widget__button--primary {
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
	color: var(--color-white);
}
</style>
