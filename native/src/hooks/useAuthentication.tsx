import { useCallback, useEffect, useState } from "react"
import { Config } from "../../app.config"
import { httpClient, setAccessToken } from "../utilities/HttpClient"

type UserData = {
    username: string,
    id: string
}

export const useAuthentication = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUserData] = useState<UserData>();

    useEffect(() => {
        setIsLoading(true);
        httpClient.get(`${Config.baseApiUrl}/user`).then((res) => {
            console.log("User logged in", res.data)
            setIsAuthenticated(true)
            setUserData(res.data)
        }).catch(() => {
            setIsAuthenticated(false)
            setUserData(undefined)
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])

    const loginUser = useCallback(async (username: string, password: string) => {

        return httpClient.post(`/auth/login`, {
            username,
            password
        }).then(async (res) => {
            console.log("User Logged in")
            await setAccessToken(res.data.access_token)

            return getUserDetails().then((res) => {
                setIsAuthenticated(true);
                setUserData(res.data)
            });
        }).catch((err) => {
            console.log("Failed logging in ", err);
            setIsAuthenticated(false);
            throw err;
        })
    }, [])

    const getUserDetails = useCallback(async () => {
        return httpClient.get(`/user`)
    }, []);

    const registerUser = useCallback(async (username: string, password: string) => {
        return httpClient.post(`/auth/register`, {
            username,
            password
        }).then(async (res) => {
            console.log("User registered")
            await setAccessToken(res.data.access_token)
            
            return getUserDetails().then((res) => {
                setUserData(res.data)
                setIsAuthenticated(true);
            });
        }).catch((err) => {
            console.log("Failed logging in ", err);
            setIsAuthenticated(false);
            setUserData(undefined)
            throw err;
        })
    }, [])

    const logoutUser = useCallback(async (callApi: boolean = true) => {

        if(!callApi) {
            setIsAuthenticated(false)
            setUserData(undefined)
            return;
        }

        return httpClient.get(`/auth/logout`).finally(() => {
            setIsAuthenticated(false)
            setUserData(undefined)
        });
    }, []);

    
    return {
        isAuthenticated,
        loginUser,
        logoutUser,
        registerUser,
        user
    }
}