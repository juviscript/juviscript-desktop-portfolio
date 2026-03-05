<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const time = ref('');

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
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

    <div class="taskbar-middle"></div>

    <div class="system-tray">
      <span class="clock">{{ time }}</span>
    </div>
  </div>
</template>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 36px;
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
  font-family: 'Press Start 2P', monospace;
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
  font-family: 'Press Start 2P', monospace;
  font-size: 9px;
  color: #000;
}
</style>
