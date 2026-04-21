import { reactive } from "vue";
import { widgets, type WidgetDefinition, type WidgetSurface } from "../data/Widgets";

type WidgetSurfaceState = {
	hiddenWidgetIds: string[];
};

const widgetState = reactive<Record<WidgetSurface, WidgetSurfaceState>>({
	desktop: {
		hiddenWidgetIds: [],
	},
	mobile: {
		hiddenWidgetIds: [],
	},
});

function widgetsForSurface(surface: WidgetSurface): WidgetDefinition[] {
	return widgets
		.filter(widget => widget.surfaces.includes(surface) && !widgetState[surface].hiddenWidgetIds.includes(widget.id))
		.sort((firstWidget, secondWidget) => firstWidget.order - secondWidget.order);
}

function hideWidget(surface: WidgetSurface, id: string) {
	if (widgetState[surface].hiddenWidgetIds.includes(id)) {
		return;
	}

	widgetState[surface].hiddenWidgetIds.push(id);
}

function showAllWidgets(surface?: WidgetSurface) {
	if (surface) {
		widgetState[surface].hiddenWidgetIds = [];
		return;
	}

	widgetState.desktop.hiddenWidgetIds = [];
	widgetState.mobile.hiddenWidgetIds = [];
}

export function useWidgets() {
	return {
		widgetState,
		widgetsForSurface,
		hideWidget,
		showAllWidgets,
	};
}
