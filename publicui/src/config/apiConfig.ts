import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { jwtDecode } from "jwt-decode";
import { ITokenInfo, ITokenResponse } from "../types";
import { BaseEndpoints } from "./BaseEndpoints";

// const getAppToken = async () => {
//     const res = await fetch(`${BaseEndpoints.base}/connect/token`);
//     const data: ITokenResponse = await res.json();
//     return data;
// };
const getAppToken = async (): Promise<ITokenResponse> => {
    // Encode client credentials in Base64 format
    //const credentials = btoa(`${clientId}:${clientSecret}`);

    const res = await fetch(`${BaseEndpoints.base}/connect/token`, {
        method: 'POST',
        mode: 'cors', 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Authorization': `Basic ${credentials}`
        },
        body: new URLSearchParams({
            'client_id': import.meta.env.VITE_API_CLIENTID,
            'client_secret': import.meta.env.VITE_API_SECRET,
            'grant_type': 'client_credentials',
            // 'scope': 'api.read api.write' 
        })
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch token: ${res.status} ${res.statusText}`);
    }

    const data: ITokenResponse = await res.json();
    console.log("token",data)
    return data;
};
const setAccessToken = (token: string, exp: number) => {
    localStorage.setItem("token", token);
};
const getAccessToken = () => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) return accessToken;
    else return null;
};

export const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    { baseUrl?: string }
> = async (args, api, extraOptions) => {
    const baseUrl = BaseEndpoints.base;// extraOptions?.baseUrl || ``;
    const baseQuery = fetchBaseQuery({ baseUrl });

    const accessToken = getAccessToken();

    const fetchArgs: FetchArgs =
        typeof args === "string" ? { url: args } : { ...args };

    const headers: Record<string, string> = fetchArgs.headers
        ? fetchArgs.headers instanceof Headers
            ? Object.fromEntries(fetchArgs.headers.entries())
            : Array.isArray(fetchArgs.headers)
                ? Object.fromEntries(fetchArgs.headers)
                : fetchArgs.headers
        : {};
   // let headers:any={};
   // headers['Content-Type'] = 'application/x-www-form-urlencoded';
    headers['Access-Control-Allow-Origin'] = '*';

     const currentAccessToken = getAccessToken();
    let tokenToUse = currentAccessToken;
    
    if (currentAccessToken) {
        try {
            const currentTokenInfo = jwtDecode(currentAccessToken) as ITokenInfo;
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            
            // Check if token is expired (add 60 seconds buffer for safety)
            if (currentTokenInfo.exp && currentTokenInfo.exp < (currentTime + 60)) {
                console.log("Token expired or about to expire, refreshing...");
                tokenToUse = null; // Force token refresh
            }
        } catch (error) {
            console.error("Error decoding existing token:", error);
            tokenToUse = null; // Force token refresh on decode error
        }
    }

    // If no valid token, get a new one
    if (!tokenToUse) {
        try {
            const data = await getAppToken();
            if (data?.access_token) {
                const tokenInfo = jwtDecode(data.access_token) as ITokenInfo;
                console.log("New token decoded", tokenInfo, data);                
                setAccessToken(data.access_token, tokenInfo.exp);
                tokenToUse = data.access_token;
            } else {
                throw new Error("Failed to get access token");
            }
        } catch (error) {
            console.error("Error getting new token:", error);
            // Handle token refresh failure (redirect to login, etc.)
            // window.location.href = "/login";
            throw error;
        }
    }

     // Set authorization header with the valid token
    headers["Authorization"] = `Bearer ${tokenToUse}`;
     fetchArgs.headers = headers;
    const result = await baseQuery(fetchArgs, api, extraOptions);
    if (result.data && typeof result.data === "object" && "Code" in result.data) {
        const code = (result.data as any).Code;
        if (typeof code === "number" && (code < 200 || code >= 300)) {
            return {
                error: {
                    status: code,
                    data: result.data,
                },
            };
        }
    }

    return result;
};
