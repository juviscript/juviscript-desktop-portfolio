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
		<button class="start-button">
			<span class="start-icon">🪟</span>
			<span class="start-label">Start</span>
		</button>

		<div class="taskbar-middle">
			<button v-for="window in windows" :key="window.id" class="taskbar-app" :class="{ minimized: window.isMinimized }" @click="() => emit('select-window', window.id)">
				<span class="app-icon">{{ window.icon }}</span>
				<span class="app-label">{{ window.label }}</span>
			</button>
		</div>

		<div class="system-tray">
			<span class="clock">{{ time }}</span>
		</div>
	</div>
</template>

<style scoped>
.taskbar {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 36px;
	width: 100%;
	background-color: #c0c0c0;
	border-top: 2px solid #fff;
	display: flex;
	align-items: center;
	padding: 2px 4px;
	box-sizing: border-box;
	z-index: 100;
}

.start-button {
	display: flex;
	align-items: center;
	gap: 4px;
	height: 28px;
	padding: 0 8px;
	background-color: #c0c0c0;
	border: 2px solid;
	border-color: #fff #808080 #808080 #fff;
	cursor: pointer;
	font-family: "Press Start 2P", monospace;
	font-size: 10px;
	font-weight: bold;
	color: #000;
}

.start-button:active {
	border-color: #808080 #fff #fff #808080;
}

.start-icon {
	font-size: 14px;
}

.taskbar-middle {
	flex: 1;
	display: flex;
	gap: 4px;
	padding: 0 6px;
	overflow-x: auto;
}

.taskbar-app {
	display: flex;
	align-items: center;
	gap: 4px;
	height: 28px;
	min-width: 44px;
	max-width: 160px;
	padding: 0 8px;
	background-color: #c0c0c0;
	border: 2px solid;
	border-color: #fff #808080 #808080 #fff;
	cursor: pointer;
	font-size: 12px;
}

.taskbar-app.minimized {
	border-color: #808080 #fff #fff #808080;
}

.app-icon {
	font-size: 14px;
	line-height: 1;
}

.app-label {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.system-tray {
	height: 28px;
	padding: 0 8px;
	background-color: #c0c0c0;
	border: 2px solid;
	border-color: #808080 #fff #fff #808080;
	display: flex;
	align-items: center;
}

.clock {
	font-family: "Press Start 2P", monospace;
	font-size: 9px;
	color: #000;
}
</style>
