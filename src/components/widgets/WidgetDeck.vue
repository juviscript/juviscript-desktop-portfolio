<script setup lang="ts">
import { computed } from "vue";
import { useWidgets } from "../../composables/useWidgets";
import type { WidgetSurface } from "../../data/Widgets";

const props = withDefaults(defineProps<{
	surface: WidgetSurface;
	title?: string;
	description?: string;
}>(), {
	title: "Widgets",
	description: "",
});

const { widgetsForSurface } = useWidgets();

const visibleWidgets = computed(() => widgetsForSurface(props.surface));
</script>

<template>
	<section v-if="visibleWidgets.length" class="widget-deck" :class="`widget-deck--${surface}`" :aria-label="title">
		<header v-if="title || description" class="widget-deck__header">
			<div class="widget-deck__header-copy">
				<p v-if="description" class="widget-deck__description">{{ description }}</p>
				<h2 class="widget-deck__title">{{ title }}</h2>
			</div>
		</header>

		<div class="widget-deck__items">
			<component
				:is="widget.component"
				v-for="widget in visibleWidgets"
				:key="widget.id"
				:surface="surface"
				class="widget-deck__item" />
		</div>
	</section>
</template>

<style scoped>
.widget-deck {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.widget-deck__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-3);
}

.widget-deck__header-copy {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.widget-deck__title,
.widget-deck__description {
	margin: 0;
}

.widget-deck__title {
	font-family: var(--font-display);
	font-size: var(--text-lg);
	line-height: var(--line-tight);
	color: var(--color-ink);
}

.widget-deck__description {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.widget-deck__items {
	display: grid;
	gap: var(--space-3);
}

.widget-deck--desktop .widget-deck__items {
	grid-template-columns: minmax(0, 1fr);
}

.widget-deck--mobile .widget-deck__items {
	grid-template-columns: minmax(0, 1fr);
}

.widget-deck__item {
	min-width: 0;
}
</style>
