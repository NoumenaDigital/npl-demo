import type {HelloWorld} from "./models.ts";

export const getAccessToken = async (username: string, password: string) => {
    const payload = {
        grant_type: 'password',
        username: username,
        password: password,
        client_id: 'test-client',
    }

    const urlParams = new URLSearchParams(payload)
    const response = await fetch('http://localhost:11000/token', {
        method: 'POST',
        body: urlParams
    })
    return await extractAccessToken(response)
}

export const getHelloWorldsCount = async (): Promise<number> => {
    const accessToken = await getAccessToken('alice', 'password123');
    const response = await fetch('http://localhost:8080/npl/demo/HelloWorld/?includeCount=true', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })

    const body = await response.json()

    return body.totalItems as number
}

export const getHelloWorld = async (id: string): Promise<HelloWorld> => {
    const accessToken = await getAccessToken('alice', 'password123');
    const response = await fetch(`http://localhost:8080/npl/demo/HelloWorld/${id}/`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })

    const body = await response.json()

    return body as HelloWorld
}

export const postHelloWorld = async (): Promise<HelloWorld> => {
    const accessToken = await getAccessToken('alice', 'password123');
    const payload = {
        "@parties": {
            innovator: {
                entity: {},
                access: {}
            }
        }
    }

    const response = await fetch('http://localhost:8080/npl/demo/HelloWorld/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload)
    })

    const body = await response.json()

    return body as HelloWorld
}

export const sayHello = async (helloWorldId: string, name: string): Promise<string> => {
    const accessToken = await getAccessToken('alice', 'password123');
    const payload = {
        name: name
    }

    const response = await fetch(`http://localhost:8080/npl/demo/HelloWorld/${helloWorldId}/sayHello`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload)
    })

    const body = await response.json()

    if (response.status === 400) {
        return body.message as string
    }

    return body as string
}

const extractAccessToken = async (response: Response): Promise<string> => {
    const body = await response.json();

    if (!response.ok) {
        // Handle specific status codes
        if (response.status === 401) {
            throw new Error('Unauthorized: Invalid username or password');
        } else {
            // Handle other error status codes
            throw new Error(`Error ${response.status}: ${body.error || 'Failed to authenticate'}`);
        }
    }

    return body.access_token as string;
}
