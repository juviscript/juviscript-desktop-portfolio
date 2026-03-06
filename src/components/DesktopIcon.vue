<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  icon: string;
}>();

const emit = defineEmits<{
  open: [id: string]
}>();
</script>

<template>
  <div class="desktop-icon" @dblclick="() => emit('open', id)">
    <div class="icon-image">{{ icon }}</div>
    <span class="icon-label">{{ label }}</span>
  </div>
</template>

<style scoped>
.desktop-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  padding: 6px;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
}

.desktop-icon:hover {
  border-color: #fff;
  background-color: rgba(0, 0, 128, 0.4);
}

.desktop-icon:focus {
  outline: 1px dotted #fff;
  background-color: rgba(0, 0, 128, 0.4);
}

.icon-image {
  font-size: 40px;
  line-height: 1;
  margin-bottom: 4px;
}

.icon-label {
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  color: #fff;
  text-align: center;
  text-shadow: 1px 1px 2px #000, -1px -1px 2px #000;
  word-break: break-word;
  line-height: 1.4;
}
</style>