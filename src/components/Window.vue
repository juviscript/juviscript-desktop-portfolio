<script setup lang="ts">
import { onMounted } from "vue";

defineProps<{
	id: string;
}>();

onMounted(() => {
	console.log("Window component mounted");
});
</script>

<template>
	<div class="window">
		<div class="title-bar">
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
	left: 50%;
	top: 50%;
	-webkit-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
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
