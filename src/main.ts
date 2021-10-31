//PACKAGES
import * as PIXI from "pixi.js";

//ASSETS
import hero from './assets/hero_male.json'
import bullet from './assets/bullet.png'

//ENTITY
import Player from "./entity/Player";
import Zombie from "./entity/Zombie";
import Spawner from "./utils/spawner";
import { zombies } from "./utils/globals";

const canvasSize = 512;
const canvas: HTMLCanvasElement = document.getElementById("mycanvas") as any;

const app: any | PIXI.Application = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
});

initGame()

async function initGame() {
  try {
    await loadAssets();

    const player = new Player(app);
    const zSpawner = new Spawner(() => new Zombie(app, player), app);

    const gameStartScene = createScene('Click to start hell');
    const gameOverScene = createScene('YOU DIED');
    
    app.gamestarted = false

    app.ticker.add((delta: number) => {
      gameOverScene.visible = player.dead;
      gameStartScene.visible = !app.gamestarted;

      if (!app.gamestarted) return;

      player.update(delta);

      zSpawner.spawns.forEach((zombie: Zombie) => {
        zombie.update(delta)
      })

      bulletHitTest(
        player.shooting.bullets,
        zSpawner.spawns,
        8,
        16
      );
    });

  } catch (err) {
    console.error(err)
    console.log("%c load failed", "padding:10px; color: red; font-size:18px;")
  }
}

function bulletHitTest(bullets: any[], zombies: any[], bulletRadius: number, zombieRadius: number): void {
  bullets.forEach((bullet: any) => {
    zombies.forEach((zombie: any, index: number) => {
      let dx = zombie.position.x - bullet.position.x;
      let dy = zombie.position.y - bullet.position.y;

      let distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < bulletRadius + zombieRadius) {
        zombies.splice(index, 1);
        zombie.kill();
      }
    })
  })
}

function createScene(scenetext: string): PIXI.Container {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(scenetext);

  text.x = app.screen.width / 2;
  text.y = 15;
  text.anchor.set(0.5, 0);
  sceneContainer.zIndex = 2000;
  sceneContainer.addChild(text);
  app.stage.addChild(sceneContainer);
  return sceneContainer
}

function startGame(): void {
  app.gamestarted = true;
}

async function loadAssets() {
  return new Promise((res, rej) => {
    let loader = PIXI.Loader.shared;
    
    //generates assets for all zombies
    zombies.forEach((zombie) => {
      loader.add(`${zombie.meta.image.replaceAll('.png','')}`, zombie as any)
    })

    loader.add('hero', hero as any)
    loader.add("bullet", bullet as any)
    loader.onComplete.add(res);
    loader.onError.add(rej);
    loader.load(()=> {
      let sheet = PIXI.Loader.shared.resources["hero"]
      console.log(sheet)
    });
  })
}

document.addEventListener('click', startGame);

