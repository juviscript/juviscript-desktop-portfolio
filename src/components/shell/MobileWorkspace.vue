<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { desktopApps } from "../../data/DesktopApps";
import resumePdf from "../../assets/Juvilane Panaguiton - Resume (June 2025).pdf";
import calendarDockIcon from "../../assets/mobile-icons/calendar-icon.gif";
import messagesDockIcon from "../../assets/mobile-icons/messages-icon.png";
import photosDockIcon from "../../assets/mobile-icons/photos-icon.png";
import settingsDockIcon from "../../assets/mobile-icons/settings-icon.png";
import wifiIcon from "../../assets/mobile-icons/wifi-icon.svg";
import AboutApp from "../apps/AboutApp.vue";
import BrowserApp from "../apps/BrowserApp.vue";
import ContactApp from "../apps/ContactApp.vue";
import ExplorerApp from "../apps/ExplorerApp.vue";
import ProjectApp from "../apps/ProjectApp.vue";
import ThemedIcon from "../shared/ThemedIcon.vue";
import backPageIcon from "../../assets/window-icons/last-page-icon.svg?raw";
import homeIcon from "../../assets/window-icons/home-icon.svg?raw";
import maximizeWindowIcon from "../../assets/window-icons/maximize-window-icon.svg?raw";
import { useWorkspaceState } from "../../composables/useWorkspaceState";

const {
	workspaceState,
	openMobileApp,
	closeMobileApp,
	openMobileBrowserView,
	closeMobileBrowserView,
	openMobileProject,
	closeMobileProject,
	closeMobileAppById,
	switchMobileApp,
} = useWorkspaceState();

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
const switcherPreviewIndex = ref(0);
const switcherCarousel = ref<HTMLElement | null>(null);
const switcherDoneButton = ref<HTMLButtonElement | null>(null);
const appsButton = ref<HTMLButtonElement | null>(null);
let switcherScrollFrame: number | null = null;
let lastSwitcherTrigger: HTMLElement | null = null;

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

const activeMobileBrowserView = computed(() =>
	workspaceState.mobile.browserView?.sourceAppId === activeApp.value?.id
		? workspaceState.mobile.browserView
		: null,
);

const activeMobileProjectId = computed(() =>
	activeApp.value?.id === "projects" && !activeMobileBrowserView.value
		? workspaceState.mobile.projectViewId
		: null,
);

const isNestedMobileView = computed(() => Boolean(activeMobileBrowserView.value || activeMobileProjectId.value));

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

function handleMobileOpenCertification(file: { id: string; title: string; filePath: string; displayUrl: string }) {
	openMobileBrowserView({
		sourceAppId: "certifications",
		title: file.title,
		url: file.displayUrl,
		objectUrl: file.filePath,
		isPdf: true,
	});
}

function handleMobileOpenProject(projectId: string) {
	openMobileProject(projectId);
}

function handleMobileOpenProjectUrl(projectId: string, url: string, title: string) {
	openMobileBrowserView({
		sourceAppId: "projects",
		title,
		url,
		isPdf: false,
	});
}

function handleMobileSubviewBack() {
	if (activeMobileBrowserView.value) {
		closeMobileBrowserView();
		return;
	}

	if (activeMobileProjectId.value) {
		closeMobileProject();
	}
}

function openAppSwitcher(triggerElement: HTMLElement | null = document.activeElement as HTMLElement | null) {
	if (!recentApps.value.length) {
		return;
	}

	lastSwitcherTrigger = triggerElement;

	const activeIndex = activeApp.value
		? recentApps.value.findIndex(app => app.id === activeApp.value?.id)
		: 0;

	switcherPreviewIndex.value = activeIndex >= 0 ? activeIndex : 0;
	isAppSwitcherOpen.value = true;

	nextTick(() => {
		scrollSwitcherToIndex(switcherPreviewIndex.value);
		switcherDoneButton.value?.focus({ preventScroll: true });
	});
}

function closeAppSwitcher({ restoreFocus = true }: { restoreFocus?: boolean } = {}) {
	isAppSwitcherOpen.value = false;

	if (!restoreFocus) {
		return;
	}

	nextTick(() => {
		if (lastSwitcherTrigger?.isConnected) {
			lastSwitcherTrigger.focus({ preventScroll: true });
			return;
		}

		appsButton.value?.focus({ preventScroll: true });
	});
}

function selectAppFromSwitcher(id: string) {
	switchMobileApp(id);
	closeAppSwitcher({ restoreFocus: false });

	nextTick(() => {
		appsButton.value?.focus({ preventScroll: true });
	});
}

function closeAppFromSwitcher(id: string) {
	closeMobileAppById(id);

	nextTick(() => {
		if (!recentApps.value.length) {
			switcherPreviewIndex.value = 0;
			closeAppSwitcher();
			return;
		}

		const nextIndex = Math.min(switcherPreviewIndex.value, recentApps.value.length - 1);
		scrollSwitcherToIndex(Math.max(nextIndex, 0));
	});
}

function scrollSwitcherToIndex(index: number, behavior: ScrollBehavior = "auto") {
	const carousel = switcherCarousel.value;

	if (!carousel) {
		return;
	}

	const targetCard = carousel.children[index] as HTMLElement | undefined;

	if (!targetCard) {
		return;
	}

	switcherPreviewIndex.value = index;
	carousel.scrollTo({
		left: targetCard.offsetLeft,
		behavior,
	});
}

function syncSwitcherPreviewIndex() {
	const carousel = switcherCarousel.value;

	if (!carousel) {
		return;
	}

	const cards = Array.from(carousel.children) as HTMLElement[];

	if (!cards.length) {
		switcherPreviewIndex.value = 0;
		return;
	}

	let closestIndex = 0;
	let closestDistance = Number.POSITIVE_INFINITY;

	cards.forEach((card, index) => {
		const distance = Math.abs(card.offsetLeft - carousel.scrollLeft);

		if (distance < closestDistance) {
			closestDistance = distance;
			closestIndex = index;
		}
	});

	switcherPreviewIndex.value = closestIndex;
}

function handleSwitcherScroll() {
	if (switcherScrollFrame !== null) {
		window.cancelAnimationFrame(switcherScrollFrame);
	}

	switcherScrollFrame = window.requestAnimationFrame(() => {
		syncSwitcherPreviewIndex();
		switcherScrollFrame = null;
	});
}

function getSwitcherCardStyle(index: number) {
	const distanceFromPreview = Math.abs(index - switcherPreviewIndex.value);

	return {
		zIndex: String(recentApps.value.length + 10 - distanceFromPreview),
		transform: `translateY(${Math.min(distanceFromPreview, 4) * 0.28}rem) scale(${index === switcherPreviewIndex.value ? 1 : 0.97})`,
	};
}

onBeforeUnmount(() => {
	if (switcherScrollFrame !== null) {
		window.cancelAnimationFrame(switcherScrollFrame);
	}
});

function handleMobileHome() {
	if (activeApp.value) {
		closeMobileApp();
	}
}

function handleMobileApps() {
	openAppSwitcher(appsButton.value);
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
						Use the app navigation when a view is open to jump home or switch between recent mobile sessions.
					</p>
				</div>
			</div>

			<div class="mobile-app-grid">
				<button v-for="app in desktopApps" :key="app.id" class="mobile-app-button" type="button" @click="openMobileApp(app.id)">
					<div class="mobile-app-icon-shell">
						<img class="mobile-app-icon" :src="app.icon" alt="" aria-hidden="true" />
					</div>
					<span class="mobile-app-label">{{ app.label }}</span>
				</button>
			</div>

			<div class="mobile-dock">
				<div v-for="dockApp in dockApps" :key="dockApp.id" class="mobile-dock-button" aria-hidden="true">
					<img class="mobile-dock-icon" :src="dockApp.icon" alt="" aria-hidden="true" />
				</div>
			</div>
		</div>

		<div v-else class="mobile-app-view">
			<div class="mobile-app-header">
				<div class="mobile-app-header-copy">
					<p class="mobile-kicker">{{ getAppPreviewEyebrow(activeApp?.id ?? "") }}</p>
					<h2 class="mobile-app-title">{{ activeApp?.label }}</h2>
				</div>
			</div>

			<div class="mobile-app-surface">
				<BrowserApp
					v-if="activeApp?.id === 'resume'"
					url="https://www.juviscript.dev/resume"
					:objectUrl="resumePdf"
					:isPdf="true" />

				<BrowserApp
					v-else-if="activeMobileBrowserView"
					:url="activeMobileBrowserView.url"
					:objectUrl="activeMobileBrowserView.objectUrl"
					:isPdf="activeMobileBrowserView.isPdf" />

				<ProjectApp
					v-else-if="activeMobileProjectId"
					:project-id="activeMobileProjectId"
					@open-url="handleMobileOpenProjectUrl" />

				<ExplorerApp
					v-else-if="activeApp?.id === 'certifications'"
					id="certifications"
					url="jsOS:/certifications"
					interactionMode="single"
					@open-file="handleMobileOpenCertification" />

				<ExplorerApp
					v-else-if="activeApp?.id === 'projects'"
					id="projects"
					url="jsOS:/projects"
					interactionMode="single"
					@open-project="handleMobileOpenProject" />

				<AboutApp v-else-if="activeApp?.id === 'about'" />
				<ContactApp v-else-if="activeApp?.id === 'contact'" />

				<div v-else-if="activeApp?.id === 'recycle-bin'" class="mobile-empty-app">
					<div class="mobile-empty-app__content">
						<p class="mobile-empty-app__eyebrow">System</p>
						<h3 class="mobile-empty-app__title">Recycle Bin</h3>
						<p class="mobile-empty-app__copy">Nothing to clean up here yet.</p>
					</div>
				</div>
			</div>

			<nav class="mobile-bottom-toolbar" aria-label="Mobile navigation">
				<button
					class="mobile-bottom-toolbar-button"
					:class="{ 'mobile-bottom-toolbar-button--disabled': !isNestedMobileView }"
					type="button"
					:disabled="!isNestedMobileView"
					:aria-disabled="(!isNestedMobileView).toString()"
					aria-label="Back"
					@click="handleMobileSubviewBack">
					<ThemedIcon class="mobile-bottom-toolbar-icon" :svg="backPageIcon" />
				</button>
				<button class="mobile-bottom-toolbar-button" type="button" aria-label="Home" @click="handleMobileHome">
					<ThemedIcon class="mobile-bottom-toolbar-icon" :svg="homeIcon" />
				</button>
				<button ref="appsButton" class="mobile-bottom-toolbar-button" type="button" aria-label="Apps" @click="handleMobileApps">
					<ThemedIcon class="mobile-bottom-toolbar-icon" :svg="maximizeWindowIcon" />
				</button>
			</nav>
		</div>

		<transition name="mobile-switcher-fade">
			<div v-if="isAppSwitcherOpen" class="mobile-switcher-overlay" @click.self="closeAppSwitcher()" @keydown.esc="closeAppSwitcher()">
				<div class="mobile-switcher-sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-switcher-title">
					<div class="mobile-switcher-sheet-header">
						<div>
							<p class="mobile-kicker">Recent Apps</p>
							<h2 id="mobile-switcher-title" class="mobile-switcher-title">App Switcher</h2>
							<p class="mobile-switcher-count">{{ recentApps.length }} tracked</p>
						</div>
						<button ref="switcherDoneButton" class="mobile-switcher-done" type="button" @click="closeAppSwitcher()">Done</button>
					</div>

					<div ref="switcherCarousel" class="mobile-switcher-carousel" @scroll="handleSwitcherScroll">
						<article
							v-for="(app, index) in recentApps"
							:key="`preview-${app.id}`"
							class="mobile-switcher-card"
							:class="{ 'mobile-switcher-card--active-preview': index === switcherPreviewIndex }"
							:style="getSwitcherCardStyle(index)">
							<button class="mobile-switcher-card-frame" type="button" :aria-label="`Switch to ${app.label}`" @click="selectAppFromSwitcher(app.id)">
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
													<template v-if="app.id === 'about'">
														<p class="mobile-switcher-preview-eyebrow">{{ getAppPreviewEyebrow(app.id) }}</p>
														<p class="mobile-switcher-preview-title">Juvilane Panaguiton</p>
														<p class="mobile-switcher-preview-copy">Full-Stack Developer</p>
														<div class="mobile-switcher-preview-tag-row">
															<span class="mobile-switcher-preview-tag">TypeScript</span>
															<span class="mobile-switcher-preview-tag">Vue</span>
															<span class="mobile-switcher-preview-tag">UX</span>
														</div>
														<div class="mobile-switcher-preview-card-block"></div>
														<div class="mobile-switcher-preview-card-block mobile-switcher-preview-card-block--short"></div>
													</template>

													<template v-else-if="app.id === 'contact'">
														<p class="mobile-switcher-preview-eyebrow">{{ getAppPreviewEyebrow(app.id) }}</p>
														<p class="mobile-switcher-preview-title">{{ app.label }}</p>
														<div class="mobile-switcher-preview-field"></div>
														<div class="mobile-switcher-preview-field"></div>
														<div class="mobile-switcher-preview-field mobile-switcher-preview-field--textarea"></div>
														<div class="mobile-switcher-preview-button"></div>
													</template>

													<template v-else-if="app.id === 'projects'">
														<p class="mobile-switcher-preview-eyebrow">{{ getAppPreviewEyebrow(app.id) }}</p>
														<div class="mobile-switcher-preview-project-hero"></div>
														<p class="mobile-switcher-preview-title">{{ app.label }}</p>
														<div class="mobile-switcher-preview-tag-row">
															<span class="mobile-switcher-preview-tag">Vue</span>
															<span class="mobile-switcher-preview-tag">Cloudflare</span>
														</div>
														<div class="mobile-switcher-preview-link-row">
															<div class="mobile-switcher-preview-link-pill"></div>
															<div class="mobile-switcher-preview-link-pill mobile-switcher-preview-link-pill--muted"></div>
														</div>
													</template>

													<template v-else-if="app.id === 'certifications'">
														<p class="mobile-switcher-preview-eyebrow">{{ getAppPreviewEyebrow(app.id) }}</p>
														<div class="mobile-switcher-preview-explorer">
															<div class="mobile-switcher-preview-sidebar"></div>
															<div class="mobile-switcher-preview-file-grid">
																<span class="mobile-switcher-preview-file"></span>
																<span class="mobile-switcher-preview-file"></span>
																<span class="mobile-switcher-preview-file"></span>
																<span class="mobile-switcher-preview-file"></span>
															</div>
														</div>
													</template>

													<template v-else-if="app.id === 'resume'">
														<p class="mobile-switcher-preview-eyebrow">{{ getAppPreviewEyebrow(app.id) }}</p>
														<div class="mobile-switcher-preview-browser-bar">
															<div class="mobile-switcher-preview-browser-dot"></div>
															<div class="mobile-switcher-preview-browser-dot"></div>
															<div class="mobile-switcher-preview-browser-address"></div>
														</div>
														<div class="mobile-switcher-preview-document"></div>
													</template>

													<template v-else>
														<p class="mobile-switcher-preview-eyebrow">{{ getAppPreviewEyebrow(app.id) }}</p>
														<p class="mobile-switcher-preview-title">{{ app.label }}</p>
														<p class="mobile-switcher-preview-copy">{{ getAppPreviewCopy(app.id) }}</p>
													</template>
												</div>
											</div>

											<span class="mobile-switcher-preview-home" aria-hidden="true"></span>
										</div>
									</div>
								</div>
							</button>

							<button class="mobile-switcher-close" type="button" :aria-label="`Close ${app.label}`" @click="closeAppFromSwitcher(app.id)">
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
	padding:
		calc(0.75rem + env(safe-area-inset-top))
		1rem
		calc(0.75rem + env(safe-area-inset-bottom));
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
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
	overscroll-behavior: none;
}

.mobile-status-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem 1rem;
	color: var(--color-ink);
	border-radius: var(--radius-pill);
	background: var(--color-frame-top);
	flex-shrink: 0;
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
	overflow: auto;
	overscroll-behavior: contain;
	-webkit-overflow-scrolling: touch;
	scrollbar-width: none;
}

.mobile-home-screen {
	padding-bottom: calc(var(--space-6) + 1.5rem + env(safe-area-inset-bottom));
}

.mobile-app-view {
	padding-bottom: calc(var(--space-8) + 3.9rem + env(safe-area-inset-bottom));
}

.mobile-home-screen::-webkit-scrollbar,
.mobile-app-view::-webkit-scrollbar,
.mobile-app-surface::-webkit-scrollbar {
	display: none;
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
	padding-bottom: var(--space-3);
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
	margin-bottom: calc(var(--space-3) + env(safe-area-inset-bottom));
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

.mobile-app-surface {
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
	border-radius: 1.5rem;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.14)), rgba(255, 249, 241, 0.9);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: var(--shadow-card);
	overflow: auto;
	overscroll-behavior: contain;
	-webkit-overflow-scrolling: touch;
	padding: var(--space-3);
}

.mobile-bottom-toolbar {
	position: absolute;
	left: 50%;
	bottom: calc(1.9rem + env(safe-area-inset-bottom));
	transform: translateX(-50%);
	z-index: 4;
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: var(--space-2);
	width: min(100%, 22rem);
	padding: 0.5rem;
	border-radius: 1.25rem;
	background: rgba(247, 227, 207, 0.94);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.14);
	box-shadow:
		0 1rem 1.8rem rgba(90, 61, 43, 0.16),
		inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.32);
	backdrop-filter: blur(0.75rem);
}

.mobile-bottom-toolbar-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0;
	min-height: 3rem;
	padding: 0.35rem;
	border: none;
	border-radius: 0.95rem;
	background: rgba(255, 255, 255, 0.4);
	color: var(--color-ink);
	cursor: pointer;
	transition:
		transform 140ms ease,
		background-color 140ms ease,
		box-shadow 140ms ease,
		opacity 140ms ease;
}

.mobile-bottom-toolbar-button:hover:not(:disabled),
.mobile-bottom-toolbar-button:focus-visible:not(:disabled) {
	transform: translateY(-0.0625rem);
	background: rgba(255, 255, 255, 0.65);
	box-shadow: 0 0.5rem 1rem rgba(90, 61, 43, 0.12);
}

.mobile-bottom-toolbar-button--active {
	background: linear-gradient(135deg, rgba(222, 107, 72, 0.92), rgba(233, 158, 112, 0.92));
	color: var(--color-white);
	box-shadow: 0 0.6rem 1.1rem rgba(222, 107, 72, 0.22);
}

.mobile-bottom-toolbar-button--disabled {
	opacity: 0.5;
	box-shadow: none;
	cursor: default;
}

.mobile-bottom-toolbar-icon {
	width: 1.15rem;
	height: 1.15rem;
}

.mobile-empty-app {
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
	padding: var(--space-5);
}

.mobile-empty-app__content {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	text-align: center;
}

.mobile-empty-app__eyebrow,
.mobile-empty-app__title,
.mobile-empty-app__copy {
	margin: 0;
}

.mobile-empty-app__eyebrow {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.mobile-empty-app__title {
	font-family: var(--font-display);
	font-size: var(--text-xl);
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.mobile-empty-app__copy {
	color: var(--color-ink);
	line-height: var(--line-loose);
}

.mobile-switcher-overlay {
	position: absolute;
	inset: 0;
	z-index: 20;
	display: flex;
	align-items: stretch;
	padding:
		calc(0.85rem + env(safe-area-inset-top))
		0.85rem
		calc(0.85rem + env(safe-area-inset-bottom));
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

.mobile-switcher-title {
	margin: 0.2rem 0 0;
	font-family: var(--font-display);
	font-size: var(--text-lg);
	font-weight: 700;
	line-height: var(--line-tight);
	color: var(--color-ink);
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

.mobile-switcher-done:focus-visible,
.mobile-switcher-card-frame:focus-visible,
.mobile-switcher-close:focus-visible {
	outline: none;
	box-shadow:
		0 0 0 0.18rem rgba(222, 107, 72, 0.18),
		0 0.7rem 1.2rem rgba(90, 61, 43, 0.12);
}

.mobile-switcher-carousel {
	display: flex;
	align-items: stretch;
	gap: 0;
	overflow-x: auto;
	padding: 0 1.4rem 0.35rem 0.8rem;
	scroll-snap-type: x mandatory;
	scroll-padding-inline: 0.8rem;
	scrollbar-width: none;
	flex: 1;
	min-height: 0;
	touch-action: pan-x;
}

.mobile-switcher-carousel::-webkit-scrollbar {
	display: none;
}

.mobile-switcher-card {
	scroll-snap-align: start;
	flex: 0 0 calc(100% - 4rem);
	display: flex;
	flex-direction: column;
	gap: 0.7rem;
	min-height: 0;
	position: relative;
	transform-origin: center bottom;
	transition:
		transform 180ms ease,
		filter 180ms ease,
		opacity 180ms ease;
}

.mobile-switcher-card + .mobile-switcher-card {
	margin-inline-start: -24%;
}

.mobile-switcher-card--active-preview {
	filter: none;
}

.mobile-switcher-card:not(.mobile-switcher-card--active-preview) {
	filter: saturate(0.94);
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

.mobile-switcher-preview-tag-row,
.mobile-switcher-preview-link-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
}

.mobile-switcher-preview-tag {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.35rem 0.6rem;
	border-radius: var(--radius-pill);
	background: rgba(191, 233, 255, 0.42);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.08);
	color: var(--color-ink);
	font-size: 0.68rem;
	font-weight: 700;
}

.mobile-switcher-preview-card-block,
.mobile-switcher-preview-field,
.mobile-switcher-preview-button,
.mobile-switcher-preview-link-pill,
.mobile-switcher-preview-browser-address,
.mobile-switcher-preview-document,
.mobile-switcher-preview-project-hero,
.mobile-switcher-preview-sidebar,
.mobile-switcher-preview-file,
.mobile-switcher-preview-browser-dot {
	border-radius: var(--radius-md);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.16)),
		rgba(239, 213, 183, 0.92);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.08);
}

.mobile-switcher-preview-card-block {
	height: 4.5rem;
}

.mobile-switcher-preview-card-block--short {
	height: 2.6rem;
}

.mobile-switcher-preview-field {
	height: 2.5rem;
}

.mobile-switcher-preview-field--textarea {
	height: 5.2rem;
}

.mobile-switcher-preview-button {
	height: 2.7rem;
	margin-top: auto;
	background:
		linear-gradient(135deg, rgba(222, 107, 72, 0.92), rgba(233, 158, 112, 0.92));
	border-color: rgba(222, 107, 72, 0.18);
}

.mobile-switcher-preview-project-hero {
	height: 6.2rem;
	background:
		linear-gradient(145deg, rgba(191, 233, 255, 0.42), rgba(255, 255, 255, 0.18)),
		rgba(239, 213, 183, 0.92);
}

.mobile-switcher-preview-link-pill {
	width: 5.4rem;
	height: 2rem;
}

.mobile-switcher-preview-link-pill--muted {
	width: 4.25rem;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.42), rgba(255, 255, 255, 0.12)),
		rgba(191, 233, 255, 0.4);
}

.mobile-switcher-preview-explorer {
	display: grid;
	grid-template-columns: 4.4rem minmax(0, 1fr);
	gap: 0.7rem;
	flex: 1;
	min-height: 0;
}

.mobile-switcher-preview-sidebar {
	height: 100%;
	min-height: 10rem;
}

.mobile-switcher-preview-file-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.6rem;
	align-content: start;
}

.mobile-switcher-preview-file {
	display: block;
	aspect-ratio: 1 / 1.08;
}

.mobile-switcher-preview-browser-bar {
	display: flex;
	align-items: center;
	gap: 0.45rem;
}

.mobile-switcher-preview-browser-dot {
	width: 0.75rem;
	height: 0.75rem;
	border-radius: 50%;
	background:
		linear-gradient(135deg, rgba(222, 107, 72, 0.92), rgba(233, 158, 112, 0.92));
	border-color: rgba(222, 107, 72, 0.12);
}

.mobile-switcher-preview-browser-address {
	flex: 1;
	height: 2rem;
}

.mobile-switcher-preview-document {
	flex: 1;
	min-height: 11rem;
	margin-top: 0.2rem;
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
