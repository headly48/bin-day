import { useNavigation } from "@react-navigation/native";
import { Box, Button, Center, Divider, Heading, Input, Stack } from "native-base"
import React from "react";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";

export const RegisterScreen = () => {
    const auth = useAuthenticationContext();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    if (!auth) return null;

    return <Center>

        <Heading>Register</Heading>

        <Stack space={4} w="75%" maxW="300px" mx="auto">

            <Input size="md" variant="rounded" placeholder="Email" />

            <Box alignItems="center">
                <Input variant="rounded" type={showPassword ? "text" : "password"} w="100%" py="0" InputRightElement={<Button size="xs" rounded="none" w="1/6" h="full" onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                </Button>} placeholder="Password" />
            </Box>
            
            <Button onPress={() => auth.registerUser("test@abc.com", "ABC123")}>Register</Button>
        </Stack>
    </Center>
}