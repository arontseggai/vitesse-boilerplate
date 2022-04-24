import { acceptHMRUpdate, defineStore } from 'pinia'

interface Project {
  slug: string
}

export interface RootState {
  projects: Project[]
  ready: Boolean
}

export const projects = defineStore({
  id: 'projects',
  state: () => ({
    projects: [],
    ready: false,
  } as RootState),
  actions: {
    initialize() {
      this.projects = [{ slug: 'floep' }, { slug: 'flap' }]
      this.ready = true
    },
    findBySlug(slug: string) {
      return this.projects.find((project: Project) => project.slug === slug)
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(projects, import.meta.hot))
