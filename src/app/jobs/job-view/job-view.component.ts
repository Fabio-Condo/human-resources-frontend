import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { Job } from 'src/app/core/model/Job';
import { JobsService } from '../jobs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/users/authentication.service';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.css']
})
export class JobViewComponent implements OnInit {

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
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
  }

  findById(id: number) {
    this.jobsService.findByIdForView(id).subscribe(
      (job: Job) => {
        this.job = job;
        console.log(this.job.position.name);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onApply(){
    if (this.authenticationService.isUserLoggedIn()) { 
      console.log("Implentar a candidatura")
      this.messageService.add({ severity: 'success', detail: 'Applied successfully!' });
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
