import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
}

enableMocking().then(() => {
  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
})
