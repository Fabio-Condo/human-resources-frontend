import { Component, OnInit } from '@angular/core';
import { AwsS3FilesService } from '../aws-s3-files.service';
import { S3Object } from 'src/app/core/model/S3Object';
import { IS3ObjectFilter } from 'src/app/core/interfaces/IS3ObjectFilter';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { IS3OjectsResponse } from 'src/app/core/interfaces/IS3OjectsResponse';

@Component({
  selector: 'app-aws-s3-files',
  templateUrl: './aws-s3-files.component.html',
  styleUrls: ['./aws-s3-files.component.css']
})
export class AwsS3FilesComponent implements OnInit {

  filesList: S3Object[] = [];
  totalRecords: number = 0
  showLoading: boolean = false;
  displayModalSave: boolean = false;
  selectedFile!: File;

  selectedFiles: S3Object[] = [];


  constructor(
    private awsS3FilesService: AwsS3FilesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.getFiles();
  }

  filter: IS3ObjectFilter = {
    maxKeys: 1000,
  }

  uploadFile(file: File) {
    this.showLoading = true;
    this.awsS3FilesService.uploadFile(file).subscribe(
      response => {
        this.messageService.add({ severity: 'success', detail: 'File Upload succefully!' + response.fileName })
        this.getFiles();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  getFiles(): void {
    this.showLoading = true;
    this.awsS3FilesService.getFiles(this.filter).subscribe(
      (data: IS3OjectsResponse<S3Object>) => {
        this.filesList = data.objectSummaries;
        this.totalRecords = data.keyCount;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  delete(filename: string) {
    this.awsS3FilesService.delete(filename).subscribe(
      () => {
        this.messageService.add({ severity: 'success', detail: 'File deleted succefully!' })
        this.getFiles();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  deletionConfirm(filename: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.delete(filename);
      }
    });
  }

  download(filename: string): void {
    this.awsS3FilesService.download(filename).subscribe((data: Blob) => {
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

  multipleDelete() {
    this.showLoading = true;
    const keys: string[] = this.selectedFiles.map(file => file.key);
    this.awsS3FilesService.deleteFiles(keys).subscribe(
      () => {
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Selected items deleted succefully!' })
        this.selectedFiles = [];
        this.getFiles();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  onAddNewFile(): void {
    this.displayModalSave = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUploadFile() {
    if (this.selectedFile) {
      this.uploadFile(this.selectedFile);
    }
  }

  severalDeleteConfirm(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir os ficheiros selecionados?',
      accept: () => {
        this.multipleDelete();
      }
    });
  }

  obterTipoArquivo(nomeArquivo: string): string | null {
    // Expressão regular para encontrar a extensão do arquivo
    const regex = /\.([0-9a-z]+)(?:[?#]|$)/i;

    // Executa a regex no nome do arquivo
    const match = nomeArquivo.match(regex);

    // Se houver uma correspondência, retorna a extensão, caso contrário, retorna null
    if (match && match.length > 1) {
      return match[1];
    } else {
      return null;
    }
  }

  formatarTamanhoArquivo(tamanho: number): string {
    if (tamanho < 0) {
      return "Tamanho inválido";
    } else if (tamanho < 1024) {
      return tamanho + " B";
    } else if (tamanho < 1024 * 1024) {
      return (tamanho / 1024).toFixed(2) + " KB";
    } else if (tamanho < 1024 * 1024 * 1024) {
      return (tamanho / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (tamanho / (1024 * 1024 * 1024)).toFixed(2) + " GB";
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
