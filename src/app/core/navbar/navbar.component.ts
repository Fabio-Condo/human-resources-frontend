import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AuthenticationService } from 'src/app/users/authentication.service';
import { User } from '../model/User';
import { Role } from 'src/app/enum/role.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user: User = new User; 
  isUserLoggedIn: boolean = false;

  imagePath = './assets/meta.jpg'

  showMenu: boolean = false;

  items!: MegaMenuItem[];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService, 
  ) { }

  //ngOnInit(): void {
  //}

  ngOnInit() {
    this.isUserLoggedIn = this.authenticationService.isUserLoggedIn();
    this.user = this.authenticationService.getUserFromLocalCache();
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, true);
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isSuperAdmin(): boolean {
    return this.getUserRole() === Role.SUPER_ADMIN;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

}
