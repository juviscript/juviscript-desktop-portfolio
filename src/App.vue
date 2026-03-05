<script setup lang="ts">
import { ref } from 'vue';
import BootSequence from './components/BootSequence.vue';

const bootComplete = ref(false);

const handleBootComplete = () => {
  bootComplete.value = true;
};
</script>

<template>
  <div class="app">
    <!-- Show boot sequence until complete -->
    <BootSequence v-if="!bootComplete" @complete="handleBootComplete" />
    
    <!-- Desktop (shows after boot) -->
    <div v-if="bootComplete" class="desktop">
      <h1>Desktop Loaded!</h1>
      <p>Boot sequence complete 🎉</p>
    </div>
  </div>
</template>

<style scoped>
.desktop {
  width: 100vw;
  height: 100vh;
  background-color: #008080;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Press Start 2P', monospace;
}
</style>