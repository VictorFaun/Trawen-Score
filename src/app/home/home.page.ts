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

  constructor(private _database_: DatabaseService, private _platform_: Platform) {
    console.log(this._platform_.platforms())
    if (this._platform_.is("ipad") || this._platform_.is("tablet") || this._platform_.is("phablet")) {
      this.isTablet = true;
    }
  }

  createSet() {
    this._database_.createSet()
  }

  onEnterPress(event: any) {
    if (event.key === 'Enter') {
      const inputElement: any = event.target;
      inputElement.blur();
    }
  }

}
