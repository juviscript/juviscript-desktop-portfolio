<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import jsOsLogo from "../assets/jsOS Logo.png";
import jsOsBiosLogo from "../assets/jsOS BIOS Logo.png";

const emit = defineEmits<{
	complete: [];
}>();

const showBios = ref(true);
const showLogo = ref(false);
const showBiosPhaseTwo = ref(false);
const showBiosPhaseThree = ref(false);
const progress = ref(0);
const totalLoadingBlocks = 18;
const lockBootScreen = import.meta.env.DEV && false;

const filledLoadingBlocks = computed(() => Math.round((progress.value / 100) * totalLoadingBlocks));

let phaseTwoTimeout: ReturnType<typeof setTimeout> | null = null;
let phaseThreeTimeout: ReturnType<typeof setTimeout> | null = null;
let logoTimeout: ReturnType<typeof setTimeout> | null = null;
let completeTimeout: ReturnType<typeof setTimeout> | null = null;
let progressTimeout: ReturnType<typeof setTimeout> | null = null;
let hasCompleted = false;

function clearBootTimers() {
	if (phaseTwoTimeout) {
		clearTimeout(phaseTwoTimeout);
		phaseTwoTimeout = null;
	}

	if (phaseThreeTimeout) {
		clearTimeout(phaseThreeTimeout);
		phaseThreeTimeout = null;
	}

	if (logoTimeout) {
		clearTimeout(logoTimeout);
		logoTimeout = null;
	}

	if (completeTimeout) {
		clearTimeout(completeTimeout);
		completeTimeout = null;
	}

	if (progressTimeout) {
		clearTimeout(progressTimeout);
		progressTimeout = null;
	}
}

function finishBootSequence() {
	if (hasCompleted) {
		return;
	}

	hasCompleted = true;
	clearBootTimers();
	emit("complete");
}

function startLogoSequence() {
	showBios.value = false;
	showLogo.value = true;
	progress.value = 0;
	advanceProgress();
}

function advanceProgress() {
	if (progress.value >= 100) {
		progress.value = 100;
		completeTimeout = setTimeout(() => {
			finishBootSequence();
		}, 500);
		return;
	}

	const inPauseZone = progress.value >= 45 && progress.value <= 60;
	const shouldPause = inPauseZone && Math.random() < 0.35;
	const delay = inPauseZone
		? Math.floor(Math.random() * 280) + 180
		: Math.floor(Math.random() * 90) + 55;

	if (!shouldPause) {
		const increment = inPauseZone
			? Math.floor(Math.random() * 2) + 2
			: Math.floor(Math.random() * 4) + 3;

		progress.value = Math.min(progress.value + increment, 100);
	}

	progressTimeout = setTimeout(() => {
		advanceProgress();
	}, delay);
}

function startBiosSequence() {
	showBiosPhaseTwo.value = false;
	showBiosPhaseThree.value = false;

	phaseTwoTimeout = setTimeout(() => {
		showBiosPhaseTwo.value = true;
	}, 2000);

	phaseThreeTimeout = setTimeout(() => {
		showBiosPhaseThree.value = true;
	}, 5000);

	logoTimeout = setTimeout(() => {
		startLogoSequence();
	}, 8000);
}

function handleKeydown(event: KeyboardEvent) {
	if (lockBootScreen) {
		return;
	}

	if (event.code === "Space") {
		event.preventDefault();
		finishBootSequence();
	}

	if (event.code === "Delete" && showBios.value) {
		event.preventDefault();
	}
}

onMounted(() => {
	window.addEventListener("keydown", handleKeydown);

	if (lockBootScreen) {
		showBios.value = false;
		showLogo.value = true;
		progress.value = 100;
		return;
	}

	startBiosSequence();
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleKeydown);
	clearBootTimers();
});
</script>

<template>
	<div class="boot-sequence">
		<div v-if="showBios" class="bios-screen">
			<div class="bios-text">
				<div>
					<div class="bios-phase-1">
						<div>
							<p>JuviScriptBIOS 1.0 Release 1.0</p>
							<p>Copyright 1995-2026 Juviscript Technologies Ltd.</p>
							<p>All Rights Reserved</p>
							<p>Copyright 1995-2026 Intel Corporation</p>
							<p>4S4E82M0.10A.0022.P06</p>
						</div>

                        <img :src="jsOsBiosLogo" alt="jsOS BIOS Logo" style="width: 350px; opacity: .75; margin-right: 2rem;" /> 
					</div>
					<div v-if="showBiosPhaseTwo" class="bios-phase-2">
						<p>JuviScript Systems</p>
						<p>jsOS Dimension J500</p>
						<p>BIOS Version A05</p>
						<p>Intel Pentium III Processor 500 MHz</p>
						<p>256MB System RAM Passed</p>
						<br />
						<p>Keyboard ............ Detected</p>
						<p>Mouse ............... Detected</p>
					</div>
					<div v-if="showBiosPhaseThree" class="bios-phase-3">
						<p>Fixed Disk 0: WDC WD200EB-00CPF0-(PM)</p>
						<p>ATAPI CD-ROM: CRD-8400-SM</p>
						<p>ATAPI CD-ROM: CRD-8400-SM</p>
					</div>
				</div>
				<div>
					<p>Press &lt;Del&gt; to enter SETUP</p>
					<p>Press SPACE to skip</p>
				</div>
			</div>
		</div>

		<div v-if="showLogo" class="logo-screen">
			<div class="logo-container">
				<img :src="jsOsLogo" alt="jsOS logo" class="logo" />

				<div>
					<div class="loading-blocks" aria-label="Loading progress" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
						<div v-for="block in totalLoadingBlocks" :key="block" class="loading-block" :class="{ active: block <= filledLoadingBlocks }"></div>
					</div>
					<p class="skip-hint">Press SPACE to skip</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.boot-sequence {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 10;
}

.bios-screen {
	width: 100%;
	height: 100%;
	background-color: #000;
	color: #aaa;
	font-family: "Courier New", monospace;
	font-size: 1.25rem;
	font-weight: 600;
	padding: 1.25rem;
	overflow: hidden;
	position: relative;
}

.bios-phase-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;;
}

.bios-phase-2 {
	margin: 1rem 0;
}

.bios-text {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
}

.bios-text p {
	margin: 2px 0;
	line-height: 1.4;
}

.logo-screen {
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, #f7fcff 0%, #dcf3ff 28%, #bfe9ff 68%, #a7dcf4 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;
}

.logo-screen::before {
	content: "";
	position: absolute;
	inset: 0;
	background:
		linear-gradient(to bottom, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 28%), repeating-linear-gradient(to right, rgba(255, 255, 255, 0.05) 0 28px, rgba(160, 214, 239, 0.07) 28px 56px),
		repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 0 28px, rgba(147, 202, 230, 0.05) 28px 56px);
	opacity: 0.7;
	pointer-events: none;
}

.logo-screen::after {
	content: "";
	position: absolute;
	inset: 0;
	background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0 34%, transparent 62%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 72%, rgba(129, 186, 214, 0.14) 100%);
	opacity: 1;
	pointer-events: none;
}

.logo-container {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	position: relative;
	z-index: 1;
}

.logo {
	margin: auto;
	max-width: min(78%, 540px);
	height: auto;
	image-rendering: pixelated;
}

.windows-title {
	margin: 20px 0;
}

.loading-blocks {
	display: flex;
	justify-content: center;
	gap: 0.2rem;
	margin: auto;
	position: relative;
	background: linear-gradient(to bottom, #fff8dc 0%, #ffe7ab 100%);
	box-shadow:
		inset 2px 2px 0 rgba(255, 255, 255, 0.7),
		inset -2px -2px 0 rgba(188, 141, 52, 0.28);
	width: fit-content;
	z-index: 0;
}

.loading-blocks::before {
	content: "";
	position: absolute;
	inset: -6px;
	background: #3d3827;
	clip-path: polygon(
		6px 0,
		calc(100% - 6px) 0,
		calc(100% - 6px) 2px,
		calc(100% - 2px) 2px,
		calc(100% - 2px) 6px,
		100% 6px,
		100% calc(100% - 6px),
		calc(100% - 2px) calc(100% - 6px),
		calc(100% - 2px) calc(100% - 2px),
		calc(100% - 6px) calc(100% - 2px),
		calc(100% - 6px) 100%,
		6px 100%,
		6px calc(100% - 2px),
		2px calc(100% - 2px),
		2px calc(100% - 6px),
		0 calc(100% - 6px),
		0 6px,
		2px 6px,
		2px 2px,
		6px 2px
	);
	z-index: -1;
}

.loading-block {
	width: 22px;
	height: 30px;
	position: relative;
	background: #5a3d2b;
	clip-path: polygon(
		2px 0,
		calc(100% - 2px) 0,
		calc(100% - 2px) 1px,
		calc(100% - 1px) 1px,
		calc(100% - 1px) 2px,
		100% 2px,
		100% calc(100% - 2px),
		calc(100% - 1px) calc(100% - 2px),
		calc(100% - 1px) calc(100% - 1px),
		calc(100% - 2px) calc(100% - 1px),
		calc(100% - 2px) 100%,
		2px 100%,
		2px calc(100% - 1px),
		1px calc(100% - 1px),
		1px calc(100% - 2px),
		0 calc(100% - 2px),
		0 2px,
		1px 2px,
		1px 1px,
		2px 1px
	);
	opacity: 0.9;
}

.loading-block::before {
	content: "";
	position: absolute;
	inset: 2px;
}

.loading-block.active {
	background: #5a3d2b;
	opacity: 1;
}

.loading-block.active::before {
	background: #5b9ec6;
}

.loading-block:nth-child(even).active::before {
	background: #7fbfe3;
}

.skip-hint {
	font-size: 1.5rem;
	font-family: var(--font-chrome);
}
</style>
