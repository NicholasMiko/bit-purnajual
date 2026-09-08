<template>
  <transition :name="transitionName" appear>
    <div v-if="show" class="fixed z-50" :class="[panelPosition, panelClass]">
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  show: boolean
  direction?: 'left' | 'right'
  panelClass?: string
}
 
const props = withDefaults(defineProps<Props>(), {
  direction: 'left',
  panelClass: '',
})

const transitionName = computed(() =>
    props.direction === 'right' ? 'slide-right' : 'slide-left'
);

const panelPosition = computed(() =>
    props.direction === 'right' ? 'right-0' : 'left-0'
);


</script>

<style scoped>
/*
slide-left dari name transition
menggunakan animasi bawaan vue
*-enter-from
*-enter-to
*-enter-active
*-leave-active
*-leave-from
*-leave-to
*/

/* ==== SLIDE DARI KIRI ==== */
.slide-left-enter-from { transform: translateX(-100%); opacity: 0; }
.slide-left-enter-to   { transform: translateX(0); opacity: 1; }
.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-leave-from { transform: translateX(0); opacity: 1; }
.slide-left-leave-to   { transform: translateX(-100%); opacity: 0; }

/* ==== SLIDE DARI KANAN ==== */
.slide-right-enter-from { transform: translateX(100%); opacity: 0; }
.slide-right-enter-to   { transform: translateX(0); opacity: 1; }
.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-right-leave-from { transform: translateX(0); opacity: 1; }
.slide-right-leave-to   { transform: translateX(100%); opacity: 0; }
</style>
