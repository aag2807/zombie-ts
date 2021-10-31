import * as PIXI from 'pixi.js'
import Shooting from './Shooting';

export default class Player {
  //PRIVATE
  private lastMouseButton: number = 0;
  private MAX_HEALTH: number = 100;
  private health: number = this.MAX_HEALTH;
  private MARGIN: number = 16;
  private INITIAL_WIDTH: number;

  //PUBLIC  
  public player: PIXI.Sprite;
  public playerWidth: number = 32
  public shooting: Shooting;
  public healthbar: PIXI.Graphics | any;
  public dead: boolean = false;

  /**
   * @constructor
   * @param app 
   */
  constructor(private app: PIXI.Application,) {
    this.INITIAL_WIDTH = this.app.screen.width - 2 * this.MARGIN;
    this.player = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.player.anchor.set(0.5);
    this.player.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.player.width = this.player.height = this.playerWidth;
    this.player.tint = 0xea985d; //RED;

    app.stage.addChild(this.player);

    this.shooting = new Shooting(app, this);
    this.bootstrap_healthbar();
  }

  public get position(): PIXI.ObservablePoint<any> {
    return this.player.position;
  }

  public get width(): number {
    return this.player.width;
  }

  public get rotation(): number {
    return this.player.rotation;
  }

  public update(delta:number): void {
    if(this.dead) return;

    const mouse = this.app.renderer.plugins.interaction.mouse;
    const cursorPosition = mouse.global;

    let angle = Math.atan2(
      cursorPosition.y - this.player.position.y,
      cursorPosition.x - this.player.position.x
    ) + Math.PI / 2;

    this.player.rotation = angle;

    if (mouse.buttons != this.lastMouseButton) {
      this.shooting.shoot = mouse.buttons !== 0;
      this.lastMouseButton = mouse.buttons;
    }
    this.shooting.update(delta);
  }

  public attack(): void {
    this.health -= 1;
    this.healthbar.width = 
    (this.health / this.MAX_HEALTH) * this.INITIAL_WIDTH
    if (this.health <= 0) {
      this.dead = true
    }
  }

  private bootstrap_healthbar() {
    const BAR_HEIGHT = 16;
    this.healthbar = new PIXI.Graphics();
    this.healthbar.beginFill(0xff0000);//red
    this.healthbar.drawRect(
      this.MARGIN,
      this.app.screen.height - BAR_HEIGHT - this.MARGIN / 2, this.INITIAL_WIDTH, BAR_HEIGHT)
    this.healthbar.endFill();

    this.healthbar.zIndex = 100000;
    this.app.stage.sortableChildren = true;
    this.app.stage.addChild(this.healthbar)
  }
}