import { HttpErrorResponse} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/core/model/User';
import { Role } from 'src/app/enum/role.enum';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { FileUploadStatus } from 'src/app/core/model/file-upload.status';
import { NgForm } from '@angular/forms';
import { UserContact } from 'src/app/core/model/UserContact';
import { UserTraining } from 'src/app/core/model/UserTraining';
import { UserSkill } from 'src/app/core/model/UserSkill';
import { ProfessionalExperience } from 'src/app/core/model/ProfessionalExperience';
import { ProvinceService } from 'src/app/provinces/provincia.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  private titleSubject = new BehaviorSubject<string>('Users');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[] = []; 
  public user: User = new User; 
  public refreshing: boolean = false; 
  public selectedUser: User =  new User; 
  public fileName: any; 
  public profileImage: any; 
  private subscriptions: Subscription[] = [];
  public editUser = new User();
  private currentUsername: string = ''; 
  public fileStatus = new FileUploadStatus();

  imagePath = './assets/meta.jpg'

  provinces: any[] = [];

  contact?: UserContact;
  contacts: Array<UserContact> = []
  showContactForm = false;
  contactIndex?: number;

  training?: UserTraining;
  trainings: Array<UserTraining> = []
  showTrainingForm = false;
  trainingIndex?: number;

  skill?: UserSkill;
  skills: Array<UserSkill> = []
  showSkillForm = false;
  skillIndex?: number;

  professionalExperience?: ProfessionalExperience;
  professionalExperiences: Array<ProfessionalExperience> = []
  showProfessionalExperienceForm = false;
  professionalExperienceIndex?: number;

  roles = [
    { label: 'USER', value: 'ROLE_USER' },
    { label: 'ADMIN', value: 'ROLE_ADMIN' },
    { label: 'SUPER ADMIN', value: 'ROLE_SUPER_ADMIN' },
  ];


  constructor(
    private router: Router, 
    private authenticationService: AuthenticationService,
    private userService: UserService, 
    private provinceService: ProvinceService,
    private messageService: MessageService,
    private title: Title,
    private confirmationService: ConfirmationService,
    ) {  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    this.getProvinces();
  }

  onUpdateCurrentUser(user: User): void { // Not used
    this.refreshing = true;
    this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
    const formData = this.userService.createUserFormDate(this.currentUsername, user, this.profileImage);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.fileName = null;
          this.profileImage = null;
          this.refreshing = false;
          this.messageService.add({ severity: 'success', detail: `${response.firstName} ${response.lastName} password updated successfully` });
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(errorResponse.error.message);
          this.refreshing = false;
          this.profileImage = null;
        }
      )
    );
  }

  onUpdate(userForm: NgForm) {
    this.refreshing
    this.userService.update(this.user).subscribe(
      (userAdded) => {
        this.user = userAdded;
        this.authenticationService.addUserToLocalCache(userAdded);
        this.fileName = null;
        this.profileImage = null;
        this.refreshing = false;
        this.messageService.add({ severity: 'success', detail: 'User updated successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(errorResponse.error.message);
        this.refreshing = false;
        this.profileImage = null;
      }
    );
  }

  getProvinces() {
    this.provinceService.findAll().then(data => {
      this.provinces = data.map((province:any) => ({ 
        label: province.name,
        value: province.id 
      }));
    }),
    (errorResponse: HttpErrorResponse) => {
      this.sendNotification(errorResponse.error.message);
      this.refreshing = false;
    }
  } 

  onProfileImageChange(fileName: any, profileImage: any): void {    
    this.fileName =  fileName.target.files[0].name;
    this.profileImage = profileImage.target.files[0];
  }

  public updateProfileImage(): void {
    //this.clickButton('profile-image-input');
  }

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.messageService.add({ severity: 'success', detail: `You've been successfully logged out` });
  }

  private sendNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  // Contacts
  getReadyNewContact() {
    this.showContactForm = true;
    this.contact = new UserContact();
    this.contactIndex = this.user.userContacts.length;
  }

  getReadyContactEdit(contact: UserContact, index: number) {
    this.contact = this.cloneContact(contact);
    this.showContactForm = true;
    this.contactIndex = index;
  }

  confirmContact(frm: NgForm) {
    this.user.userContacts[this.contactIndex!] = this.cloneContact(this.contact!);
    this.showContactForm = false;
    frm.reset();
  }

  cloneContact(contact: UserContact): UserContact {
    return new UserContact(contact.id, contact.contactNumber);
  }

  get editingContact() { 
    return this.contact && this.contact?.id;
  }

  removeContact(index: number) {
    this.user.userContacts.splice(index, 1);
  }

   // Training
   getReadyNewTraining() {
    this.showTrainingForm = true;
    this.training = new UserTraining();
    this.trainingIndex = this.user.userTrainings.length;
  }

  getReadyTrainingEdit(training: UserTraining, index: number) {
    this.training = this.cloneTraining(training);
    this.showTrainingForm = true;
    this.convertTrainingStringsToDates([this.training]);
    this.trainingIndex = index;
  }

  confirmTraining(frm: NgForm) {
    this.user.userTrainings[this.trainingIndex!] = this.cloneTraining(this.training!);
    this.showTrainingForm = false;
    frm.reset();
  }

  cloneTraining(training: UserTraining): UserTraining {
    return new UserTraining(training.id, training.description, training.begin, training.end);
  }

  get editingTraining() { 
    return this.training && this.training?.id;
  }

  removeTraining(index: number) {
    this.user.userTrainings.splice(index, 1);
  }

  // Skills
  getReadyNewSkill() {
    this.showSkillForm = true;
    this.skill = new UserSkill();
    this.skillIndex = this.user.userSkills.length;
  }

  getReadySkillEdit(skill: UserSkill, index: number) {
    this.skill = this.cloneSkill(skill);
    this.showSkillForm = true;
    this.skillIndex = index;
  }

  confirmSkill(frm: NgForm) {
    this.user.userSkills[this.skillIndex!] = this.cloneSkill(this.skill!);
    this.showSkillForm = false;
    frm.reset();
  }

  cloneSkill(skill: UserSkill): UserSkill {
    return new UserSkill(skill.id, skill.name);
  }

  get editingSkill() { 
    return this.skill && this.skill?.id;
  }

  removeSkill(index: number) {
    this.user.userSkills.splice(index, 1);
  }

  // Professional Experience
  getReadyNewProfessionalExperience() {
    this.showProfessionalExperienceForm = true;
    this.professionalExperience = new ProfessionalExperience();
    this.professionalExperienceIndex = this.user.professionalExperiences.length;
  }

  getReadyProfessionalExperienceEdit(professionalExperience: ProfessionalExperience, index: number) {
    this.professionalExperience = this.cloneProfessionalExperience(professionalExperience);
    this.showProfessionalExperienceForm = true;
    this.convertTrainingStringsToDates([this.professionalExperience]);
    this.professionalExperienceIndex = index;
  }

  confirmProfessionalExperience(frm: NgForm) {
    this.user.professionalExperiences[this.professionalExperienceIndex!] = this.cloneProfessionalExperience(this.professionalExperience!);
    this.showProfessionalExperienceForm = false;
    frm.reset();
  }

  cloneProfessionalExperience(professionalExperience: ProfessionalExperience): ProfessionalExperience {
    return new ProfessionalExperience(professionalExperience.id, professionalExperience.description, professionalExperience.company, professionalExperience.beginDate, professionalExperience.endDate, professionalExperience.province);
  }

  get editingProfessionalExperience() { 
    return this.professionalExperience && this.professionalExperience?.id;
  }

  removeProfessionalExperience(index: number) {
    this.user.professionalExperiences.splice(index, 1);
  }

  private convertTrainingStringsToDates(training: any[]) {
    for (const train of training) {
      train.begin = new Date(train.begin);
    }
    for (const train of training) {
      train.end = new Date(train.end);
    }
    for (const train of training) {
      train.beginDate = new Date(train.beginDate);
    }
    for (const train of training) {
      train.endDate = new Date(train.endDate);
    }
  }

  
}
