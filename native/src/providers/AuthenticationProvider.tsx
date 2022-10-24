import React, { useContext } from "react";
import {useAuthentication} from "../hooks/useAuthentication";


export const AuthenticationContext = React.createContext<ReturnType<typeof useAuthentication> | undefined>(undefined);

export const useAuthenticationContext = () => {
    return useContext(AuthenticationContext) 
}