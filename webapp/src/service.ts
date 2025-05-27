import { jwtDecode } from "jwt-decode";

// Environment variables
const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}/npl/demo/HelloWorld`;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const AUTH_CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID;
const USER_USERNAME = import.meta.env.VITE_USER_USERNAME;
const USER_PASSWORD = import.meta.env.VITE_USER_PASSWORD;

export const getAccessToken = async (username: string, password: string): Promise<EnhancedResponse> => {
    const payload = {
        grant_type: 'password',
        username: username,
        password: password,
        client_id: AUTH_CLIENT_ID,
    }

    const urlParams = new URLSearchParams(payload)
    const endpoint = AUTH_URL;
    const method = 'POST';
    const response = await fetch(endpoint, {
        method,
        body: urlParams
    })

    return enhanceResponse(response, method, endpoint);
}

interface EnhancedResponse extends Response {
    requestInfo: {
        method: string;
        endpoint: string;
        statusCode: number;
    };
}

const enhanceResponse = async (response: Response, method: string, endpoint: string): Promise<EnhancedResponse> => {
    const enhancedResponse = response as EnhancedResponse;
    enhancedResponse.requestInfo = {
        method,
        endpoint,
        statusCode: response.status
    };
    return enhancedResponse;
};

export const getHelloWorldsCount = async (): Promise<EnhancedResponse> => {
    const tokenResponse = await getAccessToken(USER_USERNAME, USER_PASSWORD);
    const tokenBody = await tokenResponse.json();
    const accessToken = tokenBody.access_token as string;

    const endpoint = `${SERVER_URL}/?pageSize=1&includeCount=true`;
    const method = 'GET';
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    return enhanceResponse(response, method, endpoint);
}

export const getHelloWorld = async (id: string): Promise<EnhancedResponse> => {
    const tokenResponse = await getAccessToken(USER_USERNAME, USER_PASSWORD);
    const tokenBody = await tokenResponse.json();
    const accessToken = tokenBody.access_token as string;

    const endpoint = `${SERVER_URL}/${id}/`;
    const method = 'GET';
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    });

    return enhanceResponse(response, method, endpoint);
}

export const postHelloWorld = async (): Promise<EnhancedResponse> => {
    const tokenResponse = await getAccessToken(USER_USERNAME, USER_PASSWORD);
    const tokenBody = await tokenResponse.json();
    const accessToken = tokenBody.access_token as string;
    const decodedToken = jwtDecode(accessToken);

    const payload = {
        "@parties": {
            innovator: {
                entity: { preferred_username: [(decodedToken as any).preferred_username] },
                access: {}
            }
        }
    }

    const endpoint = `${SERVER_URL}/`;
    const method = 'POST';
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    return enhanceResponse(response, method, endpoint);
}

export const sayHello = async (helloWorldId: string, name: string): Promise<EnhancedResponse> => {
    const tokenResponse = await getAccessToken(USER_USERNAME, USER_PASSWORD);
    const tokenBody = await tokenResponse.json();
    const accessToken = tokenBody.access_token as string;

    const payload = {
        name: name
    }

    const endpoint = `${SERVER_URL}/${helloWorldId}/sayHello`;
    const method = 'POST';
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    return enhanceResponse(response, method, endpoint);
}
