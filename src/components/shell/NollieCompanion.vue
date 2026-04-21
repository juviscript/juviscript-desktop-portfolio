<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{
	surface?: "desktop" | "mobile";
	gifSrc?: string;
}>(), {
	surface: "desktop",
	gifSrc: "",
});

const desktopTips = [
	"Double-click desktop apps to open them quickly.",
	"The taskbar lets you swap between open windows.",
	"Projects and certifications are the fastest way to scan the portfolio.",
];

const mobileTips = [
	"Use the bottom toolbar to go Home or open recent Apps.",
	"Projects open with a single tap on mobile.",
	"Contact is the quickest way to send a note without leaving jsOS.",
];

const isBubbleVisible = ref(false);
const activeTipIndex = ref(0);

const tips = computed(() => (props.surface === "mobile" ? mobileTips : desktopTips));
const currentTip = computed(() => tips.value[activeTipIndex.value] ?? tips.value[0] ?? "");

function handleMascotPress() {
	if (!isBubbleVisible.value) {
		isBubbleVisible.value = true;
		return;
	}

	activeTipIndex.value = (activeTipIndex.value + 1) % tips.value.length;
}

function dismissBubble() {
	isBubbleVisible.value = false;
}
</script>

<template>
	<aside class="nollie-companion" :class="`nollie-companion--${surface}`" aria-label="Nollie companion">
		<transition name="nollie-bubble">
			<div v-if="isBubbleVisible" class="nollie-companion__bubble" role="status" aria-live="polite">
				<div class="nollie-companion__bubble-copy">
					<p class="nollie-companion__bubble-name">Nollie</p>
					<p class="nollie-companion__bubble-message">{{ currentTip }}</p>
				</div>
				<button class="nollie-companion__bubble-close" type="button" aria-label="Dismiss Nollie tip" @click="dismissBubble">
					×
				</button>
			</div>
		</transition>

		<button
			class="nollie-companion__button"
			type="button"
			:aria-label="isBubbleVisible ? 'Show another Nollie tip' : 'Show Nollie tip'"
			@click="handleMascotPress">
			<img v-if="gifSrc" class="nollie-companion__gif" :src="gifSrc" alt="" aria-hidden="true" />
			<div v-else class="nollie-companion__placeholder" aria-hidden="true">
				<span class="nollie-companion__tail"></span>
				<span class="nollie-companion__body"></span>
				<span class="nollie-companion__paw nollie-companion__paw--front"></span>
				<span class="nollie-companion__paw nollie-companion__paw--back"></span>
				<span class="nollie-companion__face">
					<span class="nollie-companion__ear nollie-companion__ear--left"></span>
					<span class="nollie-companion__ear nollie-companion__ear--right"></span>
					<span class="nollie-companion__eye nollie-companion__eye--left"></span>
					<span class="nollie-companion__eye nollie-companion__eye--right"></span>
					<span class="nollie-companion__nose"></span>
				</span>
			</div>
		</button>
	</aside>
</template>

<style scoped>
.nollie-companion {
	position: absolute;
	display: flex;
	flex-direction: column;
	gap: var(--space-2);
	z-index: 2;
}

.nollie-companion--desktop {
	left: var(--space-5);
	bottom: 6.5rem;
	max-width: 14rem;
}

.nollie-companion--mobile {
	right: var(--space-3);
	bottom: calc(6.25rem + env(safe-area-inset-bottom));
	max-width: 11rem;
}

.nollie-companion__bubble {
	position: relative;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: var(--space-2);
	padding: 0.8rem 0.9rem;
	border-radius: 1rem;
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.18)),
		rgba(255, 249, 241, 0.96);
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	box-shadow: var(--shadow-card);
}

.nollie-companion__bubble::after {
	content: "";
	position: absolute;
	left: 1.5rem;
	bottom: -0.45rem;
	width: 0.9rem;
	height: 0.9rem;
	background: rgba(255, 249, 241, 0.96);
	border-right: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-bottom: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	transform: rotate(45deg);
}

.nollie-companion__bubble-copy {
	display: flex;
	flex-direction: column;
	gap: var(--space-1);
}

.nollie-companion__bubble-name,
.nollie-companion__bubble-message {
	margin: 0;
}

.nollie-companion__bubble-name {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.nollie-companion__bubble-message {
	font-size: var(--text-xs);
	line-height: var(--line-loose);
	color: var(--color-ink);
}

.nollie-companion__bubble-close {
	display: inline-grid;
	place-items: center;
	width: 1.6rem;
	height: 1.6rem;
	padding: 0;
	border: none;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.55);
	color: var(--color-ink-soft);
	font-size: 1rem;
	cursor: pointer;
	flex: 0 0 auto;
}

.nollie-companion__button {
	align-self: flex-start;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
}

.nollie-companion__button:focus-visible {
	outline: none;
}

.nollie-companion__button:focus-visible .nollie-companion__placeholder,
.nollie-companion__button:focus-visible .nollie-companion__gif {
	box-shadow:
		0 0 0 0.18rem rgba(222, 107, 72, 0.18),
		0 1rem 1.6rem rgba(90, 61, 43, 0.18);
}

.nollie-companion__gif {
	display: block;
	width: 8rem;
	height: auto;
	object-fit: contain;
	filter: drop-shadow(0 1rem 1.4rem rgba(90, 61, 43, 0.18));
}

.nollie-companion__placeholder {
	position: relative;
	display: block;
	width: 8rem;
	height: 4.7rem;
	filter: drop-shadow(0 0.9rem 1.2rem rgba(90, 61, 43, 0.18));
	transition: transform 140ms ease;
}

.nollie-companion__button:hover .nollie-companion__placeholder,
.nollie-companion__button:hover .nollie-companion__gif {
	transform: translateY(-0.0625rem);
}

.nollie-companion__body,
.nollie-companion__face,
.nollie-companion__paw,
.nollie-companion__tail {
	position: absolute;
	display: block;
}

.nollie-companion__body {
	left: 1.1rem;
	right: 1.7rem;
	bottom: 0.85rem;
	height: 2.45rem;
	border-radius: 1.45rem 1.75rem 1.5rem 1.1rem;
	background:
		radial-gradient(circle at 68% 62%, rgba(255, 248, 237, 0.98) 0 0.9rem, transparent 0.94rem),
		linear-gradient(180deg, #f3bf8a 0%, #d5884d 100%);
}

.nollie-companion__tail {
	right: 0.65rem;
	bottom: 1.7rem;
	width: 1.25rem;
	height: 0.55rem;
	border-radius: 999px;
	background: #c6763e;
	transform: rotate(18deg);
}

.nollie-companion__paw {
	bottom: 0.4rem;
	width: 1.4rem;
	height: 0.65rem;
	border-radius: 999px;
	background: #f7ead6;
}

.nollie-companion__paw--front {
	left: 2.3rem;
}

.nollie-companion__paw--back {
	right: 2.2rem;
}

.nollie-companion__face {
	left: 0.2rem;
	bottom: 1.15rem;
	width: 2.95rem;
	height: 2.55rem;
	border-radius: 1.4rem;
	background:
		radial-gradient(circle at 50% 74%, #fff8ed 0 0.78rem, transparent 0.8rem),
		linear-gradient(180deg, #f0b47b 0%, #d98749 100%);
	box-shadow: inset 0 -0.15rem 0 rgba(255, 255, 255, 0.18);
}

.nollie-companion__ear {
	position: absolute;
	top: -0.48rem;
	width: 0.78rem;
	height: 1rem;
	border-radius: 0.45rem 0.45rem 0.15rem 0.15rem;
	background: #bd6f39;
}

.nollie-companion__ear--left {
	left: 0.5rem;
	transform: rotate(-20deg);
}

.nollie-companion__ear--right {
	right: 0.5rem;
	transform: rotate(18deg);
}

.nollie-companion__eye,
.nollie-companion__nose {
	position: absolute;
	display: block;
	background: var(--color-ink);
}

.nollie-companion__eye {
	top: 1rem;
	width: 0.18rem;
	height: 0.34rem;
	border-radius: 999px;
}

.nollie-companion__eye--left {
	left: 1rem;
}

.nollie-companion__eye--right {
	right: 1rem;
}

.nollie-companion__nose {
	left: 50%;
	bottom: 0.58rem;
	width: 0.42rem;
	height: 0.28rem;
	transform: translateX(-50%);
	border-radius: 999px;
}

.nollie-bubble-enter-active,
.nollie-bubble-leave-active {
	transition:
		opacity 160ms ease,
		transform 160ms ease;
}

.nollie-bubble-enter-from,
.nollie-bubble-leave-to {
	opacity: 0;
	transform: translateY(0.35rem);
}

@media (max-width: 48rem) {
	.nollie-companion--mobile .nollie-companion__placeholder,
	.nollie-companion--mobile .nollie-companion__gif {
		width: 6.3rem;
	}

	.nollie-companion--mobile .nollie-companion__bubble {
		padding: 0.7rem 0.8rem;
	}
}
</style>
