import { Player } from '../player/Player';
import { Paimon } from '../npc/Paimon';

export class HUD {
  player: Player;
  paimon: Paimon;
  container: HTMLDivElement;
  pauseMenu: HTMLDivElement;
  crosshair: HTMLDivElement;
  controlsHint: HTMLDivElement;
  damageNumbers: HTMLDivElement[] = [];

  constructor(player: Player, paimon: Paimon) {
    this.player = player;
    this.paimon = paimon;
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      user-select: none;
      z-index: 100;
      font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    `;
    document.getElementById('game-container')!.appendChild(this.container);

    this.container.appendChild(this.createCharacterPanel());
    this.container.appendChild(this.createMinimap());
    this.container.appendChild(this.createSkillBar());
    this.container.appendChild(this.createDialogBox());
    this.container.appendChild(this.createDamageContainer());

    this.pauseMenu = this.createPauseMenu();
    this.crosshair = this.createCrosshair();
    this.controlsHint = this.createControlsHint();

    this.container.appendChild(this.pauseMenu);
    this.container.appendChild(this.crosshair);
    this.container.appendChild(this.controlsHint);

    this.pauseMenu.style.display = 'none';
  }

  createCharacterPanel(): HTMLDivElement {
    const panel = document.createElement('div');
    panel.style.cssText = `
      position: absolute;
      top: 16px; left: 16px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    `;

    // Avatar
    const avatar = document.createElement('div');
    avatar.style.cssText = `
      width: 56px; height: 56px;
      border-radius: 8px;
      background: linear-gradient(135deg, #4a6741 0%, #2d5a27 100%);
      border: 2px solid rgba(255,255,255,0.8);
      box-shadow: 0 0 8px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      flex-shrink: 0;
    `;
    avatar.textContent = '空';
    panel.appendChild(avatar);

    // Bars container
    const bars = document.createElement('div');
    bars.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 180px;
    `;

    // Health bar
    const hpRow = document.createElement('div');
    hpRow.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    const hpIcon = document.createElement('span');
    hpIcon.textContent = '❤';
    hpIcon.style.cssText = 'color: #e74c3c; font-size: 12px;';
    const hpBar = document.createElement('div');
    hpBar.style.cssText = `
      flex: 1; height: 18px;
      background: rgba(0,0,0,0.5);
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.3);
      position: relative;
    `;
    const hpFill = document.createElement('div');
    hpFill.dataset.type = 'hp-fill';
    hpFill.style.cssText = `
      width: 100%; height: 100%;
      background: linear-gradient(90deg, #c0392b, #e74c3c);
      transition: width 0.3s ease;
    `;
    const hpText = document.createElement('span');
    hpText.dataset.type = 'hp-text';
    hpText.textContent = '10000 / 10000';
    hpText.style.cssText = `
      position: absolute;
      top: 0; left: 0; right: 0;
      text-align: center;
      font-size: 11px;
      color: white;
      line-height: 18px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      font-weight: bold;
    `;
    hpBar.appendChild(hpFill);
    hpBar.appendChild(hpText);
    hpRow.appendChild(hpIcon);
    hpRow.appendChild(hpBar);
    bars.appendChild(hpRow);

    // Stamina bar
    const staminaRow = document.createElement('div');
    staminaRow.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    const staminaIcon = document.createElement('span');
    staminaIcon.textContent = '⚡';
    staminaIcon.style.cssText = 'color: #f39c12; font-size: 12px;';
    const staminaBar = document.createElement('div');
    staminaBar.style.cssText = `
      flex: 1; height: 14px;
      background: rgba(0,0,0,0.5);
      border-radius: 3px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.2);
      position: relative;
    `;
    const staminaFill = document.createElement('div');
    staminaFill.dataset.type = 'stamina-fill';
    staminaFill.style.cssText = `
      width: 100%; height: 100%;
      background: linear-gradient(90deg, #d68910, #f5b041);
      transition: width 0.3s ease;
    `;
    staminaBar.appendChild(staminaFill);
    staminaRow.appendChild(staminaIcon);
    staminaRow.appendChild(staminaBar);
    bars.appendChild(staminaRow);

    panel.appendChild(bars);
    return panel;
  }

  createMinimap(): HTMLDivElement {
    const map = document.createElement('div');
    map.style.cssText = `
      position: absolute;
      top: 16px; right: 16px;
      width: 140px; height: 140px;
      border-radius: 50%;
      background: rgba(0,0,0,0.4);
      border: 2px solid rgba(255,255,255,0.4);
      box-shadow: 0 0 12px rgba(0,0,0,0.3);
      overflow: hidden;
    `;

    const mapInner = document.createElement('div');
    mapInner.style.cssText = `
      width: 100%; height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139,195,74,0.3) 0%, rgba(76,175,80,0.2) 100%);
      position: relative;
    `;

    // Compass directions
    const n = document.createElement('div');
    n.textContent = 'N';
    n.style.cssText = `
      position: absolute; top: 4px; left: 50%;
      transform: translateX(-50%);
      color: #e74c3c; font-size: 12px; font-weight: bold;
      text-shadow: 0 0 4px rgba(0,0,0,0.8);
    `;
    mapInner.appendChild(n);

    // Player dot
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 8px; height: 8px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(255,255,255,0.8);
    `;
    mapInner.appendChild(dot);

    // Direction arrow
    const arrow = document.createElement('div');
    arrow.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -100%);
      width: 0; height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 8px solid rgba(255,255,255,0.7);
    `;
    mapInner.appendChild(arrow);

    map.appendChild(mapInner);
    return map;
  }

  createSkillBar(): HTMLDivElement {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: absolute;
      bottom: 24px; right: 50%;
      transform: translateX(50%);
      display: flex;
      gap: 16px;
      align-items: flex-end;
    `;

    // Elemental Burst (Q)
    const burstWrapper = document.createElement('div');
    burstWrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    `;

    const burstIcon = document.createElement('div');
    burstIcon.style.cssText = `
      width: 48px; height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a5c5c, #2d8a8a);
      border: 2px solid rgba(255,255,255,0.5);
      box-shadow: 0 0 8px rgba(64,224,208,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      position: relative;
    `;
    burstIcon.textContent = '💨';

    const burstKey = document.createElement('div');
    burstKey.textContent = 'Q';
    burstKey.style.cssText = `
      font-size: 11px; color: rgba(255,255,255,0.7);
      background: rgba(0,0,0,0.4);
      padding: 1px 6px;
      border-radius: 4px;
    `;

    burstWrapper.appendChild(burstIcon);
    burstWrapper.appendChild(burstKey);
    bar.appendChild(burstWrapper);

    // Elemental Skill (E)
    const skillWrapper = document.createElement('div');
    skillWrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    `;

    const skillIcon = document.createElement('div');
    skillIcon.style.cssText = `
      width: 56px; height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1a5c5c, #40e0d0);
      border: 2px solid rgba(255,255,255,0.6);
      box-shadow: 0 0 12px rgba(64,224,208,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      position: relative;
      overflow: hidden;
    `;
    skillIcon.textContent = '🌬';

    // Cooldown overlay
    const cooldownOverlay = document.createElement('div');
    cooldownOverlay.dataset.type = 'skill-cooldown';
    cooldownOverlay.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.75);
      display: none;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: white;
      font-weight: bold;
      text-shadow: 0 0 4px rgba(0,0,0,0.8);
    `;
    skillIcon.appendChild(cooldownOverlay);

    // Ready glow ring
    const readyRing = document.createElement('div');
    readyRing.dataset.type = 'skill-ready';
    readyRing.style.cssText = `
      position: absolute;
      top: -3px; left: -3px;
      width: calc(100% + 6px); height: calc(100% + 6px);
      border-radius: 15px;
      border: 2px solid rgba(64,224,208,0.6);
      box-shadow: 0 0 8px rgba(64,224,208,0.4);
      animation: skillPulse 1.5s ease-in-out infinite;
      pointer-events: none;
    `;

    const key = document.createElement('div');
    key.textContent = 'E';
    key.style.cssText = `
      font-size: 12px; color: rgba(255,255,255,0.8);
      background: rgba(0,0,0,0.4);
      padding: 1px 8px;
      border-radius: 4px;
    `;

    skillWrapper.appendChild(skillIcon);
    skillWrapper.appendChild(key);
    bar.appendChild(skillWrapper);
    bar.appendChild(readyRing);

    // Sprint / Dodge
    const sprintWrapper = document.createElement('div');
    sprintWrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    `;

    const sprintIcon = document.createElement('div');
    sprintIcon.style.cssText = `
      width: 44px; height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5c4a1a, #8a7d2d);
      border: 2px solid rgba(255,255,255,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    `;
    sprintIcon.textContent = '🏃';

    const sprintKey = document.createElement('div');
    sprintKey.textContent = 'Shift';
    sprintKey.style.cssText = `
      font-size: 10px; color: rgba(255,255,255,0.6);
    `;

    sprintWrapper.appendChild(sprintIcon);
    sprintWrapper.appendChild(sprintKey);
    bar.appendChild(sprintWrapper);

    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes skillPulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.02); }
      }
    `;
    document.head.appendChild(style);

    return bar;
  }

  createDialogBox(): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: absolute;
      bottom: 100px; left: 50%;
      transform: translateX(-50%);
      display: none;
      align-items: flex-start;
      gap: 12px;
      max-width: 560px;
      padding: 16px 20px;
      background: rgba(0,0,0,0.65);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(4px);
    `;
    wrapper.dataset.type = 'dialog-wrapper';

    // Speaker avatar
    const avatar = document.createElement('div');
    avatar.style.cssText = `
      width: 48px; height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fff, #e0e0e0);
      border: 2px solid rgba(255,255,255,0.6);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    `;
    avatar.textContent = '🥺';

    const content = document.createElement('div');
    content.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
    `;

    const name = document.createElement('div');
    name.textContent = '派蒙';
    name.style.cssText = `
      color: #f1c40f;
      font-size: 14px;
      font-weight: bold;
    `;

    const text = document.createElement('div');
    text.dataset.type = 'dialog-text';
    text.style.cssText = `
      color: white;
      font-size: 15px;
      line-height: 1.5;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    `;

    content.appendChild(name);
    content.appendChild(text);
    wrapper.appendChild(avatar);
    wrapper.appendChild(content);

    return wrapper;
  }

  createDamageContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.dataset.type = 'damage-container';
    container.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;
    return container;
  }

  createPauseMenu(): HTMLDivElement {
    const menu = document.createElement('div');
    menu.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      backdrop-filter: blur(8px);
    `;

    const title = document.createElement('h1');
    title.textContent = '迷你原神';
    title.style.cssText = `
      color: white;
      font-size: 52px;
      margin-bottom: 12px;
      text-shadow: 0 0 20px rgba(64,224,208,0.5);
      letter-spacing: 8px;
    `;
    menu.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Mini Genshin Demo';
    subtitle.style.cssText = `
      color: rgba(255,255,255,0.5);
      font-size: 16px;
      margin-bottom: 40px;
      letter-spacing: 2px;
    `;
    menu.appendChild(subtitle);

    const hint = document.createElement('div');
    hint.style.cssText = `
      color: rgba(255,255,255,0.6);
      font-size: 16px;
      padding: 12px 32px;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      background: rgba(255,255,255,0.05);
      cursor: pointer;
      transition: all 0.2s;
    `;
    hint.textContent = '点击画面继续游戏';
    hint.onmouseenter = () => {
      hint.style.background = 'rgba(255,255,255,0.1)';
      hint.style.borderColor = 'rgba(255,255,255,0.4)';
    };
    hint.onmouseleave = () => {
      hint.style.background = 'rgba(255,255,255,0.05)';
      hint.style.borderColor = 'rgba(255,255,255,0.2)';
    };
    menu.appendChild(hint);

    const controls = document.createElement('div');
    controls.style.cssText = `
      margin-top: 40px;
      color: rgba(255,255,255,0.4);
      font-size: 13px;
      text-align: center;
      line-height: 1.8;
    `;
    controls.innerHTML = `
      <div>WASD 移动 | 空格 跳跃 | 鼠标 视角 | 滚轮 缩放</div>
      <div>左键/J 攻击 | E 元素战技 | Q 元素爆发 | ESC 暂停</div>
    `;
    menu.appendChild(controls);

    return menu;
  }

  createCrosshair(): HTMLDivElement {
    const ch = document.createElement('div');
    ch.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 24px; height: 24px;
      pointer-events: none;
    `;

    // Center dot
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 4px; height: 4px;
      background: rgba(255,255,255,0.9);
      border-radius: 50%;
      box-shadow: 0 0 4px rgba(0,0,0,0.5);
    `;
    ch.appendChild(dot);

    // Four lines
    const lines = [
      { top: '0', left: '50%', w: '1px', h: '8px' },
      { bottom: '0', left: '50%', w: '1px', h: '8px' },
      { top: '50%', left: '0', w: '8px', h: '1px' },
      { top: '50%', right: '0', w: '8px', h: '1px' },
    ];
    for (const line of lines) {
      const el = document.createElement('div');
      const style: string[] = [
        'position: absolute',
        'background: rgba(255,255,255,0.6)',
        'box-shadow: 0 0 2px rgba(0,0,0,0.5)',
      ];
      if ('top' in line) style.push(`top: ${line.top}`);
      if ('bottom' in line) style.push(`bottom: ${line.bottom}`);
      if ('left' in line) style.push(`left: ${line.left}; transform: translateX(-50%)`);
      if ('right' in line) style.push(`right: ${line.right}; transform: translateX(50%)`);
      style.push(`width: ${line.w}; height: ${line.h}`);
      el.style.cssText = style.join('; ');
      ch.appendChild(el);
    }

    return ch;
  }

  createControlsHint(): HTMLDivElement {
    const hint = document.createElement('div');
    hint.style.cssText = `
      position: absolute;
      bottom: 16px; left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.35);
      font-size: 13px;
      text-align: center;
      line-height: 1.6;
    `;
    hint.innerHTML = `
      <div>WASD 移动 | 空格 跳跃 | 鼠标 视角 | 滚轮 缩放</div>
      <div>左键/J 攻击 | E 元素战技 | Q 元素爆发</div>
    `;
    return hint;
  }

  showPauseMenu() {
    this.pauseMenu.style.display = 'flex';
    this.crosshair.style.display = 'none';
    this.controlsHint.style.display = 'none';
  }

  hidePauseMenu() {
    this.pauseMenu.style.display = 'none';
    this.crosshair.style.display = 'block';
    this.controlsHint.style.display = 'block';
  }

  spawnDamageNumber(amount: number, x: number, y: number, isCrit = false) {
    const container = this.container.querySelector('[data-type="damage-container"]') as HTMLDivElement;
    if (!container) return;

    const num = document.createElement('div');
    num.textContent = amount.toString();
    num.style.cssText = `
      position: absolute;
      left: ${x}px; top: ${y}px;
      color: ${isCrit ? '#ff6b35' : '#40e0d0'};
      font-size: ${isCrit ? '28px' : '22px'};
      font-weight: bold;
      text-shadow: 0 0 8px ${isCrit ? 'rgba(255,107,53,0.6)' : 'rgba(64,224,208,0.6)'}, 0 2px 4px rgba(0,0,0,0.5);
      pointer-events: none;
      animation: damageFloat 1s ease-out forwards;
      transform: translate(-50%, -50%);
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes damageFloat {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        100% { opacity: 0; transform: translate(-50%, -120%) scale(1); }
      }
    `;
    document.head.appendChild(style);

    container.appendChild(num);
    setTimeout(() => num.remove(), 1000);
  }

  update(dt: number) {
    const healthPct = this.player.health / this.player.maxHealth;
    const staminaPct = this.player.stamina / this.player.maxStamina;

    const hpFill = this.container.querySelector('[data-type="hp-fill"]') as HTMLDivElement;
    const hpText = this.container.querySelector('[data-type="hp-text"]') as HTMLDivElement;
    const staminaFill = this.container.querySelector('[data-type="stamina-fill"]') as HTMLDivElement;

    if (hpFill) hpFill.style.width = `${healthPct * 100}%`;
    if (hpText) hpText.textContent = `${Math.round(this.player.health)} / ${this.player.maxHealth}`;
    if (staminaFill) staminaFill.style.width = `${staminaPct * 100}%`;

    const cooldownOverlay = this.container.querySelector('[data-type="skill-cooldown"]') as HTMLDivElement;
    const readyRing = this.container.querySelector('[data-type="skill-ready"]') as HTMLDivElement;

    if (cooldownOverlay) {
      if (this.player.skillCooldown > 0) {
        cooldownOverlay.style.display = 'flex';
        cooldownOverlay.textContent = Math.ceil(this.player.skillCooldown).toString();
        if (readyRing) readyRing.style.display = 'none';
      } else {
        cooldownOverlay.style.display = 'none';
        if (readyRing) readyRing.style.display = 'block';
      }
    }

    const dialogWrapper = this.container.querySelector('[data-type="dialog-wrapper"]') as HTMLDivElement;
    const dialogText = this.container.querySelector('[data-type="dialog-text"]') as HTMLDivElement;

    const dialog = this.paimon.getCurrentDialog();
    if (dialogWrapper && dialogText) {
      if (dialog) {
        dialogWrapper.style.display = 'flex';
        dialogText.textContent = dialog;
      } else {
        dialogWrapper.style.display = 'none';
      }
    }
  }
}
