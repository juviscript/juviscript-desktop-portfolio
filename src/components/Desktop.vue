<script setup lang="ts">
import DesktopIcon from './DesktopIcon.vue';
import Taskbar from './Taskbar.vue';

const icons = [
  { id: 'projects',       label: 'My Projects',    icon: '📁' },
  { id: 'about',          label: 'About Me',        icon: '📄' },
  { id: 'resume',         label: 'Resume',          icon: '📋' },
  { id: 'contact',        label: 'Contact',         icon: '✉️' },
  { id: 'certifications', label: 'Certs',           icon: '🏆' },
  { id: 'recycle-bin',    label: 'Recycle Bin',     icon: '🗑️' },
];

function handleIconOpen(id: string) {
  console.log(`Opened: ${id}`);
}
</script>

<template>
  <div class="desktop">
    <div class="icon-grid">
      <DesktopIcon
        v-for="icon in icons"
        :key="icon.id"
        :id="icon.id"
        :label="icon.label"
        :icon="icon.icon"
        @open="handleIconOpen"
      />
    </div>

    <Taskbar />
  </div>
</template>

<style scoped>
.desktop {
  width: 100vw;
  height: 100vh;
  background:
    linear-gradient(to bottom, #87ceeb 0%, #b0e0f5 60%, #4a8f3f 60%, #3a7a2f 100%);
  overflow: hidden;
  position: relative;
}

.icon-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 8px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
