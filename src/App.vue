<script setup lang="ts">
import { ref } from 'vue';
import BootSequence from './components/BootSequence.vue';
import Desktop from './components/Desktop.vue';

const bootComplete = ref(false);

const handleBootComplete = () => {
  bootComplete.value = true;
};
</script>

<template>
  <div class="app">
    <BootSequence v-if="!bootComplete" @complete="handleBootComplete" />
    <Desktop v-if="bootComplete" />
  </div>
</template>