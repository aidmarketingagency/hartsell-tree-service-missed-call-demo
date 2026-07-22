(function () {
  var BUBBLE_ID = 'ultra-fast-widget-bubble-54722168';
  var KEY = 'aidDemoWidgetAutoOpened';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var userTouched = false;
  document.addEventListener('click', function (e) {
    if (e.isTrusted && e.target && e.target.closest && e.target.closest('#' + BUBBLE_ID)) { userTouched = true; }
  }, true);
  var tries = 0;
  var t = setInterval(function () {
    tries += 1;
    var b = document.getElementById(BUBBLE_ID);
    if (b && tries >= 7) {
      clearInterval(t);
      if (!userTouched) { b.click(); }
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    }
    if (tries > 30) { clearInterval(t); }
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

  // Re-arm on scroll re-entry
  if ('IntersectionObserver' in window){
    var demoIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          playThread();
        } else if (!reducedMotion()){
          clearTimers();
          playing = false;
          resetThread();
        }
      });
    }, { threshold: 0.35 });
    if(thread) demoIO.observe(thread);
  } else {
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
// ── 7/16 sequencer contract override (patched 2026-07-21) ──
// play at ~15% visible; re-arm ONLY after full viewport exit; replay hard-resets.
;(function(){
  // Locate the SMS thread element (try common IDs in priority order)
  var threadIds = ['thread','thread-mobile','thread-desktop','sms-thread','sms-thread-desktop','demo-thread'];
  var threadEl = null;
  for (var _i = 0; _i < threadIds.length; _i++){
    threadEl = document.getElementById(threadIds[_i]);
    if (threadEl) break;
  }
  if (!threadEl) return; // no thread found — bail

  // Locate replay buttons (use the FIRST one if multiple)
  var replayBtns = Array.prototype.slice.call(document.querySelectorAll('[id*="replay"],[data-replay]'));

  function hardReset(){
    // Simulate a replay button click to let the existing implementation reset+play.
    // If no replay button exists, try firing a custom event the sequencer may listen for.
    if (replayBtns.length > 0){ replayBtns[0].click(); }
  }

  var _armed = true;
  function _autoplay(){
    if (!_armed) return;
    _armed = false;
    hardReset();
  }

  // playIO: fires when >= 15% of the thread is visible
  var playIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting && e.intersectionRatio >= 0.15){ _autoplay(); }
    });
  }, { threshold: 0.18 });
  playIO.observe(threadEl);

  // rearmIO: fires when thread fully exits the viewport (threshold:0 + !isIntersecting)
  var rearmIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting){ _armed = true; }
    });
  }, { threshold: 0 });
  rearmIO.observe(threadEl);

  // Check already-visible case at init time
  var _rect = threadEl.getBoundingClientRect();
  var _vh = window.innerHeight || document.documentElement.clientHeight;
  var _vis = Math.min(_rect.bottom, _vh) - Math.max(_rect.top, 0);
  if (_rect.height > 0 && _vis / _rect.height >= 0.15){ _autoplay(); }
})();
