import { createApp } from 'vue';
import App from './App.vue';

const rootEl = document.getElementById('root');
if (rootEl) {
  const app = createApp(App);
  app.mount(rootEl);
}
