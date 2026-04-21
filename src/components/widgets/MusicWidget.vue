<script lang="ts">
let desktopInteractionSeen = false;
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import WidgetCard from "./WidgetCard.vue";
import { musicTracks } from "../../data/MusicTracks";

const props = withDefaults(defineProps<{
	surface?: "desktop" | "mobile";
}>(), {
	surface: "desktop",
});

const currentTrackIndex = ref(0);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isSeeking = ref(false);
const volumeLevel = ref(0.2);
const audioElement = ref<HTMLAudioElement | null>(null);

const hasTracks = computed(() => musicTracks.length > 0);
const currentTrack = computed(() => musicTracks[currentTrackIndex.value] ?? null);
const progressPercent = computed(() => (duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0));
const currentTimeLabel = computed(() => formatTime(currentTime.value));
const durationLabel = computed(() => formatTime(duration.value));
const appliedVolume = computed(() => Math.pow(volumeLevel.value, 3));

function applyVolume() {
	if (audioElement.value) {
		audioElement.value.volume = appliedVolume.value;
	}
}

async function playCurrentTrack() {
	const audio = audioElement.value;

	if (!audio || !currentTrack.value) {
		return false;
	}

	try {
		applyVolume();
		await audio.play();
		isPlaying.value = true;
		return true;
	} catch {
		isPlaying.value = false;
		return false;
	}
}

function formatTime(seconds: number) {
	if (!Number.isFinite(seconds) || seconds <= 0) {
		return "0:00";
	}

	const flooredSeconds = Math.floor(seconds);
	const minutes = Math.floor(flooredSeconds / 60);
	const remainingSeconds = flooredSeconds % 60;

	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function syncTrack() {
	const audio = audioElement.value;

	if (!audio || !currentTrack.value) {
		return;
	}

	audio.src = currentTrack.value.src;
	audio.load();
	applyVolume();
	currentTime.value = 0;
	duration.value = 0;

	if (isPlaying.value) {
		void playCurrentTrack();
	}
}

function previousTrack() {
	if (!hasTracks.value) {
		return;
	}

	currentTrackIndex.value = currentTrackIndex.value === 0 ? musicTracks.length - 1 : currentTrackIndex.value - 1;
}

function nextTrack() {
	if (!hasTracks.value) {
		return;
	}

	currentTrackIndex.value = (currentTrackIndex.value + 1) % musicTracks.length;
}

function togglePlayback() {
	const audio = audioElement.value;

	if (!audio || !currentTrack.value) {
		return;
	}

	isPlaying.value = !isPlaying.value;

	if (isPlaying.value) {
		void playCurrentTrack();
		return;
	}

	audio.pause();
}

function handleLoadedMetadata() {
	const audio = audioElement.value;

	if (!audio) {
		return;
	}

	applyVolume();
	duration.value = Number.isFinite(audio.duration) ? audio.duration : 0;
}

function handleTimeUpdate() {
	if (isSeeking.value) {
		return;
	}

	currentTime.value = audioElement.value?.currentTime ?? 0;
}

function handleTrackEnded() {
	if (!hasTracks.value) {
		return;
	}

	nextTrack();
}

function handleSeek(event: Event) {
	const value = Number((event.target as HTMLInputElement).value);
	currentTime.value = value;
}

function commitSeek() {
	const audio = audioElement.value;

	if (!audio) {
		return;
	}

	audio.currentTime = currentTime.value;
	isSeeking.value = false;
}

function handleVolumeInput(event: Event) {
	const nextVolume = Number((event.target as HTMLInputElement).value);
	volumeLevel.value = nextVolume;
}

async function handleFirstDesktopInteraction(event: Event) {
	desktopInteractionSeen = true;

	const interactionTarget = event.target;

	if (
		interactionTarget instanceof HTMLElement &&
		interactionTarget.closest(".music-widget__button, .music-widget__progress-input")
	) {
		return;
	}

	if (props.surface !== "desktop" || !hasTracks.value || isPlaying.value) {
		return;
	}

	await playCurrentTrack();
}

watch(currentTrackIndex, () => {
	syncTrack();
});

watch(hasTracks, hasAnyTracks => {
	if (!hasAnyTracks) {
		isPlaying.value = false;
		currentTrackIndex.value = 0;
		currentTime.value = 0;
		duration.value = 0;
	}
});

watch(appliedVolume, nextVolume => {
	if (audioElement.value) {
		audioElement.value.volume = nextVolume;
	}
});

onMounted(() => {
	applyVolume();

	if (props.surface !== "desktop" || !hasTracks.value) {
		return;
	}

	if (desktopInteractionSeen) {
		void playCurrentTrack();
		return;
	}

	window.addEventListener("pointerdown", handleFirstDesktopInteraction, { once: true });
	window.addEventListener("keydown", handleFirstDesktopInteraction, { once: true });
});

onBeforeUnmount(() => {
	window.removeEventListener("pointerdown", handleFirstDesktopInteraction);
	window.removeEventListener("keydown", handleFirstDesktopInteraction);
	audioElement.value?.pause();
});
</script>

<template>
	<WidgetCard title="Now Playing" subtitle="Music Widget" accent="red">
		<div class="music-widget">
			<audio
				v-if="currentTrack"
				ref="audioElement"
				:key="currentTrack.id"
				:src="currentTrack.src"
				preload="metadata"
				@loadedmetadata="handleLoadedMetadata"
				@timeupdate="handleTimeUpdate"
				@ended="handleTrackEnded" />

			<div class="music-widget__cover" aria-hidden="true">
				<div class="music-widget__disc"></div>
			</div>

			<div v-if="currentTrack" class="music-widget__copy">
				<p class="music-widget__title">{{ currentTrack.title }}</p>
				<p class="music-widget__artist">{{ currentTrack.artist }}</p>
			</div>

			<div v-else class="music-widget__empty-state">
				<p class="music-widget__title">Drop in your music</p>
				<p class="music-widget__artist">
					Add tracks in `src/data/MusicTracks.ts` after you upload audio into `src/assets/music/`.
				</p>
			</div>

			<div class="music-widget__progress">
				<div class="music-widget__progress-track">
					<input
						class="music-widget__progress-input"
						type="range"
						min="0"
						:max="duration || 0"
						:value="currentTime"
						:disabled="!currentTrack"
						aria-label="Playback progress"
						@input="handleSeek"
						@pointerdown="isSeeking = true"
						@pointerup="commitSeek"
						@change="commitSeek" />
					<div class="music-widget__progress-bar">
						<div class="music-widget__progress-fill" :style="{ width: `${progressPercent}%` }"></div>
					</div>
				</div>
				<div class="music-widget__timestamps">
					<span>{{ currentTrack ? currentTimeLabel : "No tracks" }}</span>
					<span>{{ currentTrack ? durationLabel : "Add audio" }}</span>
				</div>
			</div>

			<div class="music-widget__controls">
				<button class="music-widget__button" type="button" :disabled="!currentTrack" @click="previousTrack">Prev</button>
				<button class="music-widget__button music-widget__button--primary" type="button" :disabled="!currentTrack" @click="togglePlayback">
					{{ isPlaying ? "Pause" : "Play" }}
				</button>
				<button class="music-widget__button" type="button" :disabled="!currentTrack" @click="nextTrack">Next</button>
			</div>

			<div class="music-widget__volume">
				<label class="music-widget__volume-label" for="music-widget-volume">Volume</label>
				<input
					id="music-widget-volume"
					class="music-widget__volume-slider"
					type="range"
					min="0"
					max="1"
					step="0.01"
					:value="volumeLevel"
					:disabled="!currentTrack"
					@input="handleVolumeInput" />
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

.music-widget__empty-state {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
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

.music-widget__progress-track {
	position: relative;
}

.music-widget__progress-input {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	opacity: 0;
	cursor: pointer;
}

.music-widget__progress-input:disabled {
	cursor: default;
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

.music-widget__button:disabled {
	opacity: 0.52;
	cursor: default;
}

.music-widget__button--primary {
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
	color: var(--color-white);
}

.music-widget__volume {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.music-widget__volume-label {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.music-widget__volume-slider {
	width: 100%;
	margin: 0;
	accent-color: var(--color-accent-red);
}
</style>
