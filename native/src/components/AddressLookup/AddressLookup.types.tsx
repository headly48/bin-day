


export type AddressDetails = {
    address_components: {
        long_name: string,
        short_name: string,
        types: string[]
    }[]
    adr_address: string,
    formatted_address: string
    geometry: {
        location: {
            lat: number,
            lng: number
        }
    },
    icon: string,
    icon_background_color: string,
    icon_mask_base_uri: string,
    name: string,
    place_id: string,
    reference: string,
    types: string[],
    url: string,
    utc_offset: number,
    vicinity: string
}
