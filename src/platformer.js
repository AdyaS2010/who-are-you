import { AudioEngine } from './audio.js';
const NW = 320, NH = 180;
const ENVS = {
  twilight:{sky:['#0c0818','#2a1f45'],ground:'#1a1230',accent:'#c9b8ff',stars:true},
  urban:{sky:['#0a0c12','#1e2540'],ground:'#151a28',accent:'#7eb8e0',stars:true},
  forest:{sky:['#0a120e','#1d3520'],ground:'#142618',accent:'#7ecc8e',stars:false},
  crossroads:{sky:['#120810','#3a1f35'],ground:'#251520',accent:'#e87eaa',stars:true},
  storm:{sky:['#080a10','#181c28'],ground:'#101520',accent:'#8899bb',stars:true},
  iron:{sky:['#0a0a10','#252535'],ground:'#181822',accent:'#aaaacc',stars:false},
  chaos:{sky:['#100508','#351520'],ground:'#201015',accent:'#ff6666',stars:false},
  collective:{sky:['#08080f','#202060'],ground:'#151540',accent:'#8888ff',stars:true},
  mirror:{sky:['#100a12','#3a1f50'],ground:'#251530',accent:'#cc88ff',stars:true},
  void:{sky:['#020202','#050505'],ground:'#030303',accent:'#555',stars:false},
};
export class Platformer {
  constructor(canvas, hudEl) {
    this.c = canvas; this.ctx = canvas.getContext('2d');
    this.hud = hudEl; this.audio = new AudioEngine();
    this.buf = document.createElement('canvas');
    this.buf.width = NW; this.buf.height = NH;
    this.b = this.buf.getContext('2d');
    this.running = false; this.phase = 2;
    this.choiceCb = null; this.collected = false;
    this.env = ENVS.twilight; this.shakeX = 0; this.shakeY = 0;
    this.player = {x:20,y:120,vx:0,vy:0,grounded:false,dir:1,frame:0,coyote:0,jumpBuf:0,wasG:false};
    this.cam = {x:0}; this.platforms = []; this.orbs = [];
    this.crystal = null; this.particles = []; this.stars = [];
    this.paths = []; this.questionTriggered = false;
    this.signs = []; this.movingPlats = [];
    this.decorations = []; this.storyNodes = [];
    this.footT = 0; this.trail = [];
    this.motes = [];
    for(let i=0;i<25;i++) this.motes.push({x:Math.random()*560,y:Math.random()*150,vx:(Math.random()-.5)*4,vy:-Math.random()*3-.5,s:Math.random()*1.5+.5,life:Math.random()*8+4,maxLife:8,t:Math.random()*6.28});
    this.keys = {};
    for(let i=0;i<60;i++) this.stars.push({x:Math.random()*800,y:Math.random()*90,s:Math.random()*1.2+.3,t:Math.random()*6.28});
    this._bind();this._resize();
    window.addEventListener('resize',()=>this._resize());
  }
  _resize(){
    const vw=window.innerWidth,vh=window.innerHeight;
    this.c.width=vw*(devicePixelRatio||1);this.c.height=vh*(devicePixelRatio||1);
    this.c.style.width='100%';this.c.style.height='100%';
  }
  _bind(){
    const k=(e,d)=>{
      if(document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA'))return;
      if(['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW'].includes(e.code)){e.preventDefault();this.keys[e.code]=d;if(d&&!this.audio.initialized){this.audio.init();this.audio.resume();this.audio.startAmbient(this.phase);}}
    };
    window.addEventListener('keydown',e=>k(e,true));window.addEventListener('keyup',e=>k(e,false));
    this.c.addEventListener('touchstart',e=>{if(!this.audio.initialized){this.audio.init();this.audio.resume();this.audio.startAmbient(this.phase);}for(const t of e.changedTouches){const r=t.clientX/window.innerWidth;if(r<.3)this.keys._tl=true;else if(r>.7)this.keys._tr=true;else this.keys._tj=true;}e.preventDefault();},{passive:false});
    this.c.addEventListener('touchend',()=>{this.keys._tl=false;this.keys._tr=false;this.keys._tj=false;});
  }
  setArchetype(id){
    this.playerArchetype = id;
    this.doubleJumpUsed = false;
    this.wasSpacePressed = false;
    this._renderPowerupBadge();
  }
  _renderPowerupBadge(){
    let badge = this.hud.querySelector('.ghud-powerup-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'ghud-powerup-badge';
      this.hud.appendChild(badge);
    }
    let info;
    if (this.phase === 4) {
      info = { name: 'Identity Dissolved', desc: 'Archetype powerups offline', icon: '❌' };
    } else {
      info = {
        alex: { name: 'Shielded Mind', desc: 'Maintains steady velocity', icon: '🛡️' },
        mira: { name: 'Continuity Jump', desc: 'Allows a Double Jump in mid-air', icon: '✨' },
        riley: { name: 'Wind Dash', desc: 'Jump in mid-air to Dash forward', icon: '💨' },
        solara: { name: 'Ethereal Float', desc: 'Hold Space to glide slowly', icon: '🪶' },
        dylan: { name: 'Magnetic Pull', desc: 'Attracts orbs from a distance', icon: '🧲' },
        axel: { name: 'Glitched Gravity', desc: 'Jump 15% higher and fall slower', icon: '⚡' },
        skyler: { name: 'Super Speed', desc: 'Move 40% faster through the level', icon: '🏃' }
      }[this.playerArchetype] || { name: 'Inner Self', desc: 'No active powerup', icon: '⭐' };
    }

    let html = `
      <span class="powerup-icon">${info.icon}</span>
      <div class="powerup-info">
        <span class="powerup-name">${info.name}</span>
        <span class="powerup-source">${info.desc}</span>
      </div>
    `;

    if (this.hasWings || this.hasShield) {
      html += `<div class="shop-upgrades-hud-row">`;
      if (this.hasWings) html += `<span class="shop-upgrade-badge" title="Triple Jump Active">🪶 Wings</span>`;
      if (this.hasShield) html += `<span class="shop-upgrade-badge" title="Hobbesian Fall Protection Active">🛡️ Shield</span>`;
      html += `</div>`;
    }

    badge.innerHTML = html;
  }
  setPhase(p){this.phase=p;}
  onChoice(cb){this.choiceCb=cb;}

  loadScenario(scenario, envKey){
    this.env = ENVS[envKey]||ENVS.twilight;
    if(this.phase===4) this.env=ENVS.void;
    this.collected=false; this.questionTriggered=false;
    this.player.x=20;this.player.y=120;this.player.vx=0;this.player.vy=0;this.player.grounded=false;
    this.cam.x=0; this.particles=[];
    this.platforms=[]; this.movingPlats=[]; this.orbs=[]; this.signs=[];
    this.decorations=[]; this.storyNodes=[];

    const GY=152, nc=scenario.choices.length;
    const ph=this.phase;

    // --- ENVIRONMENTAL DECORATIONS based on env ---
    const ek=envKey||'twilight';
    if(ek==='forest'||ek==='crossroads'){
      for(let x=20;x<280;x+=25+Math.random()*20)
        this.decorations.push({type:'tree',x,h:15+Math.random()*20,w:2+Math.random()*2});
    } else if(ek==='urban'||ek==='iron'){
      for(let x=15;x<280;x+=20+Math.random()*15)
        this.decorations.push({type:'building',x,h:20+Math.random()*35,w:8+Math.random()*8});
    } else if(ek==='storm'||ek==='chaos'){
      for(let x=10;x<280;x+=30+Math.random()*25)
        this.decorations.push({type:'mountain',x,h:25+Math.random()*30,w:15+Math.random()*10});
    } else if(ek==='void'){
      for(let i=0;i<8;i++)
        this.decorations.push({type:'ruin',x:30+Math.random()*250,h:5+Math.random()*15,w:4+Math.random()*8});
    } else {
      for(let x=30;x<280;x+=35+Math.random()*25)
        this.decorations.push({type:'pillar',x,h:10+Math.random()*18,w:3});
    }

    // --- STORY TEXT that reveals as you walk through it ---
    const sentences=scenario.text.split(/(?<=[.!?])\s+/).filter(s=>s.trim());
    const storySpacing=200/(sentences.length+1);
    sentences.forEach((s,i)=>{
      this.storyNodes.push({x:40+storySpacing*(i+1),y:20+i*8,text:s.trim(),opacity:0});
    });

    // --- PHASE-SPECIFIC LEVEL DESIGN ---
    if(ph===2){
      // Phase 2: Open journey, gentle ground, welcoming terrain
      for(let x=0;x<300;x+=4) this.platforms.push({x,y:GY,w:4,h:28,solid:true});
      this.platforms.push({x:70,y:135,w:28,h:4,solid:false});
      this.platforms.push({x:130,y:125,w:24,h:4,solid:false});
      this.platforms.push({x:190,y:130,w:20,h:4,solid:false});
      // Intermediate climbing platforms for highest path accessibility
      this.platforms.push({x:235,y:112,w:22,h:4,solid:false});
      this.platforms.push({x:265,y:96,w:18,h:4,solid:false});
    } else if(ph===3){
      // Phase 3: Constrained world, tighter spaces, ceiling pressure
      for(let x=0;x<300;x+=4) this.platforms.push({x,y:GY,w:4,h:28,solid:true});
      // Ceiling tiles to feel oppressive
      for(let x=60;x<280;x+=4) this.platforms.push({x,y:60,w:4,h:4,solid:true,ceiling:true});
      this.platforms.push({x:100,y:135,w:16,h:4,solid:false});
      this.platforms.push({x:170,y:128,w:14,h:4,solid:false});
      // Intermediate climbing platforms for Phase 3
      this.platforms.push({x:215,y:115,w:16,h:4,solid:false});
      this.platforms.push({x:250,y:100,w:14,h:4,solid:false});
    } else {
      // Phase 4: Crumbling void, ground breaks apart
      for(let x=0;x<280;x+=4){
        const isSafe=x<60||Math.random()>.25;
        this.platforms.push({x,y:GY,w:4,h:28,solid:true,
          crumble:x>80&&Math.random()>.5,crumbleT:null});
      }
      // Stepping stones in Phase 4
      this.platforms.push({x:90,y:135,w:16,h:4,solid:false,crumble:true,crumbleT:null});
      this.platforms.push({x:150,y:125,w:14,h:4,solid:false,crumble:true,crumbleT:null});
      this.platforms.push({x:205,y:112,w:14,h:4,solid:false,crumble:true,crumbleT:null});
      this.platforms.push({x:255,y:98,w:14,h:4,solid:false,crumble:true,crumbleT:null});
    }

    // Crystal at approach end (positioned dynamically to prevent overlap with platforms)
    let cx = 255, cy = 118;
    if (ph === 2) { cx = 214; cy = 124; }
    else if (ph === 3) { cx = 236; cy = 126; }
    else if (ph === 4) { cx = 222; cy = 124; }
    this.crystal = { x: cx, y: cy, triggered: false, t: 0 };

    // --- CHOICE PATHS with meaningful labels ---
    const pathYs = nc===2 ? [95,145] : [80,118,148];
    const pathColors = nc===2 ? ['#ffcc66','#66ccff'] : ['#ff8888','#88ff88','#8888ff'];
    // Wall separator at fork point
    for(let y=0;y<NH;y+=4){
      let blocked=true;
      for(const py of pathYs){ if(y>=py-48&&y<=py+16) blocked=false; }
      if(blocked) this.platforms.push({x:295,y,w:4,h:4,solid:true,wall:true});
    }

    // Build paths with phase-aware design
    pathYs.forEach((py,i)=>{
      const startX=308, endX=510, orbX=endX-10;
      const label=scenario.choices[i].text;
      const shortLabel = `Option ${String.fromCharCode(65 + i)}`;
      this.signs.push({x:282,y:py-6,text:shortLabel,color:pathColors[i]});

      if(ph===2){
        // P2: Each path is accessible but with increasing height = aspiration
        const pCount=4+Math.floor(Math.random()*2);
        for(let j=0;j<pCount;j++){
          const px=startX+j*((endX-startX-40)/pCount);
          const pw=18+Math.random()*8;
          this.platforms.push({x:px,y:py+Math.random()*4-2,w:pw,h:4,solid:false});
        }
      } else if(ph===3){
        // P3: Paths are hostile, moving platforms, tight spaces
        let px=startX;
        while(px<endX-40){
          if(i===0){
            // Top: sparse crumbling
            this.platforms.push({x:px,y:py+Math.random()*6-3,w:14,h:4,solid:false,crumble:true,crumbleT:null});
            px+=35+Math.random()*10;
          } else {
            // Others: moving
            this.movingPlats.push({x:px,y:py,w:18,h:4,baseX:px,baseY:py,mx:0,my:8+i*4,speed:.8+Math.random()*.4,t:Math.random()*6.28});
            px+=38+Math.random()*10;
          }
        }
      } else {
        // P4: Everything is unstable, flickering platforms
        let px=startX;
        while(px<endX-30){
          this.platforms.push({x:px,y:py+Math.random()*6-3,w:12+Math.random()*6,h:4,solid:false,
            crumble:Math.random()>.3,crumbleT:null,flicker:true});
          px+=25+Math.random()*15;
        }
      }

      // Landing platform + orb at end
      this.platforms.push({x:orbX-14,y:py,w:30,h:4,solid:false});
      this.orbs.push({x:orbX,y:py-8,text:shortLabel,fullText:label,
        vectors:scenario.choices[i].vectors,collected:false,t:Math.random()*6.28,color:pathColors[i]});
    });

    // HUD: only narrator, story reveals through walking
    this.hud.innerHTML='';
    const nar=document.createElement('div');nar.className='ghud-narrator';
    nar.textContent=scenario.narrator?.replace(/"/g,'')||'';
    this.hud.appendChild(nar);
    this._scenarioText=scenario.text;
    this._scenarioChoices=scenario.choices;
    this._showBanner(false);
    this._renderPowerupBadge();
  }

  _showBanner(show){
    let el=this.hud.querySelector('.ghud-scenario');
    if(!el&&show){
      el=document.createElement('div');el.className='ghud-scenario';
      let h=`<div class="ghud-question">${this._scenarioText}</div>`;
      h+='<div class="ghud-hint">Climb the path of your intuition and claim a glowing orb</div>';
      el.innerHTML=h; this.hud.appendChild(el);
    }
    if(el) el.style.opacity=(show && !this.collected)?'1':'0';
  }
  _showCollect(text, color){
    let el=this.hud.querySelector('.ghud-collect');
    if(!el){el=document.createElement('div');el.className='ghud-collect';this.hud.appendChild(el);}
    el.textContent='✦ Chosen: ' + text;
    el.style.background = color || 'var(--accent)';
    el.style.color = '#0a0810';
    el.style.borderColor = '#ffffff';
    el.style.opacity='1';
    setTimeout(()=>{el.style.opacity='0';},2800);
  }
  _updateProximity(){
    // Disabled to keep selection blind until touched
  }

  start(){this.running=true;this.audio.init();this.audio.resume();this.audio.startAmbient(this.phase);this._last=performance.now();this._loop();}
  stop(){this.running=false;this.audio.stopAmbient();}

  _loop(){
    if(!this.running)return;
    const now=performance.now(),dt=Math.min((now-this._last)/1000,.05);
    this._last=now;this._update(dt);this._render();
    requestAnimationFrame(()=>this._loop());
  }

  _update(dt){
    if(this.collected) {
      this._showBanner(false);
      return;
    }
    const p=this.player;

    // Archetype powerup attributes (disabled in the glitch phase)
    const isSkyler = this.phase !== 4 && this.playerArchetype === 'skyler';
    const isAlex = this.phase !== 4 && this.playerArchetype === 'alex';
    const isAxel = this.phase !== 4 && this.playerArchetype === 'axel';
    const isSolara = this.phase !== 4 && this.playerArchetype === 'solara';
    const isDylan = this.phase !== 4 && this.playerArchetype === 'dylan';
    const isRiley = this.phase !== 4 && this.playerArchetype === 'riley';
    const isMira = this.phase !== 4 && this.playerArchetype === 'mira';

    const spd = isSkyler ? 145 : 105;
    const acc = isSkyler ? 950 : 800;
    const fric = isAlex ? 180 : 500;
    const grav = isAxel ? 500 : (isSolara && p.vy > 0 && (this.keys.Space||this.keys.ArrowUp||this.keys.KeyW||this.keys._tj) ? 280 : 620);
    const jmpF = isAxel ? -180 : -155;

    // Magnetic pull for Dylan
    if(isDylan){
      this.orbs.forEach(orb=>{
        if(orb.collected)return;
        const dx=(p.x+4)-orb.x, dy=(p.y+8)-orb.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<80){
          const pullSpeed=90*(1-dist/80)*dt;
          orb.x+= (dx>0?-1:1)*pullSpeed;
          orb.y+= (dy>0?-1:1)*pullSpeed;
        }
      });
    }

    let dir=0;
    if(this.keys.ArrowLeft||this.keys.KeyA||this.keys._tl) dir=-1;
    if(this.keys.ArrowRight||this.keys.KeyD||this.keys._tr) dir=1;

    // Horizontal movement
    if(dir){p.vx+=dir*acc*dt;p.vx=Math.max(-spd,Math.min(spd,p.vx));p.dir=dir;
      if(p.grounded){p.frame+=dt*10;this.footT+=dt;
        if(this.footT>.2){this.audio.playFootstep();this.footT=0;this._dust(p.x+4,p.y+14);}}
      // Movement trail
      if(Math.abs(p.vx)>30) this.trail.push({x:p.x+4,y:p.y+7,a:0.4,life:0.3});}
    else{p.vx*=(1-fric*dt/80);if(Math.abs(p.vx)<.5)p.vx=0;p.frame=0;}

    // Jump with coyote time + buffer
    const wantJmp=this.keys.Space||this.keys.ArrowUp||this.keys.KeyW||this.keys._tj;
    if(wantJmp) p.jumpBuf=.1;
    if(p.jumpBuf>0) p.jumpBuf-=dt;
    if(p.coyote>0) p.coyote-=dt;

    const jmpPressed = wantJmp && !this.wasSpacePressed;
    this.wasSpacePressed = wantJmp;

    if(p.grounded){
      this.doubleJumpUsed = false;
      this.tripleJumpUsed = false;
    }

    if(p.jumpBuf>0&&p.coyote>0){
      p.vy=jmpF;
      p.coyote=0;
      p.jumpBuf=0;
      p.grounded=false;
      this.audio.playJump();
      // Burst of mystical dust particles on jump
      for(let i=0; i<8; i++){
        this.particles.push({
          x: p.x + 4,
          y: p.y + 14,
          vx: (Math.random() - 0.5) * 40,
          vy: (Math.random() - 0.5) * 15,
          life: 0.5,
          color: this.env.accent
        });
      }
    } else if(!p.grounded && !this.doubleJumpUsed && jmpPressed){
      // Universal double jump for all characters
      if(isRiley){
        // Riley: air dash instead of vertical jump
        p.vx=p.dir*280;
        p.vy=-40;
        this.doubleJumpUsed=true;
        this.audio.playJump();
        for(let i=0;i<10;i++){
          this.particles.push({x:p.x+4,y:p.y+8,vx:-p.dir*(Math.random()*60+20),vy:(Math.random()-0.5)*15,life:0.5,color:'#ff6666'});
        }
      } else {
        // Everyone else: standard double jump
        p.vy = isMira ? jmpF : jmpF * 0.85;
        this.doubleJumpUsed=true;
        this.audio.playJump();
        const djColor = isMira ? '#ffdd66' : this.env.accent;
        const djCount = isMira ? 10 : 6;
        for(let i=0;i<djCount;i++){
          this.particles.push({x:p.x+4,y:p.y+14,vx:(Math.random()-0.5)*45,vy:(Math.random()-0.5)*25,life:0.5,color:djColor});
        }
      }
    } else if(!p.grounded && this.doubleJumpUsed && !this.tripleJumpUsed && jmpPressed && this.hasWings){
      // Emersonian Wings: TRIPLE JUMP
      p.vy = jmpF * 0.8;
      this.tripleJumpUsed = true;
      this.audio.playJump();
      for(let i=0;i<10;i++){
        this.particles.push({x:p.x+4,y:p.y+14,vx:(Math.random()-0.5)*40,vy:(Math.random()-0.5)*25,life:0.5,color:'#66ffdd'});
      }
    }
    // Variable jump height: release early = lower jump
    if(!wantJmp&&p.vy<-40) p.vy*=.8;

    p.vy+=grav*dt; p.x+=p.vx*dt; p.y+=p.vy*dt;

    // Collision with static platforms
    p.grounded=false;
    const allPlats=[...this.platforms.filter(pl=>!pl.crumbleT||pl.crumbleT>.3),...this.movingPlats];
    for(const pl of allPlats){
      if(pl.wall||pl.solid){
        // Solid walls: block horizontal movement
        if(pl.wall && p.x+7>pl.x && p.x+1<pl.x+pl.w && p.y+14>pl.y && p.y<pl.y+pl.h){
          if(p.vx>0) p.x=pl.x-8; else p.x=pl.x+pl.w;
          p.vx=0;
        }
        // Solid ground
        if(pl.solid&&!pl.wall && p.x+7>pl.x && p.x+1<pl.x+pl.w && p.vy>=0){
          if(p.y+15>=pl.y && p.y+15<pl.y+10){p.y=pl.y-15;p.vy=0;p.grounded=true;}
        }
      } else {
        // One-way platforms: land on top
        if(p.x+7>pl.x && p.x+1<pl.x+pl.w && p.vy>=0){
          const feet=p.y+15;
          if(feet>=pl.y-1 && feet<pl.y+8){p.y=pl.y-15;p.vy=0;p.grounded=true;
            // Crumble check
            if(pl.crumble&&pl.crumbleT===null){pl.crumbleT=0;}
          }
        }
      }
    }

    if(p.grounded) p.coyote=.12;
    if(p.grounded&&!p.wasG){
      this.shakeY=1.2;this.audio.playLand();
      // Landing dust burst
      for(let i=0;i<5;i++) this.particles.push({x:p.x+4+Math.random()*4-2,y:p.y+14,vx:(Math.random()-.5)*25,vy:-Math.random()*10-2,life:0.35,color:this.env.accent});
    }
    p.wasG=p.grounded;

    // Crumbling platforms
    this.platforms.forEach(pl=>{if(pl.crumbleT!==null&&pl.crumbleT<9) pl.crumbleT+=dt;});

    // Moving platforms
    this.movingPlats.forEach(mp=>{
      mp.t+=dt*mp.speed;
      mp.x=mp.baseX+Math.sin(mp.t)*mp.mx;
      mp.y=mp.baseY+Math.sin(mp.t)*mp.my;
    });

    // Bounds & respawn
    p.x=Math.max(0,Math.min(560,p.x));
    if(p.y>190){
      if(this.hasShield) {
        // Hobbesian Shield: Teleport slightly back to safety
        p.x = Math.max(40, p.x - 35);
        p.y = 80; p.vy = 0; p.vx = 0;
        this.audio.playLand();
      } else {
        p.x=20;p.y=120;p.vy=0;p.vx=0;
      }
    }

    // Camera (smooth lerp)
    const tx=p.x-NW/2+30;
    this.cam.x+=(tx-this.cam.x)*.09;
    this.cam.x=Math.max(0,Math.min(280,this.cam.x));

    // Crystal
    if(this.crystal&&!this.crystal.triggered){
      if(Math.abs(p.x+4-this.crystal.x)<14&&Math.abs(p.y+8-this.crystal.y)<16){
        this.crystal.triggered=true;this.questionTriggered=true;
        this.audio.playCrystal();this._showBanner(true);
      }
    }
    if(this.crystal) this.crystal.t+=dt;

    // Orb collision
    for(const orb of this.orbs){
      if(orb.collected)continue; orb.t+=dt;
      if(Math.abs(p.x+4-orb.x)<10&&Math.abs(p.y+8-orb.y)<12){
        orb.collected=true;this.collected=true;
        this._showBanner(false);
        this.audio.playCollect();this.shakeX=3;this.shakeY=3;
        if(this.phase===4) this.audio.playGlitch();
        for(let i=0;i<20;i++) this.particles.push({x:orb.x,y:orb.y,vx:(Math.random()-.5)*100,vy:(Math.random()-.5)*100,life:1,color:orb.color});
        this._showCollect(orb.fullText, orb.color);
        setTimeout(()=>{if(this.choiceCb) this.choiceCb(this.orbs.indexOf(orb),orb.vectors);},1800);
      }
    }

    // Particles
    this.particles=this.particles.filter(pt=>{pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.vy+=120*dt;pt.life-=dt*1.5;return pt.life>0;});
    // Trail fade
    this.trail=this.trail.filter(tr=>{tr.a-=dt*2;tr.life-=dt;return tr.life>0;});
    // Ambient motes
    this.motes.forEach(m=>{m.x+=m.vx*dt;m.y+=m.vy*dt;m.t+=dt;if(m.y<-5||m.x<-5||m.x>565){m.x=Math.random()*560;m.y=155;m.t=0;}});
    this.shakeX*=.85;this.shakeY*=.85;
    this._updateProximity();
  }

  _dust(x,y){for(let i=0;i<2;i++) this.particles.push({x,y,vx:(Math.random()-.5)*12,vy:-Math.random()*8,life:.4,color:this.env.ground});}

  _render(){
    const b=this.b,cx=this.cam.x,t=performance.now()/1000,isV=this.phase===4;

    // Sky
    const sg=b.createLinearGradient(0,0,0,NH);
    sg.addColorStop(0,this.env.sky[0]);sg.addColorStop(1,this.env.sky[1]);
    b.fillStyle=sg;b.fillRect(0,0,NW,NH);

    // Stars
    if(this.env.stars){b.fillStyle='#fff';this.stars.forEach(s=>{
      const sx=((s.x-cx*.1)%400+400)%400;if(sx>NW)return;
      b.globalAlpha=.3+Math.sin(t+s.t)*.2;
      b.fillRect(Math.floor(sx),Math.floor(s.y),Math.ceil(s.s),Math.ceil(s.s));});b.globalAlpha=1;}

    // Ambient motes (floating particles in foreground)
    for(const m of this.motes){
      const mx=((m.x-cx*.3)%560+560)%560;if(mx>NW)continue;
      b.fillStyle=this.env.accent;b.globalAlpha=0.15+Math.sin(m.t*1.5)*0.1;
      b.fillRect(Math.floor(mx),Math.floor(m.y),Math.ceil(m.s),Math.ceil(m.s));
    }
    b.globalAlpha=1;

    // Void static
    if(isV){b.globalAlpha=.05;for(let i=0;i<15;i++){b.fillStyle=Math.random()>.5?'#fff':'#000';b.fillRect(0,Math.floor(Math.random()*NH),NW,1);}b.globalAlpha=1;}

    // --- DECORATIONS (environmental storytelling) ---
    for(const d of this.decorations){
      const dx=Math.floor(d.x-cx*.4);if(dx<-20||dx>NW+20)continue;
      b.globalAlpha=.25;
      if(d.type==='tree'){
        b.fillStyle='#1a0e08';b.fillRect(dx,152-d.h,Math.ceil(d.w),Math.ceil(d.h));
        b.fillStyle=this.env.ground;b.fillRect(dx-3,152-d.h-4,Math.ceil(d.w)+6,5);
        b.fillRect(dx-2,152-d.h-8,Math.ceil(d.w)+4,5);
      } else if(d.type==='building'){
        b.fillStyle=this.env.ground;b.fillRect(dx,152-d.h,Math.ceil(d.w),Math.ceil(d.h));
        b.fillStyle='#ffdd66';b.globalAlpha=.1;
        for(let wy=152-d.h+3;wy<150;wy+=6) for(let wx=dx+2;wx<dx+d.w-2;wx+=4) b.fillRect(wx,wy,2,2);
      } else if(d.type==='mountain'){
        b.fillStyle=this.env.ground;
        b.beginPath();b.moveTo(dx,152);b.lineTo(dx+d.w/2,152-d.h);b.lineTo(dx+d.w,152);b.fill();
      } else if(d.type==='pillar'){
        b.fillStyle=this.env.accent;b.fillRect(dx,152-d.h,Math.ceil(d.w),Math.ceil(d.h));
      } else if(d.type==='ruin'){
        b.fillStyle='#222';b.fillRect(dx,152-d.h,Math.ceil(d.w),Math.ceil(d.h));
        b.fillRect(dx+1,152-d.h-2,Math.ceil(d.w)-2,2);
      }
      b.globalAlpha=1;
    }

    // --- STORY TEXT floating in world ---
    for(const sn of this.storyNodes){
      const dist=Math.abs(this.player.x-sn.x);
      sn.opacity=Math.max(0,Math.min(1,1-dist/70));
      if(sn.opacity>0.02){
        const sx=Math.floor(sn.x-cx);
        b.fillStyle='#fff';b.globalAlpha=sn.opacity*.55;
        b.font='4px sans-serif';b.textAlign='center';
        const lines=this._wrap(sn.text,80);
        lines.forEach((l,i)=>b.fillText(l,sx,sn.y+i*6));
        b.globalAlpha=1;
      }
    }

    // Platforms
    for(const pl of this.platforms){
      if(pl.crumbleT!==null&&pl.crumbleT>.3)continue;
      if(pl.flicker&&Math.sin(t*3+pl.x)>.4)continue; // P4 flickering
      const px=Math.floor(pl.x-cx);if(px<-40||px>NW+40)continue;
      if(pl.ceiling){b.fillStyle=this.env.ground;b.globalAlpha=.3;b.fillRect(px,pl.y,pl.w,pl.h);b.globalAlpha=1;continue;}
      if(pl.wall){b.fillStyle=this.env.ground;b.globalAlpha=.5;b.fillRect(px,pl.y,pl.w,pl.h);b.globalAlpha=1;continue;}
      const alpha=pl.crumbleT!==null?(1-pl.crumbleT*3):1;
      b.globalAlpha=alpha;
      if(pl.solid){b.fillStyle=this.env.ground;b.fillRect(px,pl.y,pl.w,pl.h);}
      else{b.fillStyle=this.env.ground;b.fillRect(px,pl.y,pl.w,pl.h||4);
        b.fillStyle=this.env.accent;b.globalAlpha=.2*alpha;b.fillRect(px,pl.y,pl.w,1);}
      b.globalAlpha=1;
    }

    // Moving platforms
    for(const mp of this.movingPlats){
      const px=Math.floor(mp.x-cx);if(px<-30||px>NW+30)continue;
      b.fillStyle=this.env.ground;b.fillRect(px,Math.floor(mp.y),mp.w,mp.h);
      b.fillStyle=this.env.accent;b.globalAlpha=.3;b.fillRect(px,Math.floor(mp.y),mp.w,1);b.globalAlpha=1;
    }

    // Crystal
    if(this.crystal){
      const crx=Math.floor(this.crystal.x-cx),cry=Math.floor(this.crystal.y+Math.sin(t*2)*3);
      b.fillStyle=this.env.accent;b.globalAlpha=.12+Math.sin(t*3)*.08;b.fillRect(crx-8,cry-8,16,16);b.globalAlpha=1;
      b.fillStyle=this.crystal.triggered?'#444':this.env.accent;
      // Diamond
      b.fillRect(crx-1,cry-5,2,2);b.fillRect(crx-2,cry-3,4,2);b.fillRect(crx-3,cry-1,6,2);
      b.fillRect(crx-2,cry+1,4,2);b.fillRect(crx-1,cry+3,2,2);
      if(!this.crystal.triggered){b.fillStyle='#fff';b.globalAlpha=.5+Math.sin(t*2)*.3;
        b.fillRect(crx-1,cry-13,2,2);b.fillRect(crx-2,cry-17,4,2);b.fillRect(crx+1,cry-15,1,2);b.globalAlpha=1;}
    }

    // Signs at path entrances
    for(const s of this.signs){
      const sx=Math.floor(s.x-cx);if(sx<-50||sx>NW+50)continue;
      b.fillStyle=s.color;b.globalAlpha=this.questionTriggered?.7+Math.sin(t*2)*.2:.25;
      b.font='4px sans-serif';b.textAlign='center';
      const lines=this._wrap(s.text,50);
      lines.forEach((l,i)=>b.fillText(l,sx,s.y+i*5));
      // Arrow
      b.fillRect(sx+20,s.y+2,3,1);b.fillRect(sx+22,s.y+1,1,3);
      b.globalAlpha=1;
    }

    // Orbs
    for(const orb of this.orbs){
      if(orb.collected)continue;
      const ox=Math.floor(orb.x-cx),oy=Math.floor(orb.y+Math.sin(t*1.5+orb.t)*2);
      b.fillStyle=orb.color;
      b.globalAlpha=this.questionTriggered?.2+Math.sin(t*2+orb.t)*.1:.06;
      b.fillRect(ox-5,oy-5,10,10);b.globalAlpha=1;
      b.fillStyle=this.questionTriggered?orb.color:'#555';
      b.fillRect(ox-2,oy-3,4,1);b.fillRect(ox-3,oy-2,6,4);b.fillRect(ox-2,oy+2,4,1);
    }

    // Trail
    for(const tr of this.trail){
      b.fillStyle=this.env.accent;b.globalAlpha=tr.a*0.3;
      b.fillRect(Math.floor(tr.x-cx)-1,Math.floor(tr.y)-2,3,5);
    }
    b.globalAlpha=1;

    // Particles
    for(const pt of this.particles){b.fillStyle=pt.color||'#fff';b.globalAlpha=pt.life;b.fillRect(Math.floor(pt.x-cx),Math.floor(pt.y),2,2);}
    b.globalAlpha=1;

    // Player
    this._drawP(b,t);

    // Phase 4 scanlines
    if(isV&&Math.random()>.9){b.fillStyle=Math.random()>.5?'rgba(255,0,80,.08)':'rgba(0,200,255,.08)';b.fillRect(0,Math.floor(Math.random()*NH),NW,2);}

    // Blit
    this.ctx.imageSmoothingEnabled=false;
    this.ctx.drawImage(this.buf,Math.round(this.shakeX*(Math.random()-.5)),Math.round(this.shakeY*(Math.random()-.5)),this.c.width,this.c.height);
  }

  _drawP(b,t){
    const p=this.player,px=Math.floor(p.x-this.cam.x),py=Math.floor(p.y),isV=this.phase===4;
    const col=isV?'#1a1a1a':'#0a0810';
    const leg=p.grounded?Math.sin(p.frame*2)*2:1;
    const bob=p.grounded&&Math.abs(p.vx)>5?Math.sin(p.frame*2)*.5:0;
    const by=py+bob;

    // Alex: subtle ring only (no filled background)
    if (this.phase !== 4 && this.playerArchetype === 'alex') {
      b.strokeStyle = 'rgba(201, 184, 255, 0.25)';
      b.lineWidth = 0.5;
      b.beginPath();
      b.arc(px + 4, by + 8, 10 + Math.sin(t*2)*1.5, 0, Math.PI * 2);
      b.stroke();
    }

    // Axel: tiny glitch flicker (not a rectangle, just pixel scatter)
    if (this.phase !== 4 && this.playerArchetype === 'axel' && Math.random() > 0.75) {
      b.fillStyle = 'rgba(255, 102, 102, 0.25)';
      b.fillRect(px + Math.floor(Math.random()*6), Math.floor(by) + Math.floor(Math.random()*12), 2, 2);
    }

    // Shadow (tiny line, not a box)
    b.fillStyle='#000';b.globalAlpha=.15;b.fillRect(px+1,Math.floor(by)+15,6,1);b.globalAlpha=1;
    b.fillStyle=col;
    b.fillRect(px+2,Math.floor(by),4,4); // head
    b.fillRect(px+1,Math.floor(by)+4,6,5); // body
    b.fillRect(px+1+Math.floor(leg*.6),Math.floor(by)+9,2,5); // legs
    b.fillRect(px+5-Math.floor(leg*.6),Math.floor(by)+9,2,5);
    const arm=p.grounded?Math.sin(p.frame*2+Math.PI):(-1);
    b.fillRect(px-1,Math.floor(by)+5+Math.floor(arm),2,3); // arms
    b.fillRect(px+7,Math.floor(by)+5-Math.floor(arm),2,3);
    // Phase 4: glitch pixels scattered around (no box overlay)
    if(isV && Math.random()>.9){
      const gc=Math.random()>.5?'rgba(255,0,80,0.2)':'rgba(0,200,255,0.2)';
      b.fillStyle=gc;
      b.fillRect(px+Math.floor(Math.random()*8-1),Math.floor(by)+Math.floor(Math.random()*14),2,2);
    }
  }

  _wrap(text,maxW){
    const words=text.split(' ');let line='',lines=[];
    words.forEach(w=>{const t=line+w+' ';if(t.length*2.5>maxW&&line){lines.push(line.trim());line=w+' ';}else line=t;});
    if(line.trim())lines.push(line.trim());return lines;
  }
  destroy(){this.stop();}
}
