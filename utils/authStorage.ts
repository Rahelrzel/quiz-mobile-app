import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAuthToken = async (token: string) => {
  await AsyncStorage.setItem("auth_token", token);
};
