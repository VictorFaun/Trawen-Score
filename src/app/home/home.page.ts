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

  sets = this._database_.getAllSets();
  set = this._database_.getSet();


  constructor(private _database_: DatabaseService, private _platform_: Platform) {
    if (this._platform_.is("ipad") || this._platform_.is("tablet") || this._platform_.is("phablet") || this._platform_.is("desktop")) {
      this.isTablet = true;
      this.movileDesign = false;
    }
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

  onChangeName(e:any,n:number){
    if(n==1){
      console.log("Local: ", e.target.value)
    }
    if(n==2){
      console.log("Vista: ", e.target.value)
    }
  }

}
