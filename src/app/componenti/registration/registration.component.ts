import {AfterViewInit, Component} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {RegistrationRequestDto} from "../../Model/RegistrationRequestDto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements AfterViewInit{

  name: string | undefined;
  surname: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  password : string | undefined;
  registrationSuccess: boolean = false;



  constructor(private authenticationService: AuthService, private router: Router) {
  }

  ngAfterViewInit(): void {
    document.getElementById('signupForm')?.addEventListener('submit', function(event) {
      event.preventDefault();

    });
  }


  showMessage(container: HTMLElement, message: string, type: 'success' | 'error') {
    container.textContent = message;
    container.className = `message ${type} show`;
  }

  handleRegistration(){
    if (this.name && this.surname && this.email && this.phone && this.password) {
      const registrationDto = new RegistrationRequestDto();
      registrationDto.name = this.name;
      registrationDto.surname = this.surname;
      registrationDto.email = this.email;
      registrationDto.phone = this.phone;
      registrationDto.password = this.password;
      this.authenticationService.register(registrationDto).subscribe(
        (result) => {
          this.registrationSuccess = true;
          this.router.navigate(['/login']);
        },
        () => {
          this.registrationSuccess = false;
          // Puoi gestire eventuali errori di registrazione qui
        }
      );
    } else {
      // Gestione dei campi mancanti per la registrazione
      // Puoi impostare un flag o un messaggio di errore appropriato qui
    }
  }

}
