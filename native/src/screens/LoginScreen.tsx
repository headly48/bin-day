import { PreventRemoveContext, useNavigation } from "@react-navigation/native";
import { Box, Button, Center, Container, Divider, FormControl, Heading, HStack, Input, Link, Stack, Text, useToast, WarningOutlineIcon } from "native-base"
import React, { useState } from "react";
import RubbishBinSVG from "../components/assets/RubbishBinIcon";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import Icon from 'react-native-vector-icons/Ionicons';
import { Pressable } from "react-native";
import { ToastAlert } from "../components/ToastAlert";
import { SplashHeaderComponent } from "../components/SplashHeaderComponent";
import { EmailInputComponent } from "../components/form/EmailInputComponent";
import { PasswordInputComponent } from "../components/form/PasswordInputComponent";

export const LoginScreen = () => {
    const auth = useAuthenticationContext();
    const toast = useToast();
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState(false);

    const [formDetails, setFormDetails] = useState<{
        username: {
            value: string | null,
            valid: boolean
        },
        password: {
            value: string | null,
            valid: boolean
        },
        submitted: boolean
    }>({
        username: {
            value: null,
            valid: false
        },
        password: {
            value: null,
            valid: false
        },
        submitted: false
    })

    if (!auth) return null;

    const loginUser = async () => {
        setFormDetails((prev) => ({ ...prev, submitted: true }))

        if (formDetails.password && formDetails.username.valid && formDetails.username.value && formDetails.password.value && formDetails.password.valid) {

            try {
                setLoading(true);
                await auth.loginUser(formDetails.username.value, formDetails.password.value)
            } catch (err: any) {
                if (err.response.status === 400) {
                    toast.show({
                        placement: "top-right",
                        render: (props) => <ToastAlert toast={toast} id={props.id} status="error" variant={undefined} title="Invalid username or password" description={undefined} isClosable={true} />
                    })
                } else {
                    toast.show({
                        placement: "top-right",
                        render: (props) => <ToastAlert toast={toast} id={props.id} status="error" variant={undefined} title="Something has gone wrong" description={"Please try again later."} isClosable={true} />
                    })
                }
            }

            setLoading(false);
        }
    }


    return (<Box bgColor="primary.100" height={"full"}>

        <SplashHeaderComponent pageName="Login"></SplashHeaderComponent>

        <Stack space={12} w="75%" maxW="300px" mx="auto" marginBottom={8}>

            <EmailInputComponent onChangeText={(text) => setFormDetails((prev) => ({ ...prev, username: { ...prev.username, value: text } }))} displayError={formDetails.submitted} handleInputValidity={(valid) => { setFormDetails((prev) => ({ ...prev, username: { ...prev.username, valid } })) }} />

            <PasswordInputComponent onChangeText={(text: string) => setFormDetails((prev) => ({ ...prev, password: { ...prev.password, value: text } }))} displayError={formDetails.submitted}
                handleInputValidity={(valid) => { setFormDetails((prev) => ({ ...prev, password: { ...prev.password, valid } })) }} />

            <Button onPress={loginUser} isLoading={loading}>Login</Button>

            <Box w="75%" maxW="300px" height={"container"}>
                <Link height="2" onPress={() => navigation.navigate('Register')} size={"xl"} color="darkText" _hover={{ cursor: 'pointer' } as any} _text={{
                    fontWeight: "bold"
                }}>Sign up</Link>
            </Box>
        </Stack>
    </Box>)
}