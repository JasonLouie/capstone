const errorNames = {400: "BadRequest", 401: "Unauthorized", 403: "Forbidden", 404: "NotFound", 409: "Conflict", 500: "ServerError"};

export default class EndpointError {
    #status;
    #message;
    #name;

    constructor(status, message) {
        this.#status = status;
        
        this.#message = typeof message === "string" && message.split(" ").length === 1 ? this.#formatMsg : message;
        this.#name = errorNames[status];
    }

    get status() {
        return this.#status;
    }

    get message() {
        return this.#message;
    }

    get name() {
        return this.#name;
    }

    #formatMsg(status, message) {
        const messages = {404: `${message} not found.`, 500: "Internal Server Error."};
        return messages[status];
    }

    toJSON() {
        return {name: this.#name, status: this.#status, message: this.#message};
    }
}