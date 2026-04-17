<script setup lang="ts">
const props = defineProps<{
	id: string;
	label: string;
	icon: string;
	tabIndex?: number;
}>();

const emit = defineEmits<{
	open: [id: string];
}>();

function handleActivate(event: MouseEvent) {
	if (event.detail === 0) {
		emit("open", props.id);
	}
}
</script>

<template>
	<button class="desktop-icon" type="button" :tabindex="props.tabIndex ?? 0" :aria-label="label" @click="handleActivate" @dblclick="() => emit('open', props.id)">
		<img class="icon-image" :src="props.icon" alt="" aria-hidden="true" />
		<span class="icon-label">{{ props.label }}</span>
	</button>
</template>

<style scoped>
.desktop-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-2);
	width: 5.75rem;
	padding: var(--space-2);
	background: transparent;
	font: inherit;
	color: inherit;
	border: var(--border-thin) solid transparent;
	cursor: pointer;
	user-select: none;
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
}

.desktop-icon:focus-visible {
	border-color: rgba(255, 255, 255, 0.8);
	background: rgba(255, 249, 241, 0.46);
	box-shadow:
		0 0 0 0.18rem rgba(255, 255, 255, 0.46),
		0 0.75rem 1.5rem rgba(90, 61, 43, 0.14);
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
