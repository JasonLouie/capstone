export default class EndpointError {
    #status;
    #message;
    #name = "CustomError";

    constructor(status, message) {
        this.#status = status;
        this.#message = message.split(" ").length === 1 ? this.#formatMsg : message;
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