import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from "expo-location";
import { Dimensions, Platform, SafeAreaView, Text } from 'react-native';
import { AddressDetails } from "./AddressLookup.types";
import { useAuthenticationContext } from "../../providers/AuthenticationProvider";
import { Button, View } from "native-base";
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown'
import { Feather } from "@expo/vector-icons";
import { httpClient } from "../../utilities/HttpClient";
import { v4 as uuidv4 } from 'uuid';

const AddressLookup: React.FC<{
  handleError: () => void,
  handleSelect: (details: GooglePlaceDetail) => void
}> = ({
  handleError,
  handleSelect,
}) => {

    // const authContext = useAuthenticationContext();

    const [addressState, setAddressState] = useState<{
      loading: boolean,
      country: undefined | null | string,
    }>({
      loading: true,
      country: undefined,
    })

    const [sessionToken, setSessionToken] = useState(uuidv4());

    useEffect(() => {
      Location.installWebGeolocationPolyfill();
    }, [])


    useEffect(() => {
      (async () => {
        const hasPermission = await Location.getForegroundPermissionsAsync();

        if (!hasPermission.granted) {
          if (!hasPermission.canAskAgain) {
            console.log("Does not have permission and cannot ask again")
            setAddressState({
              loading: false,
              country: undefined
            })
            return;
          } else {
            const test = await Location.requestForegroundPermissionsAsync();
            if (!test.granted) {
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

    const [loading, setLoading] = useState(false)
    const [suggestionsList, setSuggestionsList] = useState<TAutocompleteDropdownItem[] | null>(null)
    const [selectedItem, setSelectedItem] = useState<string | null>(null)
    const dropdownController = useRef<any>(null)

    const searchRef = useRef<any>(null)

    const getSuggestions = useCallback(async (q: string) => {
      const filterToken = q.toLowerCase()
      console.log('getSuggestions', q)
      handleSelect(undefined)

      if (typeof q !== 'string' || q.length < 3) {
        setSuggestionsList(null)
        return
      }

      setLoading(true)

      const response = await httpClient.get("/address/search", {
        params: {
          query: filterToken,
          country: addressState.country,
          sessiontoken: sessionToken
        }
      })

      try {

        const addressItems = response.data.predictions.map((pred) => {
          return {
            id: pred.place_id,
            title: pred.description
          }
        })

        setSuggestionsList(addressItems)
        setLoading(false)
      } catch (err) {
        //TODO: Handle error

        setSuggestionsList(null)
      }
      setLoading(false)
    }, [])

    const onClearPress = useCallback(() => {
      setSuggestionsList(null)
    }, [])

    const onOpenSuggestionsList = useCallback(isOpened => { }, [])

    if (addressState.loading) {
      // TODO: Add spinner component
      return <Text>THIS IS A SPINNER</Text>
    }

    const handleSelectItem = async (id: string) => {

      setLoading(true)

      try {
        const response = await httpClient.get(`/address/${id}`, {
          params: {
            sessiontoken: sessionToken
          }
        })

        handleSelect(response.data.result)
      } catch (err) {

        //TODO: Handle error

      }
      
      setLoading(false)
    }

    return (
      <>
        <View
          style={[
            { flex: 1, flexDirection: 'row', alignItems: 'center' },
            Platform.select({ ios: { zIndex: 1 } }),
          ]}>
          <AutocompleteDropdown
            ref={searchRef}
            controller={controller => {
              dropdownController.current = controller
            }}
            // initialValue={'1'}
            direction={Platform.select({ ios: 'down' })}
            dataSet={suggestionsList}
            onChangeText={getSuggestions}
            onSelectItem={item => {
              item && handleSelectItem(item.id)
            }}
            debounce={600}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
            onClear={onClearPress}
            //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
            onOpenSuggestionsList={onOpenSuggestionsList}
            loading={loading}
            useFilter={false} // set false to prevent rerender twice
            textInputProps={{
              placeholder: 'Search Address',
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {
                borderRadius: 25,
                backgroundColor: '#ffff',
                color: 'black',
                paddingLeft: 18,
              },
            }}
            rightButtonsContainerStyle={{
              right: 8,
              height: 30,
              alignSelf: 'center',
            }}
            inputContainerStyle={{
              backgroundColor: '#383b42',
              borderRadius: 25,
            }}
            suggestionsListContainerStyle={{
              backgroundColor: '#383b42',
            }}
            containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={(item, text) => <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>}
            ChevronIconComponent={<Feather name="chevron-down" size={20} color="#fff" />}
            ClearIconComponent={<Feather name="x-circle" size={18} color="#fff" />}
            inputHeight={50}
            showChevron={false}
            closeOnBlur={false}
          //  showClear={false}
          />
          <View style={{ width: 10 }} />
        </View>
      </>
    )




    // return (
    //   <SafeAreaView style={{ width: "100%", height: "100%" }}>
    //     <GooglePlacesAutocomplete
    //       placeholder='Search'
    //       fetchDetails
    //       onPress={(data, details) => {
    //         // 'details' is provided when fetchDetails = true
    //         if(details) {
    //             handleSelect(details)
    //         } else {
    //             handleError()
    //         }
    //         console.log(data, details);
    //       }}
    //       query={{
    //         key: 'TODO: REPLACE WITH ENV',
    //         language: 'en',
    //         components: addressState.country ? `country:${addressState.country}` : undefined,
    //       }}
    //       requestUrl={{
    //         url: "http://192.168.1.126:18000/maps/api",
    //         useOnPlatform: "all",
    //         headers: {
    //           Authorization: `Bearer ${authToken}`
    //         }
    //       }}
    //       onFail={
    //         (err) => {
    //           console.log("ERROR", err)
    //           handleError();
    //         }
    //       }
    //       onTimeout={() => console.log("timeout")}
    //       enablePoweredByContainer
    //     />
    //   </SafeAreaView>
    // )



  }


export {
  AddressLookup
}