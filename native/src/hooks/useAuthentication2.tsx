// import * as AuthSession from "expo-auth-session";
// import { useCallback, useEffect, useState } from "react";
// import { Platform } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as SecureStore from 'expo-secure-store';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as jose from "jose"

// if (Platform.OS == "web") {
//     WebBrowser.maybeCompleteAuthSession();
// }

// const auth0ClientId = "My3U7DhnHSn08euQfWl6UCgQaftcK0ng";
// const authorizationEndpoint = "https://dev-ver23ej7ohjledpv.us.auth0.com/authorize";
// const revocationEndpoint = "https://dev-ver23ej7ohjledpv.us.auth0.com/oauth/revoke";
// const tokenEndpoint = "https://dev-ver23ej7ohjledpv.us.auth0.com/oauth/token";

// const useProxy = Platform.select({ web: false, default: true });
// const redirectUri = AuthSession.makeRedirectUri({ useProxy });

// const ACCESS_TOKEN_STORAGE_KEY = 'BIN_DAY_ACCESS_TOKEN';
// const REFRESH_TOKEN_STORAGE_KEY = 'BIN_DAY_REFRESH_TOKEN';
// const ID_TOKEN_STORAGE_KEY = 'BIN_DAY_ID_TOKEN';


// async function saveToStorage(key: string, value: string) {

//     if (await SecureStore.isAvailableAsync()) {
//         await SecureStore.setItemAsync(key, value);
//     } else {
//         await AsyncStorage.setItem(key, value)
//     }
// }

// async function getFromStorage(key: string): Promise<string | null> {

//     if (await SecureStore.isAvailableAsync()) {
//         return await SecureStore.getItemAsync(key);
//     } else {
//         return await AsyncStorage.getItem(key)
//     }
// }

// async function deleteFromStorage(key: string) {

//     if (await SecureStore.isAvailableAsync()) {
//         await SecureStore.deleteItemAsync(key);
//     } else {
//         await AsyncStorage.removeItem(key)
//     }
// }


// export const useAuthentication = () => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [error, setError] = useState<AuthSession.AuthError | null>();

//     const [request, result, promptAsync] = AuthSession.useAuthRequest(
//         {
//             redirectUri,
//             clientId: auth0ClientId,
//             responseType: "code",
//             scopes: ["openid", "profile", "offline_access"],
//             extraParams: {
//                 audience: "https://mulchron.com/bin-day",
//             },
//         },
//         { authorizationEndpoint }
//     );

//     // Auto login if token in in storage
//     useEffect(() => {
//         (async () => {
//             const accessToken = await getFromStorage(ACCESS_TOKEN_STORAGE_KEY)

//             if (!accessToken) {
//                 return null;
//             }

//             const decodedAccessToken = jose.decodeJwt(accessToken);

//             if (!decodedAccessToken?.exp || Date.now() >= decodedAccessToken.exp * 1000) {
//                 // TOKEN EXPIRED
//                 deleteFromStorage(ACCESS_TOKEN_STORAGE_KEY);
//                 deleteFromStorage(ID_TOKEN_STORAGE_KEY);

//                 try { 
//                     const refreshToken = await getFromStorage(REFRESH_TOKEN_STORAGE_KEY);
//                     if(!refreshToken) {
//                         return null;
//                     }

//                     const tokenResponse = await AuthSession.refreshAsync({
//                         clientId: auth0ClientId,
//                         refreshToken: refreshToken
//                     }, { tokenEndpoint });

//                     tokenResponse?.accessToken && saveToStorage(ACCESS_TOKEN_STORAGE_KEY, tokenResponse?.accessToken);
//                     tokenResponse?.refreshToken && saveToStorage(REFRESH_TOKEN_STORAGE_KEY, tokenResponse?.refreshToken);
//                     tokenResponse?.idToken && saveToStorage(ID_TOKEN_STORAGE_KEY, tokenResponse?.idToken);

//                     setIsAuthenticated(true);
//                 } catch(e) {

//                     deleteFromStorage(REFRESH_TOKEN_STORAGE_KEY);
//                 }

//                 return null;
//             } else {

//                 setIsAuthenticated(true);
//             }
//         })();
//     }, [])

//     useEffect(() => {
//         (async () => {
//             if (result) {
//                 if (result.type === "error") {
//                     setIsAuthenticated(false);
//                     setError(result.error)
//                 }
//                 if (result.type === "success") {
//                     setError(undefined);

//                     const code = result?.params.code;
//                     const tokenResponse = await AuthSession.exchangeCodeAsync({
//                         code,
//                         clientId: auth0ClientId,
//                         redirectUri,
//                         extraParams: {
//                             ...(request ? { code_verifier: request?.codeVerifier } : {})
//                         }
//                     }, { tokenEndpoint })

//                     console.log("AccessToken", tokenResponse?.accessToken)
//                     console.log("refreshToken", tokenResponse?.refreshToken)
//                     console.log("idToken", tokenResponse?.idToken)

//                     tokenResponse?.accessToken && saveToStorage(ACCESS_TOKEN_STORAGE_KEY, tokenResponse?.accessToken);
//                     tokenResponse?.refreshToken && saveToStorage(REFRESH_TOKEN_STORAGE_KEY, tokenResponse?.refreshToken);
//                     tokenResponse?.idToken && saveToStorage(ID_TOKEN_STORAGE_KEY, tokenResponse?.idToken);

//                     setIsAuthenticated(true);
//                 }
//             }
//         })();
//     }, [result]);

//     const loginUser = useCallback(async () => {

    
//     }, [])

//     const logoutUser = useCallback(async () => {
//         const token = await getFromStorage(ACCESS_TOKEN_STORAGE_KEY)

//         if (token) {
//             try {
//                 AuthSession.revokeAsync({ token }, { revocationEndpoint });
//             } catch(e) {
//                 console.log("Failed to revoke token", e)
//             }

//             deleteFromStorage(ACCESS_TOKEN_STORAGE_KEY);
//             deleteFromStorage(ID_TOKEN_STORAGE_KEY);
//             deleteFromStorage(REFRESH_TOKEN_STORAGE_KEY);
//         }

//         setIsAuthenticated(false)
//     }, [])

//     const getAccessToken = useCallback(async () => {

//         if (isAuthenticated) {
//             let accessToken = await getFromStorage(ACCESS_TOKEN_STORAGE_KEY);

//             if(!accessToken) {
//                 setIsAuthenticated(false);
//                 return null;
//             }

//             const decodedAccessToken = jose.decodeJwt(accessToken);

//             // If it is due to expire in 1 hour get new token
//             if (!decodedAccessToken?.exp || (Date.now() + 3600000) >= decodedAccessToken.exp * 1000) {
//                 // TOKEN EXPIRED
//                 deleteFromStorage(ACCESS_TOKEN_STORAGE_KEY);
//                 deleteFromStorage(ID_TOKEN_STORAGE_KEY);

//                 try { 
//                     const refreshToken = await getFromStorage(REFRESH_TOKEN_STORAGE_KEY);
//                     if(!refreshToken) {
//                         return null;
//                     }

//                     const tokenResponse = await AuthSession.refreshAsync({
//                         clientId: auth0ClientId,
//                         refreshToken: refreshToken
//                     }, { tokenEndpoint });

//                     tokenResponse?.accessToken && saveToStorage(ACCESS_TOKEN_STORAGE_KEY, tokenResponse?.accessToken);
//                     tokenResponse?.refreshToken && saveToStorage(REFRESH_TOKEN_STORAGE_KEY, tokenResponse?.refreshToken);
//                     tokenResponse?.idToken && saveToStorage(ID_TOKEN_STORAGE_KEY, tokenResponse?.idToken);

//                     setIsAuthenticated(true);
//                     return tokenResponse?.accessToken;
//                 } catch(e) {
//                     deleteFromStorage(REFRESH_TOKEN_STORAGE_KEY);
//                     setIsAuthenticated(false);
//                 }

//                 return null;
//             }


//             return accessToken;
//         } else {
//             console.log("WHAT TO DO HERE??")
//             // promptAsync({ useProxy })
//             return null;
//         }
//     }, [isAuthenticated, setIsAuthenticated])

//     return { isAuthenticated, error, loginUser: () => promptAsync({ useProxy }), getAccessToken, logoutUser };
// }

