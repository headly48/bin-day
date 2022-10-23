import React, { useState, useEffect } from "react";
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from "expo-location";
import { SafeAreaView, Text } from 'react-native';
import { AddressDetails } from "./AddressLookup.types";

const AddressLookup: React.FC<{
    handleError: () => void,
    handleSelect: (details: GooglePlaceDetail) => void
}> = ({
    handleError,
    handleSelect,
}) => {

    const [addressState, setAddressState] = useState<{
      loading: boolean,
      country: undefined | null | string
    }>({
      loading: true,
      country: undefined
    })
  
    useEffect(() => {
      Location.installWebGeolocationPolyfill();
    }, [])
  
    useEffect(() => {
      (async () => {
        const hasPermission = await Location.getForegroundPermissionsAsync();
  
        if(!hasPermission.granted) {
          if(!hasPermission.canAskAgain) {
            console.log("Does not have permission and cannot ask again")
            setAddressState({
              loading: false,
              country: undefined
            })
            return;
          } else {
            const test = await Location.requestForegroundPermissionsAsync();
            if(!test.granted) {
              console.log("Denied location permissions")
              setAddressState({
                loading: false,
                country: undefined
              })
              return;
            }
          }
        }
  
        try {
          const lastKnownPosition = await Location.getLastKnownPositionAsync()
          if (lastKnownPosition?.coords.latitude && lastKnownPosition?.coords.longitude) {
            const locations = await Location.reverseGeocodeAsync({ latitude: lastKnownPosition.coords.latitude, longitude: lastKnownPosition.coords.longitude });
            
            console.debug(`Finding addresses for: ${locations?.[0]?.isoCountryCode}`)
            setAddressState(
              {
                loading: false,
                country: locations?.[0]?.isoCountryCode
              }
            )
          }
        } catch (e) {
          console.log("Unable to get country for user")
          console.error(e)
        }
      }
      )()
    }, [])
  
    if (addressState.loading) {
      // TODO: Add spinner component
      return <Text>THIS IS A SPINNER</Text>
    }
  
    return (
      <SafeAreaView style={{ width: "100%", height: "100%" }}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          fetchDetails
          onPress={(data, details) => {
            // 'details' is provided when fetchDetails = true
            if(details) {
                handleSelect(details)
            } else {
                handleError()
            }
            console.log(data, details);
          }}
          query={{
            key: 'TODO: REPLACE WITH ENV',
            language: 'en',
            components: addressState.country ? 'country:us' : undefined
          }}
          requestUrl={{
            url: "http://192.168.1.126:18000/maps/api",
            useOnPlatform: "all"
          }}
          onFail={
            (err) => {
              console.log("ERROR", err)
              handleError();
            }
          }
          onTimeout={() => console.log("timeout")}
          enablePoweredByContainer
        />
      </SafeAreaView>
    )
  }


  export {
    AddressLookup
  }