import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { PlacePage } from '../place/place';
import { OnInit } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  addPlacePage = AddPlacePage;
  places: Place[] = [];

  constructor(public navCtrl: NavController,
              private placeService: PlacesService,
              private modalCtrl: ModalController) {

  }

  ngOnInit(){
    this.refreshPlaces();
  }

  ionViewWillEnter(){
    this.places = this.placeService.loadPlaces();
  }

  onOpenPlace(place: Place, index: number){
    const modal = this.modalCtrl.create(PlacePage, {place: place, index: index});
    modal.present();
    modal.onDidDismiss(() => {
      this.refreshPlaces();
    });
  }

  refreshPlaces(){
    this.placeService.fetchPlaces()
      .then((places: Place[]) => {
        this.places = places;
      });
  }

}
