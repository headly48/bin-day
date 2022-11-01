import { useNavigation } from "@react-navigation/native";
import { Button } from "native-base";
import React, { useState } from "react";
import { View, Text, SafeAreaView, Platform } from "react-native";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { AddressLookup } from "../../../components/AddressLookup/AddressLookup";
// import { useCreateLocationContext } from "../../AddLocationScreen";

export const SelectAddressScreen = () => {
    const [details, setDetails] = useState<GooglePlaceDetail>();
    const [error, setError] = useState(false);
    const navigation = useNavigation<any>();
    // const createLocationContext = useCreateLocationContext();

    return (
        <View style={[
            Platform.select({ ios: { zIndex: 2 } }),
        ]}>
            {error && <View><Text>An error has occurred please try again later</Text></View>}

            <Text>Select Address</Text>
            {/* <SafeAreaView> */}
            <AddressLookup handleError={() => setError(true)} handleSelect={(details) => {
                setError(false);
                setDetails(details);
            }} />
            {/* </SafeAreaView> */}

            {/* <Button title="Continue" disabled={!details} onPress={() => details && handleContinue(details)}></Button> */}
            <Button disabled={!details} onPress={() => {
                // details && createLocationContext.setAddress?.(details)
                navigation.navigate('AddBins', { address: details })
            }} zIndex={-1}>Continue</Button>
        </View>
    )
}