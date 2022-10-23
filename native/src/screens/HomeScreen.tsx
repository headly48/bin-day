import { Box, Center } from "native-base"
import React from "react"
import { View, Text } from "react-native"
import { Heading } from 'native-base';
import { Button } from "native-base";

export const HomeScreen = ({ navigation }: { navigation: any }) => {



    return (
        <Box>
            <Center>
                <Heading>Welcome</Heading>
                <Text>Add a location to get started</Text>

                <Button onPress={() =>
                    navigation.navigate('AddLocation')
                }>Add location</Button>
            </Center>
        </Box>
    )
}