import { Bin } from "./Bin"


export type Location = {
    name: string,
    address: {

    }
    location: {
        type: "Point",
        coordinates: [number, number]
    },
    bins: Bin[]
}