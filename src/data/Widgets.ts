import type { Component } from "vue";
import MusicWidget from "../components/widgets/MusicWidget.vue";

export type WidgetSurface = "desktop" | "mobile";

export type WidgetDefinition = {
	id: string;
	label: string;
	component: Component;
	surfaces: WidgetSurface[];
	order: number;
};

export const widgets: WidgetDefinition[] = [
	{
		id: "music",
		label: "Now Playing",
		component: MusicWidget,
		surfaces: ["desktop", "mobile"],
		order: 1,
	},
];
