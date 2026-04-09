<script setup lang="ts">
import { ref } from "vue";
import WindowControlButton from "./WindowControlButton.vue";

const props = defineProps<{
	id: string;
	defaultWidth: number;
	defaultHeight: number;
	title: string;
	zIndex: number;
}>();

const emit = defineEmits<{
	minimize: [id: string];
	close: [id: string];
	focus: [id: string];
}>();

const x = ref(100);
const y = ref(100);
const currentWidth = ref(props.defaultWidth);
const currentHeight = ref(props.defaultHeight);
const isMaximized = ref(false);

const TASKBAR_HEIGHT = 36;
const TITLE_BAR_HEIGHT = 29;
const MIN_VISIBLE_TITLE_WIDTH = 120;

let offsetX = 0;
let offsetY = 0;

type WindowBounds = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const savedBounds = ref<WindowBounds | null>(null);

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function grabWindow(event: MouseEvent) {
	emit("focus", props.id);

	if (isMaximized.value) {
		return;
	}

	offsetX = event.clientX - x.value;
	offsetY = event.clientY - y.value;

	document.addEventListener("mousemove", dragWindow);
	document.addEventListener("mouseup", stopDragging);
}

function dragWindow(event: MouseEvent) {
	const nextX = event.clientX - offsetX;
	const nextY = event.clientY - offsetY;
	const visibleTitleWidth = Math.min(currentWidth.value, MIN_VISIBLE_TITLE_WIDTH);

	const minX = visibleTitleWidth - currentWidth.value;
	const maxX = window.innerWidth - visibleTitleWidth;
	const minY = 0;
	const maxY = window.innerHeight - TASKBAR_HEIGHT - TITLE_BAR_HEIGHT;

	x.value = clamp(nextX, minX, maxX);
	y.value = clamp(nextY, minY, maxY);
}

function stopDragging() {
	document.removeEventListener("mousemove", dragWindow);
	document.removeEventListener("mouseup", stopDragging);
}

function handleWindowAction(action: string) {
	if (action === "minimize") {
		emit("minimize", props.id);
		return;
	}

	if (action === "maximize") {
		if (!isMaximized.value) {
			savedBounds.value = {
				x: x.value,
				y: y.value,
				width: currentWidth.value,
				height: currentHeight.value,
			};
			isMaximized.value = true;
			return;
		}

		if (savedBounds.value) {
			x.value = savedBounds.value.x;
			y.value = savedBounds.value.y;
			currentWidth.value = savedBounds.value.width;
			currentHeight.value = savedBounds.value.height;
		}
		isMaximized.value = false;
		return;
	}

	if (action === "close") {
		emit("close", props.id);
	}
}
</script>

<template>
	<div
		class="window"
		:class="{ maximized: isMaximized }"
		:style="{
			...(isMaximized
				? {}
				: {
						left: `${x}px`,
						top: `${y}px`,
						width: `${currentWidth}px`,
						height: `${currentHeight}px`,
					}),
			zIndex: props.zIndex,
		}"
		@click="emit('focus', props.id)">
		<div class="title-bar" @mousedown="grabWindow">
			<span class="title">{{ props.title }}</span>
			<div class="window-controls">
				<WindowControlButton action="minimize" icon="-" @windowAction="handleWindowAction" />
				<WindowControlButton action="maximize" icon="[]" @windowAction="handleWindowAction" />
				<WindowControlButton action="close" icon="X" @windowAction="handleWindowAction" />
			</div>
		</div>
		<div class="content">
			<slot />
		</div>
	</div>
</template>

<style scoped>
.window {
	position: absolute;
	background-color: white;
	border: 2px solid #c0c0c0;
	box-shadow: 2px 2px 0 #404040;
}

.window.maximized {
	left: 0;
	top: 0;
	right: 0;
	bottom: 36px;
}

.title-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #0078d7;
	color: white;
	padding: 4px 8px;
	user-select: none;
}

.window-controls {
	display: flex;
	gap: 4px;
}

.content {
	height: calc(100% - 29px);
	overflow: auto;
}
</style>
