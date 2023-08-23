import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.thedifference.trawenscore',
  appName: 'Trawen Score',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchFadeOutDuration:1000
    },
  },
};

export default config;
