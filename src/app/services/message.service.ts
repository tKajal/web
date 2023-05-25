import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageModal } from '../model/message.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessageService {

    url = "http://localhost:3000";

    constructor(public httpClient: HttpClient) { }

    async getMessages() {
        let url = `${this.url}/messages`
        return await this.httpClient.get(url).toPromise()
    }
    sendMessage(message:any) {
        console.log(message)
        let url = `${this.url}/messages`
        return this.httpClient.post(url,message);
    }
    updateMessages(message:any) {
        console.log(message)
        let url = `${this.url}/messages`
        return this.httpClient.put(url,message);
    }
    updateCount(data:any) {
        console.log(data)
        let url = `${this.url}/count`
        return this.httpClient.put(url,data);
    }
    getCount(data:any) {
        console.log(data)
        let url = `${this.url}/count/${data.roomId}/${data.from}`
        return this.httpClient.get(url);
    }
}
