import 'zone.js';
import { ApplicationRef, createComponent } from '@angular/core';
import { createApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// Framework-agnostic contract exposed over Module Federation.
//
// The host (React) can't render an Angular component directly, so instead of
// exposing a component we expose mount()/unmount(): the host hands us a DOM
// element, we bootstrap a full Angular application into it, and tear it down
// on cleanup. This is what makes the micro-frontend technology-agnostic.

let appRef: ApplicationRef | null = null;

export async function mount(el: HTMLElement): Promise<void> {
  // Bootstrap a standalone Angular application, then create the root component
  // directly into the host-provided element.
  const app = await createApplication();
  const componentRef = createComponent(AppComponent, {
    environmentInjector: app.injector,
    hostElement: el,
  });
  app.attachView(componentRef.hostView);
  appRef = app;
}

export function unmount(): void {
  appRef?.destroy();
  appRef = null;
}
