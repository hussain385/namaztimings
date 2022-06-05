import { ConfigContext, ExpoConfig } from "@expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Namaz Timings",
  slug: "NamazTimings",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/icon.jpeg",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  plugins: ["@react-native-firebase/app", "expo-location", "expo-image-picker"],
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.jpeg",
      backgroundColor: "#008000",
    },
    package: "com.namaztimings",
    googleServicesFile: "./google-services.json",
    jsEngine: "hermes",
    config: {
      googleMaps: {
        apiKey: "AIzaSyCrsNBX-pWunuPeL-ziP99aXhetdZL2VKs",
      },
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
})
