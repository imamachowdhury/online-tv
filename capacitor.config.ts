import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.orbit.tv',
  appName: 'Orbit TV',
  webDir: 'out',
  server: {
    // We removed the remote 'url' so the app loads from the built-in assets
    // This allows the app to communicate with your local video server
    allowNavigation: ['172.28.28.10'],
    cleartext: true
  },
  android: {
    // This setting bypasses the "Mixed Content" security block
    allowMixedContent: true
  }
};

export default config;
