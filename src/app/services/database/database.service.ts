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
  private sets: WritableSignal<Set[]> = signal<Set[]>([]);
  private set: any;


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
        nameVisit VARCHAR(255) DEFAULT 'Visita',
        nameLocal VARCHAR(255) DEFAULT 'Local',
        setsVisit INTEGER DEFAULT 0,
        setsLocal INTEGER DEFAULT 0,
        visit INTEGER DEFAULT 0,
        local INTEGER DEFAULT 0,
        maxPoint INTEGER DEFAULT 25,
        difference BOOLEAN DEFAULT true
      );`

      await this.db.execute(schema);
      this.loadSets();

      return true;
    } catch (error) {
      return false;
    }

  }

  async loadSets() {
    const sets = await this.db.query('SELECT * FROM sets WHERE status IN (0, 1)')
    this.sets.set(sets.values || [])
    
    const set = await this.db.query('SELECT * FROM sets WHERE status = 1')
    this.set = set.values

    console.log("sets: ",sets)
    console.log("set: ",set)
  }

  async updateSet(set:Set){
    const query = `
      UPDATE sets
      SET
        status = ${set.status},
        nameVisit = ${set.nameVisit},
        nameLocal = ${set.nameLocal},
        setsVisit = ${set.setsVisit},
        setsLocal = ${set.setsLocal},
        visit = ${set.visit},
        local = ${set.local},
        maxPoint = ${set.maxPoint},
        difference = ${set.difference}
      WHERE id = ${set.id}
    `;

    const result = await this.db.query(query);

    this.loadSets();

    return result
  }

  async deleteSet(set:Set){
    const query = `
      UPDATE sets
      SET
        status = -1
      WHERE id = ${set.id}
    `;

    const result = await this.db.query(query);

    this.loadSets();

    return result
  }

  async createSet(){
    let query = `UPDATE sets SET status = 0 WHERE status = 1;`;

    await this.db.query(query);
    
    query = `INSERT INTO sets DEFAULT VALUES;`;

    let result = await this.db.query(query);

    this.loadSets();

    return result
  }

}
