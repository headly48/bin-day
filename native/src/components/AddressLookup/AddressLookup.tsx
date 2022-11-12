import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from "expo-location";
import { Dimensions, Platform, SafeAreaView, Text } from 'react-native';
import { Button, FormControl, View, WarningOutlineIcon } from "native-base";
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown'
import { Feather } from "@expo/vector-icons";
import { httpClient } from "../../utilities/HttpClient";
import { v4 as uuidv4 } from 'uuid';

const AddressLookup: React.FC<{
  handleError: () => void,
  handleSelect: (details: GooglePlaceDetail | undefined) => void
  handleInputValidity: (isValid: boolean) => void
  displayError: boolean
}> = ({
  handleError,
  handleSelect,
  handleInputValidity,
  displayError
}) => {
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

    const [validity, setValidity] = useState(false);
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestionsList, setSuggestionsList] = useState<TAutocompleteDropdownItem[] | null>(null)
    const [selectedItem, setSelectedItem] = useState<GooglePlaceDetail | undefined>(undefined)
    const dropdownController = useRef<any>(null)

    const searchRef = useRef<any>(null)

    useEffect(() => {
      handleSelect(selectedItem)
    }, [selectedItem])

    useEffect(() => {
      handleInputValidity(validity)
    }, [validity])


    const getSuggestions = useCallback(async (q: string) => {
      setSearchTerm(q);
      setSelectedItem(undefined);
      const filterToken = q.toLowerCase()

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
        setSuggestionsList(null)
        handleError();
      }
      setLoading(false)
    }, [])

    const onClearPress = useCallback(() => {
      setSuggestionsList(null)
    }, [])


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

        setSelectedItem(response.data.result)
        setValidity(true)
      } catch (err) {
        setValidity(false)
        setSelectedItem(undefined)
        handleError();
        //TODO: Handle error

      }

      setLoading(false)
    }

    return (
      <>
        <FormControl isInvalid={displayError}>
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
              dataSet={suggestionsList ?? undefined}
              onChangeText={getSuggestions}
              onSelectItem={item => {
                item && handleSelectItem(item.id)
              }}
              debounce={600}
              suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
              onClear={onClearPress}
              //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
              // onOpenSuggestionsList={onOpenSuggestionsList}
              loading={loading}
              useFilter={false} // set false to prevent rerender twice
              textInputProps={{
                placeholder: 'Search Address',
                autoCorrect: false,
                autoCapitalize: 'none',
                placeholderTextColor: "#000000",
                style: {
                  backgroundColor: '#ffff',
                  color: 'black',
                  borderStyle: "solid",
                  borderWidth: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                  fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  fontSize: 14,
                  height: "auto",
                  outline: "none"
                },
              }}
              rightButtonsContainerStyle={{
                right: 8,
                height: 30,
                alignSelf: 'center',
              }}
              inputContainerStyle={{
                backgroundColor: '#383b42',
                borderBottomColor: !validity && displayError ? "rgb(220, 38, 38)" : "rgb(0, 0, 0)",
                boxShadow: !validity && displayError ? "rgb(220 38 38) 0px 1px 0px 0px" : undefined,
                borderBottomWidth: 1
              }}
              suggestionsListContainerStyle={{
                backgroundColor: '#383b42',
                top: 40
              }}
              containerStyle={{ flexGrow: 1, flexShrink: 1, }}
              renderItem={(item, text) => <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>}
              ChevronIconComponent={<Feather name="chevron-down" size={20} color="#fff" />}
              ClearIconComponent={<Feather name="x-circle" size={18} color="#fff" />}
              inputHeight={50}
              showChevron={false}
              closeOnBlur={false}
            />
          </View>

          {!searchTerm && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />} zIndex={-2}>
            Address is required
          </FormControl.ErrorMessage>}

          {searchTerm && !selectedItem && !loading && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />} zIndex={-2}>
            Please select address from list
          </FormControl.ErrorMessage>}
        </FormControl>
      </>
    )
  }


export {
  AddressLookup
}