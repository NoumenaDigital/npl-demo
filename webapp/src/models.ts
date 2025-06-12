export interface HelloWorld {
    "@id": string,
    "@state": string,
    "@actions": {
        sayHello: string
    },
    "@parties": {
        innovator: {
            access: {}
            entity: {}
        }
    }
}
