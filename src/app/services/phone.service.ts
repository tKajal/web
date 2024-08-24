// phone.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {
  private phoneNumber: string = '';

  setPhoneNumber(phone: string) {
    this.phoneNumber = phone;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }
}
