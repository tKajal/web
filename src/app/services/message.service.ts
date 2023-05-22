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

    getMessages() {
        let url = `${this.url}/messages`
        return this.httpClient.get(url);
    }
    sendMessage(message:MessageModal) {
        let url = `${this.url}/messages`
        return this.httpClient.post(url,message);
    }
    
}
