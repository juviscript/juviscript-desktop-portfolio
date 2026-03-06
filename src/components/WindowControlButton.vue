<script setup lang="ts">

defineProps<{
    id: string;
    icon: string
}>();

const emit = defineEmits<{
  windowAction: [id: string]
}>();

</script>

<template>
	<div class="button" @click="() => emit('windowAction', id)">
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
