import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Platform, Alert, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { SelectAddressScreen } from './src/screens/location/add/SelectAddressScreen';
import { AddBinsScreen } from './src/screens/location/add/AddBinsScreen';
import { SelectBinColourScreen } from './src/screens/location/add/SelectBinColourScreen';
import { SelectBinScheduleScreen } from './src/screens/location/add/SelectBinScheduleScreen';
import { Box, NativeBaseProvider } from 'native-base';
import { useAuthentication } from './src/hooks/useAuthentication';
import { LoginScreen } from './src/screens/LoginScreen';
import { AuthenticationContext } from './src/providers/AuthenticationProvider';

const Stack = createNativeStackNavigator();

export default function App() {
  const auth = useAuthentication();

  // console.log(auth)
  (auth as any)["blah"] = "wtf"

  return (
    <AuthenticationContext.Provider value={auth}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {auth.isAuthenticated && (<>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Bin Day' }}
              />

              <Stack.Group>
                {/* <Stack.Screen name="AddLocation" component={AddLocationScreen} /> */}
                <Stack.Screen
                  name="AddLocation"
                  component={SelectAddressScreen}
                  options={{ title: 'Select Address' }}
                />
                <Stack.Screen name="AddBins" component={AddBinsScreen} options={{ title: "Add Bins" }} />
                <Stack.Screen name="SelectBinColour" component={SelectBinColourScreen} options={{ title: "Bin Colour" }} />
                <Stack.Screen name="SelectBinSchedule" component={SelectBinScheduleScreen} options={{ title: "Bin Schedule" }} />
              </Stack.Group>
            </>)}

            {!auth.isAuthenticated && <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Bin Day' }}
            />}
          </Stack.Navigator>

        </NavigationContainer>
        <StatusBar style="auto" />
      </NativeBaseProvider>
    </AuthenticationContext.Provider>
  );


  // return (
  //   <View style={styles.container}>
  //     <Text>Open up App.tsx to start working</Text>

  //     <AddressLookup />

  //     
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});




