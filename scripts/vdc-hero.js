/* ============================================================
   VDC CINEMATIC HERO ENGINE
   Particle tooth ⇄ implant, scroll-driven 3-act story.
   Plays its grand entrance after the site preloader curtain
   lifts. Relies on gsap + ScrollTrigger + THREE (all deferred
   before this file) and coexists with Lenis via app.js sync.
   ============================================================ */
(function(){
  "use strict";
  // Boot resiliently: deferred CDN order isn't guaranteed when a CDN stalls,
  // so poll briefly for THREE/gsap/ScrollTrigger before initializing.
  let tries=0;
  function boot(){
    const hero=document.getElementById("hero");
    const ready=hero&&hero.classList.contains("vdc-hero")
      &&typeof THREE!=="undefined"&&typeof gsap!=="undefined"&&typeof ScrollTrigger!=="undefined";
    if(!ready){ if(++tries<80) setTimeout(boot,100); return; }
    init(hero);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();

  function init(hero){
  gsap.registerPlugin(ScrollTrigger);
  hero.classList.add("vdc-prestate");

  const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch=("ontouchstart" in window)&&window.innerWidth<1024;

  /* =====================================================
     1. PARTICLES — pointillist tooth ⇄ implant
     ===================================================== */
  const N=isTouch?3600:8200;
  const tooth=new Float32Array(N*3), implant=new Float32Array(N*3), scatter=new Float32Array(N*3);
  const colA=new Float32Array(N*3), colB=new Float32Array(N*3);
  const delays=new Float32Array(N), jit=new Float32Array(N);
  const dispX=new Float32Array(N), dispY=new Float32Array(N), dispZ=new Float32Array(N);
  const velX=new Float32Array(N), velY=new Float32Array(N), velZ=new Float32Array(N);

  function randDir(){
    let x,y,z,l;
    do{ x=Math.random()*2-1; y=Math.random()*2-1; z=Math.random()*2-1; l=x*x+y*y+z*z; }
    while(l>1||l<1e-4);
    l=Math.sqrt(l); return [x/l,y/l,z/l];
  }
  function superPoint(p,a,b,c){
    const d=randDir();
    const t=Math.pow(Math.pow(Math.abs(d[0]/a),p)+Math.pow(Math.abs(d[1]/b),p)+Math.pow(Math.abs(d[2]/c),p),-1/p);
    return [d[0]*t,d[1]*t,d[2]*t];
  }
  function quadBezier(t,p0,p1,p2){
    const u=1-t;
    return [u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0], u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1], u*u*p0[2]+2*u*t*p1[2]+t*t*p2[2]];
  }
  const setP=(a,i,x,y,z)=>{ a[i*3]=x; a[i*3+1]=y; a[i*3+2]=z; };
  function setC(a,i,r,g,b,v){
    const k=1+(Math.random()-0.5)*(v||0.25);
    a[i*3]=Math.min(1,r*k); a[i*3+1]=Math.min(1,g*k); a[i*3+2]=Math.min(1,b*k);
  }
  function crownPoint(sa,sb,sc,cy){
    let [x,y,z]=superPoint(3.1,sa,sb,sc);
    if(y>0){
      const w=y/sb, cx=sa*0.46, cz=sc*0.46, s=0.085;
      let bump=Math.exp(-(((x-cx)**2)+((z-cz)**2))/s)+Math.exp(-(((x+cx)**2)+((z-cz)**2))/s)
              +Math.exp(-(((x-cx)**2)+((z+cz)**2))/s)+Math.exp(-(((x+cx)**2)+((z+cz)**2))/s);
      const groove=0.62*Math.exp(-(x*x)/0.02)+0.5*Math.exp(-(z*z)/0.02);
      y+=w*(0.22*bump-0.12*groove)*sb;
    }
    return [x,y+cy,z];
  }
  const INK=[0.075,0.102,0.090], TEAL=[0.043,0.357,0.325], TEAL_D=[0.030,0.250,0.228], GOLD=[0.910,0.690,0.294];
  const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
  function inkTealFleck(arr,i){
    const r=Math.random();
    const c=r<0.05?GOLD:(r<0.45?mix(INK,TEAL,Math.random()*0.5):mix(TEAL_D,TEAL,Math.random()));
    setC(arr,i,c[0],c[1],c[2],0.2);
  }

  (function buildTooth(){
    const crownN=Math.floor(N*0.52);
    for(let i=0;i<crownN;i++){
      const [x,y,z]=crownPoint(1.02,0.80,0.94,1.02);
      setP(tooth,i,x,y,z); inkTealFleck(colA,i);
    }
    for(let i=crownN;i<N;i++){
      const side=(i%2===0)?1:-1, t=Math.random();
      const c=quadBezier(t,[0.40*side,0.42,0],[0.52*side,-0.55,0],[0.15*side,-1.62,0]);
      const r=0.30*Math.pow(1-t,0.72)+0.025, a=Math.random()*Math.PI*2;
      setP(tooth,i,c[0]+Math.cos(a)*r*0.92,c[1],c[2]+Math.sin(a)*r*0.78);
      const cc=mix(INK,[0.42,0.34,0.18],Math.random()*0.55);
      setC(colA,i,cc[0],cc[1],cc[2],0.25);
    }
  })();

  (function buildImplant(){
    const bodyN=Math.floor(N*0.58), abutN=Math.floor(N*0.08);
    for(let i=0;i<bodyN;i++){
      const t=Math.random(), y=0.42+t*(-1.72-0.42);
      let r=0.30+t*(0.13-0.30);
      const a=Math.random()*Math.PI*2;
      const phase=((y/0.20)*Math.PI*2)%(Math.PI*2);
      let d=Math.abs(a-((phase+Math.PI*2)%(Math.PI*2)));
      d=Math.min(d,Math.PI*2-d);
      const ridge=Math.exp(-(d*d)/0.22)*0.085*(t>0.04?1:0);
      r+=ridge;
      setP(implant,i,Math.cos(a)*r,y,Math.sin(a)*r);
      const c=mix(TEAL_D,GOLD,Math.min(1,ridge*9));
      setC(colB,i,c[0],c[1],c[2],0.18);
    }
    for(let i=bodyN;i<bodyN+abutN;i++){
      const t=Math.random(), y=0.42+t*(0.86-0.42), r=0.17+t*(0.115-0.17), a=Math.random()*Math.PI*2;
      setP(implant,i,Math.cos(a)*r,y,Math.sin(a)*r);
      setC(colB,i,GOLD[0],GOLD[1],GOLD[2],0.2);
    }
    for(let i=bodyN+abutN;i<N;i++){
      const [x,y,z]=crownPoint(0.84,0.56,0.78,1.32);
      setP(implant,i,x,y,z); inkTealFleck(colB,i);
    }
  })();

  for(let i=0;i<N;i++){
    const d=randDir(), R=4.5+Math.random()*5.5;
    setP(scatter,i,d[0]*R,d[1]*R,d[2]*R*0.6);
    delays[i]=Math.random(); jit[i]=Math.random()*Math.PI*2;
  }

  /* --- three.js --- */
  const canvas=document.getElementById("vdc-scene");
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,1,0.1,100);
  camera.position.set(0,0.15,7.2);

  const sc=document.createElement("canvas"); sc.width=sc.height=64;
  const sx=sc.getContext("2d");
  const g=sx.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(0.4,"rgba(255,255,255,.85)"); g.addColorStop(1,"rgba(255,255,255,0)");
  sx.fillStyle=g; sx.fillRect(0,0,64,64);
  const sprite=new THREE.CanvasTexture(sc);

  const geo=new THREE.BufferGeometry();
  const livePos=new Float32Array(N*3), liveCol=new Float32Array(N*3);
  livePos.set(scatter); liveCol.set(colA);
  geo.setAttribute("position",new THREE.BufferAttribute(livePos,3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute("color",new THREE.BufferAttribute(liveCol,3).setUsage(THREE.DynamicDrawUsage));
  const mat=new THREE.PointsMaterial({
    size:isTouch?0.05:0.042, map:sprite, vertexColors:true,
    transparent:true, opacity:0.9, depthWrite:false, sizeAttenuation:true
  });
  const points=new THREE.Points(geo,mat);
  const ring=new THREE.Mesh(
    new THREE.TorusGeometry(0.62,0.0085,8,72),
    new THREE.MeshBasicMaterial({color:0xE8B04B,transparent:true,opacity:0})
  );
  ring.rotation.x=Math.PI/2;
  const model=new THREE.Group();
  model.add(points); model.add(ring);
  scene.add(model);

  function layout(){
    const w=window.innerWidth,h=window.innerHeight;
    renderer.setSize(w,h,false);
    camera.aspect=w/h; camera.updateProjectionMatrix();
    if(w<=860){ model.position.set(0,1.0,0); model.scale.setScalar(0.52); }
    else if(w<=1120){ model.position.set(1.35,0,0); model.scale.setScalar(0.9); }
    else{ model.position.set(1.85,0,0); model.scale.setScalar(1.0); }
    model.userData.baseScale=model.scale.x;
  }
  layout(); window.addEventListener("resize",()=>{ layout(); ScrollTrigger.refresh(); });

  const state={ spawn:0, morph:0, scan:-1 };
  let mouseX=0,mouseY=0,smX=0,smY=0,pmX=0,pmY=0,cursorSpeed=0;
  let baseRot=0, dragVel=0, dragging=false, dragLastX=0, tiltX=0;
  const ray=new THREE.Raycaster(), ndc=new THREE.Vector2();
  const plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
  const hit=new THREE.Vector3(), local=new THREE.Vector3();

  window.addEventListener("pointermove",e=>{
    mouseX=(e.clientX/window.innerWidth)*2-1;
    mouseY=(e.clientY/window.innerHeight)*2-1;
    if(dragging){ dragVel+=(e.clientX-dragLastX)*0.00035; dragLastX=e.clientX; }
  });
  if(!isTouch){
    window.addEventListener("pointerdown",e=>{
      if(e.target.closest("a,button")) return;
      if(e.clientX<window.innerWidth*0.5) return;
      // only while the hero is on screen
      if(hero.getBoundingClientRect().bottom<window.innerHeight*0.5) return;
      dragging=true; dragLastX=e.clientX;
    });
    window.addEventListener("pointerup",()=>{ dragging=false; });
  }

  const smoothstep=t=>t<=0?0:t>=1?1:t*t*(3-2*t);
  const clamp01=t=>t<0?0:t>1?1:t;
  const clock=new THREE.Clock();
  let targetP=0, p=0;

  function tick(){
    requestAnimationFrame(tick);
    const t=clock.getElapsedTime();
    p+=(targetP-p)*0.085;
    applyStory(p);

    smX+=(mouseX-smX)*0.10; smY+=(mouseY-smY)*0.10;
    cursorSpeed=Math.min(2.5,Math.hypot(smX-pmX,smY-pmY)*60);
    pmX=smX; pmY=smY;

    baseRot+=0.0022+dragVel;
    dragVel*=0.94;
    model.rotation.y=baseRot+smX*0.65+p*2.2;
    tiltX+=((smY*0.34+0.05)-tiltX)*0.08;
    model.rotation.x=tiltX;
    model.updateMatrixWorld(true);

    let hasHit=false;
    if(!prefersReduced&&!isTouch){
      ndc.set(smX,-smY);
      ray.setFromCamera(ndc,camera);
      if(ray.ray.intersectPlane(plane,hit)){
        local.copy(hit); model.worldToLocal(local); hasHit=true;
      }
    }
    const rx=local.x,ry=local.y,rz=local.z;
    const RAD=1.45, RAD2=RAD*RAD;
    const push=(0.028+cursorSpeed*0.035);
    const sp=state.spawn, mo=state.morph;
    const wob=prefersReduced?0:0.0065;

    for(let i=0;i<N;i++){
      const i3=i*3;
      const m=smoothstep((mo-delays[i]*0.28)/0.72);
      const s=smoothstep((sp-delays[i]*0.38)/0.62);
      const tx=tooth[i3]+(implant[i3]-tooth[i3])*m;
      const ty=tooth[i3+1]+(implant[i3+1]-tooth[i3+1])*m;
      const tz=tooth[i3+2]+(implant[i3+2]-tooth[i3+2])*m;
      let x=scatter[i3]+(tx-scatter[i3])*s;
      let y=scatter[i3+1]+(ty-scatter[i3+1])*s;
      let z=scatter[i3+2]+(tz-scatter[i3+2])*s;

      if(hasHit){
        const dx=x-rx,dy=y-ry,dz=z-rz;
        const d2=dx*dx+dy*dy+dz*dz;
        if(d2<RAD2&&d2>1e-6){
          const d=Math.sqrt(d2), f=(1-d/RAD)*(1-d/RAD)*push/d;
          velX[i]+=dx*f-dy*f*0.45;
          velY[i]+=dy*f+dx*f*0.45;
          velZ[i]+=dz*f;
        }
      }
      velX[i]*=0.86; velY[i]*=0.86; velZ[i]*=0.86;
      dispX[i]=(dispX[i]+velX[i])*0.94;
      dispY[i]=(dispY[i]+velY[i])*0.94;
      dispZ[i]=(dispZ[i]+velZ[i])*0.94;

      const j=jit[i];
      x+=dispX[i]+Math.sin(t*1.3+j*7)*wob;
      y+=dispY[i]+Math.cos(t*1.1+j*5)*wob;
      z+=dispZ[i]+Math.sin(t*1.6+j*3)*wob;

      livePos[i3]=x; livePos[i3+1]=y; livePos[i3+2]=z;
      liveCol[i3]  =colA[i3]  +(colB[i3]  -colA[i3])*m;
      liveCol[i3+1]=colA[i3+1]+(colB[i3+1]-colA[i3+1])*m;
      liveCol[i3+2]=colA[i3+2]+(colB[i3+2]-colA[i3+2])*m;
    }
    geo.attributes.position.needsUpdate=true;
    geo.attributes.color.needsUpdate=true;

    if(state.scan>=0&&state.scan<=1){
      const ss=state.scan;
      ring.position.y=1.95-ss*3.9;
      const widthAt=0.35+0.45*Math.sin(Math.PI*clamp01((1.95-ring.position.y)/3.9))+0.12;
      ring.scale.setScalar(Math.max(0.45,widthAt));
      ring.material.opacity=Math.sin(Math.PI*ss)*0.85;
    }else ring.material.opacity=0;

    const breathe=1+0.09*Math.sin(Math.PI*clamp01((p-0.36)/0.26));
    model.scale.setScalar(model.userData.baseScale*breathe);

    renderer.render(scene,camera);
  }

  /* =====================================================
     2. SCROLL STORY
     ===================================================== */
  const rng=(v,a,b)=>clamp01((v-a)/(b-a));
  const act1=hero.querySelector(".vdc-act-1");
  const act2=hero.querySelector(".vdc-act-2");
  const act3=hero.querySelector(".vdc-act-3");
  const annos=[...hero.querySelectorAll(".vdc-anno")];
  const railFill=hero.querySelector(".vdc-rail-line i");
  const railNodes=[...hero.querySelectorAll(".vdc-rail-node")];
  const foot=hero.querySelector(".vdc-foot");
  const meta=hero.querySelector(".vdc-meta");
  const shadow=hero.querySelector(".vdc-shadow");
  let act3Live=false;

  const narrow=window.innerWidth<=860;
  gsap.set([act1,act2,act3],{yPercent:narrow?0:-50});

  function applyStory(v){
    const o1=1-rng(v,0.13,0.25);
    const o2=rng(v,0.31,0.40)*(1-rng(v,0.66,0.74));
    const o3=rng(v,0.76,0.86);
    gsap.set(act1,{opacity:o1,y:-44*rng(v,0.13,0.25)});
    gsap.set(act2,{opacity:o2,y:40*(1-rng(v,0.31,0.40))-40*rng(v,0.66,0.74)});
    gsap.set(act3,{opacity:o3,y:40*(1-rng(v,0.76,0.86))});
    act1.classList.toggle("live",o1>0.5);
    act2.classList.toggle("live",o2>0.5);
    if(o3>0.5&&!act3Live){ act3Live=true; act3.classList.add("live"); }
    if(o3<=0.5&&act3Live){ act3Live=false; act3.classList.remove("live"); }

    state.morph=smoothstep(rng(v,0.36,0.62));
    const scn=rng(v,0.50,0.68);
    if(v>0.49&&v<0.69) state.scan=scn;
    else if(state.scan>=0&&!teaser.active) state.scan=-1;

    const fadeLate=1-0.55*rng(v,0.78,0.88);
    [[0.55,0.61],[0.60,0.66],[0.65,0.71]].forEach((r,i)=>{
      const k=rng(v,r[0],r[1])*fadeLate;
      const el=annos[i]; if(!el) return;
      el.querySelector(".ln").style.transform="scaleX("+k+")";
      const lab=el.querySelector(".lab");
      lab.style.opacity=k;
      lab.style.transform="translateY("+(1-k)*8+"px)";
    });

    if(railFill) railFill.style.height=(v*100)+"%";
    if(railNodes.length===3){
      railNodes[0].classList.toggle("on",v<0.34);
      railNodes[1].classList.toggle("on",v>=0.34&&v<0.74);
      railNodes[2].classList.toggle("on",v>=0.74);
    }
    if(chromeLive){
      const k=String(1-rng(v,0.05,0.13));
      if(foot) foot.style.opacity=k;
      if(meta) meta.style.opacity=k;
    }
    if(shadow) shadow.style.opacity=state.spawn*(0.55+0.45*(1-Math.abs(v-0.5)*0.6));
  }
  let chromeLive=false;   // entrance owns meta/foot opacity until done

  // QA hook
  window.__vdcSetProgress=v=>{ targetP=v; p=v; };

  const SCROLL_LEN=2800;
  ScrollTrigger.create({
    trigger:hero,
    start:"top top",
    end:"+="+SCROLL_LEN,
    pin:true,
    anticipatePin:1,
    onUpdate(self){ targetP=self.progress; }
  });

  railNodes.forEach(btn=>{
    btn.addEventListener("click",()=>{
      const v=parseFloat(btn.dataset.go);
      const top=v*SCROLL_LEN;
      if(window.lenis) window.lenis.scrollTo(top);
      else window.scrollTo({top,behavior:prefersReduced?"auto":"smooth"});
    });
  });

  /* =====================================================
     3. TIME-BASED MOMENTS
     ===================================================== */
  const cycleEl=hero.querySelector(".vdc-cycle");
  const words=["precise","calm","gentle","lasting"];
  let wi=0;
  if(cycleEl) setInterval(()=>{
    if(p>0.1||prefersReduced) return;
    wi=(wi+1)%words.length;
    gsap.to(cycleEl,{opacity:0,y:-6,duration:0.35,ease:"power2.in",onComplete(){
      cycleEl.textContent=words[wi];
      gsap.fromTo(cycleEl,{opacity:0,y:8},{opacity:1,y:0,duration:0.45,ease:"power2.out"});
    }});
  },3600);

  const teaser={active:false,v:0};
  setInterval(()=>{
    if(p>0.08||teaser.active||prefersReduced||state.spawn<1) return;
    teaser.active=true;
    gsap.fromTo(teaser,{v:0},{v:1,duration:2.0,ease:"power1.inOut",
      onUpdate(){ state.scan=teaser.v; },
      onComplete(){ teaser.active=false; if(p<0.49) state.scan=-1; }
    });
  },10000);

  // live Dehradun clock in the meta strip
  const clockEl=hero.querySelector(".vdc-clock");
  if(clockEl){
    const fmt=()=>{ try{
      return new Date().toLocaleTimeString("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false})+" IST";
    }catch(e){ return ""; } };
    clockEl.textContent=fmt();
    setInterval(()=>{ clockEl.textContent=fmt(); },30000);
  }

  // drifting gold motes
  const motes=hero.querySelector(".vdc-motes");
  if(motes&&!prefersReduced){
    const n=window.innerWidth<=860?6:12;
    for(let i=0;i<n;i++){
      const m=document.createElement("i");
      const s=1.5+Math.random()*2.5;
      m.style.width=m.style.height=s+"px";
      m.style.left=(4+Math.random()*92)+"%";
      m.style.animationDuration=(14+Math.random()*16)+"s";
      m.style.animationDelay=(-Math.random()*24)+"s";
      motes.appendChild(m);
    }
  }

  /* =====================================================
     4. GRAND ENTRANCE — after the site preloader lifts
     ===================================================== */
  // split act-1 headline into words for the cascade
  const lines=[...hero.querySelectorAll(".vdc-act-1 .vdc-hin")];
  lines.forEach(line=>{
    const frag=document.createDocumentFragment();
    [...line.childNodes].forEach(node=>{
      if(node.nodeType===3){
        node.textContent.split(/(\s+)/).forEach(part=>{
          if(/^\s+$/.test(part)||part===""){ frag.appendChild(document.createTextNode(part)); }
          else{
            const w=document.createElement("span");
            w.className="w"; w.textContent=part;
            frag.appendChild(w);
          }
        });
      }else if(node.nodeType===1){
        const w=document.createElement("span");
        w.className="w"; w.appendChild(node.cloneNode(true));
        frag.appendChild(w);
      }
    });
    line.innerHTML=""; line.appendChild(frag);
  });
  const wordsEls=hero.querySelectorAll(".vdc-act-1 .w");
  gsap.set(wordsEls,{yPercent:115,rotateZ:2.5});

  function entrance(){
    const tl=gsap.timeline({defaults:{ease:"power3.out"}});
    tl
      .to(state,{spawn:1,duration:2.4,ease:"power2.inOut"},0)
      .to(".vdc-ghost",{opacity:1,duration:1.6,ease:"power2.out"},0.2)
      .to(".vdc-arcs",{opacity:1,duration:1.8},0.4)
      .to(".vdc-frame .ft,.vdc-frame .fb",{scaleX:1,duration:1.3,ease:"power3.inOut"},0.3)
      .to(".vdc-frame .fl,.vdc-frame .fr",{scaleY:1,duration:1.3,ease:"power3.inOut"},0.45)
      .to(".vdc-frame b",{opacity:1,duration:0.5,stagger:0.07},1.3)
      .to(".vdc-meta",{opacity:1,duration:0.9},0.9)
      .to(".vdc-act-1 .vdc-eyebrow",{opacity:1,duration:0.8},1.0)
      .fromTo(".vdc-act-1 .vdc-wordmark",{opacity:0,y:10},{opacity:1,y:0,duration:0.9},1.12)
      .to(wordsEls,{yPercent:0,rotateZ:0,duration:1.4,stagger:0.09,ease:"power4.out"},1.28)
      .to(".vdc-act-1 .vdc-sub",{opacity:1,duration:0.9},1.9)
      .fromTo(".vdc-act-1 .vdc-idcard",{opacity:0,y:16},{opacity:1,y:0,duration:1.0},2.05)
      .to(".vdc-rail",{opacity:1,duration:0.9},1.9)
      .to(".vdc-foot",{opacity:1,duration:0.9,onComplete(){ chromeLive=true; }},2.0)
      // the gold ring blooms once over the assembled tooth
      .fromTo(teaser,{v:0},{v:1,duration:1.9,ease:"power1.inOut",
        onStart(){ teaser.active=true; },
        onUpdate(){ state.scan=teaser.v; },
        onComplete(){ teaser.active=false; if(p<0.49) state.scan=-1; }
      },2.3);
    if(prefersReduced){ tl.progress(1); state.spawn=1; chromeLive=true; }
  }

  // wait for the site preloader curtain to finish, with a fallback
  const pre=document.getElementById("preloader");
  let started=false;
  function startOnce(){ if(started) return; started=true; entrance(); }
  if(pre){
    const obs=new MutationObserver(()=>{
      if(pre.style.display==="none"){ obs.disconnect(); startOnce(); }
    });
    obs.observe(pre,{attributes:true,attributeFilter:["style"]});
    setTimeout(startOnce,3500);            // safety net
  }else{
    if(document.readyState==="complete") setTimeout(startOnce,200);
    else window.addEventListener("load",()=>setTimeout(startOnce,200));
  }

  tick();   // start the render loop last
  }
})();
