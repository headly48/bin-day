import { useNavigation } from "@react-navigation/native";
import { Box, Button, Text, useToast, VStack } from "native-base";
import React, { useState } from "react";
import { View, SafeAreaView, Platform } from "react-native";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { AddressLookup } from "../../../components/AddressLookup/AddressLookup";
import { NameInputComponent } from "../../../components/form/NameInputComponent";
import { ToastAlert } from "../../../components/ToastAlert";

export const SelectAddressScreen = () => {
    const navigation = useNavigation<any>();
    const toast = useToast();
    const [formData, setFormData] = useState<
        {
            submitted: boolean
            valid: boolean
            name: {
                value: string | undefined,
                valid: boolean
            },
            address: {
                value: GooglePlaceDetail | undefined,
                valid: boolean
            },
        }>({
            submitted: false,
            valid: false,
            address: {
                value: undefined,
                valid: false
            },
            name: {
                value: undefined,
                valid: false
            }
        });

    const submitAddress = () => {
        setFormData({ ...formData, submitted: true })

        if (formData.valid) {
            navigation.navigate('AddBins', { address: formData.address.value, name: formData.name.value })
        }
    }

    const setFormDataFieldValue = (field: "address" | "name", value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                value
            }
        }))
    }

    const setFormDataFieldValidity = (field: "address" | "name", valid: boolean) => {
        setFormData((prev) => {
            const data = {
                ...prev,
                [field]: {
                    ...prev[field],
                    valid
                }
            }
            data.valid = data.name.valid && data.address.valid
            return data;
        })
    }

    return (
        <Box bgColor="#5c9284" height={"full"} p={"12"}>

            <Box width="2/3" p="6" minWidth={"400"} mx="auto" alignContent={"center"} bgColor={"white"} shadow="5" borderRadius={"md"} >

                <View style={[
                    Platform.select({ ios: { zIndex: 2 } }),
                ]}>
                    <VStack space={12}>
                        <VStack space={6}>

                            <NameInputComponent placeholder="Location name" displayError={formData.submitted} onChangeText={(text) => setFormDataFieldValue("name", text)} handleInputValidity={(valid) => setFormDataFieldValidity("name", valid)} />

                            <VStack>
                                <AddressLookup displayError={formData.submitted} handleError={() => {

                                    toast.show({
                                        placement: "top-right",
                                        render: (props) => <ToastAlert toast={toast} id={props.id} status="error" variant={undefined} title="Something has gone wrong" description={"Please try again later."} isClosable={true} />
                                    })
                                }

                                } handleSelect={(details) => {
                                    setFormDataFieldValue("address", details)
                                }} handleInputValidity={(valid) => setFormDataFieldValidity("address", valid)} />
                            </VStack>
                        </VStack>

                        <Button onPress={submitAddress} zIndex={-1} backgroundColor="#2e495e" color={"#f9b64b"}>Continue</Button>
                    </VStack>
                </View>
            </Box>
        </Box>
    )
}