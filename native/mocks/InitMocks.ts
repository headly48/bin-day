var express = require('express')
var app = express()
var cors = require('cors');
import { addressDetails } from "./address/address-details";
import { addresses } from "./address/get-addresses"



const initMocks = () => {




    console.log("Initalizing mocks")




    // app.use(function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     next();
    // });

    app.use(cors());

    app.get('/maps/api/place/autocomplete/json', function (req: any, res: any) {
        res.send(addresses)
    })

    app.get('/maps/api/place/details/json', function (req: any, res: any) {
        res.send(addressDetails)
    })

    app.listen(18000)

    
}






initMocks();