<script setup lang="ts">
import { ref } from "vue";
import BootSequence from "./components/BootSequence.vue";
import Desktop from "./components/Desktop.vue";

const bootComplete = ref(false);

const handleBootComplete = () => {
	bootComplete.value = true;
};
</script>

<template>
	<div class="monitor-frame">
		<div class="app">
			<BootSequence v-if="!bootComplete" @complete="handleBootComplete" />
			<Desktop v-if="bootComplete" />
		</div>
	</div>
</template>

<style scoped>
.monitor-frame {
	width: min(calc(100vw - 3rem), 112rem, calc((100vh - 3rem) * 16 / 9));
	aspect-ratio: 16 / 9;
	padding: var(--space-4);
	border-radius: var(--radius-2xl);
	background: linear-gradient(160deg, var(--color-frame-top) 0%, var(--color-frame-bottom) 100%);
	border: var(--border-thin) solid rgba(255, 255, 255, 0.65);
	box-shadow: var(--shadow-shell);
	position: relative;
}

.monitor-frame::before {
	content: "";
	position: absolute;
	inset: var(--space-3);
	border-radius: calc(var(--radius-2xl) - var(--space-2));
	border: var(--border-thin) solid rgba(255, 255, 255, 0.35);
	pointer-events: none;
}

.app {
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
