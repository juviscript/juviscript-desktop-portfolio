<script setup lang="ts">
import { computed, ref } from "vue";
import { desktopApps } from "../data/DesktopApps";
import calendarDockIcon from "../assets/mobile-icons/calendar-icon.gif";
import messagesDockIcon from "../assets/mobile-icons/messages-icon.png";
import photosDockIcon from "../assets/mobile-icons/photos-icon.png";
import settingsDockIcon from "../assets/mobile-icons/settings-icon.png";
import wifiIcon from "../assets/mobile-icons/wifi-icon.svg";
import { useWorkspaceState } from "../composables/useWorkspaceState";

const { workspaceState, openMobileApp, closeMobileApp, closeMobileAppById, switchMobileApp } = useWorkspaceState();

const currentTime = computed(() =>
	new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date()),
);

const dockApps = [
	{ id: "messages", label: "Messages", icon: messagesDockIcon },
	{ id: "photos", label: "Photos", icon: photosDockIcon },
	{ id: "calendar", label: "Calendar", icon: calendarDockIcon },
	{ id: "settings", label: "Settings", icon: settingsDockIcon },
];

const isAppSwitcherOpen = ref(false);
const indicatorDragStartY = ref<number | null>(null);
const indicatorActivePointerId = ref<number | null>(null);
const dragOpenedSwitcher = ref(false);

const activeApp = computed(() =>
	workspaceState.mobile.activeAppId
		? desktopApps.find(app => app.id === workspaceState.mobile.activeAppId) ?? null
		: null,
);

const recentApps = computed(() =>
	workspaceState.mobile.recentAppIds
		.map(id => desktopApps.find(app => app.id === id))
		.filter((app): app is (typeof desktopApps)[number] => Boolean(app)),
);

function getAppPreviewCopy(id: string) {
	switch (id) {
		case "about":
			return "Profile details, experience highlights, and core stack overview.";
		case "contact":
			return "Direct message form with email delivery through the Cloudflare contact flow.";
		case "projects":
			return "Project directory with entries that can open deeper detail views and live links.";
		case "certifications":
			return "Certification explorer with document previews and linked PDF browser windows.";
		case "resume":
			return "Resume preview with PDF rendering and browser-style navigation shell.";
		case "recycle-bin":
			return "Still empty.";
		default:
			return "Placeholder mobile preview.";
	}
}

function getAppPreviewEyebrow(id: string) {
	switch (id) {
		case "about":
			return "Profile";
		case "contact":
			return "Message Center";
		case "projects":
			return "Project Directory";
		case "certifications":
			return "Document Vault";
		case "resume":
			return "Resume Viewer";
		case "recycle-bin":
			return "System";
		default:
			return "App Preview";
	}
}

function openAppSwitcher() {
	if (!recentApps.value.length) {
		return;
	}

	isAppSwitcherOpen.value = true;
}

function closeAppSwitcher() {
	isAppSwitcherOpen.value = false;
}

function selectAppFromSwitcher(id: string) {
	switchMobileApp(id);
	closeAppSwitcher();
}

function closeAppFromSwitcher(id: string) {
	closeMobileAppById(id);

	if (recentApps.value.length <= 1) {
		closeAppSwitcher();
	}
}

function handleIndicatorPointerDown(event: PointerEvent) {
	const indicatorButton = event.currentTarget as HTMLElement | null;

	indicatorDragStartY.value = event.clientY;
	indicatorActivePointerId.value = event.pointerId;
	dragOpenedSwitcher.value = false;
	indicatorButton?.setPointerCapture(event.pointerId);
}

function handleIndicatorPointerMove(event: PointerEvent) {
	if (
		indicatorDragStartY.value === null
		|| indicatorActivePointerId.value !== event.pointerId
		|| dragOpenedSwitcher.value
	) {
		return;
	}

	const dragDistance = indicatorDragStartY.value - event.clientY;

	if (dragDistance > 48) {
		openAppSwitcher();
		dragOpenedSwitcher.value = true;
	}
}

function resetIndicatorDrag() {
	indicatorDragStartY.value = null;
	indicatorActivePointerId.value = null;

	window.setTimeout(() => {
		dragOpenedSwitcher.value = false;
	}, 0);
}

function handleIndicatorPointerUp(event: PointerEvent) {
	const indicatorButton = event.currentTarget as HTMLElement | null;

	if (indicatorButton?.hasPointerCapture(event.pointerId)) {
		indicatorButton.releasePointerCapture(event.pointerId);
	}

	resetIndicatorDrag();
}

function handleIndicatorPointerCancel(event: PointerEvent) {
	const indicatorButton = event.currentTarget as HTMLElement | null;

	if (indicatorButton?.hasPointerCapture(event.pointerId)) {
		indicatorButton.releasePointerCapture(event.pointerId);
	}

	resetIndicatorDrag();
}

function handleIndicatorClick() {
	if (dragOpenedSwitcher.value) {
		return;
	}

	if (activeApp.value) {
		closeMobileApp();
	}
}
</script>

<template>
	<div class="mobile-workspace">
		<div class="mobile-status-bar">
			<span class="mobile-time">{{ currentTime }}</span>
			<div class="mobile-status-icons">
				<img class="mobile-status-icon" :src="wifiIcon" alt="Wi-Fi connected" />
				<div class="mobile-battery" aria-label="Battery level 82 percent" role="img">
					<div class="mobile-battery-body">
						<div class="mobile-battery-fill"></div>
					</div>
					<div class="mobile-battery-cap"></div>
				</div>
			</div>
		</div>

		<div v-if="!activeApp" class="mobile-home-screen">
			<div class="mobile-hero">
				<div class="mobile-hero-copy">
					<p class="mobile-kicker">Home Screen</p>
					<h1 class="mobile-title">jsOS Mobile</h1>
					<p class="mobile-subtitle">
						{{ new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()) }}
					</p>
				</div>

				<div class="mobile-widget">
					<p class="mobile-widget-label">Workspace</p>
					<p class="mobile-widget-value">{{ recentApps.length || desktopApps.length }} apps ready</p>
					<p class="mobile-widget-copy">
						Drag the home indicator upward to open the app switcher and cycle through your recent mobile sessions.
					</p>
				</div>
			</div>

			<div class="mobile-app-grid">
				<button v-for="app in desktopApps" :key="app.id" class="mobile-app-button" type="button" @click="openMobileApp(app.id)">
					<div class="mobile-app-icon-shell">
						<img class="mobile-app-icon" :src="app.icon" :alt="`${app.label} icon`" />
					</div>
					<span class="mobile-app-label">{{ app.label }}</span>
				</button>
			</div>

			<div class="mobile-dock">
				<button v-for="dockApp in dockApps" :key="dockApp.id" class="mobile-dock-button" type="button" aria-label="Dock placeholder">
					<img class="mobile-dock-icon" :src="dockApp.icon" :alt="`${dockApp.label} icon`" />
				</button>
			</div>

			<button
				class="home-indicator-button"
				type="button"
				aria-label="Open recent apps"
				@pointerdown="handleIndicatorPointerDown"
				@pointermove="handleIndicatorPointerMove"
				@pointerup="handleIndicatorPointerUp"
				@pointercancel="handleIndicatorPointerCancel"
				@click="handleIndicatorClick">
				<span class="home-indicator" aria-hidden="true"></span>
			</button>
		</div>

		<div v-else class="mobile-app-view">
			<div class="mobile-app-header">
				<div class="mobile-app-header-copy">
					<p class="mobile-kicker">App Preview</p>
					<h2 class="mobile-app-title">{{ activeApp?.label }}</h2>
				</div>
			</div>

			<div class="mobile-app-card">
				<div class="mobile-app-card-header">
					<div class="mobile-app-card-dot"></div>
					<p class="mobile-app-card-title">{{ activeApp?.label }}</p>
				</div>
				<p class="mobile-app-card-eyebrow">{{ getAppPreviewEyebrow(activeApp?.id ?? "") }}</p>
				<p class="mobile-app-copy">
					This is the placeholder mobile view for {{ activeApp?.label }}. Returning home does not clear the app session, so you can switch breakpoints or reopen it from the recent-app strip without losing state.
				</p>
			</div>

			<button
				class="home-indicator-button"
				type="button"
				aria-label="Go home or open recent apps"
				@pointerdown="handleIndicatorPointerDown"
				@pointermove="handleIndicatorPointerMove"
				@pointerup="handleIndicatorPointerUp"
				@pointercancel="handleIndicatorPointerCancel"
				@click="handleIndicatorClick">
				<span class="home-indicator" aria-hidden="true"></span>
			</button>
		</div>

		<transition name="mobile-switcher-fade">
			<div v-if="isAppSwitcherOpen" class="mobile-switcher-overlay" @click.self="closeAppSwitcher">
				<div class="mobile-switcher-sheet">
					<div class="mobile-switcher-sheet-header">
						<div>
							<p class="mobile-kicker">Recent Apps</p>
							<p class="mobile-switcher-count">{{ recentApps.length }} tracked</p>
						</div>
						<button class="mobile-switcher-done" type="button" @click="closeAppSwitcher">Done</button>
					</div>

					<div class="mobile-switcher-carousel">
						<article
							v-for="app in recentApps"
							:key="`preview-${app.id}`"
							class="mobile-switcher-card">
							<button class="mobile-switcher-card-frame" type="button" @click="selectAppFromSwitcher(app.id)">
								<div class="mobile-switcher-preview-body">
									<div class="mobile-switcher-preview-window">
										<div class="mobile-switcher-preview-status">
											<span class="mobile-switcher-preview-time">{{ currentTime }}</span>
											<div class="mobile-switcher-preview-status-icons">
												<img class="mobile-switcher-preview-wifi" :src="wifiIcon" alt="" aria-hidden="true" />
												<div class="mobile-switcher-preview-battery" aria-hidden="true">
													<div class="mobile-switcher-preview-battery-body">
														<div class="mobile-switcher-preview-battery-fill"></div>
													</div>
													<div class="mobile-switcher-preview-battery-cap"></div>
												</div>
											</div>
										</div>
										<div class="mobile-switcher-preview-window-body">
											<div class="mobile-switcher-card-topbar">
												<div class="mobile-switcher-app-copy">
													<p class="mobile-switcher-app-label">{{ app.label }}</p>
													<p class="mobile-switcher-app-state">
														{{ app.id === activeApp?.id ? "Active now" : "In background" }}
													</p>
												</div>
												<span class="mobile-switcher-preview-pill">{{ app.id === activeApp?.id ? "Live" : "Open" }}</span>
											</div>

											<div class="mobile-switcher-preview-surface">
												<div class="mobile-switcher-preview-surface-header">
													<div class="mobile-switcher-preview-dot"></div>
													<p class="mobile-switcher-preview-window-title">{{ app.label }}</p>
												</div>
												<div class="mobile-switcher-preview-content">
													<p class="mobile-switcher-preview-eyebrow">{{ getAppPreviewEyebrow(app.id) }}</p>
													<p class="mobile-switcher-preview-title">{{ app.label }}</p>
													<p class="mobile-switcher-preview-copy">{{ getAppPreviewCopy(app.id) }}</p>
												</div>
											</div>

											<span class="mobile-switcher-preview-home" aria-hidden="true"></span>
										</div>
									</div>
								</div>
							</button>

							<button class="mobile-switcher-close" type="button" @click="closeAppFromSwitcher(app.id)">
								Close App
							</button>
						</article>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.mobile-workspace {
	width: 100%;
	height: 100%;
    padding: 1rem; 
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
	width: 100%;
	height: 100%;
	background-color: #edc37a;
	background-image:
		linear-gradient(45deg, rgba(255, 246, 220, 0.18) 25%, transparent 25%, transparent 75%, rgba(255, 246, 220, 0.18) 75%, rgba(255, 246, 220, 0.18)),
		linear-gradient(45deg, rgba(255, 246, 220, 0.18) 25%, transparent 25%, transparent 75%, rgba(255, 246, 220, 0.18) 75%, rgba(255, 246, 220, 0.18)), linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
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

.mobile-status-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 1rem;
	color: var(--color-ink);
	border-radius: var(--radius-pill);
	background: var(--color-frame-top);
}

.mobile-time {
	font-family: var(--font-display);
	font-size: var(--text-sm);
	font-weight: 700;
}

.mobile-status-icons {
	display: flex;
	align-items: center;
	gap: var(--space-2);
}

.mobile-status-icon {
	width: 1.15rem;
	height: 1.15rem;
	object-fit: contain;
}

.mobile-battery {
	display: inline-flex;
	align-items: center;
	gap: 0.15rem;
}

.mobile-battery-body {
	width: 1.7rem;
	height: 0.9rem;
	padding: 0.12rem;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.62);
	border-radius: 0.3rem;
	background: rgba(255, 249, 241, 0.64);
	box-sizing: border-box;
}

.mobile-battery-fill {
	width: 82%;
	height: 100%;
	border-radius: 0.18rem;
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
}

.mobile-battery-cap {
	width: 0.18rem;
	height: 0.5rem;
	border-radius: 0.2rem;
	background: rgba(90, 61, 43, 0.62);
}

.status-pill {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 1.7rem;
	padding: 0 0.7rem;

	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.05em;
	text-transform: uppercase;
}

.mobile-home-screen,
.mobile-app-view {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	position: relative;
	padding-bottom: calc(var(--space-5) + 1.4rem);
}

.mobile-hero {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: var(--space-3);
	margin-bottom: var(--space-4);
}

.mobile-hero-copy {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.mobile-kicker {
	margin: 0;
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-title,
.mobile-app-title {
	margin: 0;
	font-family: var(--font-display);
	font-size: clamp(1.7rem, 5vw, 2.2rem);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.mobile-subtitle {
	margin: 0;
	font-size: var(--text-sm);
	font-weight: 500;
	color: var(--color-ink-soft);
}

.mobile-widget {
	padding: var(--space-4);
	border-radius: 1.4rem;
	background: linear-gradient(145deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.12)), linear-gradient(145deg, rgba(233, 158, 112, 0.18), rgba(191, 233, 255, 0.22));
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: var(--shadow-card);
}

.mobile-widget-label,
.mobile-widget-value,
.mobile-widget-copy,
.mobile-app-card-title,
.mobile-app-copy {
	margin: 0;
}

.mobile-widget-label {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-widget-value {
	margin-top: var(--space-2);
	font-family: var(--font-display);
	font-size: var(--text-lg);
	font-weight: 700;
	color: var(--color-ink);
}

.mobile-widget-copy {
	margin-top: var(--space-2);
	font-size: var(--text-sm);
	line-height: var(--line-normal);
	color: var(--color-ink);
}

.mobile-app-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: var(--space-3) var(--space-2);
	align-content: start;
}

.mobile-app-button {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.45rem;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	color: var(--color-ink);
}

.mobile-app-icon-shell {
	width: 4rem;
	height: 4rem;
	display: grid;
	place-items: center;
	padding: 0.65rem;
	border-radius: 1.2rem;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.15)), rgba(255, 249, 241, 0.88);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: 0 0.75rem 1.25rem rgba(90, 61, 43, 0.12);
	transition:
		transform 140ms ease,
		box-shadow 140ms ease,
		background-color 140ms ease;
}

.mobile-app-button:hover .mobile-app-icon-shell,
.mobile-app-button:focus-visible .mobile-app-icon-shell {
	transform: translateY(-0.125rem);
	box-shadow: 0 1rem 1.6rem rgba(90, 61, 43, 0.18);
}

.mobile-app-button:focus-visible {
	outline: none;
}

.mobile-app-icon {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.mobile-app-label {
	font-size: 0.7rem;
	font-weight: 600;
	line-height: 1.2;
	text-align: center;
}

.mobile-dock {
	margin-top: auto;
	margin-bottom: calc(var(--space-3) + 1rem);
	display: flex;
	gap: var(--space-2);
	justify-content: center;
	align-items: center;
	padding: 0.55rem;
	border-radius: 1.5rem;
	background: var(--color-frame-top);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.1);
	box-shadow:
		0 1rem 1.75rem rgba(90, 61, 43, 0.12),
		inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.24);
	backdrop-filter: blur(0.8rem);
}

.mobile-dock-button {
	display: grid;
	place-items: center;
	width: 100%;
	aspect-ratio: 1;
	padding: 0.45rem;
	border: none;
	border-radius: 1rem;
	background: rgba(255, 255, 255, 0.28);
	cursor: pointer;
	max-height: 64px;
	max-width: 64px;
}

.mobile-dock-icon {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.mobile-app-view {
	gap: var(--space-4);
}

.mobile-app-header {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: var(--space-3);
}

.mobile-app-header-copy {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.mobile-app-card {
	flex: 1;
	min-height: 0;
	padding: var(--space-4);
	border-radius: 1.5rem;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.14)), rgba(255, 249, 241, 0.9);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: var(--shadow-card);
}

.mobile-app-card-header {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	margin-bottom: var(--space-3);
}

.mobile-app-card-dot {
	width: 0.65rem;
	height: 0.65rem;
	border-radius: 50%;
	background: var(--color-accent-red);
}

.mobile-app-card-title {
	font-family: var(--font-chrome);
	font-size: var(--text-xs);
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-app-copy {
	color: var(--color-ink);
	line-height: var(--line-loose);
}

.mobile-app-card-eyebrow {
	margin: 0 0 var(--space-2);
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.home-indicator-button {
	width: 9rem;
	height: 1.75rem;
	position: absolute;
	left: 50%;
	bottom: 0.2rem;
	transform: translateX(-50%);
	display: grid;
	place-items: center;
	border: none;
	background: transparent;
	cursor: pointer;
	z-index: 4;
	touch-action: none;
	-webkit-user-select: none;
	user-select: none;
}

.home-indicator {
	display: block;
	width: 8rem;
	height: 0.38rem;
	border-radius: var(--radius-pill);
	background: rgba(90, 61, 43, 0.34);
	box-shadow:
		0 0.15rem 0.5rem rgba(255, 255, 255, 0.28),
		0 0.25rem 0.6rem rgba(90, 61, 43, 0.12);
}

.mobile-switcher-overlay {
	position: absolute;
	inset: 0;
	z-index: 20;
	display: flex;
	align-items: stretch;
	padding: 0.85rem;
	background: rgba(90, 61, 43, 0.18);
	backdrop-filter: blur(0.5rem);
}

.mobile-switcher-sheet {
	width: 100%;
	border-radius: 0;
	background: transparent;
	border: none;
	box-shadow: none;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
	min-height: 0;
}

.mobile-switcher-sheet-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-3);
	padding: 0.15rem 0.4rem 0;
}

.mobile-switcher-count {
	margin: 0.2rem 0 0;
	font-size: var(--text-xs);
	color: var(--color-ink-soft);
}

.mobile-switcher-done {
	min-height: 2.15rem;
	padding: 0.35rem 0.9rem;
	border: var(--border-thin) solid rgba(255, 255, 255, 0.28);
	border-radius: var(--radius-pill);
	background: rgba(255, 249, 241, 0.74);
	color: var(--color-ink);
	font-size: var(--text-2xs);
	font-weight: 700;
	cursor: pointer;
}

.mobile-switcher-carousel {
	display: flex;
	align-items: stretch;
	gap: 0;
	overflow-x: auto;
	padding: 0 1rem 0.2rem 0.8rem;
	scroll-snap-type: x mandatory;
	scroll-padding-inline: 1rem;
	scrollbar-width: none;
	flex: 1;
	min-height: 0;
	touch-action: pan-x;
}

.mobile-switcher-carousel::-webkit-scrollbar {
	display: none;
}

.mobile-switcher-card {
	scroll-snap-align: center;
	flex: 0 0 calc(100% - 3.5rem);
	display: flex;
	flex-direction: column;
	gap: 0.7rem;
	min-height: 0;
	margin-inline-end: -18%;
	position: relative;
	z-index: 0;
	transform-origin: center bottom;
}

.mobile-switcher-card:last-child {
	margin-inline-end: 0;
}

.mobile-switcher-card:nth-child(odd) {
	transform: rotate(-1.1deg);
}

.mobile-switcher-card:nth-child(even) {
	transform: rotate(1.1deg);
}

.mobile-switcher-card-frame {
	flex: 1;
	width: 100%;
	border: none;
	padding: 0;
	border-radius: 1.9rem;
	background: transparent;
	box-shadow: none;
	display: flex;
	flex-direction: column;
	gap: 0;
	cursor: pointer;
	text-align: left;
	min-height: 0;
	overflow: hidden;
}

.mobile-switcher-card:hover,
.mobile-switcher-card:focus-within {
	z-index: 2;
}

.mobile-switcher-card-topbar {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: var(--space-2);
}

.mobile-switcher-app-meta {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	min-width: 0;
}

.mobile-switcher-app-copy {
	min-width: 0;
}

.mobile-switcher-app-label,
.mobile-switcher-app-state,
.mobile-switcher-preview-title,
.mobile-switcher-preview-copy {
	margin: 0;
}

.mobile-switcher-app-label {
	font-size: var(--text-sm);
	font-weight: 700;
	color: var(--color-ink);
}

.mobile-switcher-app-state {
	margin-top: 0.15rem;
	font-size: var(--text-2xs);
	color: var(--color-ink-soft);
}

.mobile-switcher-preview-pill {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 1.65rem;
	padding: 0 0.6rem;
	border-radius: var(--radius-pill);
	background: linear-gradient(135deg, rgba(237, 109, 75, 0.92), rgba(241, 146, 73, 0.92));
	color: white;
	font-size: 0.68rem;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.mobile-switcher-preview-body {
	flex: 1;
	display: flex;
	min-height: 0;
}

.mobile-switcher-preview-window {
	flex: 1;
	display: flex;
	flex-direction: column;
	border-radius: 1.9rem;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0)),
		linear-gradient(180deg, #f3d992 0%, #efc778 100%);
	border: var(--border-thin) solid rgba(255, 255, 255, 0.32);
	overflow: hidden;
	min-height: 0;
	box-shadow:
		0 1.5rem 2.8rem rgba(90, 61, 43, 0.22),
		inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.14);
}

.mobile-switcher-preview-status {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-2);
	padding: 0.95rem 1.1rem 0.7rem;
	color: rgba(90, 61, 43, 0.86);
	font-family: var(--font-display);
	font-size: 0.86rem;
	font-weight: 700;
}

.mobile-switcher-preview-time {
	line-height: 1;
}

.mobile-switcher-preview-status-icons {
	display: flex;
	align-items: center;
	gap: 0.35rem;
}

.mobile-switcher-preview-wifi {
	width: 0.95rem;
	height: 0.95rem;
	object-fit: contain;
}

.mobile-switcher-preview-battery {
	display: inline-flex;
	align-items: center;
	gap: 0.12rem;
}

.mobile-switcher-preview-battery-body {
	width: 1.32rem;
	height: 0.72rem;
	padding: 0.1rem;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.58);
	border-radius: 0.28rem;
	background: rgba(255, 249, 241, 0.46);
	box-sizing: border-box;
}

.mobile-switcher-preview-battery-fill {
	width: 82%;
	height: 100%;
	border-radius: 0.14rem;
	background: linear-gradient(135deg, var(--color-accent-red), var(--color-accent-orange));
}

.mobile-switcher-preview-battery-cap {
	width: 0.16rem;
	height: 0.38rem;
	border-radius: 0.12rem;
	background: rgba(90, 61, 43, 0.56);
}

.mobile-switcher-preview-window-title {
	margin: 0;
	font-size: var(--text-xs);
	font-weight: 700;
	color: var(--color-ink-soft);
}

.mobile-switcher-preview-window-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
	padding: 0.2rem 1rem 1rem;
}

.mobile-switcher-preview-surface {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-height: 0;
	border-radius: 1.45rem;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.14)),
		rgba(255, 249, 241, 0.92);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: 0 1rem 1.7rem rgba(90, 61, 43, 0.1);
	overflow: hidden;
}

.mobile-switcher-preview-surface-header {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	padding: 0.8rem 1rem;
	background: rgba(255, 255, 255, 0.4);
	border-bottom: var(--border-thin) solid rgba(90, 61, 43, 0.08);
}

.mobile-switcher-preview-dot {
	width: 0.55rem;
	height: 0.55rem;
	border-radius: 50%;
	background: var(--color-accent-red);
}

.mobile-switcher-preview-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--space-2);
	padding: 1.15rem;
}

.mobile-switcher-preview-eyebrow {
	margin: 0;
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-switcher-preview-title {
	font-family: var(--font-display);
	font-size: clamp(1.4rem, 4.2vw, 1.8rem);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.mobile-switcher-preview-copy {
	font-size: var(--text-sm);
	line-height: var(--line-loose);
	color: var(--color-ink-soft);
}

.mobile-switcher-preview-home {
	align-self: center;
	width: 7rem;
	height: 0.32rem;
	border-radius: var(--radius-pill);
	background: rgba(90, 61, 43, 0.26);
	margin-top: auto;
}

.mobile-switcher-close {
	align-self: center;
	min-height: 2.15rem;
	padding: 0.45rem 1rem;
	border: var(--border-thin) solid rgba(255, 255, 255, 0.34);
	border-radius: var(--radius-pill);
	background: rgba(255, 249, 241, 0.72);
	color: var(--color-ink);
	font-size: var(--text-2xs);
	font-weight: 700;
	cursor: pointer;
	box-shadow: 0 0.7rem 1.2rem rgba(90, 61, 43, 0.12);
}

.mobile-switcher-fade-enter-active,
.mobile-switcher-fade-leave-active {
	transition: opacity 180ms ease;
}

.mobile-switcher-fade-enter-active .mobile-switcher-sheet,
.mobile-switcher-fade-leave-active .mobile-switcher-sheet {
	transition: transform 220ms ease;
}

.mobile-switcher-fade-enter-from,
.mobile-switcher-fade-leave-to {
	opacity: 0;
}

.mobile-switcher-fade-enter-from .mobile-switcher-sheet,
.mobile-switcher-fade-leave-to .mobile-switcher-sheet {
	transform: translateY(1.5rem);
}
</style>
