import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Place } from '../../models/place';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { PlacesService } from '../../services/places';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;
  index: number;

  constructor(public navParams: NavParams,
              private viewCrtl: ViewController,
              private placesService: PlacesService) {
    this.place = navParams.get('place');
    this.index = navParams.get('index');
  }

  onLeave(){
    this.viewCrtl.dismiss();
  }

  onDelete(){
    this.placesService.deletePlace(this.index);
    this.onLeave();
  }

}
