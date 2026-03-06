<script setup lang="ts">
import DesktopIcon from "./DesktopIcon.vue";
import Taskbar from "./Taskbar.vue";
import Window from "./Window.vue";
import { ref } from "vue";

const desktopApps = [
	{ id: "projects", iconLabel: "My Projects", icon: "📁", defaultWidth: 400, defaultHeight: 300 },
	{ id: "about", iconLabel: "About Me", icon: "📄", defaultWidth: 400, defaultHeight: 300 },
	{ id: "resume", iconLabel: "Resume", icon: "📋", defaultWidth: 400, defaultHeight: 300 },
	{ id: "contact", iconLabel: "Contact", icon: "✉️", defaultWidth: 400, defaultHeight: 300 },
	{ id: "certifications", iconLabel: "Certs", icon: "🏆", defaultWidth: 400, defaultHeight: 300 },
	{ id: "recycle-bin", iconLabel: "Recycle Bin", icon: "🗑️", defaultWidth: 400, defaultHeight: 300 },
];

const openWindows = ref<typeof desktopApps>([]);

function openApp(id: string) {
  const app = desktopApps.find(a => a.id === id);
  if (app && !openWindows.value.find(w => w.id === id)) {
    openWindows.value.push(app);
  }
}

</script>

<template>
	<div class="desktop">
		<div class="icon-grid">
			<DesktopIcon v-for="app in desktopApps" :key="app.id" :id="app.id" :iconLabel="app.iconLabel" @open="openApp" />
		</div>

		<Window v-for="app in openWindows" :key="app.id" :id="app.id" :defaultWidth="app.defaultWidth" :defaultHeight="app.defaultHeight">
			<p v-if="app.id === 'resume'">This is the content of the Resume window.</p>
			<p v-if="app.id === 'projects'">This is the content of the Projects window.</p>
			<p v-if="app.id === 'about'">This is the content of the About window.</p>
			<p v-if="app.id === 'contact'">This is the content of the Contact window.</p>
			<p v-if="app.id === 'certifications'">This is the content of the Certifications window.</p>
			<p v-if="app.id === 'recycle-bin'">The Recycle Bin is empty.</p>
		</Window>

		<Taskbar />
	</div>
</template>

<style scoped>
.desktop {
	width: 100vw;
	height: 100vh;
	background: linear-gradient(to bottom, #87ceeb 0%, #b0e0f5 60%, #4a8f3f 60%, #3a7a2f 100%);
	overflow: visible;
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
