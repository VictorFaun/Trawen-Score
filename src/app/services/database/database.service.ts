import { Injectable, WritableSignal, signal } from '@angular/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_NAME = ''

export interface Set {
  id: number;
  status: number;
  nameVisit: string;
  nameLocal: string;
  setsVisit: number;
  setsLocal: number;
  visit: number;
  local: number;
  maxPoint: number;
  difference: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  //private sets: WritableSignal<Set[]> = signal<Set[]>([]);
  private set: WritableSignal<Set | null> = signal<Set | null>(null);

  private localWin: WritableSignal<boolean> = signal<boolean>(false);
  private visitWin: WritableSignal<boolean> = signal<boolean>(false);

  isOnline = false;

  constructor() { }

  async initializPlugin() {
    try {
      this.db = await this.sqlite.createConnection(
        DB_NAME,
        false,
        'no-encryption',
        1,
        false
      )

      await this.db.open()

      const schema = `CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status INTEGER DEFAULT 1,
        nameVisit VARCHAR(255) DEFAULT "",
        nameLocal VARCHAR(255) DEFAULT "",
        setsVisit INTEGER DEFAULT 0,
        setsLocal INTEGER DEFAULT 0,
        visit INTEGER DEFAULT 0,
        local INTEGER DEFAULT 0,
        maxPoint INTEGER DEFAULT 25,
        difference BOOLEAN DEFAULT true
      );`

      await this.db.execute(schema);
      this.loadSets();
      this.isOnline = true
      return true;
    } catch (error) {
      this.set.set({
        id: -1,
        status: 1,
        nameVisit: "Visita",
        nameLocal: "Local",
        setsVisit: 0,
        setsLocal: 0,
        visit: 0,
        local: 0,
        maxPoint: 25,
        difference: true,
      })
      return false;
    }
  }

  getSet() {
    return this.set
  }

  getLocalWin() {
    return this.localWin
  }

  getVisitWin() {
    return this.visitWin
  }

  setSet(set: Set) {
    this.loadSets(set);
    if (this.isOnline) {
      this.updateSet(set);
    }
  }

  // getAllSets(){
  //   return this.sets
  // }

  async loadSets(set2: any = null) {
    // const sets = await this.db.query('SELECT * FROM sets WHERE status IN (0, 1)')
    // this.sets.set(sets.values || [])
    // console.log("sets: ",sets)
    if (set2 != null) {
      this.validaWin(set2)
      this.set.set(set2)
      return;
    }

    const set = await this.db.query('SELECT * FROM sets WHERE status = 1')
    if (set.values?.length == 1) {
      if (!set.values[0].nameLocal.replace(/\s/g, '')) {
        set.values[0].nameLocal = "Local"
      }
      if (!set.values[0].nameVisit.replace(/\s/g, '')) {
        set.values[0].nameVisit = "Visita"
      }
      this.validaWin(set.values[0])
      this.set.set(set.values[0])
      console.log("set: ", set)
    } else {
      this.createSet()
    }
  }

  async updateSet(set: Set) {
    const query = `
      UPDATE sets
      SET
        status = ${set.status},
        nameVisit = "${set.nameVisit.toLowerCase().replace(/\s/g, '') == "visit"?"":set.nameVisit}",
        nameLocal = "${set.nameLocal.toLowerCase().replace(/\s/g, '') == "local"?"":set.nameLocal}",
        setsVisit = ${set.setsVisit},
        setsLocal = ${set.setsLocal},
        visit = ${set.visit},
        local = ${set.local},
        maxPoint = ${set.maxPoint},
        difference = ${set.difference}
      WHERE id = ${set.id}
    `;

    const result = await this.db.query(query);

    return result
  }

  async createSet() {

    let newSet = {
      id: -1,
      status: 1,
      nameVisit: "Visita",
      nameLocal: "Local",
      setsVisit: 0,
      setsLocal: 0,
      visit: 0,
      local: 0,
      maxPoint: 25,
      difference: true,
    }

    if (!this.isOnline) {
      this.set.set(newSet)
      this.visitWin.set(false);
      this.localWin.set(false);
      return;
    }

    // let query = `UPDATE sets SET status = 0 WHERE status = 1;`;
    // await this.db.query(query);

    // let query = `DELETE FROM sets`;
    // await this.db.query(query);

    // query = `INSERT INTO sets DEFAULT VALUES;`;
    // let result = await this.db.query(query);

    let aux = this.set()
    if (aux) {
      newSet.id = aux.id
      this.setSet(newSet)
    } else {
      let query = `INSERT INTO sets DEFAULT VALUES;`;
      let result = await this.db.query(query);

      this.loadSets();
    }

    return;
  }

  async createSetBySet(set: Set) {

    let newSet = {
      id: -1,
      status: 1,
      nameVisit: set.nameVisit,
      nameLocal: set.nameLocal,
      setsVisit: set.setsVisit,
      setsLocal: set.setsLocal,
      visit: 0,
      local: 0,
      maxPoint: set.maxPoint,
      difference: set.difference,
    }

    if (!this.isOnline) {

      this.set.set(newSet)
      this.visitWin.set(false);
      this.localWin.set(false);
      return;
    }
    
    newSet.id = set.id
    this.setSet(newSet)

    return;
  }

  validaWin(set: any) {
    if (set.local >= set.maxPoint) {
      if ((set.local - set.visit) >= 2 ||
        !set.difference) {
        this.localWin.set(true);
      } else {
        this.localWin.set(false);
      }
    } else {
      this.localWin.set(false);
    }

    if (set.visit >= set.maxPoint) {
      if ((set.visit - set.local) >= 2 ||
        !set.difference) {
        this.visitWin.set(true);
      } else {
        this.visitWin.set(false);
      }
    } else {
      this.visitWin.set(false);
    }
  }
}
