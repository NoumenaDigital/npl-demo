import { jwtDecode } from "jwt-decode";

const SERVER_URL = `${import.meta.env.VITE_SERVER_URL}/npl/demo/HelloWorld`;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const AUTH_CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID;

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

export const getHelloWorldsCount = async (accessToken: string): Promise<EnhancedResponse> => {
    return makeAuthenticatedRequest({
        endpoint: `${SERVER_URL}/?pageSize=1&includeCount=true`,
        method: 'GET',
        accessToken
    });
}

export const getHelloWorld = async (id: string, accessToken: string): Promise<EnhancedResponse> => {
    return makeAuthenticatedRequest({
        endpoint: `${SERVER_URL}/${id}/`,
        method: 'GET',
        accessToken
    });
}

export const postHelloWorld = async (accessToken: string): Promise<EnhancedResponse> => {
    const decodedToken = jwtDecode(accessToken)

    const payload = {
        "@parties": {
            innovator: {
                entity: { preferred_username: [(decodedToken as any).preferred_username] },
                access: {}
            }
        }
    };

    return makeAuthenticatedRequest({
        endpoint: `${SERVER_URL}/`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload,
        accessToken
    });
}

export const sayHello = async (helloWorldId: string, accessToken:string): Promise<EnhancedResponse> => {
    return makeAuthenticatedRequest({
        endpoint: `${SERVER_URL}/${helloWorldId}/sayHello`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        accessToken
    });
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

const makeAuthenticatedRequest = async (options: RequestOptions): Promise<EnhancedResponse> => {
    const headers: Record<string, string> = {
        'Authorization': `Bearer ${options.accessToken}`,
        ...options.headers
    };

    const fetchOptions: RequestInit = {
        method: options.method,
        headers
    };

    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(options.endpoint, fetchOptions);

    return enhanceResponse(response, options.method, options.endpoint);
};

interface EnhancedResponse extends Response {
    requestInfo: {
        method: string;
        endpoint: string;
        statusCode: number;
    };
}

interface RequestOptions {
    method: string;
    endpoint: string;
    headers?: Record<string, string>;
    body?: any;
    accessToken: string;
}