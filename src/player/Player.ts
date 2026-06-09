import * as THREE from 'three';
import { InputManager } from '../core/InputManager';
import { Terrain } from '../world/Terrain';
import { PlayerModel } from './PlayerModel';

export class Player {
  mesh: THREE.Group;
  model: PlayerModel;
  position = new THREE.Vector3(0, 5, 0);
  velocity = new THREE.Vector3();
  rotation = 0;
  cameraYaw = 0;
  onGround = false;
  speed = 8;
  jumpForce = 12;
  gravity = 30;
  health = 100;
  maxHealth = 100;
  stamina = 100;
  maxStamina = 100;
  staminaRegen = 30;
  sprinting = false;
  sprintSpeed = 16;
  normalSpeed = 8;
  attacking = false;
  attackTimer = 0;
  skillCooldown = 0;
  burstCooldown = 0;
  scene: THREE.Scene;
  input: InputManager;
  terrain: Terrain;

  constructor(scene: THREE.Scene, input: InputManager, terrain: Terrain) {
    this.scene = scene;
    this.input = input;
    this.terrain = terrain;
    this.model = new PlayerModel();
    this.mesh = this.model.mesh;
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);
  }

  update(dt: number) {
    if (this.skillCooldown > 0) this.skillCooldown -= dt;
    if (this.burstCooldown > 0) this.burstCooldown -= dt;

    // stamina regen when not sprinting
    if (!this.sprinting && this.stamina < this.maxStamina) {
      this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRegen * dt);
    }

    this.handleMovement(dt);
    this.handleCombat(dt);
    this.applyPhysics(dt);

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation + Math.PI;
  }

  handleMovement(dt: number) {
    if (!this.input.locked) return;

    const forward = this.input.isDown('KeyW') ? 1 : this.input.isDown('KeyS') ? -1 : 0;
    const right = this.input.isDown('KeyD') ? 1 : this.input.isDown('KeyA') ? -1 : 0;
    const shiftDown = this.input.isDown('ShiftLeft') || this.input.isDown('ShiftRight');

    // Sprint logic
    this.sprinting = false;
    if (shiftDown && (forward !== 0 || right !== 0) && this.stamina > 0) {
      this.sprinting = true;
      this.speed = this.sprintSpeed;
      this.stamina = Math.max(0, this.stamina - 25 * dt);
    } else {
      this.speed = this.normalSpeed;
    }

    if (forward !== 0 || right !== 0) {
      const moveAngle = Math.atan2(right, -forward) + this.cameraYaw;

      this.rotation = -moveAngle;
      this.position.x += Math.sin(moveAngle) * this.speed * dt;
      this.position.z += Math.cos(moveAngle) * this.speed * dt;
      this.model.setAnimation(this.sprinting ? 'sprint' : 'walk');
    } else {
      this.model.setAnimation('idle');
    }

    if (this.input.isDown('Space') && this.onGround) {
      this.velocity.y = this.jumpForce;
      this.onGround = false;
      this.model.setAnimation('jump');
    }
  }

  handleCombat(dt: number) {
    if (this.attacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attacking = false;
      }
      return;
    }

    if (this.input.isDown('MouseLeft') || this.input.isDown('KeyJ')) {
      this.attacking = true;
      this.attackTimer = 0.4;
      this.model.setAnimation('attack');
    }

    // E: Elemental Skill
    if (this.input.isDown('KeyE') && this.skillCooldown <= 0) {
      this.skillCooldown = 5;
      this.model.setAnimation('skill');
      this.createWindBlade();
    }

    // Q: Elemental Burst
    if (this.input.isDown('KeyQ') && this.burstCooldown <= 0) {
      this.burstCooldown = 12;
      this.model.setAnimation('burst');
      this.createTornado();
    }
  }

  createWindBlade() {
    const geometry = new THREE.ConeGeometry(0.5, 3, 8);
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x40e0d0,
      transparent: true,
      opacity: 0.8,
    });
    const blade = new THREE.Mesh(geometry, material);

    const direction = new THREE.Vector3(
      Math.sin(-this.rotation),
      0,
      Math.cos(-this.rotation)
    );

    blade.position.copy(this.position).add(direction.clone().multiplyScalar(1.5));
    blade.position.y += 1;
    blade.rotation.y = -this.rotation;
    this.scene.add(blade);

    const speed = 20;
    let life = 0;

    const animate = () => {
      life += 0.016;
      blade.position.add(direction.clone().multiplyScalar(speed * 0.016));
      blade.scale.setScalar(1 + life * 2);
      material.opacity = Math.max(0, 0.8 - life * 1.5);

      if (life < 1) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(blade);
        geometry.dispose();
        material.dispose();
      }
    };
    animate();
  }

  createTornado() {
    // Create a swirling tornado effect
    const group = new THREE.Group();
    group.position.copy(this.position);
    group.position.y += 0.5;
    this.scene.add(group);

    // Main funnel
    const funnelGeo = new THREE.ConeGeometry(1.5, 6, 16, 1, true);
    const funnelMat = new THREE.MeshBasicMaterial({
      color: 0x40e0d0,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const funnel = new THREE.Mesh(funnelGeo, funnelMat);
    funnel.position.y = 3;
    group.add(funnel);

    // Inner spiral particles
    const particleCount = 30;
    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < particleCount; i++) {
      const size = 0.1 + Math.random() * 0.3;
      const pGeo = new THREE.SphereGeometry(size, 4, 4);
      const pMat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.5 ? 0x40e0d0 : 0x80f0e0,
        transparent: true,
        opacity: 0.6,
      });
      const p = new THREE.Mesh(pGeo, pMat);
      particles.push(p);
      group.add(p);
    }

    let life = 0;
    const duration = 3;

    const animate = () => {
      life += 0.016;
      const t = life / duration;

      // Rotate funnel
      funnel.rotation.y -= 0.15;
      funnel.scale.setScalar(1 + Math.sin(life * 3) * 0.2);
      funnelMat.opacity = 0.3 * (1 - t);

      // Animate particles in spiral
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = life * 5 + (i / particleCount) * Math.PI * 2;
        const radius = 1 + Math.sin(life * 2 + i) * 0.5;
        const height = ((life * 3 + i * 0.3) % 6);
        p.position.x = Math.cos(angle) * radius;
        p.position.z = Math.sin(angle) * radius;
        p.position.y = height;
        (p.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - t);
      }

      if (life < duration) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(group);
        funnelGeo.dispose();
        funnelMat.dispose();
        particles.forEach(p => {
          p.geometry.dispose();
          (p.material as THREE.MeshBasicMaterial).dispose();
        });
      }
    };
    animate();
  }

  applyPhysics(dt: number) {
    this.velocity.y -= this.gravity * dt;
    this.position.y += this.velocity.y * dt;

    const terrainHeight = this.terrain.getHeight(this.position.x, this.position.z);

    if (this.position.y <= terrainHeight + 0.1) {
      this.position.y = terrainHeight + 0.1;
      this.velocity.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }
}
