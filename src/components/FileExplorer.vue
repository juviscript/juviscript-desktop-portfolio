<script setup lang="ts">
import { certifications, type Certification } from "../data/Certifications";
import { projects, type Project } from "../data/Projects";

const props = defineProps<{
	id: string;
	url: string;
}>();

const emit = defineEmits<{
	"open-file": [file: { id: string; title: string; filePath: string; displayUrl: string }];
	"open-project": [projectId: string];
}>();

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
				<button class="file-explorer-back-button"><-</button>
				<button class="file-explorer-forward-button">-></button>
				<button class="file-explorer-refresh-button">⟳</button>
			</div>
			<div class="file-explorer-address-bar">
				<input type="text" class="file-explorer-url-input" :value="props.url" disabled />
			</div>
			<div class="file-explorer-search-bar">
				<input type="text" class="file-explorer-search-input" placeholder="Search Certifications..." />
			</div>
		</div>

		<div class="file-explorer-content">
			<div class="file-explorer-directory">
				<ul class="file-explorer-directory-list">
					<li class="file-explorer-directory-item">This PC</li>
				</ul>
			</div>

			<div class="file-explorer-files">
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
</template>

<style scoped>
.file-explorer-window {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.file-explorer-title-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	height: 30px;
	background-color: #0078d7;
}

.file-explorer-address-bar {
	flex-grow: 1;

	input {
		width: 100%;
		padding: 4px 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
}

.file-explorer-search-bar {
	input {
		width: 100%;
		padding: 4px 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
}

.file-explorer-content {
	flex-grow: 1;
	display: flex;
}

.file-explorer-directory {
	width: 25%;
	background-color: #f0f0f0;
	border-right: 1px solid #ccc;
	padding: 1rem;
}

.file-explorer-files {
	background-color: white;
	padding: 1rem;
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.file-explorer-file {
	width: 120px;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	cursor: pointer;
}

.file-explorer-file.disabled {
	cursor: default;
	opacity: 0.6;
}

.file-icon {
	width: 64px;
	height: 64px;
	object-fit: contain;
}

.file-explorer-directory-list {
	list-style: none;
	padding: 0;
	margin: 0;
}
</style>
