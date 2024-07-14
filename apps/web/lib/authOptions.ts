/* eslint-disable no-undef */
import {prismaClient} from "@repo/db/client"
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import {JWTPayload, SignJWT, importJWK } from 'jose'
import { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface session extends Session {
    user: {
      id: string;
      jwtToken: string;
      email: string;
      name: string;
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    token: string;
  }

  interface token extends JWT {
    uid: string;
    jwtToken: string;
  }

export const authOptions = {
    providers:[
        CredentialsProvider({
            name:"credentials",
            credentials:{
                username: { label: "email", type: "text", placeholder: "" },
                password: { label: "password", type: "password", placeholder: "" },
            },
            async authorize(credentials: any) {
                if(!credentials.username || !credentials.password){
                    return null
                }

                const userInDb = await prismaClient.user.findFirst({
                    where:{
                        email: credentials.username
                    },
                    select:{
                        id:true,
                        password:true,
                        name:true,
                    }
                })

                if(userInDb){
                    if(await bcrypt.compare(credentials.password, userInDb.password)){

                        const jwt = generateToken({
                            id:userInDb.id
                        });

                        return {
                            id:userInDb.id,
                            name:userInDb.name,
                            email:credentials.username,
                            token:jwt
                        }
                    }else{
                        return null
                    }
                }
                
                try{
                    if(credentials.username.length < 2){
                        return null;
                    }
                    if(credentials.password.length < 2){
                        return null;
                    }
                    const hashedPassword = await bcrypt.hash(credentials.password, 10)
                    const user = await prismaClient.user.create({
                        data:{
                            email: credentials.username,
                            name:credentials.username,
                            password:hashedPassword
                        }
                    })

                    const jwt = generateToken({
                        id:user.id
                    });

                    return {
                        id:user.id,
                        name:credentials.username,
                        email:credentials.username,
                        token:jwt
                    }

                }catch(e){
                    console.log("is problem here ")
                    console.log(e);
                    return null;
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET, 
    callbacks: {
        session: async ({ session, token }:any) => {
          const newSession: session = session as session;
          if (newSession.user && token.uid) {
            newSession.user.id = token.uid as string;
            newSession.user.jwtToken = token.jwtToken as string;
          }
          return newSession!;
        },
        jwt: async ({ token, user }:any): Promise<JWT> => {
          const newToken = token;
    
          if (user) {
            newToken.uid = user.id;
            newToken.jwtToken = (user as User).token;
          }
          return newToken;
        },
      },
}

async function generateToken(payload : JWTPayload){

    const secret  = process.env.JWT_SECRET || "secret";

    const jwk = await importJWK({k:secret , alg:"HS256", kty:"oct"});

    const jwt = await new SignJWT(payload)
    .setProtectedHeader({alg:"HS256"})
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(jwk)

    return jwt
}