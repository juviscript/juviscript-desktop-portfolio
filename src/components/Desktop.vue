<script setup lang="ts">
import { ref } from "vue";
import DesktopIcon from "./DesktopIcon.vue";
import Taskbar from "./Taskbar.vue";
import Window from "./Window.vue";
import FileExplorer from "./FileExplorer.vue";
import resumePdf from "../assets/Juvilane Panaguiton - Resume (June 2025).pdf";
import WebBrowser from "./WebBrowser.vue";


type DesktopApp = {
	id: string;
	label: string;
	icon: string;
	defaultWidth: number;
	defaultHeight: number;
};

type OpenWindow = DesktopApp & {
	isMinimized: boolean;
	zIndex: number;
	windowType: "app" | "browser";
	url?: string;
	objectUrl?: string;
	isPdf?: boolean;
};

const desktopApps: DesktopApp[] = [
	{ id: "projects", label: "My Projects", icon: "📁", defaultWidth: 400, defaultHeight: 300 },
	{ id: "about", label: "About Me", icon: "📄", defaultWidth: 400, defaultHeight: 300 },
	{ id: "resume", label: "Resume", icon: "📋", defaultWidth: 600, defaultHeight: 950 },
	{ id: "contact", label: "Contact", icon: "✉️", defaultWidth: 400, defaultHeight: 300 },
	{ id: "certifications", label: "Certs", icon: "🏆", defaultWidth: 800, defaultHeight: 800 },
	{ id: "recycle-bin", label: "Recycle Bin", icon: "🗑️", defaultWidth: 400, defaultHeight: 300 },
];

const openWindows = ref<OpenWindow[]>([]);

let nextZIndex = 1;

function openApp(id: string) {
	import.meta.env.DEV && console.log(`Checking if app is already open with id: ${id}`);
	const existingWindow = openWindows.value.find(openWindow => openWindow.id === id);

	if (existingWindow) {
		import.meta.env.DEV && console.log("App is already open, restoring if minimized:", id);
		existingWindow.isMinimized = false;
		focusApp(id);
		return;
	}

	import.meta.env.DEV && console.log("Finding app with id:", id);
	const app = desktopApps.find(desktopApp => desktopApp.id === id);

	if (app) {
		import.meta.env.DEV && console.log("App found, opening window for:", id);

		openWindows.value.push({
			...app,
			isMinimized: false,
			zIndex: nextZIndex++,
			windowType: "app",
		});
	}
}

function getTopVisibleWindow() {
	return openWindows.value
		.filter(window => !window.isMinimized)
		.reduce<OpenWindow | undefined>((topWindow, currentWindow) => {
			if (!topWindow || currentWindow.zIndex > topWindow.zIndex) {
				return currentWindow;
			}
			return topWindow;
		}, undefined);
}

function closeApp(id: string) {
	import.meta.env.DEV && console.log(`Closing app with id: ${id}`);
	openWindows.value = openWindows.value.filter(openWindow => openWindow.id !== id);
}

function minimizeApp(id: string) {
	const openWindow = openWindows.value.find(window => window.id === id);

	if (openWindow) {
		import.meta.env.DEV && console.log(`Minimizing app with id: ${id}`);
		openWindow.isMinimized = true;
	}
}

function handleTaskbarIconClick(id: string) {
	const openWindow = openWindows.value.find(window => window.id === id);

	if (!openWindow) {
		return;
	}

	const topWindow = getTopVisibleWindow();

	if (openWindow.isMinimized) {
		openWindow.isMinimized = false;
		focusApp(id);
		return;
	}

	if (topWindow?.id === id) {
		openWindow.isMinimized = true;
		return;
	}

	focusApp(id);
}

function focusApp(id: string) {
	const openWindow = openWindows.value.find(window => window.id === id);
	if (!openWindow) {
		return;
	}

	openWindow.zIndex = nextZIndex++;
}

function openBrowserWindow(file: { id: string; title: string; filePath: string; displayUrl: string }) {
	const browserWindowId = `browser-${file.id}`;
	const existingWindow = openWindows.value.find(openWindow => openWindow.id === browserWindowId);

	if (existingWindow) {
		import.meta.env.DEV && console.log("Browser window is already open, restoring if minimized:", browserWindowId);
		existingWindow.isMinimized = false;
		focusApp(browserWindowId);
		return;
	}

	const browserIcon = desktopApps.find(desktopApp => desktopApp.id === "certifications")?.icon ?? "[web]";

	openWindows.value.push({
		id: browserWindowId,
		label: file.title,
		icon: browserIcon,
		defaultWidth: 900,
		defaultHeight: 700,
		isMinimized: false,
		zIndex: nextZIndex++,
		windowType: "browser",
		url: file.displayUrl,
		objectUrl: file.filePath,
		isPdf: true,
	});
}
</script>

<template>
	<div class="desktop">
		<div class="icon-grid">
			<DesktopIcon v-for="app in desktopApps" :key="app.id" :id="app.id" :label="app.label" :icon="app.icon" @open="openApp" />
		</div>

		<Window
			v-for="app in openWindows"
			v-show="!app.isMinimized"
			:key="app.id"
			:id="app.id"
			:defaultWidth="app.defaultWidth"
			:defaultHeight="app.defaultHeight"
			:title="app.label"
			:z-index="app.zIndex"
			@close="closeApp"
			@minimize="minimizeApp"
			@focus="focusApp"
		>
			<WebBrowser v-if="app.id === 'resume'" url="https://www.juviscript.dev/resume" :objectUrl="resumePdf" :isPdf="true" />
			<WebBrowser v-else-if="app.windowType === 'browser'" :url="app.url || ''" :objectUrl="app.objectUrl" :isPdf="app.isPdf || false" />
			<FileExplorer v-else-if="app.id === 'certifications'" id="certifications" url="C:\Users\Juvilane\Certifications" @open-file="openBrowserWindow" />
			
			<p v-else-if="app.id === 'projects'">This is the content of the Projects window.</p>
			<p v-else-if="app.id === 'about'">This is the content of the About window.</p>
			<p v-else-if="app.id === 'contact'">This is the content of the Contact window.</p>
			<p v-else-if="app.id === 'recycle-bin'">The Recycle Bin is empty.</p>
		</Window>

		<Taskbar :windows="openWindows" @select-window="handleTaskbarIconClick" />
	</div>
</template>

<style scoped>
.desktop {
	width: 100%;
	height: 100%;
	background: linear-gradient(to bottom, #87ceeb 0%, #b0e0f5 60%, #4a8f3f 60%, #3a7a2f 100%);
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
