//PACKAGES
import * as PIXI from 'pixi.js';

//ENTITY
import Zombie from "../entity/Zombie";

export default class Spawner {
  //Private
  private spawnInterval: number = 1000; //in Miliseconds
  private maxSpawns = 20

  //Public
  public spawns: Zombie[] = [];

  /**
   * @constructor
   * @param create 
   */
  constructor(private create: () => Zombie, private app: PIXI.Application | any) {
    setInterval(() => {
      this.spawn()
    }, this.spawnInterval);
  }

  private spawn(): void {
    if (this.app.gamestarted) {
      if (this.spawns.length >= this.maxSpawns) return;
      let s = this.create();
      this.spawns.push(s);
    }
  }

} 