<script setup lang="ts">
import { ref } from "vue";

const x = ref(100);
const y = ref(100);

// Tracks where inside the title bar the user clicked
let offsetX = 0;
let offsetY = 0;

defineProps<{
	id: string;
}>();

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
</script>

<template>
	<div class="window" :style="{ left: `${x}px`, top: `${y}px` }">
		<div class="title-bar" @mousedown="grabWindow">
			<span class="title">Window Title</span>
			<div class="window-controls">
				<button class="control-btn minimize">_</button>
				<button class="control-btn maximize">[ ]</button>
				<button class="control-btn close">X</button>
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
	width: 400px;
	height: 300px;
	background-color: white;
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
