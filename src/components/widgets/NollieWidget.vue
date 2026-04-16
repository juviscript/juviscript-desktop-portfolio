<script setup lang="ts">
import { computed, ref } from "vue";
import WidgetCard from "./WidgetCard.vue";

const tips = [
	"Double-click desktop apps to open them quickly.",
	"Use the mobile home indicator to return home or open the switcher.",
	"Keep your contact form and projects easy to reach from both shells.",
];

const activeTipIndex = ref(0);

const activeTip = computed(() => tips[activeTipIndex.value]);

function nextTip() {
	activeTipIndex.value = (activeTipIndex.value + 1) % tips.length;
}
</script>

<template>
	<WidgetCard title="Nollie" subtitle="Corgi Companion" accent="gold">
		<div class="nollie-widget">
			<div class="nollie-widget__avatar" aria-hidden="true">
				<span class="nollie-widget__ear nollie-widget__ear--left"></span>
				<span class="nollie-widget__ear nollie-widget__ear--right"></span>
				<div class="nollie-widget__face">
					<div class="nollie-widget__eyes">
						<span></span>
						<span></span>
					</div>
					<span class="nollie-widget__nose"></span>
				</div>
			</div>

			<p class="nollie-widget__message">{{ activeTip }}</p>

			<div class="nollie-widget__footer">
				<span class="nollie-widget__tag">Helpful</span>
				<button class="nollie-widget__button" type="button" @click="nextTip">Another tip</button>
			</div>
		</div>
	</WidgetCard>
</template>

<style scoped>
.nollie-widget {
	display: flex;
	flex-direction: column;
	gap: var(--space-3);
}

.nollie-widget__avatar {
	position: relative;
	width: 6rem;
	height: 5.25rem;
	margin: 0 auto;
}

.nollie-widget__ear {
	position: absolute;
	top: 0;
	width: 1.5rem;
	height: 1.8rem;
	border-radius: 0.6rem 0.6rem 0.2rem 0.2rem;
	background: #c57b43;
}

.nollie-widget__ear--left {
	left: 0.7rem;
	transform: rotate(-22deg);
}

.nollie-widget__ear--right {
	right: 0.7rem;
	transform: rotate(22deg);
}

.nollie-widget__face {
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 4.8rem;
	height: 4rem;
	transform: translateX(-50%);
	border-radius: 1.8rem;
	background:
		radial-gradient(circle at 50% 74%, #fff8ed 0 0.9rem, transparent 0.92rem),
		linear-gradient(180deg, #f1b57d 0%, #d58a4d 100%);
	box-shadow:
		inset 0 -0.25rem 0 rgba(255, 255, 255, 0.18),
		0 0.7rem 1.2rem rgba(90, 61, 43, 0.12);
}

.nollie-widget__eyes {
	position: absolute;
	top: 1.35rem;
	left: 50%;
	display: flex;
	gap: 1.1rem;
	transform: translateX(-50%);
}

.nollie-widget__eyes span,
.nollie-widget__nose {
	display: block;
	background: var(--color-ink);
}

.nollie-widget__eyes span {
	width: 0.28rem;
	height: 0.52rem;
	border-radius: 999px;
}

.nollie-widget__nose {
	position: absolute;
	left: 50%;
	bottom: 0.95rem;
	width: 0.55rem;
	height: 0.4rem;
	transform: translateX(-50%);
	border-radius: 999px;
}

.nollie-widget__message {
	margin: 0;
	font-size: var(--text-sm);
	line-height: var(--line-loose);
	color: var(--color-ink);
}

.nollie-widget__footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--space-2);
}

.nollie-widget__tag {
	font-family: var(--font-chrome);
	font-size: var(--text-2xs);
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--color-ink-soft);
}

.nollie-widget__button {
	min-height: 2rem;
	padding: 0.35rem 0.8rem;
	border: var(--border-thin) solid rgba(90, 61, 43, 0.12);
	border-radius: var(--radius-pill);
	background: rgba(255, 255, 255, 0.78);
	color: var(--color-ink);
	font-size: var(--text-2xs);
	font-weight: 700;
	cursor: pointer;
}
</style>
