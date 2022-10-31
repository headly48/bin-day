import { Collection, Db, DeleteStatement, ObjectId } from "mongodb";
import { Location } from "../dto/Location";
import winston from "winston";
import { UserEntity } from "./UsersRepository";
import { Bin } from "../dto/Bin";


export type LocationEntity = {
    _id?: ObjectId
    name: string
    createdBy: ObjectId,
    address: {
    }
    location: {
        type: "Point",
        coordinates: [number, number]
    },
    bins: Bin[],
    dateCreated: number
}


export class LocationsRepository {
    collection: Collection

    constructor(private db: Db) {

        this.collection = db.collection("locations");
    }

    async getLocationById(id: ObjectId): Promise<LocationEntity> {

        return this.collection.findOne<LocationEntity>({
            _id: id
        });
    }

    async getAllLocationsCreatedBy(id: ObjectId) {
        const res = this.collection.find({
            createdBy: id
        })

        res.limit(100);

        return (await res.toArray()) as LocationEntity[]
    }

    async createLocation(location: Location, user: UserEntity): Promise<ObjectId> {
        const LocationEntity: LocationEntity = {
            ...location,
            createdBy: user._id,
            dateCreated: new Date().getUTCMilliseconds()
        }
        
        const res = await this.collection.insertOne(LocationEntity);
        return res.insertedId
    }
}