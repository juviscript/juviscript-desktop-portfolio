<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import DesktopIcon from "./DesktopIcon.vue";
import Taskbar from "./Taskbar.vue";
import AppWindow from "./AppWindow.vue";
import ExplorerApp from "../apps/ExplorerApp.vue";
import resumePdf from "../../assets/Juvilane Panaguiton - Resume (June 2025).pdf";
import BrowserApp from "../apps/BrowserApp.vue";
import ProjectApp from "../apps/ProjectApp.vue";
import AboutApp from "../apps/AboutApp.vue";
import ContactApp from "../apps/ContactApp.vue";
import NollieCompanion from "./NollieCompanion.vue";
import WidgetDeck from "../widgets/WidgetDeck.vue";
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

const desktopElement = ref<HTMLElement | null>(null);

const hasVisibleDesktopWindow = computed(() =>
	workspaceState.desktop.openWindows.some(window => !window.isMinimized),
);

const windowsInTabOrder = computed(() =>
	[...workspaceState.desktop.openWindows].sort((firstWindow, secondWindow) => secondWindow.zIndex - firstWindow.zIndex),
);

const activeVisibleWindowId = computed(() => windowsInTabOrder.value.find(window => !window.isMinimized)?.id ?? null);

watch(activeVisibleWindowId, async nextWindowId => {
	await nextTick();

	const activeElement = document.activeElement as HTMLElement | null;
	const activeElementIsUsable = activeElement && activeElement !== document.body && desktopElement.value?.contains(activeElement);

	if (activeElementIsUsable) {
		return;
	}

	if (nextWindowId) {
		const activeWindowElement = desktopElement.value?.querySelector<HTMLElement>(`[data-window-id="${nextWindowId}"]`);
		activeWindowElement?.focus({ preventScroll: true });
		return;
	}

	const firstDesktopIcon = desktopElement.value?.querySelector<HTMLElement>(".desktop-icon");
	firstDesktopIcon?.focus({ preventScroll: true });
});
</script>

<template>
	<div ref="desktopElement" class="desktop">
		<div class="icon-grid">
			<DesktopIcon
				v-for="app in desktopApps"
				:key="app.id"
				:id="app.id"
				:label="app.label"
				:icon="app.icon"
				:tab-index="hasVisibleDesktopWindow ? -1 : 0"
				@open="openDesktopApp" />
		</div>

		<WidgetDeck surface="desktop" title="Widgets" description="Workspace Shelf" class="desktop-widget-deck" />
		<NollieCompanion surface="desktop" />

		<AppWindow
			v-for="app in windowsInTabOrder"
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

.desktop-widget-deck {
	position: absolute;
	top: var(--space-5);
	right: var(--space-5);
	width: min(24rem, calc(100% - 16rem));
	max-height: calc(100% - 11rem);
	overflow: auto;
	scrollbar-width: none;
	z-index: 1;
}

.desktop-widget-deck::-webkit-scrollbar {
	display: none;
}
</style>
