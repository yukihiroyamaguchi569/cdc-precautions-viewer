import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// Restore theme before mount to avoid a flash of the wrong color scheme.
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (stored === 'dark' || (stored === null && prefersDark)) {
  document.documentElement.classList.add('dark');
}

createApp(App).mount('#app');
