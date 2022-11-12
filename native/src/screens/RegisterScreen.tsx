import { AxiosError } from "axios";
import { Box, Button, Center, Divider, Heading, Input, Pressable, Stack, useToast } from "native-base"
import React, { useCallback, useState } from "react";
import { EmailInputComponent } from "../components/form/EmailInputComponent";
import { NameInputComponent } from "../components/form/NameInputComponent";
import { PasswordInputComponent } from "../components/form/PasswordInputComponent";
import { SplashHeaderComponent } from "../components/SplashHeaderComponent";
import { ToastAlert } from "../components/ToastAlert";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export const RegisterScreen = () => {
    const auth = useAuthenticationContext();
    const navigation = useNavigation<any>();
    const toast = useToast();
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
        name: {
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
        name: {
            value: null,
            valid: false
        },
        submitted: false
    })


    const registerUser = useCallback(async () => {
        setFormDetails((prev) => ({ ...prev, submitted: true }))

        if (formDetails.name.valid && formDetails.password.valid && formDetails.username.valid) {
            if (formDetails.username.value && formDetails.password.value && formDetails.name.value) {
                setLoading(true)
                try {
                    auth && await auth.registerUser({ username: formDetails.username.value, password: formDetails.password.value, name: formDetails.name.value })
                } catch (e) {
                    const axiosError: AxiosError<{ errors: { id: string }[] }> = e as any;
                    const userAlreadyExists = !!(axiosError.response?.data.errors ?? []).find((err) => err.id === "USER_EXISTS")

                    if (userAlreadyExists) {
                        toast.show({
                            placement: "top-right",
                            render: (props) => <ToastAlert toast={toast} id={props.id} status="error" variant={undefined} title="An account already exists for this email" description={undefined} isClosable={true} />
                        })
                    } else {
                        toast.show({
                            placement: "top-right",
                            render: (props) => <ToastAlert toast={toast} id={props.id} status="error" variant={undefined} title="Something has gone wrong" description={"Please try again later"} isClosable={true} />
                        })
                    }
                }

                setLoading(false)
            }
        }
    }, [formDetails, auth, setFormDetails])

    if (!auth) return null;

    return <Box bgColor="primary.100" height={"full"}>

        <SplashHeaderComponent pageName="Sign up"
            leftAction={
                <Pressable marginLeft={"1/4"} onPress={() => navigation.navigate("Login")}>
                    <Icon name="arrow-back-outline" size={25}></Icon>
                </Pressable>
            }
        ></SplashHeaderComponent>

        <Stack space={12} w="75%" maxW="300px" mx="auto">

            <NameInputComponent onChangeText={(text) => setFormDetails((prev) => ({ ...prev, name: { ...prev.name, value: text } }))} displayError={formDetails.submitted} handleInputValidity={(valid) => { setFormDetails((prev) => ({ ...prev, name: { ...prev.name, valid } })) }} />

            <EmailInputComponent onChangeText={(text) => setFormDetails((prev) => ({ ...prev, username: { ...prev.username, value: text } }))} displayError={formDetails.submitted} handleInputValidity={(valid) => { setFormDetails((prev) => ({ ...prev, username: { ...prev.username, valid } })) }} />

            <PasswordInputComponent onChangeText={(text: string) => setFormDetails((prev) => ({ ...prev, password: { ...prev.password, value: text } }))} displayError={formDetails.submitted}
                handleInputValidity={(valid) => { setFormDetails((prev) => ({ ...prev, password: { ...prev.password, valid } })) }} />

            <Button onPress={registerUser} isLoading={loading}>Register</Button>
        </Stack>
    </Box>
}