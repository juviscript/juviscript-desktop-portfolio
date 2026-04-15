<script setup lang="ts">
import { computed } from "vue";
import { certifications, type Certification } from "../data/Certifications";
import { projects, type Project } from "../data/Projects";
import ThemedIcon from "./ThemedIcon.vue";
import backPageIcon from "../assets/window-icons/last-page-icon.svg?raw";
import forwardPageIcon from "../assets/window-icons/next-page-icon.svg?raw";
import refreshPageIcon from "../assets/window-icons/refresh-icon.svg?raw";
import certificationDirectoryIcon from "../assets/desktop-icons/certification-icon.png";
import folderDirectoryIcon from "../assets/desktop-icons/folder-icon.png";
import mailDirectoryIcon from "../assets/desktop-icons/mail-icon.png";
import projectsDirectoryIcon from "../assets/desktop-icons/projects-icon.png";
import recycleBinDirectoryIcon from "../assets/desktop-icons/recycle-bin-icon.png";

const props = defineProps<{
	id: string;
	url: string;
}>();

const emit = defineEmits<{
	"open-file": [file: { id: string; title: string; filePath: string; displayUrl: string }];
	"open-project": [projectId: string];
}>();

const searchPlaceholder = computed(() => props.id === "projects" ? "Search Projects..." : "Search Certifications...");

const directorySections = computed(() => [
	{
		title: "jsOS Places",
		items: [
			{ label: "This PC", icon: folderDirectoryIcon },
			{ label: "Portfolio", icon: folderDirectoryIcon },
			{ label: "Projects", icon: projectsDirectoryIcon, isActive: props.id === "projects" },
			{ label: "Certifications", icon: certificationDirectoryIcon, isActive: props.id === "certifications" },
			{ label: "Resume", icon: folderDirectoryIcon },
		],
	},
	{
		title: "Utilities",
		items: [
			{ label: "Inbox", icon: mailDirectoryIcon },
			{ label: "Recycle Bin", icon: recycleBinDirectoryIcon },
		],
	},
]);

function openCertification(certification: Certification) {
	emit("open-file", {
		id: certification.id,
		title: certification.title,
		filePath: certification.filePath,
		displayUrl: certification.displayUrl,
	});
}

function openProject(project: Project) {
	emit("open-project", project.id);
}
</script>

<template>
	<div class="file-explorer-window">
		<div class="file-explorer-title-bar">
			<div class="file-explorer-navigation-buttons">
				<button class="file-explorer-button" type="button" aria-label="Go back">
					<ThemedIcon class="file-explorer-button-icon" :svg="backPageIcon" />
				</button>
				<button class="file-explorer-button" type="button" aria-label="Go forward">
					<ThemedIcon class="file-explorer-button-icon" :svg="forwardPageIcon" />
				</button>
				<button class="file-explorer-button" type="button" aria-label="Refresh">
					<ThemedIcon class="file-explorer-button-icon" :svg="refreshPageIcon" />
				</button>
			</div>
			<div class="file-explorer-address-bar">
				<input type="text" class="file-explorer-url-input" :value="props.url" disabled />
			</div>
			<div class="file-explorer-search-bar">
				<input type="text" class="file-explorer-search-input" :placeholder="searchPlaceholder" />
			</div>
		</div>

		<div class="file-explorer-content">
			<div class="file-explorer-directory">
				<div v-for="section in directorySections" :key="section.title" class="file-explorer-directory-section">
					<p class="file-explorer-directory-heading">{{ section.title }}</p>
					<ul class="file-explorer-directory-list">
						<li
							v-for="item in section.items"
							:key="item.label"
							class="file-explorer-directory-item"
							:class="{ active: item.isActive }">
							<img class="file-explorer-directory-icon" :src="item.icon" :alt="`${item.label} icon`" />
							<span>{{ item.label }}</span>
						</li>
					</ul>
				</div>
			</div>

			<div class="file-explorer-main-content">
				<div class="file-explorer-file-wrapper">
					<div v-if="props.id === 'certifications'" v-for="cert in certifications" :key="cert.id" class="file-explorer-file" :class="{ disabled: !cert.filePath }" @dblclick="openCertification(cert)">
						<img class="file-icon" :src="cert.icon" :alt="`${cert.title} icon`" />
						<div class="file-name">{{ cert.title }}</div>
					</div>

					<div v-else-if="props.id === 'projects'" v-for="project in projects" :key="project.id" class="file-explorer-file" @dblclick="openProject(project)">
						<img class="file-icon" :src="project.icon" :alt="`${project.name} icon`" />
						<div class="file-name">{{ project.name }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.file-explorer-window {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.file-explorer-title-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	height: 30px;
	padding: 1rem 0;
}

.file-explorer-navigation-buttons {
	display: flex;
	gap: var(--space-2);
	flex-shrink: 0;
}

.file-explorer-button {
	display: inline-grid;
	place-items: center;
	width: 2rem;
	height: 2rem;
	padding: 0;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-md);
	background: rgba(255, 255, 255, 0.82);
	color: var(--color-ink-soft);
	font-weight: 700;
	line-height: 1;
	cursor: pointer;
	box-shadow: 0 0.35rem 0.85rem rgba(90, 61, 43, 0.08);
	transition:
		transform 140ms ease,
		background-color 140ms ease,
		box-shadow 140ms ease,
		color 140ms ease;
}

.file-explorer-button:hover {
	transform: translateY(-0.0625rem);
	background: var(--color-surface);
	color: var(--color-ink);
	box-shadow: 0 0.5rem 1rem rgba(90, 61, 43, 0.12);
}

.file-explorer-button-icon {
	width: 0.9rem;
	height: 0.9rem;
}

.file-explorer-address-bar {
	flex-grow: 1;
	background-color: var(--color-surface-muted);
	padding: 0.5rem;
	border-radius: var(--radius-pill);
	border: var(--border-thin) solid transparent;
	transition:
		border-color 140ms ease,
		box-shadow 140ms ease;
}

.file-explorer-search-bar {
	background-color: white;
	padding: 0.5rem;
	border-radius: var(--radius-pill);
	border: var(--border-thin) solid transparent;
	transition:
		border-color 140ms ease,
		box-shadow 140ms ease;
}

.file-explorer-address-bar:focus-within,
.file-explorer-search-bar:focus-within {
	border-color: rgba(90, 61, 43, 0.18);
	box-shadow: 0 0 0 0.2rem rgba(191, 233, 255, 0.45);
}

.file-explorer-url-input,
.file-explorer-search-input {
	width: 100%;
	padding: 0.25rem 0.5rem;
	border: none;
	background-color: transparent;
	color: var(--color-ink);
	outline: none;
	box-shadow: none;
	appearance: none;
}

.file-explorer-url-input:focus,
.file-explorer-search-input:focus {
	outline: none;
	box-shadow: none;
}

.file-explorer-url-input::placeholder,
.file-explorer-search-input::placeholder {
	color: var(--color-ink-soft);
}

.file-explorer-content {
	flex-grow: 1;
	display: flex;
	gap: 1rem;
}

.file-explorer-directory {
	width: 25%;
	background-color: var(--color-surface-strong);
	padding: 1rem;
	border-radius: var(--radius-lg);
	display: flex;
	flex-direction: column;
	gap: var(--space-4);
}

.file-explorer-main-content {
	border-radius: var(--radius-lg);
	flex-grow: 1;
	background-color: white;
}

.file-explorer-file-wrapper {
	padding: 1rem;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(7.5rem, 7.5rem));
	gap: 1rem;
	flex-grow: 1;
	align-content: start;
	justify-content: start;
	overflow: auto;
}

.file-explorer-file {
	width: 7.5rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	gap: var(--space-2);
	text-align: center;
	cursor: pointer;
	padding: var(--space-2);
	border: var(--border-thin) solid transparent;
	border-radius: var(--radius-lg);
	transition:
		transform 140ms ease,
		background-color 140ms ease,
		border-color 140ms ease,
		box-shadow 140ms ease;
}

.file-explorer-file:hover {
	border-color: rgba(90, 61, 43, 0.14);
	background: rgba(255, 249, 241, 0.72);
	box-shadow: 0 0.75rem 1.5rem rgba(90, 61, 43, 0.12);
	transform: translateY(-0.125rem);
}

.file-explorer-file.disabled {
	cursor: default;
	opacity: 0.6;
	transform: none;
	box-shadow: none;
}

.file-explorer-file.disabled:hover {
	border-color: transparent;
	background: transparent;
	transform: none;
	box-shadow: none;
}

.file-icon {
	width: 4rem;
	height: 4rem;
	flex: 0 0 4rem;
	object-fit: contain;
}

.file-name {
	font-size: var(--text-xs);
	font-weight: 700;
	line-height: var(--line-snug);
	color: var(--color-ink);
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
	max-width: 100%;
	min-height: calc(3 * 1em * var(--line-snug));
}

.file-explorer-directory-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.file-explorer-directory-section {
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
}

.file-explorer-directory-heading {
	margin: 0;
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.file-explorer-directory-item {
	display: flex;
	align-items: center;
	gap: var(--space-2);
	padding: 0.55rem 0.65rem;
	border-radius: var(--radius-md);
	color: var(--color-ink);
	font-size: var(--text-sm);
	font-weight: 500;
	cursor: default;
	user-select: none;
}

.file-explorer-directory-item.active {
	background: rgba(191, 233, 255, 0.45);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: inset 0 0 0 0.0625rem rgba(255, 255, 255, 0.35);
}

.file-explorer-directory-icon {
	width: 1.25rem;
	height: 1.25rem;
	object-fit: contain;
	flex: 0 0 1.25rem;
}
</style>
