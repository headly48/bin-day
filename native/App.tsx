// import {  } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Platform, Alert, Button } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { SelectAddressScreen } from './src/screens/location/add/SelectAddressScreen';
import { AddBinsScreen } from './src/screens/location/add/AddBinsScreen';
import { SelectBinColourScreen } from './src/screens/location/add/SelectBinColourScreen';
import { SelectBinScheduleScreen } from './src/screens/location/add/SelectBinScheduleScreen';
import { Box, HStack, Icon, IconButton, NativeBaseProvider, Text, StatusBar, VStack, Divider, Pressable } from 'native-base';
// import { useAuthentication } from './src/hooks/useAuthentication';
import { LoginScreen } from './src/screens/LoginScreen';
import { AuthenticationContext } from './src/providers/AuthenticationProvider';
import { useAuthentication } from './src/hooks/useAuthentication';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import {
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { DrawerContent } from './src/components/navigation/DrawerContent';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { handle401Error } from './src/utilities/HttpClient';

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator<ParamListBase & {displayInNav?: boolean}>();

function AppBar({ ...props }: any) {
  console.log(props)
  return <>
    <StatusBar barStyle="light-content" />
    <Box safeAreaTop bg="violet.600" />
    <HStack bg="violet.800" px="1" py="3" justifyContent="space-between" alignItems="center" w="100%">
      <HStack alignItems="center">
        <IconButton icon={<Icon size="sm" as={MaterialIcons} name="menu" color="white" />} />
        <Text color="white" fontSize="20" fontWeight="bold">
          {props.children}
        </Text>
      </HStack>
      <HStack>
        <IconButton icon={<Icon as={MaterialIcons} name="favorite" size="sm" color="white" />} />
        <IconButton icon={<Icon as={MaterialIcons} name="search" size="sm" color="white" />} />
        <IconButton icon={<Icon as={MaterialIcons} name="more-vert" size="sm" color="white" />} />
      </HStack>
    </HStack>
  </>;
}





export default function App() {
  const auth = useAuthentication();

  useEffect(() => {
    handle401Error(() => {
      console.error("Received 401, Logging out user")
      auth.logoutUser(false);
    })
  }, [auth])


  return (
    <AuthenticationContext.Provider value={auth}>
      <NativeBaseProvider>
        <NavigationContainer>

          <Box safeArea flex={1}>
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
            >

              {auth.isAuthenticated &&
                (<Drawer.Group>
                  <Drawer.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Bin Day' }}
                    initialParams={{displayInNav: true}}
                  />


                  <Drawer.Group>
                    <Drawer.Screen
                      name="AddLocation"
                      component={SelectAddressScreen}
                      options={{ title: 'Select Address' }}
                    />
                    <Drawer.Screen name="AddBins" component={AddBinsScreen} options={{ title: "Add Bins" }} />
                    <Drawer.Screen name="SelectBinColour" component={SelectBinColourScreen} options={{ title: "Bin Colour" }} />
                    <Drawer.Screen name="SelectBinSchedule" component={SelectBinScheduleScreen} options={{ title: "Bin Schedule" }} />
                  </Drawer.Group>
                </Drawer.Group>)
              }


              {!auth.isAuthenticated &&
                (<Drawer.Group>
                  <Drawer.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Login', headerShown: false }}
                  />

                  <Drawer.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'Bin Day', headerShown: false }}
                  />
                </Drawer.Group>)
              }
            </Drawer.Navigator>
          </Box>

          {/* <Stack.Navigator screenOptions={{headerTitle: (props) => <AppBar {...props} />}}>

            {auth.isAuthenticated && (<>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Bin Day' }}
              />

              <Stack.Group>
                {/* <Stack.Screen name="AddLocation" component={AddLocationScreen} /> */}
          {/* <Stack.Screen
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
          </Stack.Navigator> */}


        </NavigationContainer>
        {/* <StatusBar style="auto" /> */}
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




