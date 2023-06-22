import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService,
    private userService: UserService, 
    private messageService: MessageService,
    private title: Title,
  ) { }

  ngOnInit(): void {
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.messageService.add({ severity: 'success', detail: `You've been successfully logged out` });
  }

}
