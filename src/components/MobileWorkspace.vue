<script setup lang="ts">
import { computed, ref } from "vue";
import { desktopApps } from "../data/DesktopApps";
import calendarDockIcon from "../assets/mobile-icons/calendar-icon.gif";
import messagesDockIcon from "../assets/mobile-icons/messages-icon.png";
import photosDockIcon from "../assets/mobile-icons/photos-icon.png";
import settingsDockIcon from "../assets/mobile-icons/settings-icon.png";
import wifiIcon from "../assets/mobile-icons/wifi-icon.svg";

const activeAppId = ref<string | null>(null);

const currentTime = computed(() =>
	new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date()),
);

const currentDay = computed(() =>
	new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
	}).format(new Date()),
);

const dockApps = [
	{ id: "messages", label: "Messages", icon: messagesDockIcon },
	{ id: "photos", label: "Photos", icon: photosDockIcon },
	{ id: "calendar", label: "Calendar", icon: calendarDockIcon },
	{ id: "settings", label: "Settings", icon: settingsDockIcon },
];

function openApp(id: string) {
	activeAppId.value = id;
}

function closeApp() {
	activeAppId.value = null;
}

function getAppLabel(id: string | null) {
	if (!id) {
		return "";
	}

	return desktopApps.find(app => app.id === id)?.label ?? id;
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

		<div v-if="!activeAppId" class="mobile-home-screen">
			<!-- <div class="mobile-hero">
				<div class="mobile-hero-copy">
					<p class="mobile-kicker">Home Screen</p>
					<h1 class="mobile-title">jsOS Mobile</h1>
					<p class="mobile-subtitle">{{ currentDay }}</p>
				</div>

				<div class="mobile-widget">
					<p class="mobile-widget-label">Workspace</p>
					<p class="mobile-widget-value">6 apps ready</p>
					<p class="mobile-widget-copy">Tap any icon to open its mobile placeholder view.</p>
				</div>
			</div> -->

			<div class="mobile-app-grid">
				<button v-for="app in desktopApps" :key="app.id" class="mobile-app-button" type="button" @click="openApp(app.id)">
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

			<div class="home-indicator" aria-hidden="true"></div>
		</div>

		<div v-else class="mobile-app-view">
			<div class="mobile-app-header">
				<button class="mobile-back-button" type="button" @click="closeApp">Back</button>
				<div class="mobile-app-header-copy">
					<p class="mobile-kicker">App Preview</p>
					<h2 class="mobile-app-title">{{ getAppLabel(activeAppId) }}</h2>
				</div>
			</div>

			<div class="mobile-app-card">
				<div class="mobile-app-card-header">
					<div class="mobile-app-card-dot"></div>
					<p class="mobile-app-card-title">{{ getAppLabel(activeAppId) }}</p>
				</div>
				<p class="mobile-app-copy">This is the placeholder mobile view for {{ getAppLabel(activeAppId) }}. The next step is wiring each app into a mobile-specific full-screen experience.</p>
			</div>

			<div class="home-indicator" aria-hidden="true"></div>
		</div>
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
	gap: var(--space-3);
}

.mobile-back-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.25rem;
	padding: 0 var(--space-3);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-pill);
	background: rgba(255, 249, 241, 0.88);
	color: var(--color-ink);
	font-size: var(--text-xs);
	font-weight: 600;
	cursor: pointer;
	box-shadow: 0 0.5rem 1rem rgba(90, 61, 43, 0.08);
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

.home-indicator {
	width: 8rem;
	height: 0.32rem;
	margin: var(--space-3) auto 0;
	border-radius: var(--radius-pill);
	background: rgba(90, 61, 43, 0.22);
}
</style>
