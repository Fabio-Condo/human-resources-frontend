import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { ISkill } from 'src/app/core/interfaces/ISkill';
import { ISkillsFilter } from 'src/app/core/interfaces/ISkillsFilter';
import { Skill } from 'src/app/core/model/Skill';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  showLoading: boolean = false;

  totalRecords: number = 0
  skills: ISkill[] = [];

  skill: ISkill = new Skill;
  displayModalSave: boolean = false;

  sizePage = [
    { label: '5 itens por página', value: 5 },
    { label: '10 itens por página', value: 10 },
    { label: '25 itens por página', value: 25 },
    { label: '50 itens por página', value: 50 },
    { label: '100 itens por página', value: 100 },
  ];

  orderPage = [
    { label: 'Nome (crescente)', value: 'name,asc' },
    { label: 'Nome (decrescente)', value: 'name,desc' },
    { label: 'Id (crescente)', value: 'id,asc' },
    { label: 'Id (decrescente)', value: 'id,desc' },
  ];

  constructor(
    private skillsService: SkillsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Skills page');
  }

  filter: ISkillsFilter = {
    page: 0,
    itemsPerPage: 5,
    sort: 'name,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.skill.id);
  }

  save(skillForm: NgForm) {
    if (this.editing) {
      this.update(skillForm)
    } else {
      this.addNew(skillForm)
    }
  }

  addNew(skillForm: NgForm) {
    this.showLoading = true;
    this.skillsService.add(this.skill).subscribe(
      (skillAdded) => {
        this.skill = skillAdded;
        this.showLoading = false;
        this.getSkills();
        this.messageService.add({ severity: 'success', detail: 'Skill added successfully' });      
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(skillForm: NgForm) {
    this.showLoading = true;
    this.skillsService.update(this.skill).subscribe(
      (skill) => {
        this.skill = skill;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Skill updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getSkills(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
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

  deleteSkill(skill: ISkill) {
    this.skillsService.delete(skill.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getSkills();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Skill deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onAddNewSkill(): void {
    this.skill = new Skill();
    this.displayModalSave = true;
  }

  onEditSkill(editSkill: Skill): void {
    this.skill = editSkill;
    this.skill.id = editSkill.id
    this.displayModalSave = true;
  }

  deletionConfirm(skill: ISkill): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteSkill(skill);
      }
    });
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;  
    this.getSkills(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
