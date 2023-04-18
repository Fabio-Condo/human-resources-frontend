import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/interfaces/IApiResponse';
import { ISkill } from 'src/app/interfaces/ISkill';
import { ISkillsFilter } from 'src/app/interfaces/SkillsFilter';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  totalRecords: number = 0
  skills: ISkill[] = [];

  showLoading: boolean = false;

  constructor(
    private skillsService: SkillsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getSkills();
  }

  filter: ISkillsFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: ''
  }

  getSkills(): void {
    this.showLoading = true;
    this.skillsService.getSkills(this.filter).subscribe(
      (data: IApiResponse<ISkill>) => {
        this.skills = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );   
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
