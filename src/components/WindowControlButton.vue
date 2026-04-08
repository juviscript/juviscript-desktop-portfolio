<script setup lang="ts">

defineProps<{
    action: string;
    icon: string
}>();

const emit = defineEmits<{
  windowAction: [action: string]
}>();

</script>

<template>
	<div class="button" @click="() => emit('windowAction', action)">
		{{ icon }}
	</div>
</template>

<style scoped>
.button {
	background-color: #0078d7;
	color: white;
	font-weight: 800;
}
</style>
