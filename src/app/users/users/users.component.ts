import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomHttpRespone } from 'src/app/core/interfaces/CustomHttpRespone';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { IUserFilter } from 'src/app/core/interfaces/IUserFilter';
import { User } from 'src/app/core/model/User';
import { Role } from 'src/app/enum/role.enum';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  displayModalSave= false;
  displayModalSettingsUser= false;

  users: User[] = []; 
  fileName: any; 
  currentUsername: string = ''; 
  profileImage: any; 
  subscriptions: Subscription[] = [];

  showLoading: any;
  user = new User();
  selectedUserView: User =  new User;
  selectedUserModal: User =  new User;
  displayModal: boolean = false;

  displayModalFilter: boolean = false;

  orderPage = [
    { label: 'First Name asc', value: 'firstName,asc' },
    { label: 'First Name desc', value: 'firstName,desc' },
    { label: 'Last Name asc', value: 'lastName,asc' },
    { label: 'Last Name desc', value: 'lastName,desc' },
    { label: 'Email asc', value: 'email,asc' },
    { label: 'Email desc', value: 'email,desc' },
    { label: 'Username asc', value: 'username,asc' },
    { label: 'Username desc', value: 'username,desc' },
    { label: 'Id asc', value: 'id,asc' },
    { label: 'Id desc', value: 'id,desc' },
  ];

  roles = [
    { label: 'CANDIDATE', value: 'ROLE_CANDIDATE' },
    { label: 'ADMIN', value: 'ROLE_ADMIN' },
    { label: 'SUPER ADMIN', value: 'ROLE_SUPER_ADMIN' },
  ];

  sizePage = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  userStatus = [
    { label: 'Both', value: 'trueAndFalse' },
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ];

  userNotLocked = [
    { label: 'Both', value: 'trueAndFalse' },
    { label: 'True', value: 'true' },
    { label: 'False', value: 'false' },
  ];

  genders = [
    { label: 'Masculino', value: 'MASCULINE' },
    { label: 'Feminino', value: 'FEMININE' },
  ];

  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService,
    private userService: UserService, 
    private messageService: MessageService,
    private title: Title,
    private confirmationService: ConfirmationService,
    ) {   
  }

  ngOnInit(): void {
    this.title.setTitle('Users page');
  }

  @ViewChild('table') grid: any;

  totalRecords: number = 0

  filter: IUserFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'person.firstName,asc',
    isActive: 'trueAndFalse',
    isNotLocked: 'trueAndFalse'
  }

  get editing() {
    return Boolean(this.user.userId)
  }

  save(userForm: NgForm) {
    if (this.editing) {
      console.log("Editing")
      this.onUpdateUser(userForm) 
    } else {
      console.log("New")
      this.onAddNewUser(userForm)
    }
  }

  filterAll(page: number = 0){
    this.showLoading = true;
    this.filter.page = page;
    this.userService.filter(this.filter).subscribe(
      (data: IApiResponse<User>) => {
        this.users = data.content
        this.totalRecords = data.totalElements
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  public onAddNewUser(userForm: NgForm): void {
    this.showLoading = true;
    const formData = this.userService.createUserFormDate(null, this.user, this.profileImage);
    //const formData = this.userService.createUserFormDate(null, userForm.value, this.profileImage);
    this.subscriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: any) => {  //Should be (response: User) -> If i use like this, it will return an error because in formData i added countryId, Object Country. 
          //this.user = response;  // I cant use this, because the response is not User, is something else, because i dont have Country Object in formData
          this.displayModalSave = false;
          this.fileName = null;
          this.profileImage = null;
          this.messageService.add({ severity: 'success', detail: `${response.firstName} ${response.lastName} added successfully`});
          this.filterAll();
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.profileImage = null;
          this.showLoading = false;
        }
      )
    );
  }

  public onUpdateUser(userForm: NgForm): void {
    console.log("Passando daqui -- editing")
    this.showLoading = true;
    const formData = this.userService.createUserFormDate(this.currentUsername, this.user, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.user = response;
          this.fileName = null;
          this.profileImage = null;
          this.messageService.add({ severity: 'success', detail: `${response.person.firstName} ${response.person.lastName} updated successfully` });
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.profileImage = null;
          this.showLoading = false;
        }
      )
    );
  }

  public onResetPassword(emailForm: NgForm): void {
    this.showLoading = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push(
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpRespone) => {
          this.messageService.add({ severity: 'success', detail: response.message });
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.showLoading = false;
        },
        () => emailForm.reset()
      )
    );
  }

  public onDeleteUder(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpRespone) => {

          if (this.grid.first === 0) {
            this.filterAll();
          } else {
            this.grid.reset();
          }
          this.messageService.add({ severity: 'success', detail: response.message });
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  confirmarExclusao(user: User): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
          this.onDeleteUder(user.username);
      }
    });
  }

  changeStatusActive(user: User): void {
    const newStatus = !user.active;
    this.userService.changeStatusActive(user.username, newStatus).subscribe(
      () => {
        const acao = newStatus ? 'active' : 'inactive';
        user.active = newStatus;
        this.messageService.add({ severity: 'success', detail: `User ${acao} with sucess!` });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  changeStatusNotLocked(user: User): void {
    const newStatus = !user.notLocked;
    this.userService.changeStatusNotLocked(user.username, newStatus).subscribe(
      () => {
        const acao = newStatus ? 'true' : 'false';
        user.notLocked = newStatus;
        this.messageService.add({ severity: 'success', detail: `User ${acao} with success!` });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.filterAll(page);
  }

  public onEditUser(editUser: User): void {
    this.user = editUser;
    this.currentUsername = editUser.username;
    this.displayModalSave = true;
  }

  onAddNewUserModal() {  
    this.user = new User();
    this.displayModalSave = true;
  }

  onUserSettings() {  
    this.displayModalSettingsUser = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onSelectUser(selectedUser: User): void {
    this.selectedUserModal = selectedUser;
    this.displayModal = true;
  }

  onProfileImageChange(fileName: any, profileImage: any): void {    
    this.fileName =  fileName.target.files[0].name;
    this.profileImage = profileImage.target.files[0];
  }

  public onFilter(): void {
    this.displayModalFilter = true;
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

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }
  
  resetFields(){
    this.filter.name = "";
    this.filter.firstName = ""
    this.filter.lastName = ""
    this.filter.username = ""
    this.filter.role = ""
    this.filter.email = ""
    this.filter.isActive = "trueAndFalse";
    this.filter.isNotLocked = "trueAndFalse";
    this.filter.sort = "firstName,asc";
    this.filterAll();
  }
}
