<script setup lang="ts">
import { ref } from "vue";
import BootSequence from "./components/BootSequence.vue";
import Desktop from "./components/Desktop.vue";

const bootComplete = ref(false);

const handleBootComplete = () => {
	bootComplete.value = true;
};
</script>

<template>
	<div class="monitor-frame">
		<div class="app">
			<BootSequence v-if="!bootComplete" @complete="handleBootComplete" />
			<Desktop v-if="bootComplete" />
		</div>
	</div>
</template>

<style scoped>
.monitor-frame {
  width: min(calc(100vw - 48px), 1880px, calc((100vh - 48px) * 16 / 9));
  aspect-ratio: 16 / 9;
  padding: 22px;
  border-radius: 24px;
  background:
    linear-gradient(145deg, #6a4a35 0%, #4a3224 45%, #2f2119 100%);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    inset 2px 2px 0 rgba(255, 236, 180, 0.18),
    inset -3px -3px 0 rgba(0, 0, 0, 0.28);
  position: relative;
}

.monitor-frame::before {
  content: "";
  position: absolute;
  inset: 14px;
  border-radius: 16px;
  border: 2px solid rgba(255, 236, 180, 0.22);
  pointer-events: none;
}

.app {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #75c8ae;
  box-shadow:
    inset 0 0 0 2px rgba(90, 61, 43, 0.45),
    inset 0 0 40px rgba(255, 236, 180, 0.08);
}

.app::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.12) 100%);
  pointer-events: none;
  z-index: 20;
}

.app::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.03) 0,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px,
      transparent 3px
    );
  opacity: 0.18;
  pointer-events: none;
  mix-blend-mode: soft-light;
  z-index: 21;
}

</style>
