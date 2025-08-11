export interface HelloWorld {
    "@id": string,
    "@state": string,
    "@actions": {
        sayHello: string
    },
    "@parties": {
        greeter: {
            access: {}
            entity: {}
        }
    }
}
