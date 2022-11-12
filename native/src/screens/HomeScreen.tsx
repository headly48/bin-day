import { Box, Center, IconButton, Image, VStack } from "native-base"
import React from "react"
import { View, Text } from "react-native"
import { Heading } from 'native-base';
import { Button } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import { EmptyBox } from "../components/EmptyBox";

export const HomeScreen = ({ navigation }: { navigation: any }) => {



    return (
        <Box bgColor="#5c9284" height={"full"} p={"12"}>
            <Center>

                <EmptyBox heading="Add a location to get started!">
                    <Button endIcon={<Icon name="add-outline" color={"white"} size={18} />} onPress={() =>
                        navigation.navigate('AddLocation')
                    } backgroundColor="#2e495e" color={"#f9b64b"}>Add</Button>
                </EmptyBox>
            </Center>
        </Box>
    )
}