import * as PIXI from "pixi.js";
import Victor from "victor";

//ENTITY
import Player from "./Player";

//UTILS

export default class Zombie {
  //PRIVATE
  private enemySpeed: number = 2;
  private enemyRadius: number = 16;
  private canvasSize: number = 512;
  private attackInterval: number = 0;

  //PUBLIC
  public zombie: PIXI.Graphics;
  public attacking: boolean = false;

  /**
   * @constructor
   * @param app
   * @param player
   */
  constructor(private app: PIXI.Application, private player: Player) {
    const r = this.randomSpawnPoint();

    this.canvasSize = this.app.screen.width;

    this.zombie = new PIXI.Graphics();
    this.zombie.position.set(r.x, r.y);
    this.zombie.beginFill(0xff0000);
    this.zombie.drawCircle(0, 0, this.enemyRadius);
    this.zombie.endFill();

    this.app.stage.addChild(this.zombie);
  }

  private randomSpawnPoint(): Victor {
    let edge = Math.floor(Math.random() * 4);
    let spawnPoint = new Victor(0, 0);

    switch (edge) {
      case 0: //top
        spawnPoint.x = this.canvasSize * Math.random();
        break;
      case 1: //right
        spawnPoint.x = this.canvasSize;
        spawnPoint.y = this.canvasSize * Math.random();
        break;
      case 2: //bottom
        spawnPoint.x = this.canvasSize * Math.random();
        spawnPoint.y = this.canvasSize;
        break;
      case 3: //left
        spawnPoint.x = 0;
        spawnPoint.y = this.canvasSize * Math.random();
        break;
      default:
        spawnPoint.x = 0;
        spawnPoint.y = this.canvasSize * Math.random();
        break;
    }
    return spawnPoint;
  }

  private attackPlayer(): void {
    if(this.attacking)return;
    this.attacking = true;
    this.attackInterval = setInterval(() => this.player.attack(),500)
  }

  public get position(): PIXI.ObservablePoint {
    return this.zombie.position;
  }

  public kill(): void {
    clearInterval(this.attackInterval);
    this.app.stage.removeChild(this.zombie);
  }

  public update(delta:number): void {
    let en = new Victor(this.zombie.position.x, this.zombie.position.y);
    let pl = new Victor(this.player.position.x, this.player.position.y);

    if (en.distance(pl) < this.player.width / 2) {
      this.attackPlayer();
      return;
    }

    let dir = pl.subtract(en);
    let v = dir.normalize().multiplyScalar(this.enemySpeed);
    this.zombie.position.set(
      this.zombie.position.x + v.x * delta,
    this.zombie.position.y + v.y * delta
    );
  }
}
