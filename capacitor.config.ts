import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.orbit.tv',
  appName: 'Orbit TV',
  webDir: 'out',
  server: {
    // We point this directly to your DigitalOcean deployment
    url: 'https://sea-turtle-app-kascl.ondigitalocean.app/',
    // This allows the app to communicate with your local video server
    allowNavigation: ['172.28.28.10'],
    cleartext: true
  },
  android: {
    // This CRITICAL setting bypasses the "Mixed Content" security block
    allowMixedContent: true
  }
};

export default config;
