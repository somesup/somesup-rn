const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// CSS 파일 처리를 위한 설정
config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

// Alias 설정
config.resolver.alias = {
  "@": path.resolve(__dirname, "./"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
