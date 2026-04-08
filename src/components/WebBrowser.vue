<script setup lang="ts">
const props = defineProps<{
	url: string;
    isPdf: boolean;
    objectUrl?: string;
}>();

</script>


<template>
<div class="browser-window">
		<div class="browser-navigation-bar">
			<div class="browser-navigation buttons">
				<button class="browser-back-button"><-</button>
				<button class="browser-forward-button">-></button>
				<button class="browser-refresh-button">⟳</button>
				<button class="browser-home-button">🏠</button>
			</div>
			<div class="browser-navigation-address-bar">
				<input type="text" class="browser-url-input" :value="props.url" disabled />
			</div>
			<div class="browser-navigation-menu">
				<button class="browser-menu-button">☰</button>
			</div>
		</div>
		<div class="browser-content">
			<object :data="props.objectUrl || props.url" :type="props.isPdf ? 'application/pdf' : undefined" style="width: 100%; height: 100%">
				<p>
					Content not available.
					<a :href="props.objectUrl || props.url" target="_blank" rel="noopener">Open content</a>
				</p>
			</object>
		</div>
	</div>
</template>

<style scoped>
.browser-window {
	width: 100%;
	height: 100%;
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
}

.browser-navigation-bar {
	width: 100%;
	display: flex;
	align-items: space-between;
	padding: 8px;
	background-color: #f0f0f0;
	border-bottom: 1px solid #ccc;
	gap: 1rem;
}

.browser-navigation-address-bar {
	flex-grow: 1;

	input {
		width: 100%;
		padding: 4px 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
	}
}

.browser-content {
	flex-grow: 1;
	overflow: hidden;
}
</style>
