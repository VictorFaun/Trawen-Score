import { Component } from '@angular/core';
import { DatabaseService } from '../services/database/database.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isTablet = false
  isOpenMenu = false;
  movileDesign = true;

  constructor(private _database_: DatabaseService, private _platform_: Platform) {
    console.log(this._platform_.platforms())
    if (this._platform_.is("ipad") || this._platform_.is("tablet") || this._platform_.is("phablet")) {
      this.isTablet = true;
      this.movileDesign = false;
    }
  }

  createSet() {
    this._database_.createSet()
  }

  pressMenu(){
    this.isOpenMenu = !this.isOpenMenu
  }

  changeDesign(){
    this.movileDesign = !this.movileDesign
  }

  onEnterPress(event: any) {
    if (event.key === 'Enter') {
      const inputElement: any = event.target;
      inputElement.blur();
    }
  }

}
