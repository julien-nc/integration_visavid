import { createApp } from 'vue'
import App from './App.vue'

document.addEventListener('DOMContentLoaded', (event) => {
	const app = createApp(App)
	app.mixin({ methods: { t, n } })
	app.mount('#content')
})
