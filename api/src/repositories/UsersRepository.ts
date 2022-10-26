import { Collection, Db } from "mongodb";
import winston from "winston";


export type User = {
    username: string
    password: string
    name: string
}


export class UsersRepository {
    collection: Collection

    constructor(private db: Db) {

        this.collection = db.collection("users");
    }

    async getUserByUsername(username: string): Promise<User | null> {

        return this.collection.findOne<User>({
            username
        });
    }


    async getUserByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        winston.log("info", `getUserByUsernameAndPassword: ${username}, password: ${password}`);
        return this.collection.findOne<User>({
            username: username,
            password: password
        }).then((res) => {
            winston.log("info", 'Res', res)
            return res;
        });
    }
}