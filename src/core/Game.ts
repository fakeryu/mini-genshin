import * as THREE from 'three';
import { InputManager } from './InputManager';
import { Player } from '../player/Player';
import { CameraController } from '../player/CameraController';
import { Terrain } from '../world/Terrain';
import { Environment } from '../world/Environment';
import { Paimon } from '../npc/Paimon';
import { HUD } from '../ui/HUD';

export class Game {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  input: InputManager;
  player: Player;
  cameraController: CameraController;
  terrain: Terrain;
  environment: Environment;
  paimon: Paimon;
  hud: HUD;
  running = false;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.clock = new THREE.Clock();
    this.input = new InputManager(this.renderer.domElement);

    this.environment = new Environment(this.scene);
    this.terrain = new Terrain(this.scene);
    this.player = new Player(this.scene, this.input, this.terrain);
    this.cameraController = new CameraController(this.camera, this.player);
    this.paimon = new Paimon(this.scene, this.player);
    this.hud = new HUD(this.player, this.paimon);

    this.input.onPointerLockChange = (locked) => {
      if (!locked) this.hud.showPauseMenu();
      else this.hud.hidePauseMenu();
    };
  }

  start() {
    this.running = true;
    this.animate();
  }

  animate = () => {
    if (!this.running) return;
    requestAnimationFrame(this.animate);

    const dt = this.clock.getDelta();

    this.player.update(dt);
    this.player.model.update(dt);
    this.player.cameraYaw = this.cameraController.yaw;
    this.cameraController.update(dt);
    this.paimon.update(dt);
    this.hud.update(dt);

    this.renderer.render(this.scene, this.camera);
  };

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
