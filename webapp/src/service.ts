import { jwtDecode } from "jwt-decode";

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
    return makeAuthenticatedRequest({
        endpoint: `${SERVER_URL}/?pageSize=1&includeCount=true`,
        method: 'GET'
    });
}

export const getHelloWorld = async (id: string): Promise<EnhancedResponse> => {
    return makeAuthenticatedRequest({
        endpoint: `${SERVER_URL}/${id}/`,
        method: 'GET'
    });
}

export const postHelloWorld = async (): Promise<EnhancedResponse> => {
    const { accessToken, decodedToken } = await getAuthTokens();

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

export const sayHello = async (helloWorldId: string): Promise<EnhancedResponse> => {
    return makeAuthenticatedRequest({
        endpoint: `${SERVER_URL}/${helloWorldId}/sayHello`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const getAuthTokens = async (): Promise<AuthTokens> => {
    const tokenResponse = await getAccessToken(USER_USERNAME, USER_PASSWORD);
    const tokenBody = await tokenResponse.json();
    const accessToken = tokenBody.access_token as string;
    const decodedToken = jwtDecode(accessToken);

    return { accessToken, decodedToken };
};

const makeAuthenticatedRequest = async (options: RequestOptions): Promise<EnhancedResponse> => {
    const accessToken = options.accessToken || (await getAuthTokens()).accessToken;

    const headers: Record<string, string> = {
        'Authorization': `Bearer ${accessToken}`,
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
    accessToken?: string;
}

interface AuthTokens {
    accessToken: string;
    decodedToken: any;
}
