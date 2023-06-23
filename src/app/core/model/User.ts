import { Job } from "./Job";


export class User {
    public id: number; // acrescentado
    public userId: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string;
    public lastLoginDate: any;  // Date;
    public lastLoginDateDisplay: any; // Date;
    public joinDate: any;  // Date;
    public profileImageUrl: string;
    public active: boolean;
    public notLocked: boolean;
    public role: string;
    public authorities: [];
    public jobs: Job[];

  
    constructor() {

      this.id = 0; // acrescentado
      this.userId = '';
      this.firstName = '';
      this.lastName = '';
      this.username = '';
      this.email = '';
      this.lastLoginDate = '';
      this.lastLoginDateDisplay = '';
      this.joinDate = '';
      this.profileImageUrl = '';
      this.active = false;
      this.notLocked = false;
      this.role = '';
      this.authorities = [];
      this.jobs = [];
    }
  
  }


  export class UserChangePass {

    public currentPass: string;
    public newPass: string;
    public newPassConfirmation: string;
  
    constructor() {

      this.currentPass = '';
      this.newPass = '';
      this.newPassConfirmation = '';

    }
  
  }
  