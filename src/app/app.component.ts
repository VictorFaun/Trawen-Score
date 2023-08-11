import { Component } from '@angular/core';
import { DatabaseService } from './services/database/database.service';
import { SplashScreen } from '@capacitor/splash-screen';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private _database_ :DatabaseService) {
    this.initApp();
  }

  async initApp(){
    let result = await this._database_.initializPlugin();
    console.log("Carga BDD: ", result)
    SplashScreen.hide();
  }
}
