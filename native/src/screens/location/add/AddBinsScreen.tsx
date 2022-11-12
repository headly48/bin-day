import React, { useEffect, useState } from "react";
import { ScrollView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { httpClient } from "../../../utilities/HttpClient";
import { Box, Button, Center, Text } from "native-base";
import { EmptyBox } from "../../../components/EmptyBox";
import Icon from "react-native-vector-icons/Ionicons";

export const AddBinsScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();

    const [bins, setBins] = useState<any[]>([]);
    const [address, setAddress] = useState<GooglePlaceDetail>();

    useEffect(() => {
        console.log("updated", route.params)

        if ((route.params as any)?.address) {
            setAddress((route.params as any)?.address)
        }

        if ((route.params as any).createBin) {

            setBins((prev) => {
                const param = route.params as any;
                return [...prev, {
                    colour: param?.colour,
                    day: param?.day,
                    week: param?.week,
                    frequency: param?.frequency
                }]
            })
        }
    }, [route.params])


    const saveLocation = async () => {

        await httpClient.post("/location", {
            name: "blah",
            location: {
                type: "Point",
                coordinates: [address?.geometry.location.lat, address?.geometry.location.lng]
            },
            address,
            bins: bins
        })

        navigation.navigate("Home")
    }

    return (
        <Box bgColor="#5c9284" height={"full"} p={"12"}>
            <Center>
                <EmptyBox heading="Add a bin to get started!">
                    <Button endIcon={<Icon name="add-outline" color={"white"} size={18} />} onPress={() =>
                        navigation.navigate('SelectBinColour')
                    } backgroundColor="#2e495e" color={"#f9b64b"}>Add</Button>
                </EmptyBox>


            </Center>




            <ScrollView>
                {bins.map(bin => <View><Text>{JSON.stringify(bin)}</Text></View>)}
            </ScrollView>

            {(bins && bins.length > 0) && (<View>
                <Button onPress={saveLocation}>Save Location</Button>
            </View>)}

        </Box>

    );
};
