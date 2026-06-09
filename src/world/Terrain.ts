import * as THREE from 'three';

function noise(x: number, z: number): number {
  return Math.sin(x * 0.1) * Math.cos(z * 0.1) * 0.5 +
         Math.sin(x * 0.3 + z * 0.2) * 0.25 +
         Math.sin(x * 0.05 - z * 0.07) * 1.0;
}

export class Terrain {
  scene: THREE.Scene;
  ground: THREE.Mesh;
  size = 200;
  segments = 100;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    const geometry = new THREE.PlaneGeometry(
      this.size, this.size,
      this.segments, this.segments
    );
    geometry.rotateX(-Math.PI / 2);

    const positions = geometry.attributes.position;
    const colors: number[] = [];

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const h = this.computeHeight(x, z);
      positions.setY(i, h);

      const t = (h + 2) / 4;
      if (t < 0.3) {
        colors.push(0.2, 0.5, 0.3);
      } else if (t < 0.6) {
        colors.push(0.3, 0.7, 0.2);
      } else {
        colors.push(0.5, 0.6, 0.4);
      }
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.9,
      metalness: 0.0,
    });

    this.ground = new THREE.Mesh(geometry, material);
    this.ground.receiveShadow = true;
    scene.add(this.ground);

    this.addTrees();
    this.addRocks();
    this.addGrass();
  }

  computeHeight(x: number, z: number): number {
    return noise(x, z);
  }

  getHeight(x: number, z: number): number {
    return this.computeHeight(x, z);
  }

  addTrees() {
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
    const leavesGeo = new THREE.ConeGeometry(1, 2, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });

    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 180;
      const z = (Math.random() - 0.5) * 180;
      const h = this.getHeight(x, z);

      if (h < -0.5 || h > 2) continue;

      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.75;
      trunk.castShadow = true;

      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.y = 2.2;
      leaves.castShadow = true;

      tree.add(trunk, leaves);
      tree.position.set(x, h, z);
      tree.scale.setScalar(0.8 + Math.random() * 0.5);
      this.scene.add(tree);
    }
  }

  addRocks() {
    const geo = new THREE.DodecahedronGeometry(0.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x757575 });

    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 180;
      const z = (Math.random() - 0.5) * 180;
      const h = this.getHeight(x, z);

      if (h < -0.5 || h > 2) continue;

      const rock = new THREE.Mesh(geo, mat);
      rock.position.set(x, h + 0.3, z);
      rock.scale.setScalar(0.5 + Math.random() * 1.5);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      this.scene.add(rock);
    }
  }

  addGrass() {
    const count = 5000;
    const geo = new THREE.PlaneGeometry(0.1, 0.4);
    geo.translate(0, 0.2, 0);

    const material = new THREE.MeshStandardMaterial({
      color: 0x4caf50,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.InstancedMesh(geo, material, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 180;
      const z = (Math.random() - 0.5) * 180;
      const h = this.getHeight(x, z);

      if (h < -0.5 || h > 2) {
        i--;
        continue;
      }

      dummy.position.set(x, h, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.setScalar(0.5 + Math.random() * 0.8);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }
}
