import * as THREE from 'three';

export class PlayerModel {
  mesh: THREE.Group;
  body: THREE.Mesh;
  head: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  sword: THREE.Group;
  currentAnim = 'idle';
  animTime = 0;

  constructor() {
    this.mesh = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0a9 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xf4d03f });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.6, roughness: 0.3 });

    this.body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), bodyMat);
    this.body.position.y = 1.15;
    this.body.castShadow = true;
    this.mesh.add(this.body);

    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), skinMat);
    this.head.position.y = 1.75;
    this.head.castShadow = true;
    this.mesh.add(this.head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat);
    hair.position.y = 1.78;
    hair.rotation.x = 0;
    this.mesh.add(hair);

    const scarf = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.4), whiteMat);
    scarf.position.y = 1.55;
    this.mesh.add(scarf);

    this.leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), skinMat);
    this.leftArm.position.set(-0.4, 1.3, 0);
    this.leftArm.castShadow = true;
    this.mesh.add(this.leftArm);

    this.rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), skinMat);
    this.rightArm.position.set(0.4, 1.3, 0);
    this.rightArm.castShadow = true;
    this.mesh.add(this.rightArm);

    this.leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), bodyMat);
    this.leftLeg.position.set(-0.15, 0.35, 0);
    this.leftLeg.castShadow = true;
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), bodyMat);
    this.rightLeg.position.set(0.15, 0.35, 0);
    this.rightLeg.castShadow = true;
    this.mesh.add(this.rightLeg);

    const swordBlade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.02), goldMat);
    swordBlade.position.y = 0.4;
    const swordHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15), new THREE.MeshStandardMaterial({ color: 0x5d4037 }));
    const swordGuard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.04), goldMat);
    swordGuard.position.y = 0.05;

    this.sword = new THREE.Group();
    this.sword.add(swordBlade, swordHilt, swordGuard);
    this.sword.position.set(0.5, 1.1, 0.2);
    this.sword.rotation.z = -0.3;
    this.mesh.add(this.sword);
  }

  setAnimation(name: string) {
    if (this.currentAnim !== name) {
      this.currentAnim = name;
      this.animTime = 0;
    }
  }

  update(dt: number) {
    this.animTime += dt;
    const t = this.animTime;

    switch (this.currentAnim) {
      case 'walk': {
        const legSwing = Math.sin(t * 8) * 0.4;
        this.leftLeg.rotation.x = legSwing;
        this.rightLeg.rotation.x = -legSwing;
        this.leftArm.rotation.x = -legSwing * 0.5;
        this.rightArm.rotation.x = legSwing * 0.5;
        this.mesh.position.y = Math.abs(Math.sin(t * 16)) * 0.05;
        break;
      }
      case 'jump': {
        this.leftArm.rotation.x = -1;
        this.rightArm.rotation.x = -1;
        this.leftLeg.rotation.x = 0.3;
        this.rightLeg.rotation.x = 0.3;
        break;
      }
      case 'attack': {
        const phase = Math.min(t * 6, Math.PI);
        this.rightArm.rotation.x = -Math.sin(phase) * 2;
        this.sword.rotation.z = -0.3 + Math.sin(phase) * 1.5;
        break;
      }
      case 'skill': {
        this.leftArm.rotation.z = Math.sin(t * 10) * 0.5 + 1;
        this.rightArm.rotation.z = -Math.sin(t * 10) * 0.5 - 1;
        break;
      }
      default: {
        this.leftLeg.rotation.x *= 0.9;
        this.rightLeg.rotation.x *= 0.9;
        this.leftArm.rotation.x *= 0.9;
        this.rightArm.rotation.x *= 0.9;
        this.leftArm.rotation.z *= 0.9;
        this.rightArm.rotation.z *= 0.9;
        this.sword.rotation.z = this.sword.rotation.z * 0.9 + (-0.3) * 0.1;
        this.mesh.position.y *= 0.9;
        break;
      }
    }
  }
}
