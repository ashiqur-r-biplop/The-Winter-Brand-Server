import { Response } from "express";
import { IUser } from "../models/user.model";

import config from "../config";

interface ITokenOption {
    exprire: Date;
    maxAge: number;
    httpOnly: boolean;
    semeSite: "lex" | "strict" | "none" | undefined;
    secure?: boolean;
}


const accessTokenExpire = parseInt(config.jwt.expires_in || "300", 10)
const refreshTokenExpire = parseInt(config.jwt.refresh_expires_in || "1200", 10)

export const accessTokenOption: ITokenOption = {
    exprire: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    semeSite: "lex",
    secure: config.env === "production",
}

export const refreshTokenOption: ITokenOption = {
    exprire: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    semeSite: "lex",
    secure: config.env === "production",
}

const sendToken = () => {

}




export default sendToken