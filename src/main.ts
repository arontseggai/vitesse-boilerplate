import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import { createPinia } from 'pinia'
import { projects } from './stores/projects'
import App from './App.vue'
import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    const { app, router, initialState } = ctx

    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).forEach(i => i.install?.(ctx))

    const pinia = createPinia()
    app.use(pinia)

    if (import.meta.env.SSR)
      initialState.pinia = pinia.state.value
    else
      pinia.state.value = initialState.pinia || {}

    router.beforeEach((to, from, next) => {
      const store = projects(pinia)
      if (!store.ready)
        // perform the (user-implemented) store action to fill the store's state
        store.initialize()
      next()
    })
  },
)

export async function includedRoutes(paths, routes) {
  // https://github.com/antfu/vite-ssg#custom-routes-to-render

  // Sensitive key is managed by Vite - this would not be available inside
  // vite.config.js as it runs before the environment has been populated.
  // const apiClient = new MyApiClient(import.meta.env.MY_API_KEY)

  return Promise.all(
    routes.flatMap((route) => {
      return route?.children[0]?.name === 'hi-slug'
        ? ['aron', 'miep', 'floep'].map(slug => `/hi/${slug}`)
        : route.path
    }),
  )
}
