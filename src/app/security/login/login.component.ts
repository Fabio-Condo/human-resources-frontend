import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { HeaderType } from 'src/app/enum/header-type.enum';
import { MessageService } from 'primeng/api';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { AuthenticationService } from 'src/app/users/authentication.service';
import { User } from 'src/app/core/model/User';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  imagePath = './assets/scilogo.png'
  public showLoading: any;
  private subscriptions: Subscription[] = [];

  isLogin: boolean = true;

  countries: any[] = [];
  continents: any[] = [];
  selectedContinent?: number;

  user = new User();

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService, 
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {

    if (this.authenticationService.isUserLoggedIn()) { 
      this.router.navigateByUrl('/v1/jobs');
    } else {
      this.router.navigateByUrl('/login');
    }

  }

  public onLogin(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
       
        (response: HttpResponse<User>) => {
          this.showLoading = false;
          const token = response.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body); 
          this.router.navigateByUrl('v1/jobs');       
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  public onRegister(user: NgForm): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(this.user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.messageService.add({ severity: 'success', detail: 'A new account was created for ${response.firstName}.Please check your email for password to log in.' })
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }


  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
