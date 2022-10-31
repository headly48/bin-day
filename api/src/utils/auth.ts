import {default as passport } from 'koa-passport';
import winston from 'winston';
import { UserEntity, UsersRepository } from '../repositories/UsersRepository';
import {Strategy} from 'passport-local';
import {genSaltSync, hashSync, compareSync} from "bcryptjs";

const options = {};



export const configureAuth = (userRepository: UsersRepository) => {
    passport.serializeUser((user: UserEntity, done) => { done(null, user.username); });
    
    passport.deserializeUser((username: string, done) => {
        winston.log("info", `deserializeUser: ${username}`);

        userRepository.getUserByUsername(username).then((user) => {
            if(user) {
                done(null, user);
                return;
            }

            winston.log("error", `Failed to find users for session `, username);
            done(new Error("Error retrieving user"),null);
        }).catch((e) => {
            winston.log("error", `Failed to load session for user: ${username}`, e);
            done(new Error("Error retrieving user"),null);
        })
    });

    
    passport.use(new Strategy(options, (username: string, password: string, done) => {
        winston.log("info", `Logging in user: ${username}, password: ${password}`);

        userRepository.getUserByUsername(username).then((user) => {
            if(user) {
                if(compareSync(password, user.password)) {
                    done(null, user)
                } else {

                    winston.log("info", `Failed to log in user: ${username}, invalid password`);
                    done(null, false)
                }
            } else {
                winston.log("info", `Failed to log in user: ${username}, invalid username`);
                done(null, false)
            }
        }).catch((err) => {
            winston.log("info", `Error logging in user: ${username}`, err);
            done(err);
        })
    }));
} 


