import { Component } from '@angular/core';
import { DatabaseService } from '../services/database/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private _database_ : DatabaseService) {}

  createSet(){
    this._database_.createSet()
  }

}
