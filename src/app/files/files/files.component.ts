import { Component, OnInit, ViewChild } from '@angular/core';
import { FilesService } from '../files.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Arquivo } from 'src/app/core/model/Arquivo';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IArquivosFilter } from 'src/app/core/interfaces/IArquivosFilter';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { Title } from '@angular/platform-browser';
//import { saveAs } from 'file-saver';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  filesList: Arquivo[] = [];
  selectedFiles: File[] = [];

  arquivo: Arquivo = new Arquivo;
  displayModalSave: boolean = false;

  showLoading: boolean = false;
  totalRecords: number = 0


  constructor(
    private filesService: FilesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Files page');
    this.getFiles();
  }

  filter: IArquivosFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'nome,asc'
  }

  @ViewChild('table') grid: any;

  onAddNewFile(): void {
    this.arquivo = new Arquivo();
    this.displayModalSave = true;
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadFiles() {
    this.onUploadFiles(this.selectedFiles);
  }

  // define a function to upload files
  onUploadFiles(files: File[]): void {
    this.showLoading = true;
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    this.filesService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.getFiles();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
    this.showLoading = false;
  }

  download(filename: string): void {
    this.filesService.downloadFile(filename).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/octet-stream' });

      // Criar um link temporário para o Blob
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);

      // Definir o atributo "download" com o nome do arquivo
      link.download = filename;

      // Simular um clique no link para iniciar o download
      link.click();

      // Limpar o link após o download iniciar
      window.URL.revokeObjectURL(link.href);
    });
  }

  getFiles(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.filesService.getFiles(this.filter).subscribe(
      (data: IApiResponse<Arquivo>) => {
        this.filesList = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.filter.itemsPerPage = event!.rows!; // actualize a quantidade de itens por página de acordo com a opcao rowsPerPageOptions
    this.getFiles(page);
  }

  deletionConfirm(arquivo: Arquivo): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteFile(arquivo);
      }
    });
  }

  deleteFile(arquivo: Arquivo) {
    console.log("File: " + arquivo.nome)
    this.filesService.delete(arquivo.nome).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getFiles();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'File deleted succefully!' })
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
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
