import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';


export async function getUserByCookies(request: NextRequest) {
    try {
        const token = request.cookies.get('accessToken')?.value || '';
        let tokenState = false;

        const { exp } = jwt.decode(token) as jwt.JwtPayload;
        const isAccessTokenExpired = exp! * 1000 < Date.now();

        if (isAccessTokenExpired) {

            tokenState = true;
            return { _id: '', tokenState: tokenState }

        } else {

            const decordedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;

            return { _id: decordedToken?._id, tokenState: tokenState }
        }

    } catch (error) {
        console.log(error)
    }
}
