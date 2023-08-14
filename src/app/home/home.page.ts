import { Component } from '@angular/core';
import { DatabaseService } from '../services/database/database.service';
import { Platform } from '@ionic/angular';
import { Haptics } from '@capacitor/haptics';

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

  pressTimer: any;
  pressTimerBol: any;

  localWin = this._database_.getLocalWin();
  visitaWin = this._database_.getVisitWin();

  invert = false;

  constructor(private _database_: DatabaseService, private _platform_: Platform) {
    if (this._platform_.is("ipad") || this._platform_.is("tablet") || this._platform_.is("phablet") || this._platform_.is("desktop")) {
      this.isTablet = true;
      this.movileDesign = false;
    }
  }

  onInvert(){
    this.invert= !this.invert
  }

  onButtonTouchStart(e: any, a: any, s: any) {
    if (!this.pressTimerBol) {
      this.pressTimerBol = true
      this.pressTimer = setTimeout(async () => {
        if (e == -1 && a == -1 && s == -1) {
          this._database_.createSet()
        } else {
          this.onChangePoint(e, a, s);
        }
        await Haptics.vibrate({ duration: 10 });
      }, 500);
    }
  }

  onButtonTouchEnd() {
    clearTimeout(this.pressTimer);
    this.pressTimerBol = false
  }

  pressMenu() {
    this.isOpenMenu = !this.isOpenMenu
  }

  changeDesign() {
    this.movileDesign = !this.movileDesign
  }

  onEnterPress(event: any) {
    if (event.key === 'Enter') {
      const inputElement: any = event.target;
      inputElement.blur();
    }
  }

  onChangePoint(e: any, a: any, s: any) {
    let set = this.set();
    if (!set) {
      return;
    }
    switch (s) {
      case 1:
        switch (e) {
          case 1:
            switch (a) {
              case 1:
                if (!this.localWin() &&
                  !(this.visitaWin() && set.local == set.maxPoint - 1)) {
                  set.local++;
                }
                break;
              case 2:
                if (set.local != 0) {
                  set.local--;
                }
                break;
            }
            break;
          case 2:
            switch (a) {
              case 1:
                if (!this.visitaWin() &&
                  !(this.localWin() && set.visit == set.maxPoint - 1)) {
                  set.visit++;
                }
                break;
              case 2:
                if (set.visit != 0) {
                  set.visit--;
                }
                break;
            }
            break;
        }
        break;
      case 2:
        switch (e) {
          case 1:
            switch (a) {
              case 1:
                if (set.setsLocal != 9) {
                  set.setsLocal++;
                }
                break;
              case 2:
                if (set.setsLocal != 0) {
                  set.setsLocal--;
                }
                break;
            }
            break;
          case 2:
            switch (a) {
              case 1:
                if (set.setsVisit != 9) {
                  set.setsVisit++;
                }
                break;
              case 2:
                if (set.setsVisit != 0) {
                  set.setsVisit--;
                }
                break;
            }
            break;
        }
        break;
    }

    this._database_.setSet(this.validaNombre(set))
  }

  onChangeMaxPoint(e: any) {
    let set = this.set();
    if (!set) {
      return;
    }

    set.maxPoint = e

    this._database_.setSet(this.validaNombre(set))
  }

  onChangeDifference(e: any) {
    let set = this.set();
    if (!set) {
      return;
    }

    set.difference = e

    this._database_.setSet(this.validaNombre(set))
  }

  onReboot() {
    let set = this.set();
    if (!set) {
      return;
    }
    this._database_.createSetBySet(this.validaNombre(set))
  }

  onWin(e: any) {
    let set = this.set();
    if (!set) {
      return;
    }
    switch (e) {
      case 1:
        if(set.setsLocal!=9){
        set.setsLocal++;
        }
        break;
      case 2:
        if(set.setsVisit!=9){
        set.setsVisit++;
        }
        break;
    }
    this._database_.createSetBySet(this.validaNombre(set))
  }

  onChangeName(e: any, n: number) {
    let set = this.set();
    if (n == 1 && set) {
      if (e.target.value.toLowerCase().replace(/\s/g, '') == "local") {
        set.nameLocal = ''
      } else {
        set.nameLocal = e.target.value
      }
    }
    if (n == 2 && set) {
      if (e.target.value.toLowerCase().replace(/\s/g, '') == "visit") {
        set.nameVisit = ''
      } else {
        set.nameVisit = e.target.value
      }
    }
    if (set) {

      this._database_.setSet(this.validaNombre(set))
    }
  }

  validaNombre(set: any) {
    if (set.nameLocal.toLowerCase().replace(/\s/g, '') == "local") {
      set.nameLocal = ''
    }

    if (set.nameVisit.toLowerCase().replace(/\s/g, '') == "visit") {
      set.nameVisit = ''
    }

    return set
  }
}
