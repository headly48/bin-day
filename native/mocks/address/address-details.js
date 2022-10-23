const details = {
    "html_attributions" : [],
    "result" : {
       "address_components" : [
          {
             "long_name" : "111",
             "short_name" : "111",
             "types" : [ "street_number" ]
          },
          {
             "long_name" : "Bourke Street",
             "short_name" : "Bourke St",
             "types" : [ "route" ]
          },
          {
             "long_name" : "Leederville",
             "short_name" : "Leederville",
             "types" : [ "locality", "political" ]
          },
          {
             "long_name" : "City of Vincent",
             "short_name" : "Vincent",
             "types" : [ "administrative_area_level_2", "political" ]
          },
          {
             "long_name" : "Western Australia",
             "short_name" : "WA",
             "types" : [ "administrative_area_level_1", "political" ]
          },
          {
             "long_name" : "Australia",
             "short_name" : "AU",
             "types" : [ "country", "political" ]
          },
          {
             "long_name" : "6007",
             "short_name" : "6007",
             "types" : [ "postal_code" ]
          }
       ],
       "adr_address" : "\u003cspan class=\"street-address\"\u003e111 Bourke St\u003c/span\u003e, \u003cspan class=\"locality\"\u003eLeederville\u003c/span\u003e \u003cspan class=\"region\"\u003eWA\u003c/span\u003e \u003cspan class=\"postal-code\"\u003e6007\u003c/span\u003e, \u003cspan class=\"country-name\"\u003eAustralia\u003c/span\u003e",
       "formatted_address" : "111 Bourke St, Leederville WA 6007, Australia",
       "geometry" : {
          "location" : {
             "lat" : -31.9321543,
             "lng" : 115.8396298
          },
          "viewport" : {
             "northeast" : {
                "lat" : -31.9307032197085,
                "lng" : 115.8409775302915
             },
             "southwest" : {
                "lat" : -31.9334011802915,
                "lng" : 115.8382795697085
             }
          }
       },
       "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png",
       "icon_background_color" : "#7B9EB0",
       "icon_mask_base_uri" : "https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet",
       "name" : "111 Bourke St",
       "place_id" : "ChIJcXV97UWlMioR7tsoqfmYxIs",
       "reference" : "ChIJcXV97UWlMioR7tsoqfmYxIs",
       "types" : [ "premise" ],
       "url" : "https://maps.google.com/?q=111+Bourke+St,+Leederville+WA+6007,+Australia&ftid=0x2a32a545ed7d7571:0x8bc498f9a928dbee",
       "utc_offset" : 480,
       "vicinity" : "Leederville"
    },
    "status" : "OK"
 }



export {
    details as addressDetails
}