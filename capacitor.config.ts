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
      launchShowDuration: 2000,
      launchFadeOutDuration:2000
    },
  },
};

export default config;
