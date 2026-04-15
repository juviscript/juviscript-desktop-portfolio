<script setup lang="ts">
import { ref } from "vue";
import DesktopIcon from "./DesktopIcon.vue";
import Taskbar from "./Taskbar.vue";
import AppWindow from "./AppWindow.vue";
import ExplorerApp from "./ExplorerApp.vue";
import resumePdf from "../assets/Juvilane Panaguiton - Resume (June 2025).pdf";
import BrowserApp from "./BrowserApp.vue";
import ProjectApp from "./ProjectApp.vue";
import AboutApp from "./AboutApp.vue";

import { projects } from "../data/Projects";
import { desktopApps, type DesktopApp } from "../data/DesktopApps";
import ContactApp from "./ContactApp.vue";

type OpenWindow = DesktopApp & {
	isMinimized: boolean;
	zIndex: number;
	windowType: "app" | "browser" | "project";
	url?: string;
	objectUrl?: string;
	isPdf?: boolean;
	projectId?: string;
};

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

function openProjectBrowserWindow(projectId: string, url: string, title: string) {
	const browserWindowId = `browser-project-${projectId}`;
	const existingWindow = openWindows.value.find(openWindow => openWindow.id === browserWindowId);

	if (existingWindow) {
		import.meta.env.DEV && console.log("Browser window is already open, restoring if minimized:", browserWindowId);
		existingWindow.isMinimized = false;
		focusApp(browserWindowId);
		return;
	}

	const browserIcon = desktopApps.find(desktopApp => desktopApp.id === "projects")?.icon ?? "[web]";

	openWindows.value.push({
		id: browserWindowId,
		label: title,
		icon: browserIcon,
		defaultWidth: 900,
		defaultHeight: 700,
		isMinimized: false,
		zIndex: nextZIndex++,
		windowType: "browser",
		url,
	});
}

function openProjectsWindow(projectId: string) {
	const windowId = `project-${projectId}`;
	const existingWindow = openWindows.value.find(openWindow => openWindow.id === windowId);

	if (existingWindow) {
		import.meta.env.DEV && console.log("Project window is already open, restoring if minimized.", projectId);
		existingWindow.isMinimized = false;
		focusApp(windowId);
		return;
	}

	const project = projects.find(proj => proj.id === projectId);

	if (!project) {
		import.meta.env.DEV && console.log("Project not found with id:", projectId);
		return;
	}

	openWindows.value.push({
		id: windowId,
		label: project.name,
		icon: desktopApps.find(desktopApp => desktopApp.id === "projects")?.icon ?? "[proj]",
		defaultWidth: 700,
		defaultHeight: 700,
		isMinimized: false,
		zIndex: nextZIndex++,
		windowType: "project",
		projectId: project.id,
	});
}
</script>

<template>
	<div class="desktop">
		<div class="icon-grid">
			<DesktopIcon v-for="app in desktopApps" :key="app.id" :id="app.id" :label="app.label" :icon="app.icon" @open="openApp" />
		</div>

		<a class="icons-attribution" href="https://icons8.com" target="_blank" rel="noopener noreferrer">Icons by Icons8</a>

		<AppWindow
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
			@focus="focusApp">

			<BrowserApp v-if="app.id === 'resume'" url="https://www.juviscript.dev/resume" :objectUrl="resumePdf" :isPdf="true" />
			<BrowserApp v-else-if="app.windowType === 'browser'" :url="app.url || ''" :objectUrl="app.objectUrl" :isPdf="app.isPdf || false" />
			<ExplorerApp v-else-if="app.id === 'certifications'" id="certifications" url="C:\Users\Juvilane\Certifications" @open-file="openBrowserWindow" />
			<ExplorerApp v-else-if="app.id === 'projects'" id="projects" url="C:\Users\Juvilane\Projects" @open-project="openProjectsWindow" />
			<ProjectApp v-else-if="app.windowType === 'project' && app.projectId" :project-id="app.projectId" @open-url="openProjectBrowserWindow"/>
            <AboutApp v-else-if="app.id === 'about'" />
            <ContactApp v-else-if="app.id === 'contact'" />
            
			<p v-else-if="app.id === 'recycle-bin'">The Recycle Bin is empty.</p>
		</AppWindow>

		<Taskbar :windows="openWindows" @select-window="handleTaskbarIconClick" />
	</div>
</template>

<style scoped>
.desktop {
	width: 100%;
	height: 100%;
	background-color: #edc37a;
	background-image:
		linear-gradient(
			45deg,
			rgba(255, 246, 220, 0.18) 25%,
			transparent 25%,
			transparent 75%,
			rgba(255, 246, 220, 0.18) 75%,
			rgba(255, 246, 220, 0.18)
		),
		linear-gradient(
			45deg,
			rgba(255, 246, 220, 0.18) 25%,
			transparent 25%,
			transparent 75%,
			rgba(255, 246, 220, 0.18) 75%,
			rgba(255, 246, 220, 0.18)
		),
		linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
	background-size:
		3rem 3rem,
		3rem 3rem,
		auto;
	background-position:
		0 0,
		1.5rem 1.5rem,
		center;
	overflow: hidden;
	position: relative;
}

.desktop::before {
	content: "";
	position: absolute;
	inset: 0;
	background:
		linear-gradient(rgba(255, 255, 255, 0.08) 0.0625rem, transparent 0.0625rem),
		linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0.0625rem, transparent 0.0625rem);
	background-size: 3rem 3rem;
	opacity: 0.32;
	pointer-events: none;
}

.icon-grid {
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	padding: var(--space-5);
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}

.icons-attribution {
	position: absolute;
	right: var(--space-5);
	bottom: 5.75rem;
	padding: 0.4rem 0.8rem;
	border-radius: var(--radius-pill);
	background: rgba(255, 249, 241, 0.7);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: 0 0.5rem 1rem rgba(90, 61, 43, 0.08);
	color: var(--color-ink-soft);
	font-size: var(--text-2xs);
	font-weight: 600;
	text-decoration: none;
	backdrop-filter: blur(0.5rem);
	z-index: 2;
}

.icons-attribution:hover {
	color: var(--color-ink);
	background: rgba(255, 249, 241, 0.88);
}
</style>
