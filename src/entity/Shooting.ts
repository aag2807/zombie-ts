import * as PIXI from 'pixi.js'
import Victor from 'victor';

//ENTITY
import Player from "./Player";

export default class Shooting {
  //Private 
  private bulletSpeed: number = 6;
  private bulletRadius: number = 10;
  private maxBullets: number = 15;
  private interval: number = 0;

  //Public
  public bullets: PIXI.Graphics[] = [];

  /**
   * @constructor
   * @param app 
   * @param player 
   */
  constructor(private app: PIXI.Application, private player: Player) { }

  private fire(): void {
    if (this.bullets.length >= this.maxBullets) {
      let b = this.bullets.shift() as any;
      this.app.stage.removeChild(b);
    }

    this.regulateBulletChilds();

    const bullet:any = new PIXI.Graphics();
    const angle = this.player.rotation - Math.PI / 2;

    bullet.position.set(this.player.position.x, this.player.position.y);
    bullet.beginFill(0x0000ff, 1) //blue;
    bullet.drawCircle(0, 0, this.bulletRadius);
    bullet.endFill();

    bullet.velocity = new Victor(
      Math.cos(angle),
      Math.sin(angle)
    ).multiplyScalar(this.bulletSpeed);

    this.bullets.push(bullet);
    this.app.stage.addChild(bullet)
  }

  private regulateBulletChilds(): void {
    this.bullets.forEach((bullet: PIXI.Graphics) => {
      this.app.stage.removeChild(bullet)
    })
    this.bullets = this.bullets.filter((bullet: PIXI.Graphics) =>
      Math.abs(bullet.position.x) < this.app.screen.width &&
      Math.abs(bullet.position.y) < this.app.screen.height
    )
    this.bullets.forEach((bullet: PIXI.Graphics) => {
      this.app.stage.addChild(bullet)
    })
  }

  public set shoot(shooting: any) {
    if (shooting) {
      this.fire();
      this.interval = setInterval(() => this.fire(), 500)
    } else {
      clearInterval(this.interval);
    }
  }

  public update(delta:number): void {
    this.bullets.forEach((bullet: PIXI.Graphics | any ) => {
      bullet.position.set(bullet.position.x + bullet.velocity.x * delta, bullet.position.y + bullet.velocity.y * delta)
    })
  }
}