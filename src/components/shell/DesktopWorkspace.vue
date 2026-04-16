<script setup lang="ts">
import DesktopIcon from "./DesktopIcon.vue";
import Taskbar from "./Taskbar.vue";
import AppWindow from "./AppWindow.vue";
import ExplorerApp from "../apps/ExplorerApp.vue";
import resumePdf from "../../assets/Juvilane Panaguiton - Resume (June 2025).pdf";
import BrowserApp from "../apps/BrowserApp.vue";
import ProjectApp from "../apps/ProjectApp.vue";
import AboutApp from "../apps/AboutApp.vue";
import ContactApp from "../apps/ContactApp.vue";
import { desktopApps } from "../../data/DesktopApps";
import { useWorkspaceState } from "../../composables/useWorkspaceState";

const {
	workspaceState,
	openDesktopApp,
	closeDesktopApp,
	minimizeDesktopApp,
	focusDesktopApp,
	handleDesktopTaskbarIconClick,
	openDesktopBrowserWindow,
	openDesktopProjectBrowserWindow,
	openDesktopProjectWindow,
} = useWorkspaceState();
</script>

<template>
	<div class="desktop">
		<div class="icon-grid">
			<DesktopIcon v-for="app in desktopApps" :key="app.id" :id="app.id" :label="app.label" :icon="app.icon" @open="openDesktopApp" />
		</div>

		<a class="icons-attribution" href="https://icons8.com" target="_blank" rel="noopener noreferrer">Icons by Icons8</a>

		<AppWindow
			v-for="app in workspaceState.desktop.openWindows"
			v-show="!app.isMinimized"
			:key="app.id"
			:id="app.id"
			:defaultWidth="app.defaultWidth"
			:defaultHeight="app.defaultHeight"
			:title="app.label"
			:z-index="app.zIndex"
			@close="closeDesktopApp"
			@minimize="minimizeDesktopApp"
			@focus="focusDesktopApp">

			<BrowserApp v-if="app.id === 'resume'" url="https://www.juviscript.dev/resume" :objectUrl="resumePdf" :isPdf="true" />
			<BrowserApp v-else-if="app.windowType === 'browser'" :url="app.url || ''" :objectUrl="app.objectUrl" :isPdf="app.isPdf || false" />
			<ExplorerApp v-else-if="app.id === 'certifications'" id="certifications" url="C:\Users\Juvilane\Certifications" @open-file="openDesktopBrowserWindow" />
			<ExplorerApp v-else-if="app.id === 'projects'" id="projects" url="C:\Users\Juvilane\Projects" @open-project="openDesktopProjectWindow" />
			<ProjectApp v-else-if="app.windowType === 'project' && app.projectId" :project-id="app.projectId" @open-url="openDesktopProjectBrowserWindow" />
			<AboutApp v-else-if="app.id === 'about'" />
			<ContactApp v-else-if="app.id === 'contact'" />
			<p v-else-if="app.id === 'recycle-bin'">The Recycle Bin is empty.</p>
		</AppWindow>

		<Taskbar :windows="workspaceState.desktop.openWindows" @select-window="handleDesktopTaskbarIconClick" />
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
