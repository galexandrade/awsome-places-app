import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';

import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';

import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { PlacesService } from '../../services/places';
import { NavController } from 'ionic-angular/navigation/nav-controller';

declare var cordova: any;

@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  imageURL = '';

  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };
  locationIsSet = false;

  options: CameraOptions = {
    quality: 100,
    //destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(private modalCtrl: ModalController,
              private loadingCtrl: LoadingController,
              private geolocation: Geolocation,
              private camera: Camera,
              private file: File,
              private toastCtrl: ToastController,
              private placesService: PlacesService,
              private navCtrl: NavController){}

  onSubmit(form: NgForm){
    console.log(form);
    this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageURL);
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.imageURL = '';
    this.locationIsSet = false;
    this.navCtrl.pop();
  }

  onOpenMap(){
    console.log(this.location);
    const modal = this.modalCtrl.create(SetLocationPage, {
      location: this.location,
      isSet: this.locationIsSet
    });
    modal.present();

    modal.onDidDismiss(data => {
      if(data){
        this.location = data.location;
        this.locationIsSet = true;
      }
    });
  }

  onLocate(){
    const loading = this.loadingCtrl.create({
      content: 'Getting your location...'
    });

    loading.present();

    this.geolocation.getCurrentPosition().then((resp) => {
      loading.dismiss();

      this.location = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.locationIsSet = true;
     }).catch((err) => {
      const toast = this.toastCtrl.create({
        message: 'Error getting location: ' + err.message,
        duration: 2500
      });
      toast.present();
     });
  }

  onTakePhoto(){
    this.camera.getPicture(this.options).then((imageData) => {

      const currentName = imageData.replace(/^.*[\\\/]/, '');
      const path = imageData.replace(/[^\/]*$/, '');

      const newFileName = new Date().getUTCMilliseconds() + '.jpg';

      this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
        .then((data: Entry) => {
          this.imageURL = data.nativeURL;
          this.camera.cleanup();
        })
        .catch((err: FileError) => {
          this.imageURL = '';
          const toast = this.toastCtrl.create({
            message: 'Could not save the image. Please try again! ERR: ' + err.message,
            duration: 2500
          });

          toast.present();
          //Delete the temporary image
          this.camera.cleanup();
        });
    }, (err) => {
      const toast = this.toastCtrl.create({
        message: 'Error taking picture: ' + err.message,
        duration: 2500
      });
      toast.present();
    });
  }

}
