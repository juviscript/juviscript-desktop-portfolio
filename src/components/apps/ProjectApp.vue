<script setup lang="ts">
import { computed } from "vue";
import { projects } from "../../data/Projects";

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
		<div class="project-top-container">
			<img v-if="selectedProject.gif" :src="selectedProject.gif" :alt="`${selectedProject.name} preview`" class="project-preview-image" />
			<div v-else class="project-preview-image-placeholder">Preview not available</div>
		</div>
		<div class="project-bottom-container">
			<div>
				<h1 class="project-title">{{ selectedProject.name }}</h1>
				<div class="technologies-badges-container">
					<span v-for="technology in selectedProject.technologies" :key="technology" class="technology-badge">{{ technology }}</span>
				</div>
			</div>

			<div class="project-description">
				<p>{{ selectedProject.description }}</p>
			</div>

			<div class="project-quick-links">
				<a v-if="selectedProject.url" :href="selectedProject.url" target="_blank" rel="noopener" class="project-link" @click.prevent="emit('open-url', selectedProject.id, selectedProject.url, selectedProject.name)"> Preview Project </a>
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
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	min-height: 0;
	gap: 1rem;
	padding: 1rem;
	box-sizing: border-box;
	overflow: auto;
}

.project-top-container {
	text-align: center;
	margin: auto;
	flex-grow: 1;
	min-height: 0;
}

.project-bottom-container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	padding: 1rem;
	border-radius: var(--radius-lg);
	background-color: var(--color-surface-strong);
}

.project-preview-image {
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
	border-radius: var(--radius-md);
}

.project-preview-image-placeholder {
	width: 100%;
	height: 100%;
	min-height: 240px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.project-title {
	margin: 0;
}

.technologies-badges-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
    margin-top: .25rem;
}

.technology-badge {
	padding: 0.25rem 0.5rem;
	background-color: var(--color-accent-red);
	font-size: 0.75rem;
    font-weight: bold;
	border-radius: var(--radius-pill);
	color: white;
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
	color: var(--color);
	font-weight: bold;
	text-decoration: none;
	padding: 0.5rem 0.75rem;
	background-color: var(--color-accent-sky);
	border-radius: var(--radius-sm);
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

@media (max-width: 48rem) {
	.project-container {
		padding: 0.85rem;
	}

	.project-bottom-container {
		padding: 0.85rem;
	}

	.project-quick-links {
		flex-direction: column;
	}

	.project-link {
		text-align: center;
	}
}
</style>
