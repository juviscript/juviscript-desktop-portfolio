<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import BootSequence from "./components/boot/BootSequence.vue";
import DesktopWorkspace from "./components/shell/DesktopWorkspace.vue";
import MobileWorkspace from "./components/shell/MobileWorkspace.vue";
import MobileBootSequence from "./components/boot/MobileBootSequence.vue";

const bootComplete = ref(false);
const isMobile = ref(false);

let mediaQuery: MediaQueryList | null = null;

function handleBootComplete() {
	bootComplete.value = true;
}

function updateViewportMode() {
	if (!mediaQuery) {
		return;
	}

	isMobile.value = mediaQuery.matches;
}

onMounted(() => {
	mediaQuery = window.matchMedia("(max-width: 68rem)");
	updateViewportMode();
	mediaQuery.addEventListener("change", updateViewportMode);
});

onUnmounted(() => {
	mediaQuery?.removeEventListener("change", updateViewportMode);
});
</script>

<template>
	<div v-if="isMobile" class="phone-frame">
		<div class="frame-content">
			<MobileBootSequence v-if="!bootComplete" @complete="handleBootComplete" />
			<MobileWorkspace v-else />
		</div>
	</div>

	<div v-else class="monitor-frame">
		<div class="frame-content">
			<BootSequence v-if="!bootComplete" @complete="handleBootComplete" />
			<DesktopWorkspace v-else />
		</div>
	</div>
</template>

<style scoped>
.monitor-frame,
.phone-frame {
	background: linear-gradient(160deg, var(--color-frame-top) 0%, var(--color-frame-bottom) 100%);
	border: var(--border-thin) solid rgba(255, 255, 255, 0.65);
	box-shadow: var(--shadow-shell);
	position: relative;
}

.monitor-frame::before,
.phone-frame::before {
	content: "";
	position: absolute;
	border: var(--border-thin) solid rgba(255, 255, 255, 0.35);
	pointer-events: none;
}

.monitor-frame {
	width: min(calc(100vw - 3rem), 112rem, calc((100vh - 3rem) * 16 / 9));
	aspect-ratio: 16 / 9;
	padding: var(--space-4);
	border-radius: var(--radius-2xl);
}

.monitor-frame::before {
	inset: var(--space-3);
	border-radius: calc(var(--radius-2xl) - var(--space-2));
}

.phone-frame {
	width: calc(100vw - 0.75rem);
	height: calc(100dvh - 0.75rem);
	min-height: calc(100vh - 0.75rem);
	padding: 0.35rem;
	border-radius: 1.75rem;
}

.phone-frame::before {
	inset: 0.25rem;
	border-radius: 1.45rem;
}

.frame-content {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	border-radius: var(--radius-xl);
	background: linear-gradient(180deg, #fff6ea 0%, #f7e2cc 100%);
	box-shadow:
		inset 0 0 0 var(--border-thin) rgba(90, 61, 43, 0.12),
		inset 0 1rem 2rem rgba(255, 255, 255, 0.3);
}
</style>
