import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// Standalone entry — used when running this remote on its own at :3004.
// (When embedded in the host, the exposed mount() function is used instead.)
bootstrapApplication(AppComponent).catch((err) => console.error(err));
