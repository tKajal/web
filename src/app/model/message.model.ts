export class MessageModal {
    name: string;
    message: any;
    phone: number;

    constructor(options: { name: string, message: any, phone: number }) {
        this.name = options.name;
        this.message = options.message;
        this.phone = options.phone;
    }
}