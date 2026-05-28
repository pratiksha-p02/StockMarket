// export { AppServerModule as default } from './app/app.module.server';
import { bootstrapApplication } from '@angular/platform-browser';
import * as fs from 'fs';
import * as path from 'path';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const appConfig = {
    ...config,
    providers: [
      // Example of adding a provider for configuration
      { provide: 'APP_CONFIG', useValue: config },
      // Add any additional providers your application might need here
    ],
  };
const bootstrap = 
    () => bootstrapApplication(AppComponent, {
        providers: appConfig.providers,
      });

// --------------------------------------
/**
 * Section used to mock window object on server side, 
 * as it is not available
 *
 * preventing the error:
 * - Cannot read properties of undefined 
 *  (reading 'Core/Chart/Chart.js')
 */
const domino = require('domino');

const template = fs
  .readFileSync(
    path.join('frontend/dist/frontend/browser', 'index.html')
  )
  .toString();

const window = domino.createWindow(template);
(global as any).window = window;
(global as any).document = window.document;

// --------------------------------------

export default bootstrap;