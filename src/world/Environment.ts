import * as THREE from 'three';

export class Environment {
  scene: THREE.Scene;
  sun: THREE.DirectionalLight;
  ambient: THREE.AmbientLight;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 30, 120);

    this.ambient = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff5e6, 1.2);
    this.sun.position.set(50, 80, 30);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 200;
    this.sun.shadow.camera.left = -50;
    this.sun.shadow.camera.right = 50;
    this.sun.shadow.camera.top = 50;
    this.sun.shadow.camera.bottom = -50;
    scene.add(this.sun);

    const hemi = new THREE.HemisphereLight(0x87ceeb, 0x3d5c3d, 0.4);
    scene.add(hemi);

    this.addClouds();
  }

  addClouds() {
    const cloudGeo = new THREE.SphereGeometry(1, 8, 8);
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });

    for (let i = 0; i < 15; i++) {
      const cloud = new THREE.Group();
      const blobs = 3 + Math.floor(Math.random() * 4);

      for (let j = 0; j < blobs; j++) {
        const blob = new THREE.Mesh(cloudGeo, cloudMat);
        blob.position.set(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 2
        );
        blob.scale.setScalar(1 + Math.random());
        cloud.add(blob);
      }

      cloud.position.set(
        (Math.random() - 0.5) * 150,
        25 + Math.random() * 15,
        (Math.random() - 0.5) * 150
      );

      this.scene.add(cloud);
    }
  }
}
