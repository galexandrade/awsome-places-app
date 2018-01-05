import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };

  constructor(private modalCtrl: ModalController){}

  onSubmit(form: NgForm){
    console.log(form);
  }

  onOpenMap(){
    console.log(this.location);
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location});
    modal.present();
  }

}
