import { Button, Center, Heading } from "native-base"
import { useAuthentication } from "../hooks/useAuthentication"
import { useAuthenticationContext } from "../providers/AuthenticationProvider";

export const LoginScreen = () => {

    const auth = useAuthenticationContext();

    if (!auth) return null;

    return <Center>

        <Heading>Login to continue</Heading>


        <Button onPress={() => auth.loginUser()}>Login</Button>
    </Center>
}