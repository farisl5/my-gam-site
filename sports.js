// Both sports games run entirely in the browser, including on GitHub Pages.
function football() {
  area().innerHTML = `<p class="help">Run for touchdowns! Switch lanes with ← / →, A / D, or the buttons. Dodge defenders, reach 100 yards, and keep going. Three tackles end your run.</p>
    <div class="status" id="sports-score" aria-live="polite">Ready for kickoff · 3 lives</div>
    <canvas class="sports-canvas" id="sports-field" width="420" height="480" aria-label="American football field: dodge defenders in three lanes"></canvas>
    <div class="dpad"><button id="run-left" aria-label="Move left">← Left</button><button id="run-right" aria-label="Move right">Right →</button></div>
    <button class="primary" id="sports-start">Kick off ↗</button>`;
  const canvas = $('#sports-field'), ctx = canvas.getContext('2d');
  let lane = 1, defenders = [], yards = 0, touchdowns = 0, lives = 3;
  let active = false, spawn = 0, invincible = 0, last = 0, frame, elapsed = 0;
  const laneX = n => 90 + n * 120;
  function report(message) {
    $('#sports-score').textContent = `${touchdowns} touchdowns · ${Math.floor(yards)} / 100 yards · ${lives} lives${message ? ' · ' + message : ''}`;
  }
  function move(direction) { if (active) lane = Math.max(0, Math.min(2, lane + direction)); }
  function key(e) {
    if (['ArrowLeft','ArrowRight','a','d','A','D'].includes(e.key)) {
      e.preventDefault(); move(['ArrowLeft','a','A'].includes(e.key) ? -1 : 1);
    }
  }
  $('#run-left').onclick = () => move(-1);
  $('#run-right').onclick = () => move(1);
  document.addEventListener('keydown', key);
  function player(x, y, color, number) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y - 15, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - 17, y, 34, 27); ctx.fillRect(x - 14, y + 29, 10, 14); ctx.fillRect(x + 4, y + 29, 10, 14);
    ctx.fillStyle = '#17291b'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(number, x, y + 20);
  }
  function draw() {
    ctx.fillStyle = '#235238'; ctx.fillRect(0, 0, 420, 480);
    ctx.fillStyle = '#193f2c'; ctx.fillRect(0, 0, 420, 40);
    ctx.font = 'bold 18px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#d6fa72'; ctx.fillText('PLAYROOM • END ZONE', 210, 27);
    ctx.strokeStyle = '#ffffff65'; ctx.lineWidth = 2;
    for (let y = 45 + (yards * 9) % 65; y < 480; y += 65) {
      ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(390, y); ctx.stroke();
      ctx.font = '12px monospace'; ctx.fillStyle = '#ffffffa0'; ctx.fillText('10', 47, y - 8); ctx.fillText('10', 373, y - 8);
    }
    ctx.strokeRect(30, 40, 360, 440);
    defenders.forEach(d => player(laneX(d.lane), d.y, '#f2a18b', 'D'));
    if (invincible <= 0 || Math.floor(invincible * 10) % 2 === 0) {
      player(laneX(lane), 385, '#d6fa72', '7');
      ctx.fillStyle = '#a66d43'; ctx.beginPath(); ctx.ellipse(laneX(lane)+22, 402, 7, 12, -.5, 0, Math.PI*2); ctx.fill();
    }
    if (!active) {
      ctx.fillStyle = '#102218d9'; ctx.fillRect(55, 177, 310, 90);
      ctx.fillStyle = '#f5f5ee'; ctx.font = 'bold 23px sans-serif'; ctx.fillText(lives ? 'READY FOR KICKOFF?' : 'FINAL WHISTLE', 210, 214);
      ctx.font = '14px sans-serif'; ctx.fillText(lives ? 'You’re #7. Find the open lane.' : `${touchdowns} touchdowns. Ready for a rematch?`, 210, 243);
    }
  }
  function loop(now) {
    const dt = Math.min((now - last) / 1000 || 0, .05); last = now;
    if (active) {
      elapsed += dt; invincible = Math.max(0, invincible - dt); yards += dt * 9; spawn -= dt;
      if (yards >= 100) { yards -= 100; touchdowns++; defenders = []; report('TOUCHDOWN! +6 points'); }
      if (spawn <= 0) {
        defenders.push({lane:Math.floor(Math.random()*3), y:45});
        spawn = Math.max(.65, 1.3 - touchdowns * .08);
      }
      const speed = 140 + Math.min(100, elapsed * 1.5);
      defenders.forEach(d => d.y += dt * speed);
      if (invincible === 0 && defenders.some(d => d.lane === lane && Math.abs(d.y - 385) < 37)) {
        lives--; invincible = 1.5;
        defenders = defenders.filter(d => !(d.lane === lane && Math.abs(d.y - 385) < 50));
        if (!lives) { active = false; $('#sports-start').textContent = 'Play again ↗'; }
      }
      defenders = defenders.filter(d => d.y < 530);
      report(!lives ? 'Game over' : invincible > 0 ? 'Tackled! Find another lane.' : 'Keep running!');
    }
    draw(); frame = requestAnimationFrame(loop);
  }
  $('#sports-start').onclick = () => {
    lane=1; defenders=[]; yards=0; touchdowns=0; lives=3; spawn=.8; invincible=0; elapsed=0; active=true;
    $('#sports-start').textContent='Restart run'; report('Go!');
  };
  report('Press Kick off'); frame=requestAnimationFrame(loop);
  cleanup=()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',key);};
}

function soccer() {
  area().innerHTML = `<p class="help">Five penalties. Beat the moving keeper! Tap inside the goal to aim, or use ← / →. Press Shoot or Space to kick. Aim away from the keeper; shots too close to the posts can miss.</p>
    <div class="status" id="sports-score" aria-live="polite">Penalty 1 / 5 · 0 goals · Pick your spot</div>
    <canvas class="sports-canvas" id="sports-field" width="420" height="400" tabindex="0" aria-label="Soccer penalty goal. Tap to aim, or use left and right arrows."></canvas>
    <div class="dpad"><button id="aim-left" aria-label="Aim left">← Aim left</button><button id="aim-right" aria-label="Aim right">Aim right →</button></div>
    <div class="controls"><button class="primary" id="shoot">Shoot ⚽</button><button class="secondary" id="sports-start">New shootout ↻</button></div>`;
  const canvas=$('#sports-field'),ctx=canvas.getContext('2d');
  let aimX=210,keeper=210,shots=0,goals=0,phase='aim',ball={x:210,y:345},flight=0,shotX=210,outcome='',time=0,last=0,frame;
  function report(message) { $('#sports-score').textContent=`${shots===5?'Full time':`Penalty ${shots+1} / 5`} · ${goals} goals · ${message}`; }
  function adjust(dx){if(phase==='aim')aimX=Math.max(38,Math.min(382,aimX+dx));}
  function shoot(){if(phase!=='aim')return;shotX=aimX;flight=0;phase='flight';$('#shoot').disabled=true;report('Shot away!');}
  function key(e){if(['ArrowLeft','ArrowRight',' ','a','d'].includes(e.key)){e.preventDefault();if(e.key===' ')shoot();else adjust(['ArrowLeft','a'].includes(e.key)?-16:16);}}
  document.addEventListener('keydown',key);
  canvas.onclick=e=>{if(phase!=='aim')return;const r=canvas.getBoundingClientRect();aimX=Math.max(38,Math.min(382,(e.clientX-r.left)*420/r.width));};
  $('#aim-left').onclick=()=>adjust(-20);$('#aim-right').onclick=()=>adjust(20);$('#shoot').onclick=shoot;
  $('#sports-start').onclick=()=>{aimX=210;shots=0;goals=0;phase='aim';ball={x:210,y:345};outcome='';$('#shoot').disabled=false;$('#shoot').textContent='Shoot ⚽';report('Pick your spot');};
  function draw(){
    ctx.fillStyle='#214e35';ctx.fillRect(0,0,420,400);
    for(let y=180;y<400;y+=60){ctx.fillStyle='#285d3d';ctx.fillRect(0,y,420,30);}
    ctx.fillStyle='#142923';ctx.fillRect(0,0,420,48);ctx.fillStyle='#becfbf';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText('PLAYROOM PENALTY SHOOTOUT',210,29);
    ctx.fillStyle='#192e29';ctx.fillRect(50,66,320,115);ctx.strokeStyle='#ffffff30';ctx.lineWidth=1;
    for(let x=50;x<=370;x+=20){ctx.beginPath();ctx.moveTo(x,66);ctx.lineTo(x,181);ctx.stroke();}
    for(let y=66;y<=181;y+=19){ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(370,y);ctx.stroke();}
    ctx.strokeStyle='#f7f5df';ctx.lineWidth=6;ctx.strokeRect(50,66,320,115);
    ctx.lineWidth=2;ctx.strokeStyle='#ffffff65';ctx.strokeRect(24,181,372,105);ctx.beginPath();ctx.arc(210,286,75,0,Math.PI);ctx.stroke();
    ctx.fillStyle='#d0a1f5';ctx.beginPath();ctx.arc(keeper,114,12,0,Math.PI*2);ctx.fill();ctx.fillRect(keeper-14,130,28,31);ctx.fillRect(keeper-40,133,80,9);ctx.fillRect(keeper-15,161,10,20);ctx.fillRect(keeper+5,161,10,20);
    if(phase==='aim'){ctx.strokeStyle='#d6fa72';ctx.lineWidth=2;ctx.setLineDash([6,7]);ctx.beginPath();ctx.moveTo(210,336);ctx.lineTo(aimX,115);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(aimX,115,12,0,Math.PI*2);ctx.stroke();}
    const x=phase==='flight'?ball.x:210,y=phase==='flight'?ball.y:345;
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#182320';ctx.font='16px sans-serif';ctx.fillText('✦',x,y+5);
    if(phase==='result'||phase==='done'){ctx.fillStyle='#101d19e8';ctx.fillRect(45,209,330,63);ctx.fillStyle=outcome==='GOAL!'?'#d6fa72':'#f2ac94';ctx.font='bold 24px sans-serif';ctx.fillText(phase==='done'?`${goals} / 5 GOALS`:outcome,210,249);}
  }
  function loop(now){const dt=Math.min((now-last)/1000||0,.05);last=now;time+=dt;
    if(phase==='aim')keeper=210+Math.sin(time*1.9)*112;
    if(phase==='flight'){flight+=dt;const p=Math.min(1,flight/.45);ball={x:210+(shotX-210)*p,y:345-230*p};
      if(p===1){shots++;outcome=shotX<64||shotX>356?'WIDE!':Math.abs(shotX-keeper)<44?'SAVED!':'GOAL!';if(outcome==='GOAL!')goals++;
        phase=shots===5?'done':'result';report(shots===5?(goals>=4?'What a finish! Start a new shootout.':'Try another shootout!'):outcome);
        $('#shoot').textContent=shots===5?'Shootout complete':'Next penalty →';$('#shoot').disabled=shots===5;
      }
    }draw();frame=requestAnimationFrame(loop);
  }
  $('#shoot').onclick=()=>{if(phase==='result'){phase='aim';ball={x:210,y:345};$('#shoot').textContent='Shoot ⚽';report('Pick your spot');}else shoot();};
  frame=requestAnimationFrame(loop);cleanup=()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',key);};
}
