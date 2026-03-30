const b            = document.getElementById('b');
const statusTxt    = document.getElementById('status-txt');
const barraFome    = document.getElementById('barra-fome');
const criaturaWrap = document.getElementById('criatura-wrap');
const overlay      = document.getElementById('overlay-morte');
const btnReiniciar = document.getElementById('btn-reiniciar');
const bandeja      = document.getElementById('bandeja');
const slotComida   = document.getElementById('slot-comida');
const dragClone    = document.getElementById('drag-clone');
const dragCloneImg = dragClone.querySelector('img');
const tela         = document.getElementById('tela');

const estados = {
  normal:  'criatura.png',
  bravo:   'criatura_brava.png',
  morto:   'criatura_morta.png',
  comendo: 'criatura_comendo.png',
};

const TEMPO_BRAVO   = 30;
const TEMPO_MORTO   = 60;
const TEMPO_COMENDO = 3;

let contador    = 0;
let estado      = 'normal';
let intervalo   = null;
let timeComendo = null;

function iniciar() {
  contador = 0;
  estado   = 'normal';

  btnReiniciar.style.display = 'none';
  bandeja.style.display      = 'flex';
  overlay.classList.remove('ativo');
  criaturaWrap.classList.remove('morta');
  slotComida.classList.remove('invisivel');

  aplicarEstado('normal');
  atualizarBarra();

  if (intervalo)   clearInterval(intervalo);
  if (timeComendo) clearTimeout(timeComendo);

  intervalo = setInterval(() => {
    if (estado === 'comendo' || estado === 'morto') return;

    contador++;
    atualizarBarra();

    if (contador >= TEMPO_MORTO) {
      morrer();
    } else if (contador >= TEMPO_BRAVO) {
      aplicarEstado('bravo');
    }
  }, 1000);
}

function aplicarEstado(novoEstado) {
  b.classList.remove('pulsando', 'tremendo', 'comendo-anim');
  estado = novoEstado;
  b.src  = estados[novoEstado];

  switch (novoEstado) {
    case 'normal':
      statusTxt.textContent = '● NORMAL';
      statusTxt.style.color = '#806040';
      b.classList.add('pulsando');
      break;
    case 'bravo':
      statusTxt.textContent = '⚠ COM FOME';
      statusTxt.style.color = '#cc4400';
      b.classList.add('tremendo');
      break;
    case 'comendo':
      statusTxt.textContent = '😋 COMENDO...';
      statusTxt.style.color = '#80b040';
      b.classList.add('comendo-anim');
      break;
    case 'morto':
      statusTxt.textContent = '✖ MORTO';
      statusTxt.style.color = '#555';
      criaturaWrap.classList.add('morta');
      break;
  }
}

function morrer() {
  clearInterval(intervalo);
  aplicarEstado('morto');
  overlay.classList.add('ativo');
  bandeja.style.display      = 'none';
  btnReiniciar.style.display = 'block';
  atualizarBarra();
}

function alimentar() {
  if (estado === 'morto') return;

  contador = 0;
  atualizarBarra();
  emitirParticulas();

  if (timeComendo) clearTimeout(timeComendo);
  aplicarEstado('comendo');

  timeComendo = setTimeout(() => {
    aplicarEstado('normal');
  }, TEMPO_COMENDO * 1000);
}

function atualizarBarra() {
  const pct = Math.max(0, 1 - contador / TEMPO_MORTO);
  barraFome.style.width = (pct * 100) + '%';

  if (pct > 0.5) {
    barraFome.style.background = 'linear-gradient(90deg, #ff4500, #ffaa00)';
  } else if (pct > 0.2) {
    barraFome.style.background = 'linear-gradient(90deg, #cc2200, #ff6600)';
  } else {
    barraFome.style.background = 'linear-gradient(90deg, #880000, #cc2200)';
  }
}

function emitirParticulas() {
  const icones = ['⚙', '🔩', '✨', '⚡'];
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className    = 'particula';
      p.textContent  = icones[Math.floor(Math.random() * icones.length)];
      p.style.left   = (160 + Math.random() * 100) + 'px';
      p.style.bottom = (180 + Math.random() * 60)  + 'px';
      tela.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }, i * 120);
  }
}

let arrastando = false;

slotComida.addEventListener('mousedown', (e) => {
  if (estado === 'morto') return;
  e.preventDefault();
  arrastando = true;

  slotComida.classList.add('invisivel');
  dragCloneImg.src = 'comida.png';
  dragClone.style.display = 'block';
  moverClone(e.clientX, e.clientY);

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup',   onMouseUp);
});

function onMouseMove(e) {
  moverClone(e.clientX, e.clientY);

  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top  && e.clientY <= rect.bottom;

  criaturaWrap.classList.toggle('drag-over', sobre);
}

function onMouseUp(e) {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup',   onMouseUp);

  dragClone.style.display = 'none';
  slotComida.classList.remove('invisivel');
  criaturaWrap.classList.remove('drag-over');
  arrastando = false;

  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top  && e.clientY <= rect.bottom;

  if (sobre) alimentar();
}

slotComida.addEventListener('touchstart', (e) => {
  if (estado === 'morto') return;
  e.preventDefault();
  const t = e.touches[0];
  slotComida.classList.add('invisivel');
  dragCloneImg.src = 'comida.png';
  dragClone.style.display = 'block';
  moverClone(t.clientX, t.clientY);
}, { passive: false });

slotComida.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  moverClone(t.clientX, t.clientY);

  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    t.clientX >= rect.left && t.clientX <= rect.right &&
    t.clientY >= rect.top  && t.clientY <= rect.bottom;
  criaturaWrap.classList.toggle('drag-over', sobre);
}, { passive: false });

slotComida.addEventListener('touchend', (e) => {
  e.preventDefault();
  const t = e.changedTouches[0];
  dragClone.style.display = 'none';
  slotComida.classList.remove('invisivel');
  criaturaWrap.classList.remove('drag-over');

  const rect = criaturaWrap.getBoundingClientRect();
  const sobre =
    t.clientX >= rect.left && t.clientX <= rect.right &&
    t.clientY >= rect.top  && t.clientY <= rect.bottom;
  if (sobre) alimentar();
}, { passive: false });

function moverClone(x, y) {
  dragClone.style.left = x + 'px';
  dragClone.style.top  = y + 'px';
}

btnReiniciar.addEventListener('click', iniciar);

iniciar();
