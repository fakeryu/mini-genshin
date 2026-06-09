import * as THREE from 'three';
import { Player } from '../player/Player';

export class Paimon {
  mesh: THREE.Group;
  bodyGroup: THREE.Group;
  headGroup: THREE.Group;
  leftWing: THREE.Mesh;
  rightWing: THREE.Mesh;
  halo: THREE.Mesh;
  cape: THREE.Mesh;
  player: Player;
  offset = new THREE.Vector3(1.2, 1.2, 1.2);
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
    this.mesh.scale.setScalar(0.5);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0a9, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.7, roughness: 0.2 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.6 });
    const darkBlueMat = new THREE.MeshStandardMaterial({ color: 0x1a5276, roughness: 0.7 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2980b9 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });

    // Body
    this.bodyGroup = new THREE.Group();
    this.mesh.add(this.bodyGroup);

    // Main body (white dress)
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), whiteMat);
    body.scale.set(1, 1.2, 0.85);
    body.castShadow = true;
    this.bodyGroup.add(body);

    // Dress bottom (flared)
    const dressGeo = new THREE.CylinderGeometry(0.05, 0.25, 0.3, 8);
    const dress = new THREE.Mesh(dressGeo, whiteMat);
    dress.position.y = -0.25;
    dress.castShadow = true;
    this.bodyGroup.add(dress);

    // Blue sash
    const sash = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 16), blueMat);
    sash.position.y = 0.05;
    sash.rotation.x = Math.PI / 2;
    this.bodyGroup.add(sash);

    // Gold star on chest
    const star = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 4), goldMat);
    star.position.set(0, 0.1, 0.17);
    star.rotation.x = -0.3;
    this.bodyGroup.add(star);

    // Cape (dark blue)
    const capeGeo = new THREE.PlaneGeometry(0.4, 0.5, 3, 3);
    const capePos = capeGeo.attributes.position;
    for (let i = 0; i < capePos.count; i++) {
      const x = capePos.getX(i);
      const y = capePos.getY(i);
      capePos.setZ(i, Math.sin(y * 3) * 0.05 + x * x * 0.3);
    }
    capeGeo.computeVertexNormals();
    this.cape = new THREE.Mesh(capeGeo, darkBlueMat);
    this.cape.position.set(0, -0.1, -0.15);
    this.cape.rotation.x = 0.15;
    this.bodyGroup.add(this.cape);

    // Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 0.35;
    this.bodyGroup.add(this.headGroup);

    // Face
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skinMat);
    face.scale.set(1, 1.05, 0.95);
    face.castShadow = true;
    this.headGroup.add(face);

    // Eyes (large, expressive)
    const leftEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), whiteMat);
    leftEyeWhite.position.set(-0.07, 0.02, 0.14);
    leftEyeWhite.scale.set(1, 1.3, 0.5);
    this.headGroup.add(leftEyeWhite);

    const rightEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), whiteMat);
    rightEyeWhite.position.set(0.07, 0.02, 0.14);
    rightEyeWhite.scale.set(1, 1.3, 0.5);
    this.headGroup.add(rightEyeWhite);

    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
    leftEye.position.set(-0.07, 0.02, 0.16);
    leftEye.scale.set(1, 1.2, 0.5);
    this.headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
    rightEye.position.set(0.07, 0.02, 0.16);
    rightEye.scale.set(1, 1.2, 0.5);
    this.headGroup.add(rightEye);

    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), blackMat);
    leftPupil.position.set(-0.07, 0.02, 0.17);
    this.headGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), blackMat);
    rightPupil.position.set(0.07, 0.02, 0.17);
    this.headGroup.add(rightPupil);

    // Hair
    const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
    hairMain.position.y = 0.03;
    hairMain.scale.set(1.05, 0.9, 1.05);
    this.headGroup.add(hairMain);

    // Hair bangs
    const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.3), hairMat);
    bangs.position.set(0, 0.05, 0.06);
    this.headGroup.add(bangs);

    // Hair side locks
    const leftLock = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 4), hairMat);
    leftLock.position.set(-0.18, -0.05, 0.05);
    leftLock.rotation.z = 0.4;
    this.headGroup.add(leftLock);

    const rightLock = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 4), hairMat);
    rightLock.position.set(0.18, -0.05, 0.05);
    rightLock.rotation.z = -0.4;
    this.headGroup.add(rightLock);

    // Halo (gold ring)
    const haloGeo = new THREE.TorusGeometry(0.16, 0.018, 8, 20);
    this.halo = new THREE.Mesh(haloGeo, goldMat);
    this.halo.position.y = 0.22;
    this.halo.rotation.x = Math.PI * 0.35;
    this.headGroup.add(this.halo);

    // Halo sparkles
    for (let i = 0; i < 4; i++) {
      const sparkle = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), goldMat);
      const angle = (i / 4) * Math.PI * 2;
      sparkle.position.set(Math.cos(angle) * 0.16, 0.22, Math.sin(angle) * 0.1);
      this.headGroup.add(sparkle);
    }

    // Wings (translucent)
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      emissive: 0x40e0d0,
      emissiveIntensity: 0.1,
    });

    // Left wing
    const leftWingGeo = new THREE.PlaneGeometry(0.35, 0.25, 3, 2);
    const lwp = leftWingGeo.attributes.position;
    for (let i = 0; i < lwp.count; i++) {
      const x = lwp.getX(i);
      const y = lwp.getY(i);
      lwp.setZ(i, Math.sin(x * 4) * 0.05);
    }
    leftWingGeo.computeVertexNormals();
    this.leftWing = new THREE.Mesh(leftWingGeo, wingMat);
    this.leftWing.position.set(-0.28, 0, -0.08);
    this.leftWing.rotation.y = 0.4;
    this.bodyGroup.add(this.leftWing);

    // Right wing
    const rightWingGeo = new THREE.PlaneGeometry(0.35, 0.25, 3, 2);
    const rwp = rightWingGeo.attributes.position;
    for (let i = 0; i < rwp.count; i++) {
      const x = rwp.getX(i);
      const y = rwp.getY(i);
      rwp.setZ(i, Math.sin(x * 4) * 0.05);
    }
    rightWingGeo.computeVertexNormals();
    this.rightWing = new THREE.Mesh(rightWingGeo, wingMat);
    this.rightWing.position.set(0.28, 0, -0.08);
    this.rightWing.rotation.y = -0.4;
    this.bodyGroup.add(this.rightWing);

    scene.add(this.mesh);
  }

  update(dt: number) {
    this.floatTime += dt;
    const t = this.floatTime;

    // Floating motion
    const targetPos = this.player.position.clone().add(this.offset);
    targetPos.y += Math.sin(t * 2.5) * 0.15 + 0.8;

    this.mesh.position.lerp(targetPos, 0.04);

    // Face player
    this.mesh.rotation.y = Math.atan2(
      this.player.position.x - this.mesh.position.x,
      this.player.position.z - this.mesh.position.z
    );

    // Wing flap
    const flap = Math.sin(t * 8) * 0.4;
    this.leftWing.rotation.z = flap;
    this.rightWing.rotation.z = -flap;
    this.leftWing.rotation.y = 0.4 + flap * 0.3;
    this.rightWing.rotation.y = -0.4 - flap * 0.3;

    // Halo rotation
    this.halo.rotation.z = t * 0.5;

    // Cape wave
    this.cape.rotation.z = Math.sin(t * 2) * 0.08;

    // Body tilt
    this.bodyGroup.rotation.z = Math.sin(t * 1.5) * 0.05;
    this.headGroup.rotation.x = Math.sin(t * 2) * 0.03;

    // Dialog
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
