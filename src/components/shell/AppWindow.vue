<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import WindowControlButton from "./WindowControlButton.vue";
import closeWindowIcon from "../../assets/window-icons/close-window-icon.svg?raw";
import maximizeWindowIcon from "../../assets/window-icons/maximize-window-icon.svg?raw";
import minimizeWindowIcon from "../../assets/window-icons/minimize-window-icon.svg?raw";

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

const TASKBAR_HEIGHT = 88;
const TITLE_BAR_HEIGHT = 56;
const MIN_VISIBLE_TITLE_WIDTH = 160;
const titleId = `window-title-${props.id}`;

const windowElement = ref<HTMLElement | null>(null);

function getDesktopBounds() {
	const parentElement = windowElement.value?.parentElement;

	if (!parentElement) {
		return {
			left: 0,
			top: 0,
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}

	const rect = parentElement.getBoundingClientRect();

	return {
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height,
	};
}

function centerWindow() {
	const { width, height } = getDesktopBounds();

	x.value = Math.max((width - currentWidth.value) / 2, 0);
	y.value = Math.max((height - TASKBAR_HEIGHT - currentHeight.value) / 2, 0);
}

function focusWindow() {
	windowElement.value?.focus({ preventScroll: true });
}

const x = ref(0);
const y = ref(0);
const currentWidth = ref(props.defaultWidth);
const currentHeight = ref(props.defaultHeight);
const isMaximized = ref(false);

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

	const { left, top } = getDesktopBounds();

	offsetX = event.clientX - left - x.value;
	offsetY = event.clientY - top - y.value;

	document.addEventListener("mousemove", dragWindow);
	document.addEventListener("mouseup", stopDragging);
}

function dragWindow(event: MouseEvent) {
	const { left, top, width, height } = getDesktopBounds();
	const nextX = event.clientX - left - offsetX;
	const nextY = event.clientY - top - offsetY;
	const visibleTitleWidth = Math.min(currentWidth.value, MIN_VISIBLE_TITLE_WIDTH);

	const minX = visibleTitleWidth - currentWidth.value;
	const maxX = width - visibleTitleWidth;
	const minY = 0;
	const maxY = height - TASKBAR_HEIGHT - TITLE_BAR_HEIGHT;

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

onMounted(() => {
	nextTick(() => {
		if (!isMaximized.value) {
			centerWindow();
		}

		focusWindow();
	});
});
</script>

<template>
	<div
		ref="windowElement"
		class="window"
		:data-window-id="props.id"
		role="dialog"
		:aria-labelledby="titleId"
		tabindex="-1"
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
		<div class="window-frame">
			<div class="title-bar" @mousedown="grabWindow">
				<h2 :id="titleId" class="title">{{ props.title }}</h2>
				<div class="window-controls">
					<WindowControlButton action="minimize" :iconSvg="minimizeWindowIcon" @windowAction="handleWindowAction" />
					<WindowControlButton action="maximize" :iconSvg="maximizeWindowIcon" @windowAction="handleWindowAction" />
					<WindowControlButton action="close" :iconSvg="closeWindowIcon" @windowAction="handleWindowAction" />
				</div>
			</div>
			<div class="content">
				<slot />
			</div>
		</div>
	</div>
</template>

<style scoped>
.window {
	position: absolute;
	box-sizing: border-box;
	padding: var(--space-2);
	border-radius: var(--radius-xl);
	background: linear-gradient(180deg, var(--color-frame-top), var(--color-frame-bottom));
	border: var(--border-thin) solid rgba(222, 107, 72, 0.18);
	box-shadow: var(--shadow-card-strong);
}

.window:focus-visible {
	outline: none;
	box-shadow:
		0 0 0 0.24rem rgba(222, 107, 72, 0.18),
		var(--shadow-card-strong);
}

.window.maximized {
	left: 0;
	top: 0;
	right: 0;
	bottom: 5.5rem;
}

.window-frame {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: var(--color-surface);
	border-radius: calc(var(--radius-xl) - var(--space-2));
	box-shadow: inset 0 0 0 var(--border-thin) rgba(222, 107, 72, 0.12);
	overflow: hidden;
}

.title-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--space-4);
	background: linear-gradient(180deg, #fffdfa 0%, var(--color-surface-strong) 100%);
	color: var(--color-ink);
	padding: var(--space-4) var(--space-5) var(--space-3);
	user-select: none;
	border-bottom: var(--border-thin) solid rgba(222, 107, 72, 0.16);
	font-family: var(--font-chrome);
	position: relative;
}

.title-bar::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 0.35rem;
	background: linear-gradient(90deg, var(--color-accent-red), var(--color-accent-orange), var(--color-accent-gold));
}

.title {
	display: inline-flex;
	align-items: center;
	min-height: 2.1rem;
	margin: 0;
	font-size: var(--text-lg);
	font-weight: 600;
	letter-spacing: 0.01em;
}

.window-controls {
	display: flex;
	gap: var(--space-2);
	flex-shrink: 0;
}

.content {
	flex: 1;
	overflow: auto;
	background: var(--color-surface);
	padding: var(--space-4);
}
</style>
