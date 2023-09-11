import { Job } from "./Job";
import { Profile } from "./Profile";


export class User {
    public id: number; // acrescentado
    public userId: string;
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
    //public jobs: Job[];
    public profile = new Profile;
  
    constructor() {

      this.id = 0; // acrescentado
      this.userId = '';
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
      //this.jobs = [];
      this.profile = new Profile;
    }
  
  }

  