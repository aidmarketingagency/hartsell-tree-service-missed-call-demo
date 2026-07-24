/* AID teaser bubble + auto-open schedule (v3, 2026-07-22):
   teaser at 10s next to the closed launcher, auto-open never before 20s.
   Pages with the data-aid-widget-boost snippet keep that snippet's own 20s
   opener; this block only auto-opens on pages without it. Clicking the
   teaser or the launcher opens the chat immediately. */
(function () {
  var WID = '54722168';
  var BUBBLE_ID = 'ultra-fast-widget-bubble-' + WID;
  var OPEN_KEY = 'aidWidgetAutoOpened';
  var LEGACY_KEY = 'aidDemoWidgetAutoOpened';
  var TEASER_KEY = 'aidTeaserShown';
  var TEASER_AT = 10; /* seconds, the old auto-open moment */
  var OPEN_AT = 20;   /* seconds, minimum auto-open delay */
  var hasBoost = !!document.querySelector('script[data-aid-widget-boost]');
  function bubble() { return document.getElementById(BUBBLE_ID); }
  function isOpen() {
    var c = document.getElementById('ultra-fast-widget-container-' + WID);
    return !!(c && getComputedStyle(c).display !== 'none');
  }
  function alreadyOpened() {
    try { return !!(sessionStorage.getItem(OPEN_KEY) || sessionStorage.getItem(LEGACY_KEY)); } catch (e) { return false; }
  }
  var teaser = null;
  var userTouched = false;
  document.addEventListener('click', function (e) {
    if (e.isTrusted && e.target && e.target.closest && e.target.closest('#' + BUBBLE_ID)) {
      userTouched = true;
      hideTeaser();
    }
  }, true);
  function hideTeaser() {
    if (!teaser) return;
    var t = teaser;
    teaser = null;
    t.style.opacity = '0';
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 450);
  }
  function openChat() {
    hideTeaser();
    var b = bubble();
    if (b && !isOpen()) b.click();
  }
  function showTeaser() {
    if (teaser || userTouched || isOpen() || alreadyOpened()) return;
    try {
      if (sessionStorage.getItem(TEASER_KEY)) return;
      sessionStorage.setItem(TEASER_KEY, '1');
    } catch (e) {}
    var d = document.createElement('div');
    d.setAttribute('data-aid-teaser', '');
    d.setAttribute('role', 'button');
    d.setAttribute('tabindex', '0');
    d.style.cssText = 'position:fixed;right:20px;bottom:98px;z-index:999998;max-width:250px;background:#141419;color:#F4F4F5;padding:13px 32px 13px 16px;border-radius:16px;border:1px solid rgba(201,168,76,.45);box-shadow:0 12px 28px rgba(0,0,0,.5);font:500 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;opacity:0;transform:translateY(10px);transition:opacity .5s ease,transform .5s ease;';
    var txt = document.createElement('p');
    txt.style.cssText = 'margin:0;';
    txt.textContent = "Give your customers AN OFFER they can't refuse! 🎙️";
    var x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('aria-label', 'Dismiss');
    x.textContent = '×';
    x.style.cssText = 'position:absolute;top:2px;right:6px;background:transparent;border:none;color:rgba(244,244,245,.55);font-size:18px;line-height:1;cursor:pointer;padding:2px 4px;';
    x.addEventListener('click', function (e) { e.stopPropagation(); hideTeaser(); });
    var arrow = document.createElement('span');
    arrow.style.cssText = 'position:absolute;bottom:-7px;right:26px;width:12px;height:12px;background:#141419;border-right:1px solid rgba(201,168,76,.45);border-bottom:1px solid rgba(201,168,76,.45);transform:rotate(45deg);';
    d.appendChild(txt);
    d.appendChild(x);
    d.appendChild(arrow);
    d.addEventListener('click', function (e) { if (e.target === x) return; e.stopPropagation(); openChat(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChat(); } });
    document.body.appendChild(d);
    teaser = d;
    requestAnimationFrame(function () { d.style.opacity = '1'; d.style.transform = 'translateY(0)'; });
  }
  var ticks = 0;
  var timer = setInterval(function () {
    ticks += 1;
    if (isOpen()) {
      hideTeaser();
      if (hasBoost || ticks >= OPEN_AT) clearInterval(timer);
      return;
    }
    var b = bubble();
    if (b && ticks >= TEASER_AT) showTeaser();
    if (!hasBoost && b && ticks >= OPEN_AT) {
      clearInterval(timer);
      hideTeaser();
      var guard = alreadyOpened();
      try { sessionStorage.setItem(LEGACY_KEY, '1'); } catch (e) {}
      if (!guard && !userTouched && !isOpen()) b.click();
    }
    if (ticks > 60) clearInterval(timer);
  }, 1000);
})();

(function(){
  // ---- Reduced-motion gate ----
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function reducedMotion(){ return !!motionQuery.matches; }

  // ---- SMS THREAD ----
  var thread = document.getElementById('thread');
  var b = [
    document.getElementById('b0'),
    document.getElementById('b1'),
    document.getElementById('b2'),
    document.getElementById('b3')
  ];
  var typers = {
    1: document.getElementById('typing1'),
    2: document.getElementById('typing2')
  };
  var replayBtn = document.getElementById('replayBtn');
  var timers = [];
  var playing = false;

  function clearTimers(){ timers.forEach(function(t){ clearTimeout(t); }); timers = []; }

  function resetThread(){
    b.forEach(function(bub){ if(bub) bub.classList.remove('show'); });
    [1,2].forEach(function(k){ if(typers[k]) typers[k].classList.remove('show'); });
  }

  function showThreadFinal(){
    clearTimers();
    playing = false;
    b.forEach(function(bub){ if(bub) bub.classList.add('show'); });
    [1,2].forEach(function(k){ if(typers[k]) typers[k].classList.remove('show'); });
  }

  function playThread(){
    if (reducedMotion()){ showThreadFinal(); return; }
    if (playing) return;
    playing = true;
    clearTimers();
    resetThread();
    var seq = [
      { t: 300,  fn: function(){ b[0].classList.add('show'); } },
      { t: 1000, fn: function(){ typers[1].classList.add('show'); } },
      { t: 2100, fn: function(){ typers[1].classList.remove('show'); b[1].classList.add('show'); } },
      { t: 3000, fn: function(){ b[2].classList.add('show'); } },
      { t: 3700, fn: function(){ typers[2].classList.add('show'); } },
      { t: 4800, fn: function(){ typers[2].classList.remove('show'); b[3].classList.add('show'); playing = false; } }
    ];
    seq.forEach(function(step){ timers.push(setTimeout(step.fn, step.t)); });
  }

  if(replayBtn){
    replayBtn.addEventListener('click', function(){
      replayBtn.classList.add('spin');
      setTimeout(function(){ replayBtn.classList.remove('spin'); }, 520);
      playing = false;
      playThread();
    });
  }

  // Autoplay fires ONCE when the thread is ~15-18% visible (including already
  // visible at script init). No observer-driven restart while any part of the
  // thread stays in view; re-arm ONLY after it has fully left the viewport.
  // (Unified single-sequencer contract, matches aid-demo-pages/charlotte-pest.)
  var armed = true;

  function autoplayThread(){
    if (!armed) return;
    armed = false;
    playThread();
  }

  if (thread && 'IntersectionObserver' in window){
    var playIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting && e.intersectionRatio >= 0.15){ autoplayThread(); }
      });
    }, { threshold: 0.18 });
    playIO.observe(thread);

    var rearmIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting){
          clearTimers();
          playing = false;
          resetThread();
          armed = true;
        }
      });
    }, { threshold: 0 });
    rearmIO.observe(thread);

    // Already visible at script init: play now instead of waiting on an entry.
    var initRect = thread.getBoundingClientRect();
    var initVh = window.innerHeight || document.documentElement.clientHeight;
    var initVisible = Math.min(initRect.bottom, initVh) - Math.max(initRect.top, 0);
    if (initRect.height > 0 && initVisible / initRect.height >= 0.15){ autoplayThread(); }
  } else if (thread) {
    playThread();
  }

  // ---- STAT COUNTER ----
  // Source: https://www.angi.com/articles/tree-removal-cost.htm
  // $2,000 mid-range of $1,500-$5,000 NC emergency tree removal range
  var STAT_TARGET = 2000;
  var statDollars = document.getElementById('statDollars');
  var statCents = document.getElementById('statCents');
  var statReplayBtn = document.getElementById('statReplayBtn');
  var countRun = 0;

  function showStatFinal(){
    countRun++;
    if(statDollars) statDollars.textContent = '$' + Math.floor(STAT_TARGET / 1000);
    if(statCents) statCents.textContent = ',' + String(STAT_TARGET % 1000).padStart(3, '0');
  }

  function runCount(){
    if(reducedMotion()){ showStatFinal(); return; }
    var runId = ++countRun;
    var dur = 1400;
    var start = null;
    function step(ts){
      if(runId !== countRun) return;
      if(!start) start = ts;
      var progress = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(eased * STAT_TARGET);
      var dollars = Math.floor(val / 1000);
      var cents = String(val % 1000).padStart(3, '0');
      if(statDollars) statDollars.textContent = '$' + dollars;
      if(statCents) statCents.textContent = ',' + cents;
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if(reducedMotion()){ showStatFinal(); }

  var statEl = document.getElementById('statNum');
  if(statEl && 'IntersectionObserver' in window){
    var statIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ runCount(); }
      });
    }, { threshold: 0.4 });
    statIO.observe(statEl);
  }

  if(statReplayBtn){
    statReplayBtn.addEventListener('click', function(){
      statReplayBtn.classList.add('spin');
      setTimeout(function(){ statReplayBtn.classList.remove('spin'); }, 520);
      runCount();
    });
  }

  // ---- REVEAL SECTIONS ----
  var reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var revealIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('visible'); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function(el){ revealIO.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('visible'); });
  }

  // ---- STICKY CTA hide when real CTA in view ----
  var stickyCta = document.getElementById('stickyCta');
  var ctaPanel = document.querySelector('.cta-section');
  if(stickyCta && ctaPanel && 'IntersectionObserver' in window){
    var ctaIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        stickyCta.classList.toggle('hidden', e.isIntersecting);
      });
    }, { threshold: 0.1 });
    ctaIO.observe(ctaPanel);
  }

  // Mid-session preference toggle
  if(motionQuery.addEventListener){
    motionQuery.addEventListener('change', function(){
      if(reducedMotion()){ showStatFinal(); showThreadFinal(); }
    });
  }
})();
