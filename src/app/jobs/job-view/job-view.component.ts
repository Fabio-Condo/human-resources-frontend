import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Job } from 'src/app/core/model/Job';
import { JobsService } from '../jobs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/users/authentication.service';
import { User } from 'src/app/core/model/User';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {

  user: User = new User; 

  imagePath = './assets/meta.jpg'

  job: Job = new Job();
  showLoading: boolean = false;

  constructor(
    private jobsService: JobsService,
    private authenticationService: AuthenticationService, 
    private messageService: MessageService,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromLocalCache();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  isAlreadyAplliedToCurrentJob(): boolean {
    if(this.user){
      return this.user.jobs.some(job => job.id === this.job.id);
    }
    return false;
  }

  findById(id: number) {
    this.jobsService.findByIdForView(id).subscribe(
      (job: Job) => {
        this.job = job;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onApply(){
    if (this.authenticationService.isUserLoggedIn()) { 
      this.addCandidateToJob(this.job.id);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  addCandidateToJob(jobId: number) {
    this.jobsService.addCandidateToJob(this.user.id, jobId).subscribe(
      (job) => {
        this.job = job;
        this.messageService.add({ severity: 'success', detail: 'Candidate added successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
      }
    )
  }

  removeCandidateFromJob(jobId: number) { // Dont use, we will not remove, but only add
    this.jobsService.removeCandidateFromJob(this.user.id, jobId).subscribe(
      (job) => {
        this.job = job;
        this.messageService.add({ severity: 'success', detail: 'Candidate removed successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
      }
    )
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
