<script setup lang="ts">
import WindowControlButton from "./WindowControlButton.vue";
import { ref } from "vue";

const props = defineProps<{
	id: string;
	defaultWidth: number;
	defaultHeight: number;
	title: string;
}>();

const emit = defineEmits<{
	close: [id: string];
}>();

const x = ref(100);
const y = ref(100);

let offsetX = 0;
let offsetY = 0;

const currentWidth = ref(props.defaultWidth);
const currentHeight = ref(props.defaultHeight);

let isMaximized = ref(false);

type WindowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const savedBounds = ref<WindowBounds | null>(null);

function grabWindow(event: MouseEvent) {
	// How far from the window's top-left corner did the user click?
	// e.g. if window is at x=100 and user clicked at clientX=160, offset is 60
	offsetX = event.clientX - x.value;
	offsetY = event.clientY - y.value;

	document.addEventListener("mousemove", dragWindow);
	document.addEventListener("mouseup", stopDragging);
}

function dragWindow(event: MouseEvent) {
	// Subtract the offset so the window doesn't snap its corner to the cursor
	x.value = event.clientX - offsetX;
	y.value = event.clientY - offsetY;
}

function stopDragging() {
	document.removeEventListener("mousemove", dragWindow);
	document.removeEventListener("mouseup", stopDragging);
}

function handleWindowAction(action: string) {
	if (action === "minimize") {
        console.log(`Minimizing window with id: ${props.id}`);
	} else if (action === "maximize") {
        console.log(`Toggling maximize for window with id: ${props.id}`);

        if (isMaximized.value == false) {
            // Save current bounds before maximizing
            savedBounds.value = { x: x.value, y: y.value, width: currentWidth.value, height: currentHeight.value };
           
            x.value = 0;
            y.value = 0;
            currentWidth.value = window.innerWidth;
            currentHeight.value = window.innerHeight;

            isMaximized.value = true;
        } else if (isMaximized.value == true && savedBounds.value) {
            // Restore to saved bounds
            x.value = savedBounds.value.x;
            y.value = savedBounds.value.y;
            currentWidth.value = savedBounds.value.width;
            currentHeight.value = savedBounds.value.height;

            isMaximized.value = false;
        }

	} else if (action === "close") {
        console.log(`Closing window with id: ${props.id}`);
        emit('close', props.id);
	}
}
</script>

<template>
	<div class="window" :class="{ 'maximized': isMaximized }" :style="isMaximized ? {} : { left: `${x}px`, top: `${y}px`, width: `${currentWidth}px`, height: `${currentHeight}px`} ">
		<div class="title-bar" @mousedown="grabWindow">
			<span class="title">Window Title</span>
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
}

.control-btn {
	background-color: red;
	color: white;
	font-weight: 800;
}
</style>
