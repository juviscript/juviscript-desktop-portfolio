<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

defineProps<{
	windows: Array<{ id: string; label: string; icon: string; isMinimized: boolean }>;
}>();

const emit = defineEmits<{
	"select-window": [id: string];
}>();

const time = ref("");

function updateTime() {
	const now = new Date();
	const hours = now.getHours().toString().padStart(2, "0");
	const minutes = now.getMinutes().toString().padStart(2, "0");
	time.value = `${hours}:${minutes}`;
}

let interval: ReturnType<typeof setInterval>;

onMounted(() => {
	updateTime();
	interval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
	clearInterval(interval);
});
</script>

<template>
	<div class="taskbar">
		<div class="start-button" aria-hidden="true">
			<span class="brand-dot"></span>
			<span class="start-label">jsOS</span>
		</div>

		<div class="taskbar-middle" role="toolbar" aria-label="Open windows">
			<button
				v-for="window in windows"
				:key="window.id"
				class="taskbar-app"
				:class="{ minimized: window.isMinimized }"
				type="button"
				:aria-pressed="(!window.isMinimized).toString()"
				@click="() => emit('select-window', window.id)">
				<img class="app-icon" :src="window.icon" alt="" aria-hidden="true" />
				<span class="app-label">{{ window.label }}</span>
			</button>
		</div>

		<div class="system-tray">
			<span class="status-dot"></span>
			<span class="clock">{{ time }}</span>
		</div>
	</div>
</template>

<style scoped>
.taskbar {
	position: absolute;
	left: 50%;
	bottom: var(--space-4);
	transform: translateX(-50%);
	width: min(calc(100% - 4rem), 68rem);
	min-height: 4.25rem;
	background: rgba(255, 249, 241, 0.9);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-xl);
	backdrop-filter: blur(0.875rem);
	display: flex;
	align-items: center;
	gap: var(--space-3);
	padding: var(--space-2) var(--space-3);
	box-sizing: border-box;
	box-shadow: var(--shadow-card);
	z-index: 100;
}

.start-button {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	min-height: 3rem;
	padding: 0 var(--space-4);
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
	border: var(--border-thin) solid rgba(90, 61, 43, 0.14);
	border-radius: var(--radius-pill);
	font-family: var(--font-display);
	font-size: var(--text-sm);
	font-weight: 700;
	color: var(--color-ink);
	box-shadow: 0 0.75rem 1.5rem rgba(222, 107, 72, 0.28);
}

.brand-dot {
	width: 0.75rem;
	height: 0.75rem;
	border-radius: 50%;
	background: var(--color-white);
	box-shadow:
		0 0 0 var(--border-thin) rgba(90, 61, 43, 0.18),
		0 0 0.75rem rgba(255, 255, 255, 0.55);
}

.taskbar-middle {
	flex: 1;
	display: flex;
	align-items: center;
	gap: var(--space-2);
	padding: 0 var(--space-2);
	overflow-x: auto;
	scrollbar-width: none;
}

.taskbar-middle::-webkit-scrollbar {
	display: none;
}

.taskbar-app {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	min-height: 3rem;
	min-width: 5rem;
	max-width: 14rem;
	padding: 0 var(--space-3);
	background: rgba(255, 255, 255, 0.4);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.14);
	border-radius: var(--radius-pill);
	cursor: pointer;
	font-size: var(--text-sm);
	color: var(--color-ink);
	transition:
		transform 140ms ease,
		background-color 140ms ease,
		border-color 140ms ease,
		box-shadow 140ms ease;
}

.taskbar-app:hover {
	transform: translateY(-0.0625rem);
	background: rgba(255, 255, 255, 0.72);
	border-color: rgba(90, 61, 43, 0.22);
	box-shadow: 0 0.5rem 1rem rgba(90, 61, 43, 0.1);
}

.taskbar-app:focus-visible {
	outline: none;
	transform: translateY(-0.0625rem);
	background: rgba(255, 255, 255, 0.78);
	border-color: rgba(222, 107, 72, 0.4);
	box-shadow:
		0 0 0 0.18rem rgba(222, 107, 72, 0.18),
		0 0.5rem 1rem rgba(90, 61, 43, 0.12);
}

.taskbar-app.minimized {
	background: rgba(255, 255, 255, 0.2);
	opacity: 0.72;
}

.app-icon {
	width: 1.25rem;
	height: 1.25rem;
	object-fit: contain;
	flex-shrink: 0;
}

.app-label {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-family: var(--font-ui);
	font-weight: 600;
}

.system-tray {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	min-height: 3rem;
	padding: 0 var(--space-4);
	background: rgba(255, 255, 255, 0.52);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.14);
	border-radius: var(--radius-pill);
	color: var(--color-ink);
}

.status-dot {
	width: 0.5rem;
	height: 0.5rem;
	border-radius: 50%;
	background: var(--color-accent-mint);
	box-shadow: 0 0 0 0.2rem rgba(155, 214, 196, 0.28);
}

.clock {
	font-family: var(--font-display);
	font-size: var(--text-sm);
	font-weight: 700;
}
</style>
