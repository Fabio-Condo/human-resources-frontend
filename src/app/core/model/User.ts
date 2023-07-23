import { Job } from "./Job";
import { ProfessionalExperience } from "./ProfessionalExperience";
import { UserContact } from "./UserContact";
import { UserSkill } from "./UserSkill";
import { UserTraining } from "./UserTraining";


export class User {
    public id: number; // acrescentado
    public userId: string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public email: string;
    public bio: string;
    public lastLoginDate: any;  // Date;
    public lastLoginDateDisplay: any; // Date;
    public joinDate: any;  // Date;
    public profileImageUrl: string;
    public active: boolean;
    public notLocked: boolean;
    public role: string;
    public company: string;
    public designation: string;
    public phoneNumber: string;
    public gender: string;
    public authorities: [];
    public jobs: Job[];
    public professionalExperiences: ProfessionalExperience[];
    public userTrainings: UserTraining[];
    public userContacts: UserContact[];
    public userSkills: UserSkill[];

  
    constructor() {

      this.id = 0; // acrescentado
      this.userId = '';
      this.firstName = '';
      this.lastName = '';
      this.username = '';
      this.email = '';
      this.bio = '';
      this.lastLoginDate = '';
      this.lastLoginDateDisplay = '';
      this.joinDate = '';
      this.profileImageUrl = '';
      this.active = false;
      this.notLocked = false;
      this.role = '';
      this.company = '';
      this.designation = '';
      this.phoneNumber = '';
      this.gender = ''
      this.authorities = [];
      this.jobs = [];
      this.professionalExperiences = [];
      this.userTrainings = [];
      this.userContacts = [];
      this.userSkills = [];
    }
  
  }

  