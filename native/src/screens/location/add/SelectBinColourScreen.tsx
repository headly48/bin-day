import React, { useState } from "react";
import { Button, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export const SelectBinColourScreen = () => {
    const [selectedColour, setSelectedColour] = useState();
    const navigation = useNavigation<any>();

    return (
        <View>
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

            <Button title="Continue" onPress={() => {
                navigation.navigate("SelectBinSchedule", {colour: selectedColour});
            }}></Button>
        </View>
    );
};
