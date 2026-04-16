<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(defineProps<{
	durationMs?: number;
}>(), {
	durationMs: 720,
});

const showOverlay = ref(true);

let overlayTimeout: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
	overlayTimeout = setTimeout(() => {
		showOverlay.value = false;
	}, props.durationMs);
});

onUnmounted(() => {
	if (overlayTimeout) {
		clearTimeout(overlayTimeout);
		overlayTimeout = null;
	}
});
</script>

<template>
	<div class="screen-power-on" :style="{ '--power-on-duration': `${props.durationMs}ms` }">
		<slot />

		<div v-if="showOverlay" class="power-on-overlay">
			<div class="power-on-line"></div>
		</div>
	</div>
</template>

<style scoped>
.screen-power-on {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.power-on-overlay {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	background: #000;
	pointer-events: none;
	z-index: 50;
	animation: power-on-overlay-fade var(--power-on-duration) ease forwards;
}

.power-on-line {
	width: 100%;
	height: 0.15rem;
	background: rgba(255, 250, 234, 0.98);
	box-shadow:
		0 0 0.55rem rgba(255, 250, 234, 0.95),
		0 0 1.4rem rgba(191, 233, 255, 0.72);
	animation: power-on-line-expand var(--power-on-duration) ease forwards;
}

@keyframes power-on-line-expand {
	0% {
		width: 0%;
		height: 0.05rem;
		opacity: 0;
	}
	10% {
		width: 18%;
		height: 0.08rem;
		opacity: 1;
	}
	22% {
		width: 100%;
		height: 0.15rem;
		opacity: 1;
	}
	46% {
		width: 100%;
		height: 0.22rem;
		opacity: 1;
	}
	72% {
		width: 100%;
		height: 100%;
		opacity: 0.96;
	}
	100% {
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}

@keyframes power-on-overlay-fade {
	0% {
		background: #000;
	}
	72% {
		background: #000;
	}
	100% {
		background: transparent;
	}
}
</style>
