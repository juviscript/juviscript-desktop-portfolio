<script setup lang="ts">
import { computed } from "vue";
import { projects } from "../data/Projects";

const props = defineProps<{
	projectId: string;
}>();

const emit = defineEmits<{
	"open-url": [projectId: string, url: string, title: string];
}>();

const selectedProject = computed(() => projects.find(project => project.id === props.projectId));
</script>

<template>
	<div v-if="selectedProject" class="project-container">
		<div class="project-left-container">
			<img v-if="selectedProject.gif" :src="selectedProject.gif" :alt="`${selectedProject.name} preview`" class="project-preview" />
			<div v-else class="project-preview-placeholder">Preview not available</div>
		</div>
		<div class="project-right-container">
			<h1 class="project-title">{{ selectedProject.name }}</h1>
			<div class="technologies-badges-container">
				<span v-for="technology in selectedProject.technologies" :key="technology" class="technology-badge">{{ technology }}</span>
			</div>
			<div class="project-description">
				<p>{{ selectedProject.description }}</p>
			</div>

			<div class="project-quick-links">
				<a
					v-if="selectedProject.url"
					:href="selectedProject.url"
					target="_blank"
					rel="noopener"
					class="project-link"
					@click.prevent="emit('open-url', selectedProject.id, selectedProject.url, selectedProject.name)"
				>
					Preview Project
				</a>
				<a v-if="selectedProject.repositoryUrl" :href="selectedProject.repositoryUrl" target="_blank" rel="noopener" class="project-link">View Repository</a>
			</div>
		</div>
	</div>
	<div v-else class="project-empty-state">
		<p>Project not found.</p>
	</div>
</template>

<style scoped>
.project-container {
	display: grid;
	grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
	width: 100%;
	height: 100%;
	gap: 1rem;
	padding: 1rem;
	box-sizing: border-box;
}

.project-left-container {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f4f4f4;
	border: 1px solid #c0c0c0;
	padding: 1rem;
}

.project-right-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.project-preview {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
}

.project-preview-placeholder {
	width: 100%;
	height: 100%;
	min-height: 240px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #666;
	background: repeating-linear-gradient(45deg, #e9e9e9, #e9e9e9 12px, #f7f7f7 12px, #f7f7f7 24px);
}

.project-title {
	margin: 0;
}

.technologies-badges-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.technology-badge {
	padding: 0.25rem 0.5rem;
	border: 1px solid #999;
	background-color: #efefef;
	font-size: 0.85rem;
}

.project-description {
	line-height: 1.5;
}

.project-quick-links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.project-link {
	color: #0055aa;
	text-decoration: none;
}

.project-link:hover {
	text-decoration: underline;
}

.project-empty-state {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

</style>
