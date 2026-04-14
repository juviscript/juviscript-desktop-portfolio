<script setup lang="ts">
import ThemedIcon from "./ThemedIcon.vue";

defineProps<{
	action: string;
	iconSvg: string;
}>();

const emit = defineEmits<{
	windowAction: [action: string];
}>();
</script>

<template>
	<button class="button" :class="`button--${action}`" type="button" :aria-label="`${action} window`" @click="() => emit('windowAction', action)">
		<ThemedIcon class="button-icon" :svg="iconSvg" />
	</button>
</template>

<style scoped>
.button {
	display: inline-grid;
	place-items: center;
	width: 1.85rem;
	height: 1.85rem;
	padding: 0;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-sm);
	color: var(--color-ink);
	font-weight: 700;
	line-height: 1;
	cursor: pointer;
	box-shadow: 0 0.35rem 0.85rem rgba(90, 61, 43, 0.08);
	transition:
		transform 140ms ease,
		background-color 140ms ease,
		box-shadow 140ms ease,
		color 140ms ease;
}

.button:hover {
	transform: translateY(-0.0625rem);
	box-shadow: 0 0.5rem 1rem rgba(90, 61, 43, 0.12);
}

.button--minimize {
	background: var(--color-accent-gold);
}

.button--maximize {
	background: var(--color-accent-apricot);
}

.button--close {
	background: var(--color-accent-red);
	color: var(--color-white);
}

.button-icon {
	width: 0.85rem;
	height: 0.85rem;
}
</style>
