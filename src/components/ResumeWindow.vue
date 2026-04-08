<script setup lang="ts">
import resumePdf from "../assets/Juvilane Panaguiton - Resume (June 2025).pdf";
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
				<input type="text" class="browser-url-input" value="https://www.juviscript.dev/resume" disabled />
			</div>
			<div class="browser-navigation-menu">
				<button class="browser-menu-button">☰</button>
			</div>
		</div>
		<div class="resume-window">
			<object :data="resumePdf" type="application/pdf" style="width: 100%; height: 100%">
				<p>
					PDF preview not available.
					<a :href="resumePdf" target="_blank" rel="noopener">Open resume</a>
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

.resume-window {
	flex-grow: 1;
	overflow: hidden;
}
</style>
