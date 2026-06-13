import { createApp } from 'vue';
import type { App as VueApp } from 'vue';
import App from './App.vue';

let app: VueApp | null = null;
let cssLoadPromise: Promise<void> | null = null;

// Load CSS from remote's index.html by parsing it for link tags
async function loadRemoteCSS() {
  if (cssLoadPromise) return cssLoadPromise;
  
  cssLoadPromise = (async () => {
    try {
      // Fetch the remote's index.html to find the CSS file path
      const response = await fetch('http://localhost:3003/index.html');
      const html = await response.text();
      
      // Extract CSS file paths from <link> tags
      const linkMatches = html.match(/<link[^>]*href=["']([^"']*\.css)["']/g);
      if (linkMatches) {
        for (const linkMatch of linkMatches) {
          const href = linkMatch.match(/href=["']([^"']*\.css)["']/)?.[1];
          if (href && !document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            // Convert relative path to absolute URL
            if (href.startsWith('/')) {
              link.href = `http://localhost:3003${href}`;
            } else {
              link.href = `http://localhost:3003/${href}`;
            }
            document.head.appendChild(link);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load CSS from Vue remote:', error);
    }
  })();
  
  return cssLoadPromise;
}

export function mount(el: HTMLElement) {
  if (app) return;
  // Mark the host-provided container so remote-global styles target it
  el.classList.add('billing-vue-remote-root');
  
  // Inject CSS when mounted in host context (Module Federation)
  loadRemoteCSS();
  
  app = createApp(App);
  app.mount(el);
}

export function unmount() {
  app?.unmount();
  // Clean up the class applied to the host container
  const root = document.querySelector('.billing-vue-remote-root');
  if (root) root.classList.remove('billing-vue-remote-root');
  app = null;
}
