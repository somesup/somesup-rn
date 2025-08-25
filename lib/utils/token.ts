import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async (name: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(name);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const setToken = async (name: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(name, value);
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const removeToken = async (name: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const getTokenExpiry = (token: string): number | null => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp;
  } catch (error) {
    return null;
  }
};

export const isRefreshTokenExpired = async (): Promise<boolean> => {
  const refreshToken = await getToken("refreshToken");
  if (!refreshToken) return true;

  const expiry = getTokenExpiry(refreshToken);
  if (!expiry) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= expiry;
};

export const clearExpiredTokens = async (): Promise<void> => {
  const refreshExpired = await isRefreshTokenExpired();

  if (refreshExpired) {
    await removeToken("accessToken");
    await removeToken("refreshToken");
  }
};

export const setTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  await setToken("accessToken", accessToken);
  await setToken("refreshToken", refreshToken);
};
