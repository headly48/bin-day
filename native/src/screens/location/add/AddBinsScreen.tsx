import React, { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import { httpClient } from "../../../utilities/HttpClient";

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
        <View>
            <View>
                <Text>We were unable to find your bin schedule</Text>
                <Text>Please add them below</Text>
            </View>

            <View>
                <Button title="Add Bin" onPress={() => {
                    navigation.navigate("SelectBinColour");
                }}></Button>
            </View>

            <ScrollView>
                {bins.map(bin => <View><Text>{JSON.stringify(bin)}</Text></View>)}
            </ScrollView>

            {(bins && bins.length > 0) && (<View>
                <Button title="Save Location" onPress={saveLocation}></Button>
            </View>)}
        </View>
    );
};
