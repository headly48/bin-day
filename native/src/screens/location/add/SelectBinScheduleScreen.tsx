import React, { useMemo, useState } from "react";
import { Button, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from "react-native-calendars";
import { default as moment } from "moment";

export const SelectBinScheduleScreen = () => {
    const [selectedFrequency, setSelectedFrequency] = useState<string>("weekly");
    const [selectedDate, setSelectedDate] = useState<moment.Moment>();

    const navigation = useNavigation<any>();
    const route = useRoute();

    const date = useMemo(() => {
        const date = moment();

        return {
            current: date,
            past: date.clone().subtract(1, "month"),
            future: date.clone().add(1, "month")
        }
    }, [])

    return (
        <View>
            <Text>Select the frequency that it gets picked up</Text>

            <Picker
                selectedValue={selectedFrequency}
                placeholder={"Please select"}
                
                onValueChange={(itemValue, itemIndex) => setSelectedFrequency(itemValue)}>
                {/* <Picker.Item label="Daily" value="daily" /> */}
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Fortnightly" value="fortnightly" />
                {/* <Picker.Item label="Monthly" value="monthly" /> */}
            </Picker>


            <Text>Select a day it was picked up on</Text>

            <Calendar
                initialDate={selectedDate?.format("YYYY-MM-DD") || date.current.format("YYYY-MM-DD")}
                minDate={date.past.format("YYYY-MM-DD")}
                maxDate={date.future.format("YYYY-MM-DD")}
                onDayPress={day => {
                    setSelectedDate(moment(day.dateString))
                }}
                onDayLongPress={day => {
                    setSelectedDate(moment(day.dateString))
                }}
                monthFormat={'MMMM yyyy'}
                hideExtraDays={true}
                firstDay={1}
                showWeekNumbers={true}
                enableSwipeMonths={true}
            />

            <Button title="Continue" disabled={!selectedFrequency || !selectedDate} onPress={() => {
                navigation.navigate("AddBins", {
                    ...route.params,
                    day: selectedDate?.isoWeekday(),
                    frequency: selectedFrequency,
                    week: (selectedDate?.isoWeek() || 0) % 2,
                    createBin: true
                });
            }}></Button>
        </View>
    );
};
