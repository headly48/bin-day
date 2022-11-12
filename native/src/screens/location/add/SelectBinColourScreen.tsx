import React, { useState } from "react";
import { Button, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Box, Center } from "native-base";

export const SelectBinColourScreen = () => {
    const [selectedColour, setSelectedColour] = useState();
    const navigation = useNavigation<any>();

    return (
        <Box bgColor="#5c9284" height={"full"} p={"12"}>
            <Center>
                <Box backgroundColor={"white"} borderRadius={"md"} p="12">

                    <Picker
                        selectedValue={selectedColour}
                        onValueChange={(itemValue, itemIndex) => setSelectedColour(itemValue)}>
                        <Picker.Item label="Green" value="green" />
                        <Picker.Item label="Yellow" value="yellow" />
                        <Picker.Item label="Red" value="red" />
                        <Picker.Item label="Purple" value="purple" />
                        <Picker.Item label="Light Green" value="light-green" />
                        <Picker.Item label="Dark Green" value="dark-green" />
                    </Picker>
                </Box>
            </Center>
        </Box>

        // <View>


        //     <Button title="Continue" onPress={() => {
        //         navigation.navigate("SelectBinSchedule", {colour: selectedColour});
        //     }}></Button>
        // </View>
    );
};
