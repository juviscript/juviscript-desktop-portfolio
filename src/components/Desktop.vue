<script setup lang="ts">
import DesktopIcon from "./DesktopIcon.vue";
import Taskbar from "./Taskbar.vue";
import Window from "./Window.vue";
import { ref } from "vue";

const icons = [
	{ id: "projects", label: "My Projects", icon: "📁" },
	{ id: "about", label: "About Me", icon: "📄" },
	{ id: "resume", label: "Resume", icon: "📋" },
	{ id: "contact", label: "Contact", icon: "✉️" },
	{ id: "certifications", label: "Certs", icon: "🏆" },
	{ id: "recycle-bin", label: "Recycle Bin", icon: "🗑️" },
];

const openWindows = ref<string[]>([]);

function handleIconDoubleClick(id: string) {
	console.log(`Opened: ${id}`);
	// Open the window if it's not already open
	if (!openWindows.value.includes(id)) {
		openWindows.value.push(id);
	}
}
</script>

<template>
	<div class="desktop">
		<div class="icon-grid">
			<DesktopIcon v-for="icon in icons" :key="icon.id" :id="icon.id" :label="icon.label" :icon="icon.icon" @open="handleIconDoubleClick" />
		</div>

		<Window v-for="id in openWindows" :key="id" :id="id">
			<p v-if="id === 'resume'">This is the content of the Resume window.</p>
			<p v-if="id === 'projects'">This is the content of the Projects window.</p>
			<p v-if="id === 'about'">This is the content of the About window.</p>
			<p v-if="id === 'contact'">This is the content of the Contact window.</p>
			<p v-if="id === 'certifications'">This is the content of the Certifications window.</p>
			<p v-if="id === 'recycle-bin'">The Recycle Bin is empty.</p>
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
