import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { IApiResponse } from 'src/app/core/interfaces/IApiResponse';
import { ILocation } from 'src/app/core/interfaces/ILocation';
import { ILocationFilter } from 'src/app/core/interfaces/ILocationFilter';
import { Location } from 'src/app/core/model/Location';
import { CountryService } from 'src/app/countries/country.service';
import { LocationsService } from '../locations.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  showLoading: boolean = false;

  totalLocations: number = 0;

  totalRecords: number = 0
  locations: ILocation[] = [];

  location: ILocation = new Location;
  displayModalSave: boolean = false;

  selectedLocationModal: Location = new Location();
  displayModal = false;

  countries: any[] = [];

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
  ];

  constructor(
    private locationsService: LocationsService,
    private countryService: CountryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private title: Title,
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Locations page');
    this.getCountries();
    this.getTotalLocations();
  }

  filter: ILocationFilter = {
    page: 0,
    itemsPerPage: 10,
    sort: 'name,asc'
  }

  @ViewChild('table') grid: any;

  get editing() {
    return Boolean(this.location.id);
  }

  save(locationForm: NgForm) {
    if (this.editing) {
      this.update(locationForm)
    } else {
      this.addNew(locationForm)
    }
  }

  addNew(locationForm: NgForm) {
    this.showLoading = true;
    this.locationsService.add(this.location).subscribe(
      (locationAdded) => {
        this.location = locationAdded;
        this.showLoading = false;
        this.getLocations();
        this.getTotalLocations();
        this.messageService.add({ severity: 'success', detail: 'Location added successfully' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  update(locationForm: NgForm) {
    this.showLoading = true;
    this.locationsService.update(this.location).subscribe(
      (location) => {
        this.location = location;
        this.showLoading = false;
        this.messageService.add({ severity: 'success', detail: 'Location updated successfully!' });
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getLocations(page: number = 0): void {
    this.showLoading = true;
    this.filter.page = page;
    this.locationsService.getLocations(this.filter).subscribe(
      (data: IApiResponse<ILocation>) => {
        this.locations = data.content;
        this.totalRecords = data.totalElements;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  deleteLocation(location: ILocation) {
    this.locationsService.delete(location.id).subscribe(
      () => {
        if (this.grid.first === 0) {
          this.getLocations();
        } else {
          this.grid.reset();
        }
        this.messageService.add({ severity: 'success', detail: 'Location deleted succefully!' })
        this.getTotalLocations();
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    )
  }

  getCountries() {
    this.countryService.findAll().then(data => {
      this.countries = data.map((country: any) => ({
        label: country.name,
        value: country.id
      }));
    }),
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
  }


  getTotalLocations() {
    this.showLoading = true;
    this.locationsService.getTotal().subscribe(
      (total) => {
        this.totalLocations = total;
        this.showLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendErrorNotification(errorResponse.error.message);
        this.showLoading = false;
      }
    );
  }

  onAddNewLocation(): void {
    this.location = new Location();
    this.displayModalSave = true;
  }

  onEditLocation(editLocation: Location): void {
    this.location = editLocation;
    this.location.id = editLocation.id
    this.displayModalSave = true;
  }

  onSelectLocation(selectedLocation: Location): void {
    this.selectedLocationModal = selectedLocation;
    this.displayModal = true;
  }

  deletionConfirm(location: ILocation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.deleteLocation(location);
      }
    });
  }

  onChangePage(event: LazyLoadEvent) {
    const page = event!.first! / event!.rows!;
    this.filter.itemsPerPage = event!.rows!; // actualize a quantidade de itens por página de acordo com a opcao rowsPerPageOptions
    this.getLocations(page);
  }

  private sendErrorNotification(message: string): void {
    if (message) {
      this.messageService.add({ severity: 'error', detail: message });
    } else {
      this.messageService.add({ severity: 'error', detail: 'An error occurred. Please try again.' });
    }
  }

}
