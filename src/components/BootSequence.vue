<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const emit = defineEmits<{
	complete: [];
}>();

const showBios = ref(true);
const showLogo = ref(false);
const progress = ref(0);

let biosTimeout: ReturnType<typeof setTimeout> | null = null;
let completeTimeout: ReturnType<typeof setTimeout> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;
let hasCompleted = false;

function clearBootTimers() {
	if (biosTimeout) {
		clearTimeout(biosTimeout);
		biosTimeout = null;
	}

	if (completeTimeout) {
		clearTimeout(completeTimeout);
		completeTimeout = null;
	}

	if (progressInterval) {
		clearInterval(progressInterval);
		progressInterval = null;
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

	progressInterval = setInterval(() => {
		progress.value += 5;

		if (progress.value >= 100) {
			progress.value = 100;

			if (progressInterval) {
				clearInterval(progressInterval);
				progressInterval = null;
			}

			completeTimeout = setTimeout(() => {
				finishBootSequence();
			}, 500);
		}
	}, 50);
}

function handleKeydown(event: KeyboardEvent) {
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

	biosTimeout = setTimeout(() => {
		startLogoSequence();
	}, 3000);
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
				<p>JuviScriptBIOS 1.0 Release 1.0</p>
				<p>Copyright 1995-2026 Juviscript Technologies Ltd.</p>
				<p>All Rights Reserved</p>
				<p>Copyright 1995-2026 Intel Corporation</p>
				<p>4S4E82M0.10A.0022.P06</p>
				<br />
				<p>Dell Dimension XPS T500</p>
				<p>BIOS Version A05</p>
				<p>Intel Â® Pentium Â® III Processor 500 MHz</p>
				<p>256MB System RAM Passed</p>
				<br />
				<p>Keyboard ............ Detected</p>
				<p>Mouse ............... Detected</p>
				<br />
				<p>Fixed Disk 0: WDC WD200EB-00CPF0-(PM)</p>
				<p>ATAPI CD-ROM: CRD-8400-SM</p>
				<p>ATAPI CD-ROM: CRD-8400-SM</p>
				<br />
				<br />
				<p>Press &lt;Del&gt; to enter SETUP</p>
			</div>

			<p class="skip-hint">Press SPACE to skip</p>
		</div>

		<div v-if="showLogo" class="logo-screen">
			<div class="logo-container">
				<div class="logo-placeholder">
					<p>LOGO OR ICON</p>
				</div>
				<h1 class="windows-title">
					<span class="microsoft">Microsoft</span>
					<span class="windows">Windows98</span>
				</h1>
				<div class="loading-bar">
					<div class="loading-progress" :style="{ width: `${progress}%` }"></div>
				</div>
			</div>

			<p class="skip-hint">Press SPACE to skip</p>
		</div>
	</div>
</template>

<style scoped>
.boot-sequence {
	width: 100vw;
	height: 100vh;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
}

.bios-screen {
	width: 100%;
	height: 100%;
	background-color: #000;
	color: #aaa;
	font-family: "Courier New", monospace;
	font-size: 14px;
	padding: 20px;
	overflow: hidden;
	position: relative;
}

.bios-text p {
	margin: 2px 0;
	line-height: 1.4;
}

.logo-screen {
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, #a6cae1 0%, #5a9bc5 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.logo-container {
	text-align: center;
}

.logo-placeholder {
	width: 200px;
	height: 200px;
	background-color: #4a7a9a;
	margin: 0 auto 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-family: "Press Start 2P", monospace;
	font-size: 12px;
	border: 3px solid #2a5a7a;
}

.windows-title {
	margin: 20px 0;
}

.microsoft {
	display: block;
	font-family: "Arial", sans-serif;
	font-size: 24px;
	color: #000;
	font-weight: normal;
}

.windows {
	display: block;
	font-family: "Arial Black", sans-serif;
	font-size: 48px;
	color: #8b0000;
	font-weight: bold;
	letter-spacing: -2px;
}

.loading-bar {
	width: 300px;
	height: 20px;
	background-color: #c0c0c0;
	border: 2px inset #808080;
	margin: 30px auto;
	overflow: hidden;
}

.loading-progress {
	height: 100%;
	background: linear-gradient(to right, #000080, #0000ff);
	transition: width 0.1s linear;
}

.skip-hint {
	position: absolute;
	left: 20px;
	bottom: 16px;
	margin: 0;
	font-size: 12px;
	letter-spacing: 0.08em;
}
</style>
