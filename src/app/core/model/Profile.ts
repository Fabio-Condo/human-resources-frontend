import { Job } from "./Job";
import { Person } from "./Person";
import { ProfessionalExperience } from "./ProfessionalExperience";
import { UserContact } from "./UserContact";
import { UserSkill } from "./UserSkill";
import { UserTraining } from "./UserTraining";

export class Profile{
    id!: number;
    profileImageUrl!: string;
    bio!: string;
    company!: string;
    designation!: string;
    phoneNumber!: string;
    person = new Person;
    contacts: UserContact[] = [];
    skills: UserSkill[] = [];
    professionalExperiences: ProfessionalExperience[] = [];
    trainings: UserTraining[] = [];
    jobs: Job[] = [];

}