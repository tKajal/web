import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    url = "http://localhost:3000";

    constructor(public httpClient: HttpClient) { }

    async getUsers() {
        let url = `${this.url}/users`
        return await this.httpClient.get(url).toPromise()
    }
    sendMessage(message:any) {
       
        console.log(message)
        let url = `${this.url}/messages`
        return this.httpClient.post(url,message);
    }
  
}
