<script setup lang="ts">
defineProps<{
	id: string;
	label: string;
	icon: string;
}>();

const emit = defineEmits<{
	open: [id: string];
}>();
</script>

<template>
	<div class="desktop-icon" @dblclick="() => emit('open', id)">
		<img class="icon-image" :src="icon" :alt="`${label} icon`" />
		<span class="icon-label">{{ label }}</span>
	</div>
</template>

<style scoped>
.desktop-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-2);
	width: 5.75rem;
	padding: var(--space-2);
	cursor: pointer;
	user-select: none;
	border: var(--border-thin) solid transparent;
	border-radius: var(--radius-lg);
	transition:
		transform 140ms ease,
		background-color 140ms ease,
		border-color 140ms ease,
		box-shadow 140ms ease;
}

.desktop-icon:hover {
	border-color: rgba(255, 255, 255, 0.55);
	background: rgba(255, 249, 241, 0.34);
	box-shadow: 0 0.75rem 1.5rem rgba(90, 61, 43, 0.12);
	transform: translateY(-0.125rem);
}

.desktop-icon:focus {
	outline: none;
	border-color: rgba(255, 255, 255, 0.8);
	background: rgba(255, 249, 241, 0.46);
}

.icon-image {
	width: 3.25rem;
	height: 3.25rem;
	object-fit: contain;
}

.icon-label {
	font-family: var(--font-ui);
	font-size: var(--text-xs);
	font-weight: 700;
	color: var(--color-ink);
	text-align: center;
	word-break: break-word;
	line-height: var(--line-snug);
	background: rgba(255, 249, 241, 0.72);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.14);
	border-radius: var(--radius-pill);
	padding: 0.18rem 0.55rem;
	max-width: 100%;
}
</style>
