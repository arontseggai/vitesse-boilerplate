<script setup lang="ts">
import { projects } from '~/stores/projects'

const props = defineProps<{ slug: string }>()

const projectsStore = projects()

const project = projectsStore.findBySlug(props.slug)
</script>

<template>
  <div v-if="project">
    <h2>
      {{ project.slug }}
    </h2>
  </div>
</template>
