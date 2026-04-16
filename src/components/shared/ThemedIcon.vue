<script setup lang="ts">
defineProps<{
	svg: string;
	label?: string;
}>();
</script>

<template>
	<span class="themed-icon" :aria-hidden="label ? undefined : 'true'" :aria-label="label" v-html="svg"></span>
</template>

<style scoped>
.themed-icon {
	display: inline-flex;
	width: 1rem;
	height: 1rem;
	flex-shrink: 0;
	color: currentColor;
}

.themed-icon :deep(svg) {
	width: 100%;
	height: 100%;
	display: block;
}

.themed-icon :deep(path),
.themed-icon :deep(rect),
.themed-icon :deep(circle),
.themed-icon :deep(polygon),
.themed-icon :deep(line),
.themed-icon :deep(polyline),
.themed-icon :deep(ellipse) {
	fill: currentColor;
	stroke: currentColor;
}
</style>
