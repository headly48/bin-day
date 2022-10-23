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
import * as AuthSession from "expo-auth-session";
import jwtDecode from "jwt-decode";
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();

const auth0ClientId = "My3U7DhnHSn08euQfWl6UCgQaftcK0ng";
const authorizationEndpoint = "https://dev-ver23ej7ohjledpv.us.auth0.com/authorize";

const useProxy = Platform.select({ web: false, default: true });
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

export default function App() {
  const [name, setName] = useState(null);
  const [token, setToken] = useState<any>();
  
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      redirectUri,
      clientId: auth0ClientId,
      // id_token will return a JWT token
      responseType: "id_token",
      // retrieve the user's profile
      scopes: ["openid", "profile"],
      extraParams: {
        // ideally, this will be a random value
        nonce: "nonce",
      },
    },
    { authorizationEndpoint }
  );

    // Retrieve the redirect URL, add this to the callback URL list
  // of your Auth0 application.
  console.log(`Redirect URL: ${redirectUri}`);

  useEffect(() => {
    if (result) {
      if (result.type === "error") {
        Alert.alert(
          "Authentication error",
          result.params.error_description || "something went wrong"
        );
        return;
      }
      if (result.type === "success") {
        // Retrieve the JWT token and decode it
        const jwtToken = result.params.id_token;
        const decoded = jwtDecode(jwtToken);

        console.log(decoded)

        const { name } = decoded as any;
        setName(name);
      }
    }
  }, [result]);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
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
        </Stack.Navigator>

      </NavigationContainer>
      <StatusBar style="auto" />

      <Text>This is the token: {name}, {token && JSON.parse(token)}</Text>

      {name ? (
        <>
          <Text>You are logged in, {name}!</Text>
          <Button title="Log out" onPress={() => setName(null)} />
        </>
      ) : (
        <Button
          disabled={!request}
          title="Log in with Auth0"
          onPress={() => promptAsync({ useProxy })}
        />
      )}
    </NativeBaseProvider>

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




