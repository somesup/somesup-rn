const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// CSS 파일 처리를 위한 설정
config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

module.exports = withNativeWind(config, { input: "./global.css" });
