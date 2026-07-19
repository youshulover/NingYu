/* =========================================================
 *  无主之城 · 宁羽的手机  —  逻辑
 * ========================================================= */
'use strict';

/* ---------- 图标（内联 SVG） ---------- */
const ICONS = {
  wechat:  '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.5-.7L3 21l1.5-4.3A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
  contacts:'<path d="M16 19a4 4 0 0 0-8 0"/><circle cx="12" cy="8" r="3.4"/><path d="M4 20a8 8 0 0 1 16 0"/>',
  photos:  '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="9.5" r="1.6"/><path d="M21 16l-5-5-7 7"/>',
  browser: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.8 3.8 9S14.5 18.5 12 21C9.5 18.5 8.2 15.2 8.2 12S9.5 5.5 12 3z"/>',
  memo:    '<path d="M5 3h11l3 3v15H5z"/><path d="M9 8h7M9 12h7M9 16h4"/>',
  map:     '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  aide:    '<path d="M12 3l1.8 4.4L18 9l-4.2 1.6L12 15l-1.8-4.4L6 9l4.2-1.6z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z"/>',
  settings:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19"/>',
  warn:    '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>'
};

/* 应用定义 */
const APPS = {
  wechat:  { name:'微信',   jp:'通信',   icon:ICONS.wechat,  badge:'' },
  contacts:{ name:'通讯录', jp:'連絡',   icon:ICONS.contacts, badge:'' },
  photos:  { name:'图库',   jp:'写真',   icon:ICONS.photos,  badge:'' },
  browser: { name:'浏览器', jp:'閲覧',   icon:ICONS.browser, badge:'' },
  memo:    { name:'备忘录', jp:'備忘',   icon:ICONS.memo,    badge:'' },
  map:     { name:'地图',   jp:'地図',   icon:ICONS.map,     badge:'' },
  aide:    { name:'AI助理', jp:'秘書',   icon:ICONS.aide,    badge:'' },
  settings:{ name:'设置',   jp:'設定',   icon:ICONS.settings, badge:'' }
};
const GRID = ['wechat','contacts','photos','browser','memo','map','aide','settings'];
const DOCK = ['wechat','aide','photos','browser'];

/* 运行时状态 */
const STATE = { wechatRepaired:false, wxView:'list', wxTab:'private', wxPrivateMode:'fact', rpConvos:null };

/* ---------- DOM 引用 ---------- */
const $ = s => document.querySelector(s);
const home = $('#home'), dockEl = $('#dock');
const sheet = $('#sheet'), backdrop = $('#backdrop'), sheetBody = $('#sheetBody');
const roleplay = $('#roleplay');

/* =========================================================
 *  桌面渲染
 * ========================================================= */
function buildHome(){
  const p = DATA.profile, t = DATA.timeline, h = STATE.health, e = DATA.emotion;
  home.innerHTML = `
    <div class="clock"><div class="t" id="bigClock">--:--</div>
      <div class="d">真光岛 · 灾历第 ${t.island} 天 · 周六</div></div>

    <div class="widgets">
      <div class="card me">
        <div class="banner"></div>
        <div class="me-body">
          <div class="me-ava-wrap">
            <div class="avatar">${p.name[0]}</div>
            <span class="me-off">${p.status}</span>
          </div>
          <div class="me-info">
            <div class="name">${p.name}</div>
            <div class="followers"><b>Followers</b> ${p.followers}</div>
            <div class="bio">${p.bio}</div>
          </div>
        </div>
        <div class="me-meta">
          <span class="loc"><svg class="loc-ico" viewBox="0 0 24 24">${ICONS.map}</svg>${p.loc}</span>
          <div class="coord">
            <div>N Latitude: ${p.coordN}</div>
            <div>E Longitude: ${p.coordE}</div>
          </div>
        </div>
      </div>

      <div class="card emotion">
        <div class="lbl">Mood · 情绪</div>
        <div class="mood">${e.mood}</div>
        <div class="hr"><span class="heart">♥</span><span class="hrtxt">心率</span></div>
        <div class="hrval">${e.hr}</div>
      </div>

      <div class="card rings">
        <div class="lbl" style="align-self:flex-start">Health · 健康</div>
        <div class="ringrow">
          ${miniRing('rSteps', h.steps.cur/h.steps.goal, '步数', (h.steps.cur/1000).toFixed(1)+'k')}
          ${miniRing('rSleep', h.sleep.cur/h.sleep.goal, '睡眠', h.sleep.cur+'h')}
          ${miniRing('rCal',   h.calorie.cur/h.calorie.goal, '热量', h.calorie.cur)}
        </div>
      </div>

      <div class="card timeline full">
        <div class="lbl">Time · 记录</div>
        <div class="trow"><span>困于荒岛</span><b>${t.island}</b><span>天</span></div>
        <div class="trow"><span>与林静结婚</span><b>${t.marriage}</b><span>天</span></div>
      </div>
    </div>

    <div class="grid" id="appGrid"></div>
  `;
  $('#appGrid').innerHTML = GRID.map(k=>appHTML(k)).join('');
  dockEl.innerHTML = DOCK.map(k=>appHTML(k,true)).join('');
  requestAnimationFrame(()=>{
    animateRing('rSteps', h.steps.cur/h.steps.goal);
    animateRing('rSleep', h.sleep.cur/h.sleep.goal);
    animateRing('rCal',   h.calorie.cur/h.calorie.goal);
  });
}

function appHTML(key, isDock){
  const a = APPS[key];
  const badge = a.badge ? `<span class="badge">${a.badge}</span>` : '';
  return `<div class="app" data-app="${key}">
    <div class="ico">${badge}<svg viewBox="0 0 24 24">${a.icon}</svg></div>
    <div class="name">${a.name}</div>
  </div>`;
}

function miniRing(id, pct, label, val){
  pct = Math.min(pct,1);
  return `<div class="ringmini"><svg width="46" height="46" viewBox="0 0 46 46">
    <circle cx="23" cy="23" r="18" stroke="rgba(120,130,135,.18)" stroke-width="5" fill="none"/>
    <circle id="${id}" cx="23" cy="23" r="18" stroke="var(--accent)" stroke-width="5" fill="none"
      stroke-linecap="round" transform="rotate(-90 23 23)"/></svg>
    <b id="${id}Val">${val}</b><span>${label}</span></div>`;
}

function animateRing(id, pct){
  const c = document.getElementById(id); if(!c) return;
  const r = 18, len = 2*Math.PI*r;
  c.style.strokeDasharray = len; c.style.strokeDashoffset = len;
  c.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)';
  requestAnimationFrame(()=>{ c.style.strokeDashoffset = len*(1-Math.min(pct,1)); });
}

/* 健康数据随机生成 + 定时刷新 */
function randomHealth(){
  const g = { steps:8000, sleep:8, cal:2200 };
  return {
    steps:  { cur: Math.floor(Math.random()*5000)+4000, goal:g.steps },
    sleep:  { cur:+(Math.random()*4+3).toFixed(1),       goal:g.sleep },
    calorie:{ cur: Math.floor(Math.random()*1300)+1100,  goal:g.cal }
  };
}
function updateHealth(){
  STATE.health = randomHealth();
  const h = STATE.health;
  animateRing('rSteps', h.steps.cur/h.steps.goal);
  animateRing('rSleep', h.sleep.cur/h.sleep.goal);
  animateRing('rCal',   h.calorie.cur/h.calorie.goal);
  const setV = (id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  setV('rStepsVal', (h.steps.cur/1000).toFixed(1)+'k');
  setV('rSleepVal', h.sleep.cur+'h');
  setV('rCalVal',   h.calorie.cur);
}

/* =========================================================
 *  面板：打开 / 关闭
 * ========================================================= */
function openApp(key){
  const a = APPS[key];
  $('#sheetIco').innerHTML = `<svg viewBox="0 0 24 24">${a.icon}</svg>`;
  $('#sheetTitle').innerHTML = `${a.name}<small>${a.jp} · 真光岛 OS</small>`;
  sheetBody.innerHTML = RENDER[key] ? RENDER[key]() : '<div class="empty">暂未实现</div>';
  sheet.classList.add('show'); backdrop.classList.add('show');
  if(BIND[key]) BIND[key]();
}
function closeApp(){ sheet.classList.remove('show'); backdrop.classList.remove('show'); }

/* =========================================================
 *  渲染器集合
 * ========================================================= */
const RENDER = {};
const BIND = {};

/* ---------- 微信 ---------- */
RENDER.wechat = ()=> STATE.wechatRepaired
  ? wechatList()
  : `<div class="repair">
       <div class="ic"><svg viewBox="0 0 24 24">${ICONS.warn}</svg></div>
       <h3>数据已损坏</h3>
       <p>微信本地数据库检测到异常，<br>部分聊天记录可能无法读取。<br><br>是否要修复数据？</p>
       <button class="btn" id="repairBtn">确定修复</button>
       <button class="btn ghost" onclick="closeApp()" style="margin-left:8px">稍后处理</button>
     </div>`;

BIND.wechat = ()=>{
  const b = $('#repairBtn'); if(!b) return;
  b.onclick = ()=>{
    sheetBody.innerHTML = `<div class="repair">
      <div class="ic"><svg viewBox="0 0 24 24">${ICONS.warn}</svg></div>
      <h3>正在修复数据…</h3>
      <div class="progress"><i id="prg"></i></div>
      <div class="progress-txt" id="prgTxt">0%</div>
    </div>`;
    let v=0; const prg=$('#prg'), txt=$('#prgTxt');
    const timer=setInterval(()=>{
      v+=Math.random()*9+3; if(v>=100){v=100; clearInterval(timer);
        setTimeout(()=>{ STATE.wechatRepaired=true; sheetBody.innerHTML=wechatList(); bindWechatList(); },400);
      }
      prg.style.width=v+'%'; txt.textContent=Math.floor(v)+'%';
    },120);
  };
};

/* 角色扮演对话持久化（localStorage） */
function loadRpConvos(){
  try{ return JSON.parse(localStorage.getItem('dzs_rp_convos')||'{}'); }
  catch(e){ return {}; }
}
function saveRpConvos(){
  try{ localStorage.setItem('dzs_rp_convos', JSON.stringify(STATE.rpConvos||{})); }catch(e){}
}
/* 由角色扮演对话派生出「宁羽微信」里的会话（左右互换：角色→左，宁羽→右） */
function rpWechatChats(){
  const out = {};
  const convos = STATE.rpConvos || {};
  Object.keys(convos).forEach(roleId=>{
    const conv = convos[roleId];
    if(!conv || !conv.length) return;
    const role = DATA.roleplayRoles.find(r=>r.id===roleId); if(!role) return;
    const msgs = conv.map(m=>({ f: m.me?'them':'me', txt:m.text,
      st: m.me? undefined : 'read', s: m.me? role.name : undefined }));
    out['rp_'+roleId] = { peer:role.name, avatar:role.name[0], msgs };
  });
  return out;
}
function allPrivateChats(){
  return Object.assign({}, DATA.chats, rpWechatChats());
}
function lastPreview(chat){
  const msgs = chat.msgs || chat;
  for(let i=msgs.length-1;i>=0;i--){ const m=msgs[i];
    if(m.f==='div'||m.f==='call') continue;
    if(m.t==='img') return '[图片]';
    return (m.f==='me'?'我: ':'')+m.txt;
  }
  return '';
}
function failedCount(chat){ return (chat.msgs||chat).filter(m=>m.f==='me'&&m.st==='failed').length; }

function wxTabBar(){
  const tab = STATE.wxTab || 'private';
  const mirror = STATE.wxPrivateMode === 'mirror';
  return `<div class="wx-tabs">
    <div class="wx-tab ${tab==='private'?'on':''} ${mirror?'mirror':''}" data-tab="private">私聊<span class="tab-tri" id="privTri"></span></div>
    <div class="wx-tab ${tab==='group'?'on':''}" data-tab="group">群聊</div>
    <div class="wx-tab ${tab==='moments'?'on':''}" data-tab="moments">朋友圈</div>
  </div>`;
}
function wxPrivateList(){
  const mirror = STATE.wxPrivateMode === 'mirror';
  const src = mirror ? rpWechatChats() : DATA.chats;
  const ids = Object.keys(src);
  let html = `<div class="sec-title">${mirror?'镜子信息':'事实信息'}</div>`;
  if(!ids.length){
    html += `<div class="empty">${mirror?'还没有进行过镜子测试。去「AI 助理」选择身份开始对话，记录会同步到这里。':'暂无私聊消息。'}</div>`;
    return html;
  }
  ids.forEach(id=>{
    const c = src[id]; const fail = failedCount(c);
    html += `<div class="chat-item" data-chat="${id}" data-kind="private">
      <div class="ava">${c.avatar||id[0]}</div>
      <div class="mid"><div class="top"><div class="nm">${c.peer||id}</div></div>
      <div class="prev ${fail?'fail':''}">${lastPreview(c)}</div></div>
      ${fail?`<div class="badge2">${fail}</div>`:''}</div>`;
  });
  return html;
}
function wxGroupList(){
  let html = '';
  DATA.groups.forEach(g=>{
    if(g.preview){
      html += `<div class="chat-item" data-chat="${g.id}" data-kind="group">
        <div class="ava">${g.avatar}</div>
        <div class="mid"><div class="top"><div class="nm">${g.name}</div></div>
        <div class="prev">${g.last}</div></div></div>`;
    } else {
      const fail=failedCount(g);
      html += `<div class="chat-item ${g.pinned?'':''}" data-chat="${g.id}" data-kind="group">
        <div class="ava ${g.pinned?'pin':''}">${g.avatar}</div>
        <div class="mid"><div class="top"><div class="nm">${g.name}${g.pinned?' 📌':''}</div></div>
        <div class="prev ${fail?'fail':''}">${lastPreview(g)}</div></div>
        ${fail?`<div class="badge2">${fail}</div>`:''}</div>`;
    }
  });
  return html;
}
function momentsView(){
  const p = DATA.profile;
  let html = `<div class="moment-cover">
    <div class="m-cover-banner"></div>
    <div class="m-cover-info">
      <div class="m-cover-text">
        <div class="m-cover-name">${escapeHtml(p.name)}</div>
        <div class="m-cover-bio">${escapeHtml(p.bio)}</div>
      </div>
      <div class="m-cover-ava">${escapeHtml(p.name[0])}</div>
    </div>
  </div>`;
  // 用于生成稳定的「随机」点赞/评论（按索引播种，刷新不变）
  const likers = ['宁羽','林静','桃子','王淼','张越','罗燃','谢颖','小柯'];
  const cpool = {
    '宁羽':['嗯。','注意安全。','早点回来。','好。','我在。'],
    '林静':['别着凉。','想你了。','今天也要好好的。','等你回家。'],
    '桃子':['哈哈哈！','姐姐最棒～','好文艺呀','羡慕了'],
    '王淼':['厉害！','今晚你请。','截个图发我','牛！'],
    '张越':['真好看。','我也看到了。','下班快乐','拍得不错'],
    '罗燃':['保重。','注意岛上情况。','收到。','…'],
    '谢颖':['嗯…','你这话让我不安。','相信你。'],
    '小柯':['收到！','老师威武','记下了']
  };
  const rnd = (s)=>()=>{ s|=0; s=s+0x6D2B79F5|0; let t=Math.imul(s^s>>>15,1|s);
    t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
  html += DATA.moments.map((m,idx)=>{
    const r = rnd(idx*131+7);
    const likeN = 2 + Math.floor(r()*3);                 // 2~4 个赞
    const likes = likers.slice().sort(()=>r()-0.5).slice(0, likeN);
    const cN = 1 + Math.floor(r()*2);                    // 1~2 条评论
    const comments = [];
    for(let k=0;k<cN;k++){
      const who = likes[Math.floor(r()*likes.length)];
      const arr = cpool[who] || ['赞'];
      comments.push({ name:who, txt:arr[Math.floor(r()*arr.length)] });
    }
    const heart = likes.length
      ? `<div class="m-likes"><span class="m-like-ic">♡</span><span class="m-like-names">${likes.map(escapeHtml).join('，')}</span></div>`
      : '';
    const cmts = comments.length
      ? `<div class="m-comments">${comments.map(c=>`<div class="m-comment"><b>${escapeHtml(c.name)}</b>：${escapeHtml(c.txt)}</div>`).join('')}</div>`
      : '';
    return `<div class="moment-card">
      <div class="moment">
        <div class="ava">${escapeHtml(m.avatar)}</div>
        <div class="m-body">
          <div class="m-name">${escapeHtml(m.name)}</div>
          <div class="m-txt">${escapeHtml(m.txt)}</div>
          ${m.imgs && m.imgs.length ? `<div class="m-imgs">${m.imgs.map(()=>`<div class="m-img ph">图片</div>`).join('')}</div>` : ''}
          <div class="m-foot"><span class="m-loc">${m.loc?('📍'+escapeHtml(m.loc)):''}</span><span class="m-time">${escapeHtml(m.time)}</span></div>
          ${heart}${cmts}
        </div>
      </div>
    </div>`;
  }).join('');
  return html;
}
function wechatList(){
  const tab = STATE.wxTab || 'private';
  let html = wxTabBar();
  if(tab==='moments') html += momentsView();
  else if(tab==='group') html += wxGroupList();
  else html += wxPrivateList();
  return html;
}

function wechatMsgs(view){
  const isGroup = view.kind==='group';
  const chat = isGroup ? DATA.groups.find(g=>g.id===view.id) : allPrivateChats()[view.id];
  const title = isGroup ? chat.name : chat.peer;
  let html = `<div class="wx">`;
  html += `<div class="wx-bar"><button class="back" id="wxBack">‹</button>
    <div class="title">${title}</div></div>`;
  if(isGroup && chat.preview){
    html += `<div class="wx-msgs"><div class="empty">记者时期的工作群，仅本地缓存了最近一条消息：<br><br>「${chat.last}」</div></div>`;
    html += `</div>`;
    return html;
  }
  html += `<div class="wx-msgs" id="wxMsgs">${chat.msgs.map((m,i)=>renderMsg(chat,m,i)).join('')}</div>`;
  html += `<div class="wx-input"><input id="wxIn" placeholder="发送消息…" autocomplete="off"><button id="wxSend">发送</button></div>`;
  html += `</div>`;
  return html;
}
function renderMsg(chat, m, i){
  if(m.f==='div') return `<div class="divider">— · —</div>`;
  if(m.f==='call') return `<div class="call-sys">📞 <b>${escapeHtml(m.txt)}</b></div>`;
  const me = m.f==='me';
  const ava = me ? '宁' : (chat.avatar|| (m.s? m.s[0] : '?'));
  const next = chat.msgs[i+1];
  const sameNext = next && next.f===m.f && m.f!=='div' && m.f!=='call';
  let inner;
  if(m.t==='img'){ inner = `<div class="msg img-msg"><div class="ph">${m.cap||'[图片]'}</div></div>`; }
  else { inner = `<div class="msg">${bubbleInner(m.txt)}</div>`; }
  let meta='';
  if(me){
    if(m.st==='failed') meta = `<div class="b-meta"><span class="check fail" onclick="showToast('信号微弱，重发失败')">⚠ 发送失败</span></div>`;
    else meta = `<div class="b-meta"><span class="check">已读</span></div>`;
  }
  const runEnd = !sameNext;  // 仅在本条是同人连发的“最后一条”（靠下）时显示头像
  const avaHtml = `<div class="b-ava ${me?'u':''} ${runEnd?'':'noava'}">${runEnd?ava:''}</div>`;
  return `<div class="bubble-row ${me?'me':''}">
    ${avaHtml}${inner}${meta}</div>`;
}
function bindWechatList(){
  sheetBody.querySelectorAll('.wx-tab').forEach(t=>{
    t.onclick = ()=>{ STATE.wxTab = t.dataset.tab; sheetBody.innerHTML = wechatList(); bindWechatList(); };
  });
  const tri = document.getElementById('privTri');
  if(tri){ tri.onclick = (e)=>{ e.stopPropagation();
    STATE.wxTab = 'private';
    STATE.wxPrivateMode = STATE.wxPrivateMode==='mirror' ? 'fact' : 'mirror';
    sheetBody.innerHTML = wechatList(); bindWechatList();
  }; }
  sheetBody.querySelectorAll('.chat-item').forEach(it=>{
    it.onclick = ()=>{
      STATE.wxView = { kind:it.dataset.kind, id:it.dataset.chat };
      sheetBody.innerHTML = wechatMsgs(STATE.wxView);
      $('#wxBack').onclick = ()=>{ STATE.wxView='list'; sheetBody.innerHTML=wechatList(); bindWechatList(); };
      bindWechatInput(STATE.wxView);
      const _wb=$('#wxMsgs'); if(_wb) _wb.scrollTop=_wb.scrollHeight;
    };
  });
}
function bindWechatInput(view){
  const box = $('#wxMsgs'); if(!box) return;
  const inp = $('#wxIn'), btn = $('#wxSend'); if(!inp || !btn) return;
  const chat = view.kind==='group' ? DATA.groups.find(g=>g.id===view.id) : allPrivateChats()[view.id];
  const send = ()=>{
    const v = inp.value.trim(); if(!v) return;
    chat.msgs.push({ f:'me', txt:v, st:'failed' });
    box.innerHTML = chat.msgs.map((m,i)=>renderMsg(chat,m,i)).join('');
    inp.value=''; box.scrollTop = box.scrollHeight;
  };
  btn.onclick = send;
  inp.addEventListener('keydown', e=>{ if(e.key==='Enter') send(); });
}
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast';
    const box = document.querySelector('.phone') || document.body; box.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._timer); t._timer = setTimeout(()=> t.classList.remove('show'), 1900);
}
/* 打开微信后补绑列表 */
const _origBindWechat = BIND.wechat;
BIND.wechat = ()=>{ _origBindWechat(); if(STATE.wechatRepaired) bindWechatList(); };

/* ---------- 通讯录 ---------- */
RENDER.contacts = ()=>{
  const normal = DATA.contacts.filter(c=>c.type==='normal').sort((a,b)=>a.py.localeCompare(b.py));
  const island = DATA.contacts.filter(c=>c.type!=='normal').sort((a,b)=>a.py.localeCompare(b.py));
  return `<div class="sec-title">普通号码</div>${normal.map(contactHTML).join('')}
          <div class="sec-title">岛内通讯</div>${island.map(contactHTML).join('')}`;
};
function contactHTML(c){
  const gray = c.type==='island' ? 'gray' : '';
  const sig = c.type==='island-on' ? `<span class="sig2 on">信号正常</span>`
            : c.type==='island' ? `<span class="sig2">无信号</span>` : '';
  return `<div class="contact ${gray}">
    <div class="ava">${c.name[0]}</div>
    <div><div class="nm">${c.name}</div></div>
    ${sig}</div>`;
}

/* ---------- 图库 ---------- */
RENDER.photos = ()=>{
  const ph = DATA.photos;
  let h = `<div class="sec-title">隐私 · 最近删除</div><div class="photos">`;
  ph.secret.forEach(s=>{
    h += `<div class="ph-tile blur" data-secret="1">
      <img src="${s.path}" onerror="this.style.display='none'">
      <div class="cap">某人的手写笔记</div></div>`;
  });
  h += `</div>`;
  h += `<div class="sec-title">相机</div><div class="photos">${ph.camera.map(tile).join('')}</div>`;
  h += `<div class="sec-title">屏幕截图</div><div class="photos">${ph.screenshots.map(tile).join('')}</div>`;
  return h;
};
function tile(t){
  return `<div class="ph-tile"><img src="${t.path}" onerror="this.style.display='none'">
    <div class="cap">${t.title}</div></div>`;
}
BIND.photos = ()=>{
  const s = sheetBody.querySelector('[data-secret]');
  if(s) s.onclick = ()=> alert('该照片已损坏，无法修复。');
};

/* ---------- 备忘录 ---------- */
RENDER.memo = ()=>{
  const m = DATA.memo;
  let h = `<div class="memo-box"><div class="h">物资 · 压缩饼干</div><div class="b">${m.biscuits}</div></div>
    <div class="memo-box"><div class="h">威胁 · 蝙蝠狂潮</div><div class="b">${m.bat}</div></div>
    <div class="sec-title">宁羽的日记</div>`;
  m.diary.forEach(d=>{ h += `<div class="diary"><div class="t">${d.title}</div><div class="x">${d.body}</div></div>`; });
  return h;
};

/* ---------- 浏览器 ---------- */
RENDER.browser = ()=>{
  const items = DATA.browser.map(b=>`<div class="it"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>${escapeHtml(b)}</div>`).join('');
  return `<div class="addr"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
    <span>搜索或输入网址</span></div>
    <div class="sec-title">搜索记录</div><div class="hist">${items}</div>`;
};

/* ---------- 地图 ---------- */
RENDER.map = ()=>{
  const pts = DATA.mapPoints.map(p=>`
    <div class="map-pt ${p.kind==='unknown'?'unknown':''}" style="left:${p.x}%;top:${p.y}%">
      <div class="d"></div><div class="lb">${p.name}</div></div>`).join('');
  return `<div class="map-wrap">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M22 30 Q14 18 30 14 Q50 8 66 16 Q86 22 84 40 Q90 58 74 66 Q60 78 42 72 Q20 70 18 52 Q14 40 22 30 Z"
          fill="rgba(255,255,255,.45)" stroke="rgba(255,255,255,.7)" stroke-width=".6"/>
        <path d="M30 14 Q40 22 34 34" stroke="rgba(255,255,255,.5)" fill="none" stroke-width=".4"/>
      </svg>${pts}</div>
    <div class="map-note">真光岛轮廓（示意）。海岸处有灯塔，内陆分布火车站、超市、酒店与一处未知区域。坐标：${DATA.profile.coord}。</div>`;
};

/* ---------- AI 助理（π 动画 + 角色扮演入口） ---------- */
RENDER.aide = ()=> `<div class="aide-stage">
    <div class="ring breathing" id="aideRing"></div>
    <div class="aide-line" id="aideLine">信息传输中… 接收者：<span class="recv" id="recv">_</span></div>
    <div class="roleplay-btn" id="rpBtnWrap"></div>
  </div>`;
BIND.aide = ()=>{
  const line = $('#aideLine'); const wrap = $('#rpBtnWrap');
  const recv = $('#recv');
  const target = '3.1415926535';
  let i=0;
  const roll = setInterval(()=>{
    i++; recv.textContent = target.slice(0,i) + (i<target.length?'_':'');
    if(i>=target.length){ clearInterval(roll);
      setTimeout(()=>{
        recv.textContent = 'π';
        line.innerHTML = '<span class="ok">110号实验品信息传输成功。</span>';
        const ring = $('#aideRing');
        if(ring){ ring.innerHTML = '<span class="pi">π</span>'; ring.classList.remove('breathing'); ring.classList.add('authed'); }
        wrap.innerHTML = `<button class="btn" id="rpStart">🪞 进入镜子测试</button>`;
        $('#rpStart').onclick = openPicker;
      },500);
    }
  },180);
};

/* ---------- 设置 ---------- */
RENDER.settings = ()=>{
  const saved = JSON.parse(localStorage.getItem('dzs_settings')||'{}');
  const wbOn = (saved.wbOn!==false);
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const chips = DATA.themes.map(t=>`<div class="theme-chip ${t.id===themeNow()?'on':''}" data-theme="${t.id}">
    <div class="sw" style="background:linear-gradient(135deg,${t.accent2},${t.accent})"></div>
    <div class="nm">${t.name}</div></div>`).join('');
  return `<div class="sec-title">全局配色</div>
    <div class="theme-pick">${chips}</div>
    <div class="sec-title">AI 接口（角色扮演用）</div>
    <div class="set-row"><div class="k">API 地址</div></div>
    <input class="api-in" id="apiUrl" placeholder="https://api.xxx/v1/chat/completions" value="${saved.apiUrl||''}">
    <div class="set-row"><div class="k">API KEY</div></div>
    <input class="api-in" id="apiKey" placeholder="sk-..." value="${saved.apiKey||''}">
    <div class="set-row"><div class="k">模型</div></div>
    <input class="api-in" id="apiModel" placeholder="gpt-4o / 自定义" value="${saved.apiModel||''}">
    <button class="btn" id="apiSave" style="margin-top:14px">保存设置</button>
    <button class="btn ghost" id="apiTest" style="margin-top:10px">测试连接</button>
    <div class="hint">填入 OpenAI 兼容的 /chat/completions 地址与 KEY 后，角色扮演将调用真实模型；留空则使用内置模拟回复。</div>
    <div class="sec-title">世界书（实验补充设定）</div>
    <div class="set-row"><div class="k">总开关</div>
      <button class="btn ghost wb-toggle ${wbOn?'on':''}" id="wbToggle">${wbOn?'已开启':'开启'}</button></div>
    <div class="set-row"><div class="k">实验体回复准则</div>
      <button class="btn ghost sm" id="wbRestoreReply">恢复默认</button></div>
    <textarea class="api-ta" id="wbReply" placeholder="约束宁羽回复方式，提升活人感…" ${wbOn?'disabled':''}>${esc(saved.wbReply||DATA.worldbook.reply)}</textarea>
    <div class="set-row"><div class="k">实验环境配置</div>
      <button class="btn ghost sm" id="wbRestoreEnv">恢复默认</button></div>
    <textarea class="api-ta" id="wbEnv" placeholder="世界观 / 时间线 / 大背景…" ${wbOn?'disabled':''}>${esc(saved.wbEnv||DATA.worldbook.env)}</textarea>
    <div class="hint">世界书作为「常量」注入到每次对话。灰色「已开启」= 已生效且锁定（防误触）；绿色「开启」= 可编辑草稿态（此时不注入，编辑后点回「已开启」即生效并锁定）。「实验环境配置」已预填无主之城背景，「实验体回复准则」为占位，可随时修改扩充。「恢复默认」会清掉该框的本地保存、回退到代码里的默认值。</div>
    <div class="sec-title">关于</div>
    <div class="set-row"><div class="k">真光岛 OS</div><div class="v">v1.0 · 宁羽的手机</div></div>`;
};
function themeNow(){ return document.documentElement.dataset.theme || 'frost'; }
BIND.settings = ()=>{
  sheetBody.querySelectorAll('.theme-chip').forEach(c=>{
    c.onclick = ()=>{
      document.documentElement.dataset.theme = c.dataset.theme;
      localStorage.setItem('dzs_theme', c.dataset.theme);
      sheetBody.querySelectorAll('.theme-chip').forEach(x=>x.classList.remove('on'));
      c.classList.add('on');
    };
  });
  const sv = $('#apiSave'); if(sv) sv.onclick = ()=>{
    const ex = JSON.parse(localStorage.getItem('dzs_settings')||'{}');
    ex.apiUrl=$('#apiUrl').value; ex.apiKey=$('#apiKey').value; ex.apiModel=$('#apiModel').value;
    if($('#wbToggle')){ ex.wbOn=$('#wbToggle').classList.contains('on'); ex.wbReply=$('#wbReply').value; ex.wbEnv=$('#wbEnv').value; }
    localStorage.setItem('dzs_settings', JSON.stringify(ex));
    sv.textContent='已保存 ✓'; setTimeout(()=>sv.textContent='保存设置',1200);
  };
  const test = $('#apiTest'); if(test) test.onclick = async ()=>{
    const cfg = { apiUrl:$('#apiUrl').value, apiKey:$('#apiKey').value, apiModel:$('#apiModel').value };
    if(!cfg.apiUrl || !cfg.apiKey){ showToast('请先填写地址和 KEY'); return; }
    test.textContent='测试中…'; test.disabled=true;
    try{
      const ctrl = new AbortController(); const to = setTimeout(()=>ctrl.abort(), 15000);
      const r = await fetch(cfg.apiUrl, {method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+cfg.apiKey},
        body:JSON.stringify({model:cfg.apiModel||'gpt-4o', messages:[{role:'user',content:'只回复一个字：好'}], temperature:.3}),
        signal:ctrl.signal});
      clearTimeout(to);
      if(!r.ok) throw new Error('HTTP '+r.status);
      const j = await r.json();
      if(j.choices && j.choices[0] && j.choices[0].message) showToast('连接成功 ✓');
      else throw new Error('返回格式不符');
    }catch(e){ showToast('连接失败：'+(e.message||'网络错误')); }
    finally{ test.textContent='测试连接'; test.disabled=false; }
  };
  // 世界书：开关 + 内容即时持久化
  const saveWb = ()=>{
    const ex = JSON.parse(localStorage.getItem('dzs_settings')||'{}');
    ex.wbOn = $('#wbToggle').classList.contains('on');
    ex.wbReply = $('#wbReply').value; ex.wbEnv = $('#wbEnv').value;
    localStorage.setItem('dzs_settings', JSON.stringify(ex));
  };
  const restoreWb = (which)=>{
    const ex = JSON.parse(localStorage.getItem('dzs_settings')||'{}');
    if(which==='reply'){ delete ex.wbReply; const ta=$('#wbReply'); if(ta) ta.value = DATA.worldbook.reply; }
    else { delete ex.wbEnv; const ta=$('#wbEnv'); if(ta) ta.value = DATA.worldbook.env; }
    localStorage.setItem('dzs_settings', JSON.stringify(ex));
    showToast('已恢复为代码默认值');
  };
  const wbT = $('#wbToggle');
  if(wbT){
    wbT.onclick = ()=>{
      const on = wbT.classList.toggle('on');
      wbT.textContent = on ? '已开启' : '开启';
      $('#wbReply').disabled = on; $('#wbEnv').disabled = on;
      saveWb();
    };
    const rta=$('#wbReply'), eta=$('#wbEnv');
    if(rta) rta.onblur = saveWb;
    if(eta) eta.onblur = saveWb;
    const rRest=$('#wbRestoreReply'), eRest=$('#wbRestoreEnv');
    if(rRest) rRest.onclick = ()=>restoreWb('reply');
    if(eRest) eRest.onclick = ()=>restoreWb('env');
  }
};

/* =========================================================
 *  角色扮演（AI 功能）
 * ========================================================= */
function openPicker(){
  const ld = DATA.lifeData;
  const rows = ld.fields.map(f=>`<div class="ld-row"><span class="ld-k">${f[0]}</span><span class="ld-v">${f[1]}</span></div>`).join('');
  roleplay.innerHTML = `<div class="rp-head"><button class="back" id="rpClose">✕</button>
    <div class="tt">选择身份</div><div class="who">以该身份与宁羽对话</div></div>
    <div class="rp-body">
      <div class="life-data">
        <div class="ld-head"><span class="ld-title">${ld.title}</span><span class="ld-err">${ld.linkErr}</span></div>
        <div class="ld-grid">${rows}</div>
        <div class="ld-rec"><b>实验记录</b><br>${ld.record}</div>
      </div>
      <div class="pi-logo">π</div>
      <div class="rp-picker" id="rpPicker"></div>
    </div>`;
  roleplay.classList.add('show');
  const picker = $('#rpPicker');
  picker.innerHTML = DATA.roleplayRoles.map(r=>`<div class="chat-item" data-role="${r.id}">
    <div class="ava">${r.name[0]}</div>
    <div class="mid"><div class="nm">${r.name}</div></div></div>`).join('');
  picker.querySelectorAll('.chat-item').forEach(it=> it.onclick=()=>openChat(it.dataset.role));
  $('#rpClose').onclick = ()=>{ clearRpTimers(); STATE._rp=null; roleplay.classList.remove('show'); };
}
function openingLine(roleId){
  return roleId==='pi' ? '你醒了。' :
    roleId==='luoran' ? '我们认识这么多年 一眼就能能看出来你有点不对劲 你有没有什么话想要对我说' :
    roleId==='linjing' ? '你怎么还不回家 宁羽 你在哪' :
    roleId==='xieying' ? '你最近看我的眼神 好像在躲着什么' :
    '……';
}
function clearRpTimers(){
  if(STATE._rpTypingTimer){ clearTimeout(STATE._rpTypingTimer); STATE._rpTypingTimer=null; }
  if(STATE._rpBatchTimer){ clearTimeout(STATE._rpBatchTimer); STATE._rpBatchTimer=null; }
}
function openChat(roleId){
  clearRpTimers();
  const role = DATA.roleplayRoles.find(r=>r.id===roleId);
  roleplay.innerHTML = `<div class="rp-head"><button class="back" id="rpBack">‹</button>
    <div class="tt">与宁羽对话 · ${role.name}</div><button class="rp-clear" id="rpClear">清除记忆</button><div class="who">你是 ${role.name}</div></div>
    <div class="rp-body" id="rpBody"></div>
    <div class="rp-input"><input id="rpIn" placeholder="以「${role.name}」的口吻说…"><button id="rpSend">发送</button></div>`;
  const body=$('#rpBody'), inp=$('#rpIn'), send=$('#rpSend');
  if(!STATE.rpConvos) STATE.rpConvos = loadRpConvos();
  const conv = STATE.rpConvos[roleId] || (STATE.rpConvos[roleId] = []);
  STATE._rp = { roleId, role, msgs: conv };
  STATE._rpPending = false;   // 是否有待送达的连发消息
  // 恢复历史记录；若为空则补开场白
  if(conv.length === 0){
    rpAdd(body, true, openingLine(roleId));   // 开场由所选角色（右/我方）说出
  } else {
    conv.forEach(m=> rpRender(body, m.me, m.text));
    rpGroupAvatars(body);
  }

  const removeTyping = ()=>{
    const t=document.getElementById('rpTyping'); if(t) t.remove();
  };
  const showTyping = ()=>{
    if(document.getElementById('rpTyping')) return;
    const typing = document.createElement('div');
    typing.id='rpTyping'; typing.className='rp-row n typing';
    typing.innerHTML='<div class="rp-ava n">宁</div><div class="rp-msg typing-dot">宁羽正在输入<span class="td-dots"><i>.</i><i>.</i><i>.</i></span></div>';
    body.appendChild(typing); body.scrollTop = body.scrollHeight;
  };
  // 12s 静默后：把攒下的消息整批送达宁羽（真实请求），拿到回复再连发出来
  const flush = ()=>{
    clearRpTimers();
    if(!STATE._rpPending) return;
    STATE._rpPending = false;
    showTyping();
    callNingyu(roleId, STATE._rp.msgs).then(reply=>{
      removeTyping(); deliverNingyu(body, roleId, reply);
    }).catch(()=>{ removeTyping(); deliverNingyu(body, roleId, mockNingyu(roleId,'')); });
  };
  const go = ()=>{
    const v=inp.value.trim(); if(!v) return;
    rpAdd(body, true, v); inp.value='';
    STATE._rpPending = true;
    // 每发一条都重新计时：收起可能已显示的「正在输入」，
    // 5~6s（随机）后重显，约 8s（±0.5s 随机）后整批送达宁羽
    clearRpTimers();
    removeTyping();
    STATE._rpTypingTimer = setTimeout(showTyping, 5000 + Math.floor(Math.random()*1000));
    STATE._rpBatchTimer  = setTimeout(flush, 8000 + Math.floor(Math.random()*1000 - 500));
  };
  send.onclick = go; inp.onkeydown = e=>{ if(e.key==='Enter') go(); };
  $('#rpClear').onclick = ()=>{
    const ov = document.createElement('div');
    ov.className = 'rp-modal-ov';
    ov.innerHTML = `<div class="rp-modal">
      <div class="rp-modal-tt">清除记忆</div>
      <div class="rp-modal-tx">确定清除与「${role.name}」的对话记忆？微信中的对应记录也会一并删除。此操作不可撤销。</div>
      <div class="rp-modal-btns">
        <button class="btn cancel" id="rpMCancel">取消</button>
        <button class="btn danger" id="rpMDel">删除</button>
      </div></div>`;
    roleplay.appendChild(ov);
    const close = ()=> ov.remove();
    $('#rpMCancel').onclick = close;
    ov.onclick = e=>{ if(e.target===ov) close(); };
    $('#rpMDel').onclick = ()=>{
      close();
      clearRpTimers();
      STATE.rpConvos[roleId] = [];
      STATE._rp.msgs = STATE.rpConvos[roleId];
      saveRpConvos();
      body.innerHTML = '';
      showToast('记忆已清除');
    };
  };
  $('#rpBack').onclick = ()=>{ clearRpTimers(); openPicker(); };
}
/* 仅渲染单条 DOM（不入库）——不做头像分组，由 rpGroupAvatars 统一处理 */
function rpRender(body, me, text){
  body.insertAdjacentHTML('beforeend',
    `<div class="rp-row ${me?'me':''}"><div class="rp-ava ${me?'u':'n'}">${me?'你':'宁'}</div>
     <div class="rp-msg">${bubbleInner(text)}</div></div>`);
  body.scrollTop = body.scrollHeight;
}
/* 渲染 + 入库 + 持久化 + 分组 */
function rpAdd(body, me, text){
  rpRender(body, me, text);
  if(STATE._rp){ STATE._rp.msgs.push({ me, text }); saveRpConvos(); }
  rpGroupAvatars(body);
}
/* 统一扫描：连续同侧消息仅最下方一条显示头像（排除 typing 行） */
function rpGroupAvatars(body){
  const rows = body.querySelectorAll('.rp-row:not(.typing)');
  rows.forEach(r=>{ r.classList.remove('grp'); const a=r.querySelector('.rp-ava'); if(a){ a.style.visibility='visible'; a.style.display=''; } });
  for(let i=1;i<rows.length;i++){
    const prev=rows[i-1], cur=rows[i];
    if(prev.classList.contains('me') === cur.classList.contains('me')){
      const pa=prev.querySelector('.rp-ava'); if(pa) pa.style.visibility='hidden';
      prev.classList.add('grp');
    }
  }
  body.scrollTop = body.scrollHeight;
}
/* 把宁羽的一段回复拆成多条短消息，依次连发；完成后统一分组 */
function deliverNingyu(body, roleId, reply){
  let parts = parseNingyuReply(reply);
  /* 防御：解析为空或全空时降级到 mock */
  if(!parts.length || !parts.some(p=>p && p.trim())){
    parts = [mockNingyu(roleId,'')];
  }
  parts = parts.filter(p=> p && p.trim());
  if(!parts.length) return;
  let i=0;
  const step = ()=>{
    if(!STATE._rp || STATE._rp.roleId!==roleId) return;
    rpAdd(body, false, parts[i]); i++;
    if(i < parts.length){
      setTimeout(step, 700+Math.random()*700);
    } else {
      rpGroupAvatars(body);
    }
  };
  step();
}
/* 解析宁羽回复：按换行拆多条；每条去括号（连内容）+去标点（空格代替） */
function parseNingyuReply(reply){
  return String(reply||'').split(/\n+/).map(line=> stripPunct(removeParens(line.trim())))
    .filter(t=> t);
}
/* 删除括号及其内部内容（中英文圆括号、方括号）——兜底确保宁羽回复不出现状态文字 */
function removeParens(t){
  return String(t||'')
    .replace(/[（(][^）)\]]*[）)\]]/g, '')
    .replace(/\s{2,}/g,' ').trim();
}
/* 去掉中英文标点，用空格代替（用于宁羽的消息） */
function stripPunct(t){
  return String(t||'')
    .replace(/[，。、；：！？,.;:!?~〜…—\-“”"'‘’()（）【】\[\]<>《》]+/g,' ')
    .replace(/\s{2,}/g,' ').trim();
}
/* 生成气泡内容（纯正文，无状态块） */
function bubbleInner(text){
  return `<div class="b-text">${escapeHtml(text)}</div>`;
}
function mockNingyu(roleId, userText){
  const base = {
    pi:'实验编号110，你看到的都是设计的一部分。继续执行观察，不必多问。',
    luoran:'宁羽……你瞒了我什么？桃子的死，没那么简单吧。',
    linjing:'林静，家里冷就多穿点。我……暂时回不来。',
    xieying:'谢颖，有些事你不知道比较好。相信我。'
  }[roleId] || '……';
  if(!userText) return base;
  const echo = {
    pi:'你的话已记录。实验继续，不必追问。',
    luoran:'你刚才说的，我记下了。宁羽，别想糊弄我。',
    linjing:'你说的我都听见了……老公，你到底在哪？',
    xieying:'嗯……你这话，让我有点不安。'
  }[roleId] || '……';
  return echo;
}
async function callNingyu(roleId, history){
  const cfg = JSON.parse(localStorage.getItem('dzs_settings')||'{}');
  if(!cfg.apiUrl || !cfg.apiKey) return mockNingyu(roleId, history[history.length-1]?.text||'');
  try{
    const role = DATA.roleplayRoles.find(r=>r.id===roleId);
    const sys = DATA.personas.ningyu + ' 你现在正在与「' + role.name + '」对话。' + (DATA.personas[roleId]||'')
      + '\n注意：对方可能一次连发了多条消息（下面同一轮里的多行就是连发内容），请把它们当作一整段一起理解后再回复。';
    // 世界书（常量注入）：开启时把「实验环境配置」与「实验体回复准则」一并拼入系统提示
    if(cfg.wbOn!==false){
      const wbEnv = (cfg.wbEnv || DATA.worldbook.env || '').trim();
      const wbReply = (cfg.wbReply || DATA.worldbook.reply || '').trim();
      if(wbEnv) sys += '\n\n【世界书 · 实验环境配置】\n' + wbEnv;
      if(wbReply) sys += '\n\n【世界书 · 实验体回复准则】\n' + wbReply;
    }
    // 合并相邻同角色的消息（把连发并成一轮），避免部分接口报错
    const messages = [{role:'system',content:sys}];
    history.forEach(h=>{
      const role = h.me?'user':'assistant';
      const last = messages[messages.length-1];
      if(last && last.role===role) last.content += '\n' + h.text;
      else messages.push({role, content:h.text});
    });
    const ctrl = new AbortController();
    const to = setTimeout(()=>ctrl.abort(), 30000);
    const r = await fetch(cfg.apiUrl, {method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+cfg.apiKey},
      body:JSON.stringify({model:cfg.apiModel||'gpt-4o', messages, temperature:.9}),
      signal:ctrl.signal});
    clearTimeout(to);
    if(!r.ok) throw new Error('HTTP '+r.status);
    const j = await r.json();
    const txt = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
    return txt ? txt.trim() : mockNingyu(roleId, history[history.length-1]?.text||'');
  }catch(e){
    showToast('接口未响应，已切换为模拟回复');
    return mockNingyu(roleId, history[history.length-1]?.text||'');
  }
}
/* ---------- 工具 ---------- */
function escapeHtml(s){ return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* =========================================================
 *  初始化
 * ========================================================= */
function tick(){
  const d=new Date(), hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0');
  const t=hh+':'+mm;
  $('#sbTime').textContent=t; const bc=$('#bigClock'); if(bc) bc.textContent=t;
}
function init(){
  const th = localStorage.getItem('dzs_theme'); if(th) document.documentElement.dataset.theme = th;
  STATE.rpConvos = loadRpConvos();
  STATE.health = randomHealth();
  buildHome();
  tick(); setInterval(tick,1000);
  setInterval(updateHealth, 20*60*1000);
  // 事件委托：点击 app
  document.body.addEventListener('click', e=>{
    const a = e.target.closest('.app'); if(a) openApp(a.dataset.app);
  });
  $('#sheetClose').onclick = closeApp;
  backdrop.onclick = closeApp;
}
document.addEventListener('DOMContentLoaded', init);
