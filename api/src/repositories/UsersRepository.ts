import { Collection, Db, ObjectId, UpdateResult } from "mongodb";
import winston from "winston";
import {genSaltSync, hashSync} from "bcryptjs";
import { User } from "../dto/User";

export type UserEntity = {
    _id: ObjectId
    username: string
    password: string
    name: string,
    locations: ObjectId[]
}


export class UsersRepository {
    collection: Collection

    constructor(private db: Db) {

        this.collection = db.collection("users");
    }

    async getUserByUsername(username: string): Promise<UserEntity | null> {

        return this.collection.findOne<UserEntity>({
            username
        });
    }

    async getUserById(id: string): Promise<UserEntity | null> {

        return this.collection.findOne<UserEntity>({
            _id: new ObjectId(id)
        });
    }

    async updateUser(user: UserEntity): Promise<UpdateResult> {
        return this.collection.updateOne({
            _id: user._id
        }, {
            $set: user
        })
    }

    async getUserByUsernameAndPassword(username: string, password: string): Promise<UserEntity | null> {
        winston.log("info", `getUserByUsernameAndPassword: ${username}, password: ${password}`);
        return this.collection.findOne<UserEntity>({
            username: username,
            password: password
        }).then((res) => {
            winston.log("info", 'Res', res)
            return res;
        });
    }

    async createUser(user: User) {
        winston.log("info", `Creating user ${user.username}, PW: ${user.password}`)
        
        const salt = genSaltSync()
        const hashedPassword = hashSync(user.password, salt);


        await this.collection.insertOne({name: user.name, password: hashedPassword, username: user.username })
    }
}