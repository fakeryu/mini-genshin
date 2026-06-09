import * as THREE from 'three';
import { Player } from '../player/Player';

export class Paimon {
  mesh: THREE.Group;
  player: Player;
  offset = new THREE.Vector3(1.5, 1.5, 1.5);
  floatTime = 0;
  dialogActive = false;
  dialogTimer = 0;
  dialogIndex = 0;
  dialogs = [
    '旅行者！前面的区域以后再来探索吧！',
    '派蒙是最好的向导哦！',
    '你看那边，好像有什么东西在发光！',
    '肚子饿了... 要不要做点好吃的？',
    '这个世界有好多宝藏等着我们发现呢！',
  ];

  constructor(scene: THREE.Scene, player: Player) {
    this.player = player;
    this.mesh = new THREE.Group();

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0a9 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), whiteMat);
    body.scale.y = 1.3;
    this.mesh.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
    head.position.y = 0.35;
    this.mesh.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat);
    hair.position.y = 0.4;
    this.mesh.add(hair);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 16), goldMat);
    halo.position.y = 0.55;
    halo.rotation.x = Math.PI * 0.3;
    this.mesh.add(halo);

    const cape = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.4, 8), blueMat);
    cape.position.y = -0.1;
    cape.rotation.x = Math.PI;
    this.mesh.add(cape);

    const leftWing = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), whiteMat);
    leftWing.position.set(-0.25, 0, -0.1);
    leftWing.rotation.y = 0.5;
    this.mesh.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), whiteMat);
    rightWing.position.set(0.25, 0, -0.1);
    rightWing.rotation.y = -0.5;
    this.mesh.add(rightWing);

    this.mesh.scale.setScalar(0.6);
    this.mesh.castShadow = true;
    scene.add(this.mesh);
  }

  update(dt: number) {
    this.floatTime += dt;

    const targetPos = this.player.position.clone().add(this.offset);
    targetPos.y += Math.sin(this.floatTime * 2) * 0.2 + 1;

    this.mesh.position.lerp(targetPos, 0.05);
    this.mesh.rotation.y = Math.atan2(
      this.player.position.x - this.mesh.position.x,
      this.player.position.z - this.mesh.position.z
    );

    const dist = this.mesh.position.distanceTo(this.player.position);
    if (dist < 5 && !this.dialogActive) {
      this.showDialog();
    }

    if (this.dialogActive) {
      this.dialogTimer -= dt;
      if (this.dialogTimer <= 0) {
        this.dialogActive = false;
      }
    }
  }

  showDialog() {
    this.dialogActive = true;
    this.dialogTimer = 4;
    this.dialogIndex = (this.dialogIndex + 1) % this.dialogs.length;
  }

  getCurrentDialog(): string | null {
    return this.dialogActive ? this.dialogs[this.dialogIndex] : null;
  }
}
