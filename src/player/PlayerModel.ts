import * as THREE from 'three';

export class PlayerModel {
  mesh: THREE.Group;
  bodyGroup: THREE.Group;
  headGroup: THREE.Group;
  leftArmGroup: THREE.Group;
  rightArmGroup: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftThigh: THREE.Mesh;
  rightThigh: THREE.Mesh;
  scarf: THREE.Mesh;
  cape: THREE.Mesh;
  sword: THREE.Group;
  hairParts: THREE.Mesh[] = [];
  currentAnim = 'idle';
  animTime = 0;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.scale.setScalar(0.85);

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0a9, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xffd93d, roughness: 0.5 });
    const hairDarkMat = new THREE.MeshStandardMaterial({ color: 0xe6b800, roughness: 0.5 });
    const coatMat = new THREE.MeshStandardMaterial({ color: 0x2c3e5a, roughness: 0.7 });
    const coatLightMat = new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.7 });
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.8 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.7, roughness: 0.2 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.7 });
    const scarfMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.9, side: THREE.DoubleSide });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffd93d, emissive: 0xffd93d, emissiveIntensity: 0.2 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });

    // ========== BODY ==========
    this.bodyGroup = new THREE.Group();
    this.bodyGroup.position.y = 1.1;
    this.mesh.add(this.bodyGroup);

    // Inner shirt (white high collar)
    const innerShirt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.5, 8), innerMat);
    innerShirt.position.y = 0.1;
    innerShirt.castShadow = true;
    this.bodyGroup.add(innerShirt);

    // Collar
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.04, 6, 12, Math.PI * 1.5), innerMat);
    collar.position.y = 0.35;
    collar.rotation.x = Math.PI * 0.75;
    collar.rotation.z = Math.PI * 0.25;
    this.bodyGroup.add(collar);

    // Coat body (main)
    const coatBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.55, 8), coatMat);
    coatBody.position.y = 0.05;
    coatBody.castShadow = true;
    this.bodyGroup.add(coatBody);

    // Coat front panels (open coat look)
    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.05), coatLightMat);
    leftPanel.position.set(-0.1, 0.05, 0.18);
    leftPanel.rotation.y = 0.15;
    this.bodyGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.05), coatLightMat);
    rightPanel.position.set(0.1, 0.05, 0.18);
    rightPanel.rotation.y = -0.15;
    this.bodyGroup.add(rightPanel);

    // Gold trim on coat
    const trim = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.32), goldMat);
    trim.position.y = -0.2;
    this.bodyGroup.add(trim);

    // Gold chest emblem
    const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 6), goldMat);
    emblem.position.set(0, 0.25, 0.2);
    emblem.rotation.x = Math.PI / 2;
    this.bodyGroup.add(emblem);

    // ========== SCARF / CAPE ==========
    const scarfGeo = new THREE.PlaneGeometry(0.5, 0.7, 4, 4);
    // Curve the scarf slightly
    const scarfPos = scarfGeo.attributes.position;
    for (let i = 0; i < scarfPos.count; i++) {
      const x = scarfPos.getX(i);
      const y = scarfPos.getY(i);
      scarfPos.setZ(i, Math.sin(y * 2) * 0.1 + Math.abs(x) * 0.15);
    }
    scarfGeo.computeVertexNormals();
    this.scarf = new THREE.Mesh(scarfGeo, scarfMat);
    this.scarf.position.set(0, 0.3, -0.22);
    this.scarf.rotation.x = 0.1;
    this.bodyGroup.add(this.scarf);

    // Cape (back)
    const capeGeo = new THREE.PlaneGeometry(0.55, 0.9, 4, 6);
    const capePos = capeGeo.attributes.position;
    for (let i = 0; i < capePos.count; i++) {
      const x = capePos.getX(i);
      const y = capePos.getY(i);
      capePos.setZ(i, Math.sin(y * 1.5) * 0.08 + Math.abs(x) * 0.1);
    }
    capeGeo.computeVertexNormals();
    this.cape = new THREE.Mesh(capeGeo, new THREE.MeshStandardMaterial({ color: 0x2c3e5a, roughness: 0.8, side: THREE.DoubleSide }));
    this.cape.position.set(0, -0.05, -0.24);
    this.cape.rotation.x = 0.05;
    this.bodyGroup.add(this.cape);

    // Cape gold trim
    const capeTrim = new THREE.Mesh(new THREE.BoxGeometry(0.57, 0.04, 0.02), goldMat);
    capeTrim.position.set(0, -0.5, -0.22);
    this.bodyGroup.add(capeTrim);

    // ========== HEAD ==========
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 0.55;
    this.bodyGroup.add(this.headGroup);

    // Face
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skinMat);
    face.scale.set(1, 1.05, 0.95);
    face.castShadow = true;
    this.headGroup.add(face);

    // Eyes
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
    leftEye.position.set(-0.08, 0.02, 0.18);
    leftEye.scale.set(1, 1.2, 0.5);
    this.headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
    rightEye.position.set(0.08, 0.02, 0.18);
    rightEye.scale.set(1, 1.2, 0.5);
    this.headGroup.add(rightEye);

    // Pupils
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), blackMat);
    leftPupil.position.set(-0.08, 0.02, 0.2);
    this.headGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), blackMat);
    rightPupil.position.set(0.08, 0.02, 0.2);
    this.headGroup.add(rightPupil);

    // Hair - main volume
    const hairMain = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hairMat);
    hairMain.position.y = 0.04;
    hairMain.scale.set(1.05, 0.95, 1.05);
    this.headGroup.add(hairMain);
    this.hairParts.push(hairMain);

    // Hair - back/spiky
    const hairBack = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.35, 6), hairMat);
    hairBack.position.set(0, 0.1, -0.18);
    hairBack.rotation.x = -0.8;
    this.headGroup.add(hairBack);
    this.hairParts.push(hairBack);

    // Hair - side tufts
    const hairLeft = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 4), hairMat);
    hairLeft.position.set(-0.2, -0.05, 0.05);
    hairLeft.rotation.z = 0.5;
    hairLeft.rotation.x = -0.2;
    this.headGroup.add(hairLeft);
    this.hairParts.push(hairLeft);

    const hairRight = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 4), hairMat);
    hairRight.position.set(0.2, -0.05, 0.05);
    hairRight.rotation.z = -0.5;
    hairRight.rotation.x = -0.2;
    this.headGroup.add(hairRight);
    this.hairParts.push(hairRight);

    // Ahoge (cowlick)
    const ahoge = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.15, 4), hairMat);
    ahoge.position.set(0.05, 0.25, 0.05);
    ahoge.rotation.z = -0.3;
    ahoge.rotation.x = -0.5;
    this.headGroup.add(ahoge);
    this.hairParts.push(ahoge);

    // Hair highlight
    const hairHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.23, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.4), new THREE.MeshStandardMaterial({ color: 0xffe066, roughness: 0.4, transparent: true, opacity: 0.5 }));
    hairHighlight.position.set(0, 0.06, 0.05);
    this.headGroup.add(hairHighlight);

    // ========== ARMS ==========
    // Left arm group (shoulder joint)
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.28, 0.25, 0);
    this.bodyGroup.add(this.leftArmGroup);

    // Shoulder
    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), coatMat);
    this.leftArmGroup.add(leftShoulder);

    // Upper arm
    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.35, 8), coatMat);
    leftUpperArm.position.y = -0.2;
    this.leftArmGroup.add(leftUpperArm);

    // Lower arm (skin)
    const leftLowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.3, 8), skinMat);
    leftLowerArm.position.y = -0.5;
    this.leftArmGroup.add(leftLowerArm);

    // Hand
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
    leftHand.position.y = -0.68;
    this.leftArmGroup.add(leftHand);

    // Gold bracelet
    const leftBracelet = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.015, 6, 12), goldMat);
    leftBracelet.position.y = -0.38;
    leftBracelet.rotation.x = Math.PI / 2;
    this.leftArmGroup.add(leftBracelet);

    // Right arm group
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.28, 0.25, 0);
    this.bodyGroup.add(this.rightArmGroup);

    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), coatMat);
    this.rightArmGroup.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.35, 8), coatMat);
    rightUpperArm.position.y = -0.2;
    this.rightArmGroup.add(rightUpperArm);

    const rightLowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.3, 8), skinMat);
    rightLowerArm.position.y = -0.5;
    this.rightArmGroup.add(rightLowerArm);

    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skinMat);
    rightHand.position.y = -0.68;
    this.rightArmGroup.add(rightHand);

    const rightBracelet = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.015, 6, 12), goldMat);
    rightBracelet.position.y = -0.38;
    rightBracelet.rotation.x = Math.PI / 2;
    this.rightArmGroup.add(rightBracelet);

    // ========== LEGS ==========
    // Left thigh
    this.leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.4, 8), pantsMat);
    this.leftThigh.position.set(-0.12, -0.35, 0);
    this.leftThigh.castShadow = true;
    this.bodyGroup.add(this.leftThigh);

    // Left lower leg + boot
    this.leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.35, 8), pantsMat);
    this.leftLeg.position.set(-0.12, -0.7, 0);
    this.leftLeg.castShadow = true;
    this.bodyGroup.add(this.leftLeg);

    // Left boot
    const leftBoot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.25, 8), bootMat);
    leftBoot.position.set(-0.12, -0.95, 0.02);
    leftBoot.castShadow = true;
    this.bodyGroup.add(leftBoot);

    // Left boot top
    const leftBootTop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), goldMat);
    leftBootTop.position.set(-0.12, -0.85, 0);
    leftBootTop.rotation.x = Math.PI / 2;
    this.bodyGroup.add(leftBootTop);

    // Right thigh
    this.rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.4, 8), pantsMat);
    this.rightThigh.position.set(0.12, -0.35, 0);
    this.rightThigh.castShadow = true;
    this.bodyGroup.add(this.rightThigh);

    // Right lower leg
    this.rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.35, 8), pantsMat);
    this.rightLeg.position.set(0.12, -0.7, 0);
    this.rightLeg.castShadow = true;
    this.bodyGroup.add(this.rightLeg);

    // Right boot
    const rightBoot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.25, 8), bootMat);
    rightBoot.position.set(0.12, -0.95, 0.02);
    rightBoot.castShadow = true;
    this.bodyGroup.add(rightBoot);

    const rightBootTop = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 12), goldMat);
    rightBootTop.position.set(0.12, -0.85, 0);
    rightBootTop.rotation.x = Math.PI / 2;
    this.bodyGroup.add(rightBootTop);

    // ========== SWORD ==========
    this.sword = new THREE.Group();

    // Blade (tapered)
    const bladeGeo = new THREE.BoxGeometry(0.06, 0.9, 0.015);
    // Taper the blade tip
    const bladePos = bladeGeo.attributes.position;
    for (let i = 0; i < bladePos.count; i++) {
      if (bladePos.getY(i) > 0.4) {
        const factor = 1 - (bladePos.getY(i) - 0.4) / 0.45;
        bladePos.setX(i, bladePos.getX(i) * factor);
      }
    }
    bladeGeo.computeVertexNormals();
    const blade = new THREE.Mesh(bladeGeo, new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 }));
    blade.position.y = 0.5;
    this.sword.add(blade);

    // Blade edge glow
    const edge = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.85, 0.02), new THREE.MeshStandardMaterial({ color: 0xa0d8ef, emissive: 0x40e0d0, emissiveIntensity: 0.3, transparent: true, opacity: 0.6 }));
    edge.position.y = 0.48;
    this.sword.add(edge);

    // Guard
    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.06), goldMat);
    guard.position.y = 0.02;
    this.sword.add(guard);

    // Guard gem
    const gem = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshStandardMaterial({ color: 0x40e0d0, emissive: 0x40e0d0, emissiveIntensity: 0.5 }));
    gem.position.y = 0.02;
    gem.position.z = 0.03;
    this.sword.add(gem);

    // Hilt
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.8 }));
    hilt.position.y = -0.1;
    this.sword.add(hilt);

    // Hilt wrap detail
    const hiltWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0x5c4a3a, roughness: 0.9 }));
    hiltWrap.position.y = -0.1;
    this.sword.add(hiltWrap);

    // Pommel
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), goldMat);
    pommel.position.y = -0.22;
    this.sword.add(pommel);

    this.sword.position.set(0.35, -0.35, 0.15);
    this.sword.rotation.z = -0.4;
    this.sword.rotation.x = 0.2;
    this.rightArmGroup.add(this.sword);
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

    // Hair subtle movement
    this.hairParts.forEach((hair, i) => {
      hair.rotation.z += Math.sin(t * 2 + i) * 0.002;
    });

    // Scarf/cape wind effect
    this.scarf.rotation.z = Math.sin(t * 1.5) * 0.05;
    this.scarf.rotation.x = 0.1 + Math.sin(t * 1.2) * 0.03;
    this.cape.rotation.z = Math.sin(t * 1.3 + 0.5) * 0.04;

    switch (this.currentAnim) {
      case 'walk': {
        const legSwing = Math.sin(t * 6) * 0.35;
        const armSwing = Math.sin(t * 6) * 0.25;

        this.leftThigh.rotation.x = legSwing;
        this.leftLeg.rotation.x = Math.max(0, legSwing) * 0.5;
        this.rightThigh.rotation.x = -legSwing;
        this.rightLeg.rotation.x = Math.max(0, -legSwing) * 0.5;

        this.leftArmGroup.rotation.x = -armSwing;
        this.rightArmGroup.rotation.x = armSwing;

        this.bodyGroup.position.y = 1.1 + Math.abs(Math.sin(t * 12)) * 0.03;
        this.headGroup.rotation.x = Math.sin(t * 6) * 0.02;
        break;
      }
      case 'sprint': {
        const legSwing = Math.sin(t * 10) * 0.5;
        const armSwing = Math.sin(t * 10) * 0.4;

        this.leftThigh.rotation.x = legSwing;
        this.leftLeg.rotation.x = Math.max(0, legSwing) * 0.6;
        this.rightThigh.rotation.x = -legSwing;
        this.rightLeg.rotation.x = Math.max(0, -legSwing) * 0.6;

        this.leftArmGroup.rotation.x = -armSwing - 0.3;
        this.rightArmGroup.rotation.x = armSwing - 0.3;

        this.bodyGroup.rotation.x = 0.15;
        this.bodyGroup.position.y = 1.1 + Math.abs(Math.sin(t * 20)) * 0.05;
        break;
      }
      case 'jump': {
        this.leftArmGroup.rotation.x = -1.2;
        this.rightArmGroup.rotation.x = -1.2;
        this.leftThigh.rotation.x = 0.4;
        this.leftLeg.rotation.x = 0.3;
        this.rightThigh.rotation.x = 0.2;
        this.rightLeg.rotation.x = 0.2;
        this.bodyGroup.rotation.x = -0.1;
        break;
      }
      case 'attack': {
        const phase = Math.min(t * 7, Math.PI);
        this.rightArmGroup.rotation.x = -Math.sin(phase) * 2.5;
        this.rightArmGroup.rotation.z = Math.sin(phase) * 0.5;
        this.sword.rotation.z = -0.4 + Math.sin(phase) * 1.8;
        this.bodyGroup.rotation.y = -Math.sin(phase) * 0.3;
        break;
      }
      case 'skill': {
        this.leftArmGroup.rotation.z = Math.sin(t * 8) * 0.3 + 0.8;
        this.rightArmGroup.rotation.z = -Math.sin(t * 8) * 0.3 - 0.8;
        this.rightArmGroup.rotation.x = -0.5;
        this.sword.rotation.z = Math.sin(t * 6) * 0.3;
        break;
      }
      case 'burst': {
        this.leftArmGroup.rotation.z = 1.2 + Math.sin(t * 12) * 0.2;
        this.rightArmGroup.rotation.z = -1.2 - Math.sin(t * 12) * 0.2;
        this.leftArmGroup.rotation.x = -0.3;
        this.rightArmGroup.rotation.x = -0.3;
        this.bodyGroup.position.y = 1.1 + Math.sin(t * 8) * 0.05;
        this.headGroup.rotation.x = Math.sin(t * 4) * 0.05;
        break;
      }
      default: {
        // Smooth return to idle
        this.leftThigh.rotation.x *= 0.9;
        this.leftLeg.rotation.x *= 0.9;
        this.rightThigh.rotation.x *= 0.9;
        this.rightLeg.rotation.x *= 0.9;
        this.leftArmGroup.rotation.x *= 0.9;
        this.leftArmGroup.rotation.z *= 0.9;
        this.rightArmGroup.rotation.x *= 0.9;
        this.rightArmGroup.rotation.z *= 0.9;
        this.bodyGroup.rotation.x *= 0.9;
        this.bodyGroup.rotation.y *= 0.9;
        this.headGroup.rotation.x *= 0.9;
        this.sword.rotation.z = this.sword.rotation.z * 0.9 + (-0.4) * 0.1;
        this.bodyGroup.position.y = this.bodyGroup.position.y * 0.9 + 1.1 * 0.1;
        break;
      }
    }
  }
}
