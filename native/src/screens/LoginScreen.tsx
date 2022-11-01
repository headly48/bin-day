import { PreventRemoveContext, useNavigation } from "@react-navigation/native";
import { Box, Button, Center, Container, Divider, FormControl, Heading, HStack, Input, Link, Stack, Text, useToast, WarningOutlineIcon } from "native-base"
import React, { useState } from "react";
import RubbishBinSVG from "../components/assets/RubbishBinIcon";
import { useAuthenticationContext } from "../providers/AuthenticationProvider";
import Icon from 'react-native-vector-icons/Ionicons';
import { Pressable } from "react-native";
import { ToastAlert } from "../components/ToastAlert";

export const LoginScreen = () => {
    const auth = useAuthenticationContext();
    const toast = useToast();
    const navigation = useNavigation<any>();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    const [formDetails, setFormDetails] = useState<{
        username: null | string,
        password: null | string,
        submitted: boolean
    }>({
        username: null,
        password: null,
        submitted: false
    })

    if (!auth) return null;

    const loginUser = async () => {
        setFormDetails((prev) => ({ ...prev, submitted: true }))

        if (formDetails.password && formDetails.username) {

            try {

                await auth.loginUser(formDetails.username, formDetails.password)
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
        }
    }


    return (<Box bgColor="primary.100" height={"full"}>

        <Box marginBottom={20} marginTop={6}>
            <Center>
                <Stack space={8}>
                    <Center><Heading size={"3xl"}>Bin Day</Heading></Center>
                    <RubbishBinSVG height={"250"}></RubbishBinSVG>
                </Stack>
            </Center>
        </Box>

        <Center height={"full"}>

            <Heading size={"2xl"} marginBottom={12}>Login</Heading>
            <Stack space={12} w="75%" maxW="300px" mx="auto" marginBottom={8}>

                <FormControl isInvalid={formDetails.submitted && !formDetails.username}>
                    <Input size="md" variant="underlined" placeholder="Email" borderBottomColor={formDetails.submitted && !formDetails.username ? "error.600" : "darkText"} placeholderTextColor={"darkText"} onChangeText={(text) => setFormDetails((prev) => ({ ...prev, username: text }))} />

                    {(formDetails.submitted && !formDetails.username) && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Email is required
                    </FormControl.ErrorMessage>}
                </FormControl>

                <Box alignItems="center">
                    <FormControl isInvalid={formDetails.submitted && !formDetails.password}>
                        <Input variant="underlined" type={showPassword ? "text" : "password"} w="100%" py="0" borderBottomColor={formDetails.submitted && !formDetails.password ? "error.600" : "darkText"} placeholderTextColor={"darkText"} onChangeText={(text) => setFormDetails((prev) => ({ ...prev, password: text }))}
                            placeholder="Password"
                            InputRightElement={
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    {!showPassword ? <Icon name="eye-outline" size={24} color="darkText" /> : <Icon name="eye-off-outline" size={24} color={"darkText"} />}
                                </Pressable>} />

                        {(formDetails.submitted && !formDetails.password) && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Password is required
                        </FormControl.ErrorMessage>}
                    </FormControl>


                </Box>

                <Button onPress={loginUser}>Login</Button>
            </Stack>

            <Box w="75%" maxW="300px" height={"container"}>
                <Link height="2" onPress={() => navigation.navigate('Register')} size={"xl"} color="darkText" _hover={{ cursor: 'pointer' } as any} _text={{
                    fontWeight: "bold"
                }}>Sign up</Link>
            </Box>
        </Center>
    </Box>)

}