import { default as passport } from 'koa-passport';
import winston from 'winston';
import { UserEntity, UsersRepository } from '../repositories/UsersRepository';
import { Strategy as LocalStratagy } from 'passport-local';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { default as jwt } from "jsonwebtoken"

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const options = {};
const JWT_SECRET = "84544-454545-8767-787878";

export const configureAuth = (userRepository: UsersRepository) => {
    passport.serializeUser((user: UserEntity, done) => { done(null, user.username); });

    passport.deserializeUser((username: string, done) => {
        winston.log("info", `deserializeUser: ${username}`);

        userRepository.getUserByUsername(username).then((user) => {
            if (user) {
                done(null, user);
                return;
            }

            winston.log("error", `Failed to find users for session `, username);
            done(new Error("Error retrieving user"), null);
        }).catch((e) => {
            winston.log("error", `Failed to load session for user: ${username}`, e);
            done(new Error("Error retrieving user"), null);
        })
    });


    passport.use(new LocalStratagy({
        session: false,
    }, (username: string, password: string, done) => {
        winston.log("info", `Logging in user: ${username}, password: ${password}`);

        userRepository.getUserByUsername(username).then((user) => {
            if (user) {
                winston.log("info", `Validating password`);
                if (compareSync(password, user.password)) {
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

    const jwtOpts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
        session: false
    }

    // JWT Strategy
    passport.use(new JwtStrategy(jwtOpts,
        // The done is the callback provided by passport
        (jwt_payload, done) => {
            winston.log("info", `Getting user for JWT token`);
            userRepository.getUserById(jwt_payload.sub).then((user) => {
                if (user) {
                    done(null, user)
                } else {
                    winston.log("info", `Failed to get user from token: ${jwt_payload.sub}`);
                    done(null, false)
                }
            }).catch((err) => {
                winston.log("info", `Failed to get user from token`, jwt_payload, err);
                done(err);
            })
        }));
}

export const getToken = function (user: UserEntity) {
    // This helps us to create the JSON Web Token
    return jwt.sign({
        sub: user._id
    }, JWT_SECRET, { expiresIn: 31536000 });
};
