import * as THREE from 'three';
import { Player } from './Player';

export class CameraController {
  camera: THREE.PerspectiveCamera;
  player: Player;
  distance = 6;
  minDistance = 2;
  maxDistance = 12;
  height = 2.5;
  yaw = 0;
  pitch = 0.3;
  smoothFactor = 0.1;
  targetYaw = 0;
  targetPitch = 0.3;

  constructor(camera: THREE.PerspectiveCamera, player: Player) {
    this.camera = camera;
    this.player = player;
    camera.position.set(0, 5, 8);
  }

  update(dt: number) {
    const player = this.player;

    if (player.input.locked) {
      const { dx, dy } = player.input.consumeMouseDelta();
      this.targetYaw -= dx * 0.003;
      this.targetPitch -= dy * 0.003;
      this.targetPitch = Math.max(-0.5, Math.min(1.2, this.targetPitch));
    }

    const scroll = player.input.getScrollDelta();
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance + scroll));

    this.yaw += (this.targetYaw - this.yaw) * this.smoothFactor;
    this.pitch += (this.targetPitch - this.pitch) * this.smoothFactor;

    const offset = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch) * this.distance,
      Math.sin(this.pitch) * this.distance + this.height,
      Math.cos(this.yaw) * Math.cos(this.pitch) * this.distance
    );

    const targetPos = player.position.clone().add(new THREE.Vector3(0, 1.5, 0));
    this.camera.position.copy(targetPos).add(offset);
    this.camera.lookAt(targetPos);
  }
}
