import { AxiosRequestConfig, AxiosResponse, default as axios } from "axios"
import { Config } from "../../app.config";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

let accessToken: string | null = null;
const ACCESS_TOKEN_KEY = "BinDay-AccessToken";

let on401Error: (() => void) | undefined = undefined;

export const httpClient = axios.create({
    baseURL: `${Config.baseApiUrl}`,
    timeout: 10000,
});

httpClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
    if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`
    }

    const token = await getFromStorage(ACCESS_TOKEN_KEY);

    if (token) {
        accessToken = token;

        if (config.headers) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
    }

    return config;
}, (error) => Promise.reject(error))

httpClient.interceptors.response.use(async (value: AxiosResponse) => {
    if (value.status === 401) {

        await deleteAccessToken();
        on401Error && on401Error();
    }

    return value;
}, (error) => Promise.reject(error))

const setAccessToken = async (token: string) => {
    accessToken = token;
    await saveToStorage(ACCESS_TOKEN_KEY, token)
    console.log("SET ACCESS TOKEN", accessToken)
}

const handle401Error = (cb: () => void) => {
    on401Error = cb;
}

const deleteAccessToken = async () => {
    accessToken = null;
    await deleteFromStorage(ACCESS_TOKEN_KEY);
}

export {
    setAccessToken,
    deleteAccessToken,
    handle401Error,
}

async function saveToStorage(key: string, value: string) {

    if (await SecureStore.isAvailableAsync()) {
        await SecureStore.setItemAsync(key, value);
    } else {
        await AsyncStorage.setItem(key, value)
    }
}

async function getFromStorage(key: string): Promise<string | null> {

    if (await SecureStore.isAvailableAsync()) {
        return await SecureStore.getItemAsync(key);
    } else {
        return await AsyncStorage.getItem(key)
    }
}

async function deleteFromStorage(key: string) {

    if (await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync(key);
    } else {
        await AsyncStorage.removeItem(key)
    }
}