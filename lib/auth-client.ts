import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    // sssss

    baseURL: "https://nextblog-blogging.vercel.app"
    // baseURL: "http://localhost:3000"
})