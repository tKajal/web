import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PhoneService } from 'src/app/services/phone.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  phone: string = '';

  constructor(public router:Router,private phoneService: PhoneService){

  }
  onSubmit() {
    if (this.phone) {
      this.phoneService.setPhoneNumber(this.phone);
      this.router.navigateByUrl('/dashboard')
      console.log('Phone number entered:', this.phone);
      // Navigate to the next step or perform an action
    }
  }
}
