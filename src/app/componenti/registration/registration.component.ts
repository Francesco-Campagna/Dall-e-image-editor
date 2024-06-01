import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements AfterViewInit{

  registrationSuccess: boolean = false;

  ngAfterViewInit(): void {
    document.getElementById('signupForm')?.addEventListener('submit', function(event) {
      event.preventDefault();

    });
  }

  signup(registrationSuccess: boolean){
    if (registrationSuccess)this.registrationSuccess = true;
    const messageContainer = document.getElementById('messageContainer')!;

    if (registrationSuccess) {
      this.showMessage(messageContainer, 'Registration successful!', 'success');
    } else {
      this.showMessage(messageContainer, 'Error during account registration. Retry.', 'error');
    }
  }


  showMessage(container: HTMLElement, message: string, type: 'success' | 'error') {
    container.textContent = message;
    container.className = `message ${type} show`;
  }

  checkRegistration(){
    const tmp = Math.random();
    if (Math.floor(tmp * 2) % 2 === 0){
      this.signup(true);
    }else{
      this.signup(false);
    }
  }

}
