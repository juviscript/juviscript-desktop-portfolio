import { reactive } from "vue";
import { projects } from "../data/Projects";
import { desktopApps, type DesktopApp } from "../data/DesktopApps";

export type DesktopOpenWindow = DesktopApp & {
	isMinimized: boolean;
	zIndex: number;
	windowType: "app" | "browser" | "project";
	url?: string;
	objectUrl?: string;
	isPdf?: boolean;
	projectId?: string;
};

type BrowserFile = {
	id: string;
	title: string;
	filePath: string;
	displayUrl: string;
};

const workspaceState = reactive({
	desktop: {
		openWindows: [] as DesktopOpenWindow[],
		nextZIndex: 1,
	},
	mobile: {
		activeAppId: null as string | null,
		recentAppIds: [] as string[],
	},
});

function bumpRecentMobileApp(id: string) {
	workspaceState.mobile.recentAppIds = [
		id,
		...workspaceState.mobile.recentAppIds.filter(existingId => existingId !== id),
	];
}

function focusDesktopApp(id: string) {
	const openWindow = workspaceState.desktop.openWindows.find(window => window.id === id);

	if (!openWindow) {
		return;
	}

	openWindow.zIndex = workspaceState.desktop.nextZIndex++;
}

function getTopVisibleDesktopWindow() {
	return workspaceState.desktop.openWindows
		.filter(window => !window.isMinimized)
		.reduce<DesktopOpenWindow | undefined>((topWindow, currentWindow) => {
			if (!topWindow || currentWindow.zIndex > topWindow.zIndex) {
				return currentWindow;
			}

			return topWindow;
		}, undefined);
}

function openDesktopApp(id: string) {
	const existingWindow = workspaceState.desktop.openWindows.find(openWindow => openWindow.id === id);

	if (existingWindow) {
		existingWindow.isMinimized = false;
		focusDesktopApp(id);
		return;
	}

	const app = desktopApps.find(desktopApp => desktopApp.id === id);

	if (!app) {
		return;
	}

	workspaceState.desktop.openWindows.push({
		...app,
		isMinimized: false,
		zIndex: workspaceState.desktop.nextZIndex++,
		windowType: "app",
	});
}

function closeDesktopApp(id: string) {
	workspaceState.desktop.openWindows = workspaceState.desktop.openWindows.filter(openWindow => openWindow.id !== id);
}

function minimizeDesktopApp(id: string) {
	const openWindow = workspaceState.desktop.openWindows.find(window => window.id === id);

	if (!openWindow) {
		return;
	}

	openWindow.isMinimized = true;
}

function handleDesktopTaskbarIconClick(id: string) {
	const openWindow = workspaceState.desktop.openWindows.find(window => window.id === id);

	if (!openWindow) {
		return;
	}

	const topWindow = getTopVisibleDesktopWindow();

	if (openWindow.isMinimized) {
		openWindow.isMinimized = false;
		focusDesktopApp(id);
		return;
	}

	if (topWindow?.id === id) {
		openWindow.isMinimized = true;
		return;
	}

	focusDesktopApp(id);
}

function openDesktopBrowserWindow(file: BrowserFile) {
	const browserWindowId = `browser-${file.id}`;
	const existingWindow = workspaceState.desktop.openWindows.find(openWindow => openWindow.id === browserWindowId);

	if (existingWindow) {
		existingWindow.isMinimized = false;
		focusDesktopApp(browserWindowId);
		return;
	}

	const browserIcon = desktopApps.find(desktopApp => desktopApp.id === "certifications")?.icon ?? "[web]";

	workspaceState.desktop.openWindows.push({
		id: browserWindowId,
		label: file.title,
		icon: browserIcon,
		defaultWidth: 900,
		defaultHeight: 700,
		isMinimized: false,
		zIndex: workspaceState.desktop.nextZIndex++,
		windowType: "browser",
		url: file.displayUrl,
		objectUrl: file.filePath,
		isPdf: true,
	});
}

function openDesktopProjectBrowserWindow(projectId: string, url: string, title: string) {
	const browserWindowId = `browser-project-${projectId}`;
	const existingWindow = workspaceState.desktop.openWindows.find(openWindow => openWindow.id === browserWindowId);

	if (existingWindow) {
		existingWindow.isMinimized = false;
		focusDesktopApp(browserWindowId);
		return;
	}

	const browserIcon = desktopApps.find(desktopApp => desktopApp.id === "projects")?.icon ?? "[web]";

	workspaceState.desktop.openWindows.push({
		id: browserWindowId,
		label: title,
		icon: browserIcon,
		defaultWidth: 900,
		defaultHeight: 700,
		isMinimized: false,
		zIndex: workspaceState.desktop.nextZIndex++,
		windowType: "browser",
		url,
	});
}

function openDesktopProjectWindow(projectId: string) {
	const windowId = `project-${projectId}`;
	const existingWindow = workspaceState.desktop.openWindows.find(openWindow => openWindow.id === windowId);

	if (existingWindow) {
		existingWindow.isMinimized = false;
		focusDesktopApp(windowId);
		return;
	}

	const project = projects.find(currentProject => currentProject.id === projectId);

	if (!project) {
		return;
	}

	workspaceState.desktop.openWindows.push({
		id: windowId,
		label: project.name,
		icon: desktopApps.find(desktopApp => desktopApp.id === "projects")?.icon ?? "[proj]",
		defaultWidth: 700,
		defaultHeight: 700,
		isMinimized: false,
		zIndex: workspaceState.desktop.nextZIndex++,
		windowType: "project",
		projectId: project.id,
	});
}

function openMobileApp(id: string) {
	workspaceState.mobile.activeAppId = id;
	bumpRecentMobileApp(id);
}

function closeMobileApp() {
	workspaceState.mobile.activeAppId = null;
}

function switchMobileApp(id: string) {
	openMobileApp(id);
}

export function useWorkspaceState() {
	return {
		workspaceState,
		openDesktopApp,
		closeDesktopApp,
		minimizeDesktopApp,
		focusDesktopApp,
		handleDesktopTaskbarIconClick,
		openDesktopBrowserWindow,
		openDesktopProjectBrowserWindow,
		openDesktopProjectWindow,
		openMobileApp,
		closeMobileApp,
		switchMobileApp,
	};
}
