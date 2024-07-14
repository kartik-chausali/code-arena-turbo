"use client"
import Link from "next/link"
import {useSession, signOut, signIn} from "next-auth/react"
import { CodeIcon } from "./Icon"
import { Button } from "@repo/ui/button";
export default function AppBar(){

    const {data:session, status:sessionStatus} = useSession();
    const loading = sessionStatus === "loading"

    
    return <div className="border-b-2 px-4 bg-gray-900 text-white md:px-6 py-3 items-center flex justify-between">
        <div>
            <Link href='/' prefetch={false} className="flex items-center gap-2">
                <CodeIcon/>
                <span className="text-lg font-bold">Code-Arena</span>
            </Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
        <Link href="/contests" className="hover:underline" prefetch={false}>
          Contests
        </Link>
        <Link href="/problems" className="hover:underline" prefetch={false}>
          Problems
        </Link>
        <Link href="/standings" className="hover:underline" prefetch={false}>
          Standings
        </Link>
        </div>
        <div>
            {!loading && session?.user && (
                 <div className="flex items-center gap-4">
                 <Button onClick={() => signOut()}>Logout</Button>
               </div>
            )}

            {!loading && !session?.user && (
                <div className="flex items-center gap-4">
                <Button onClick={() => signIn()}>Signin</Button>
              </div>
            )}

            {loading && <div className="flex items-center gap-4"></div>}
        </div>
    </div>
}