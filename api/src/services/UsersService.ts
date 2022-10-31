import { UserEntity, UsersRepository } from "../repositories/UsersRepository";
import { LocationEntity, LocationsRepository } from "../repositories/LocationsRepository";
import { Location } from "../dto/Location";
import { User } from "../dto/User";
import winston from "winston";



export class UsersService {

    constructor(private usersRepo: UsersRepository, private locationsRepo: LocationsRepository) {


    }

    async createLocation(user: UserEntity, location: Location): Promise<LocationEntity> {
        const locationId = await this.locationsRepo.createLocation(location, user)

        this.usersRepo.updateUser({
            ...user,
            locations: [...(user.locations || []), locationId]
        })

        return await this.locationsRepo.getLocationById(locationId)
    }

    async registerUser(user: User) {

        const userEntity = await this.usersRepo.getUserByUsername(user.username)

        if(userEntity) {
            winston.log("info", `Failed to register user ${user.username}. User already exists`)
            throw new Error('USER_EXISTS');
        }

        this.usersRepo.createUser(user);

    }
}