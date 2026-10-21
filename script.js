// Personalize this page before sharing it.
const FRIEND_NAME = "YOUR FRIEND";

// QA / local testing only:
// Add ?skipGame=1 to the URL to bypass the memory game and open the scrapbook.
// Example: http://localhost:8000/?skipGame=1
// This is intentionally a client-side convenience, NOT security or access control.
// Remove this override before sharing if you want everyone to play the game first.
const QA_SKIP_GAME = new URLSearchParams(window.location.search).get("skipGame") === "1";

const PAIRS = ["✦", "☾", "♧", "✷", "◇", "♡"];
const welcome = document.getElementById("welcome");
const game = document.getElementById("game");
const bookSection = document.getElementById("bookSection");
const gallerySection = document.getElementById("gallerySection");
const capsuleSection = document.getElementById("memoryCapsule");
const memoryGrid = document.getElementById("memoryGrid");
const movesLabel = document.getElementById("moves");
const pairsLabel = document.getElementById("pairs");
const gameMessage = document.getElementById("gameMessage");
const openBookBtn = document.getElementById("openBookBtn");

function showScreen(screen) {
  [welcome, game, bookSection, gallerySection, capsuleSection].forEach(el => el.classList.add("hidden"));
  screen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.getElementById("beginBtn").addEventListener("click", () => {
  if (QA_SKIP_GAME) {
    showScreen(bookSection);
    setPage(0, false);
  } else {
    showScreen(game);
  }
});

let flipped = [], matched = 0, moves = 0, locked = false;
function buildGame() {
  const deck = [...PAIRS, ...PAIRS].map((symbol, id) => ({ symbol, id, sort: Math.random() }));
  deck.sort((a, b) => a.sort - b.sort);
  memoryGrid.innerHTML = "";
  deck.forEach(card => {
    const button = document.createElement("button");
    button.className = "memory-card";
    button.setAttribute("aria-label", "Memory card");
    button.innerHTML = `<span class="memory-card-inner"><span class="card-face card-back">✳</span><span class="card-face card-front">${card.symbol}</span></span>`;
    button.dataset.symbol = card.symbol;
    button.addEventListener("click", () => flipCard(button));
    memoryGrid.appendChild(button);
  });
}
function flipCard(card) {
  if (locked || card.classList.contains("flipped") || card.classList.contains("matched")) return;
  card.classList.add("flipped");
  flipped.push(card);
  if (flipped.length !== 2) return;
  moves++;
  movesLabel.textContent = `MOVES ${String(moves).padStart(2, "0")}`;
  locked = true;
  if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
    flipped.forEach(c => c.classList.add("matched"));
    matched++;
    pairsLabel.textContent = `PAIRS ${String(matched).padStart(2, "0")} / 06`;
    flipped = [];
    locked = false;
    if (matched === PAIRS.length) {
      gameMessage.textContent = "A perfect match. You’ve earned your way in.";
      openBookBtn.classList.remove("hidden");
    } else {
      gameMessage.textContent = "That one belongs together. Keep going.";
    }
  } else {
    gameMessage.textContent = "Not quite. Try another combination.";
    setTimeout(() => {
      flipped.forEach(c => c.classList.remove("flipped"));
      flipped = [];
      locked = false;
    }, 850);
  }
}
buildGame();
openBookBtn.addEventListener("click", () => {
  showScreen(bookSection);
  setPage(0, false);
});

const pages = Array.from(document.querySelectorAll(".book-page"));
let currentPage = 0, isTurning = false;
const pageNumber = document.getElementById("pageNumber");
const prevPage = document.getElementById("prevPage"), nextPage = document.getElementById("nextPage");
const prevText = document.getElementById("prevText"), nextText = document.getElementById("nextText");
const bookHint = document.getElementById("bookHint");
function setPage(target, animate = true) {
  if (isTurning || target < 0 || target >= pages.length || target === currentPage) return;
  const oldIndex = currentPage, oldPage = pages[oldIndex], newPage = pages[target], forward = target > oldIndex;
  if (!animate) {
    pages.forEach((p, i) => {
      p.classList.remove("active", "turning-forward", "turning-back");
      p.style.zIndex = "";
      if (i === target) p.classList.add("active");
    });
    currentPage = target; updateControls(); return;
  }
  isTurning = true;
  newPage.classList.remove("turning-forward", "turning-back");
  newPage.classList.add("active");
  newPage.style.zIndex = "1";
  oldPage.style.zIndex = "4";
  oldPage.classList.remove("active");
  oldPage.classList.add(forward ? "turning-forward" : "turning-back");
  newPage.style.visibility = "visible"; newPage.style.opacity = "1";
  if (!forward) oldPage.style.transform = "rotateY(180deg)";
  currentPage = target; updateControls();
  setTimeout(() => {
    oldPage.classList.remove("turning-forward", "turning-back");
    oldPage.style.zIndex = ""; oldPage.style.transform = ""; oldPage.style.visibility = ""; oldPage.style.opacity = "";
    newPage.style.zIndex = "2"; isTurning = false; updateControls();
  }, 770);
}
function updateControls() {
  pageNumber.textContent = String(currentPage + 1).padStart(2, "0");
  prevPage.disabled = currentPage === 0 || isTurning;
  prevText.disabled = currentPage === 0 || isTurning;
  nextPage.disabled = currentPage === pages.length - 1 || isTurning;
  nextText.disabled = currentPage === pages.length - 1 || isTurning;
  bookHint.textContent = currentPage === pages.length - 1 ? "End of this little book. The next chapter is yours." : "A little archive, made just for you.";
}
function movePage(direction) { setPage(currentPage + direction); }
prevPage.addEventListener("click", () => movePage(-1)); prevText.addEventListener("click", () => movePage(-1));
nextPage.addEventListener("click", () => movePage(1)); nextText.addEventListener("click", () => movePage(1));

let touchStartX = 0, touchStartY = 0;
const book = document.getElementById("book");
book.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].clientX; touchStartY = e.changedTouches[0].clientY; }, { passive: true });
book.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX, dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.15) movePage(dx < 0 ? 1 : -1);
}, { passive: true });
document.querySelectorAll(".polaroid").forEach(card => card.addEventListener("click", () => card.classList.toggle("flipped")));

// The scrapbook is one chapter of the experience, followed by a larger photo wall and a final keepsake note.
const galleryJump = document.createElement("button");
galleryJump.className = "button button-primary";
galleryJump.id = "continueToGallery";
galleryJump.textContent = "Explore the photo wall ↗";
galleryJump.style.display = "block";
galleryJump.style.margin = "24px auto 0";
document.querySelector(".book-controls").after(galleryJump);
galleryJump.addEventListener("click", () => showScreen(gallerySection));
document.getElementById("galleryBack").addEventListener("click", () => showScreen(bookSection));
document.getElementById("galleryNext").addEventListener("click", () => showScreen(capsuleSection));
document.getElementById("capsuleCelebrate").addEventListener("click", () => {
  launchConfetti(220);
  openBirthday();
});


const birthdayOverlay = document.getElementById("birthdayOverlay");
const blowCandlesBtn = document.getElementById("blowCandlesBtn");
const candleScene = document.getElementById("candleScene");
const candlePrompt = document.getElementById("candlePrompt");
const wishMessage = document.getElementById("wishMessage");
let candlesBlown = false;
function openBirthday() {
  birthdayOverlay.classList.remove("hidden");
  candlesBlown = false;
  candleScene.classList.remove("candles-out");
  candlePrompt.classList.remove("hidden");
  wishMessage.classList.add("hidden");
  blowCandlesBtn.classList.remove("hidden");
}
function blowCandles() {
  if (candlesBlown) return;
  candlesBlown = true;
  candleScene.classList.add("candles-out");
  candlePrompt.textContent = "And now, make that wish.";
  blowCandlesBtn.classList.add("hidden");
  wishMessage.classList.remove("hidden");
  launchConfetti(180);
}
blowCandlesBtn.addEventListener("click", blowCandles);
candleScene.addEventListener("click", blowCandles);
document.getElementById("closeBirthday").addEventListener("click", () => birthdayOverlay.classList.add("hidden"));
birthdayOverlay.addEventListener("click", e => { if (e.target === birthdayOverlay) birthdayOverlay.classList.add("hidden"); });

// Show the birthday candle moment once the visitor has entered the scrapbook.
openBookBtn.addEventListener("click", () => setTimeout(openBirthday, 450));

// A small canvas ambient animation: floating petals, sparkles, and confetti.
const canvas = document.getElementById("ambientCanvas"), ctx = canvas.getContext("2d");
let width = 0, height = 0, particles = [], confetti = [], pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
function resizeCanvas() {
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width * pixelRatio; canvas.height = height * pixelRatio;
  canvas.style.width = width + "px"; canvas.style.height = height + "px";
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  particles = Array.from({length: Math.min(48, Math.floor(width / 22))}, () => makeAmbient(true));
}
function makeAmbient(initial = false) {
  return {x:Math.random()*width,y:initial?Math.random()*height:height+20,size:2+Math.random()*4,vx:(Math.random()-.5)*.28,vy:.18+Math.random()*.55,rot:Math.random()*6.28,vr:(Math.random()-.5)*.012,kind:Math.random(),alpha:.15+Math.random()*.35};
}
function launchConfetti(count = 140) {
  const colors = ["#b77854","#d6b77e","#a9b99f","#e7cfa8","#82977f","#fffaf1"];
  for(let i=0;i<count;i++) confetti.push({x:Math.random()*width,y:-20-Math.random()*height*.25,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,size:3+Math.random()*6,rot:Math.random()*6.28,vr:(Math.random()-.5)*.18,color:colors[i%colors.length],life:170+Math.random()*90});
}
function draw() {
  ctx.clearRect(0,0,width,height);
  particles.forEach(p=>{
    p.x+=p.vx+Math.sin(p.y*.008)*.15;p.y-=p.vy;p.rot+=p.vr;
    if(p.y < -20){Object.assign(p,makeAmbient());p.y=height+10}
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.alpha;
    if(p.kind<.45){ctx.strokeStyle="#b77854";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-p.size,0);ctx.lineTo(p.size,0);ctx.moveTo(0,-p.size);ctx.lineTo(0,p.size);ctx.stroke()}
    else if(p.kind<.75){ctx.fillStyle="#c7b98f";ctx.beginPath();ctx.ellipse(0,0,p.size*.55,p.size*1.3,p.rot,0,Math.PI*2);ctx.fill()}
    else{ctx.fillStyle="#a8b79e";ctx.beginPath();ctx.arc(0,0,p.size*.6,0,Math.PI*2);ctx.fill()}
    ctx.restore();
  });
  confetti = confetti.filter(c=>c.life>0 && c.y<height+30);
  confetti.forEach(c=>{c.x+=c.vx;c.y+=c.vy;c.vy+=.025;c.rot+=c.vr;c.life--;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rot);ctx.globalAlpha=Math.min(1,c.life/35);ctx.fillStyle=c.color;ctx.fillRect(-c.size/2,-c.size/3,c.size,c.size*.62);ctx.restore()});
  requestAnimationFrame(draw);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); draw();

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
if (FRIEND_NAME && FRIEND_NAME !== "YOUR FRIEND") {
  document.querySelector(".book-header h2").innerHTML = `A book for <em>${escapeHtml(FRIEND_NAME)}.</em>`;
  document.querySelector(".hero-copy h1").innerHTML = `A little world<br><em>for ${escapeHtml(FRIEND_NAME)}.</em>`;
}
