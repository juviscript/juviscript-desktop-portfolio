<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import nollieSpriteSheet from "../../assets/nollie-sprite-sheet.png";

const props = withDefaults(defineProps<{
	surface?: "desktop" | "mobile";
	spriteSheetSrc?: string;
}>(), {
	surface: "desktop",
	spriteSheetSrc: "",
});

const FRAME_SIZE = 256;
const SPRITE_COLUMNS = 12;
const SPRITE_ROWS = 6;
const INACTIVITY_TIMEOUT_MS = 12000;
const RANDOM_BEHAVIOR_INTERVAL_MS = 3600;

const animations = {
	idle: { row: 0, frames: [0, 1, 2, 3, 4, 5], speed: 220, loop: true },
	blink: { row: 1, frames: [0, 1, 2, 3, 4, 5], speed: 90, loop: false },
	look: { row: 2, frames: [0, 1, 2, 3, 4, 5], speed: 140, loop: false },
	tilt: { row: 3, frames: [0, 1, 2, 3, 4, 5], speed: 140, loop: false },
	sleep: { row: 4, frames: [0, 1, 2, 3, 4, 5], speed: 240, loop: true },
	spin: { row: 5, frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], speed: 90, loop: false },
} as const;

type AnimationName = keyof typeof animations;

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

const currentAnimationName = ref<AnimationName>("idle");
const currentFrameIndex = ref(0);
const isBubbleVisible = ref(false);
const activeTipIndex = ref(0);
const isSleeping = ref(false);

const spriteTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null);
const randomBehaviorIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
const inactivityTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null);

const spriteSheetUrl = computed(() => props.spriteSheetSrc || nollieSpriteSheet);
const frameDisplaySize = computed(() => (props.surface === "mobile" ? 6 : 8));
const frameDisplayScale = computed(() => (frameDisplaySize.value * 16) / FRAME_SIZE);
const tips = computed(() => (props.surface === "mobile" ? mobileTips : desktopTips));
const currentTip = computed(() => tips.value[activeTipIndex.value] ?? tips.value[0] ?? "");
const currentAnimation = computed(() => animations[currentAnimationName.value]);

const spriteStyle = computed(() => {
	const frame = currentAnimation.value.frames[currentFrameIndex.value] ?? 0;
	const row = currentAnimation.value.row;
	const x = -(frame * FRAME_SIZE);
	const y = -(row * FRAME_SIZE);

	return {
		width: `${FRAME_SIZE}px`,
		height: `${FRAME_SIZE}px`,
		backgroundImage: `url(${spriteSheetUrl.value})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: `${x}px ${y}px`,
		transform: `scale(${frameDisplayScale.value})`,
		transformOrigin: "top left",
	};
});

function clearSpriteTimeout() {
	if (!spriteTimeoutId.value) {
		return;
	}

	clearTimeout(spriteTimeoutId.value);
	spriteTimeoutId.value = null;
}

function scheduleNextFrame() {
	clearSpriteTimeout();

	spriteTimeoutId.value = setTimeout(() => {
		const nextFrameIndex = currentFrameIndex.value + 1;

		if (nextFrameIndex >= currentAnimation.value.frames.length) {
			if (currentAnimation.value.loop) {
				currentFrameIndex.value = 0;
				scheduleNextFrame();
				return;
			}

			playAnimation(isSleeping.value ? "sleep" : "idle");
			return;
		}

		currentFrameIndex.value = nextFrameIndex;
		scheduleNextFrame();
	}, currentAnimation.value.speed);
}

function playAnimation(name: AnimationName) {
	currentAnimationName.value = name;
	currentFrameIndex.value = 0;
	scheduleNextFrame();
}

function randomBehavior() {
	if (isSleeping.value || currentAnimationName.value !== "idle") {
		return;
	}

	const roll = Math.random();

	if (roll < 0.55) {
		playAnimation("idle");
		return;
	}

	if (roll < 0.72) {
		playAnimation("look");
		return;
	}

	if (roll < 0.88) {
		playAnimation("tilt");
		return;
	}

	playAnimation("blink");
}

function scheduleSleepTimer() {
	if (inactivityTimeoutId.value) {
		clearTimeout(inactivityTimeoutId.value);
	}

	inactivityTimeoutId.value = setTimeout(() => {
		isSleeping.value = true;
		playAnimation("sleep");
	}, INACTIVITY_TIMEOUT_MS);
}

function resetInactivity() {
	const wasSleeping = isSleeping.value;
	isSleeping.value = false;

	if (wasSleeping && currentAnimationName.value === "sleep") {
		playAnimation("idle");
	}

	scheduleSleepTimer();
}

function handleMascotPress() {
	resetInactivity();

	if (!isBubbleVisible.value) {
		isBubbleVisible.value = true;
		playAnimation("spin");
		return;
	}

	activeTipIndex.value = (activeTipIndex.value + 1) % tips.value.length;
	playAnimation("spin");
}

function dismissBubble() {
	isBubbleVisible.value = false;
}

onMounted(() => {
	playAnimation("idle");
	scheduleSleepTimer();

	randomBehaviorIntervalId.value = setInterval(randomBehavior, RANDOM_BEHAVIOR_INTERVAL_MS);

	window.addEventListener("pointermove", resetInactivity, { passive: true });
	window.addEventListener("pointerdown", resetInactivity, { passive: true });
	window.addEventListener("keydown", resetInactivity);
});

onBeforeUnmount(() => {
	clearSpriteTimeout();

	if (randomBehaviorIntervalId.value) {
		clearInterval(randomBehaviorIntervalId.value);
	}

	if (inactivityTimeoutId.value) {
		clearTimeout(inactivityTimeoutId.value);
	}

	window.removeEventListener("pointermove", resetInactivity);
	window.removeEventListener("pointerdown", resetInactivity);
	window.removeEventListener("keydown", resetInactivity);
});
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
					x
				</button>
			</div>
		</transition>

		<button
			class="nollie-companion__button"
			type="button"
			:aria-label="isBubbleVisible ? 'Show another Nollie tip' : 'Show Nollie tip'"
			@click="handleMascotPress">
			<div class="nollie-companion__sprite-frame" :style="{ width: `${frameDisplaySize}rem`, height: `${frameDisplaySize}rem` }" aria-hidden="true">
				<div class="nollie-companion__sprite" :style="spriteStyle"></div>
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
	font-size: 0.9rem;
	font-weight: 700;
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

.nollie-companion__button:focus-visible .nollie-companion__sprite-frame {
	box-shadow:
		0 0 0 0.18rem rgba(222, 107, 72, 0.18),
		0 1rem 1.6rem rgba(90, 61, 43, 0.18);
}

.nollie-companion__button:hover .nollie-companion__sprite-frame {
	transform: translateY(-0.0625rem);
}

.nollie-companion__sprite-frame {
	position: relative;
	overflow: hidden;
	transition: transform 140ms ease, box-shadow 140ms ease;
}

.nollie-companion__sprite {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	filter: drop-shadow(0 0.9rem 1.2rem rgba(90, 61, 43, 0.18));
	transition: filter 140ms ease;
	image-rendering: auto;
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
</style>
