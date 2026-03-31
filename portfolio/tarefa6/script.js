const mainImage = document.getElementById('mainImage');
const avatarImg = document.getElementById('avatar-img');
const fomeBarra = document.getElementById('fome-barra');
const statusBadge = document.getElementById('status-badge');
const btnReiniciar = document.getElementById('btn-reiniciar');
const diaNoiteToggle = document.getElementById('dia-noite-toggle');

const imagens = {
    normal: 'Criatura/criatura.png',
    bravo: 'Criatura/criatura_brava.png',
    morto: 'Criatura/criatura_morta.png',
    comendo: 'Criatura/criatura_comendo.png',
    feliz: 'Criatura/criatura_alimentada.png'
};

const fundoDia = "background.png";
const fundoNoite = "background_noite.png";

const TEMPO_MORTE = 60; 
const TEMPO_BRAVO = 30; 

let contador = 0;
let estado = 'normal';
let intervaloVida = null;
let timeoutAcao = null;
let horas = 0;
let intervaloTempo = null;

function iniciar() {
    contador = 0;
    estado = 'normal';
    
    btnReiniciar.classList.add('hidden');
    atualizarUI();
    
    if (intervaloVida) clearInterval(intervaloVida);
    
    intervaloVida = setInterval(() => {
        if (estado === 'morto') return;
        
        contador++;
        atualizarUI();
        
        if (contador >= TEMPO_MORTE) {
            morrer();
        } else if (contador >= TEMPO_BRAVO && estado !== 'comendo') {
            aplicarEstado('bravo');
        }
    }, 1000);
}

function aplicarEstado(novoEstado) {
    if (estado === 'morto' && novoEstado !== 'normal') return;
    
    estado = novoEstado;
    mainImage.src = imagens[estado];
    avatarImg.src = imagens[estado];

    mainImage.classList.remove('pulsar', 'tremer', 'comer');
    
    switch (estado) {
        case 'normal':
            mainImage.classList.add('pulsar');
            statusBadge.textContent = 'Tranquilo';
            statusBadge.className = 'badge badge-ghost mt-2';
            break;
        case 'feliz':
            mainImage.classList.add('pulsar');
            statusBadge.textContent = 'Muito Feliz! ❤️';
            statusBadge.className = 'badge badge-success mt-2';
            break;
        case 'bravo':
            mainImage.classList.add('tremer');
            statusBadge.textContent = 'Com Fome!';
            statusBadge.className = 'badge badge-warning mt-2';
            break;
        case 'comendo':
            mainImage.classList.add('comer');
            statusBadge.textContent = 'Nham Nham...';
            statusBadge.className = 'badge badge-info mt-2';
            break;
        case 'morto':
            statusBadge.textContent = 'Morto';
            statusBadge.className = 'badge badge-error mt-2';
            break;
    }
}

function alimentar() {
    if (estado === 'morto') {

        iniciar();
        aplicarEstado('normal');
    }
    
    aplicarEstado('comendo');
    contador = 0; 
    atualizarUI();
    
    if (timeoutAcao) clearTimeout(timeoutAcao);
    
    timeoutAcao = setTimeout(() => {
        if (estado !== 'morto') {
            aplicarEstado('feliz');
        
            timeoutAcao = setTimeout(() => {
                if (estado !== 'morto') {
                    aplicarEstado('normal');
                }
            }, 3000);
        }
    }, 1500);
}

function morrer() {
    aplicarEstado('morto');
    btnReiniciar.classList.remove('hidden');
}

function atualizarUI() {
    const pct = Math.max(0, 100 - (contador / TEMPO_MORTE * 100));
    fomeBarra.value = pct;

    if (pct > 50) {
        fomeBarra.className = 'progress progress-primary w-32';
    } else if (pct > 20) {
        fomeBarra.className = 'progress progress-warning w-32';
    } else {
        fomeBarra.className = 'progress progress-error w-32';
    }
}

function atualizarFundo() {
    if (intervaloTempo) clearInterval(intervaloTempo);

    intervaloTempo = setInterval(() => {
        horas++;

        if (horas >= 12 && horas < 24) {
            document.body.style.backgroundImage = `url('${fundoNoite}')`;
            diaNoiteToggle.checked = true;
        } else {
            document.body.style.backgroundImage = `url('${fundoDia}')`;
            diaNoiteToggle.checked = false;
        }
        
        if (horas >= 24) horas = 0;
    }, 500); 
}

function alternarManual() {

    if (diaNoiteToggle.checked) {
        horas = 12;
        document.body.style.backgroundImage = `url('${fundoNoite}')`;
    } else {
        horas = 0;
        document.body.style.backgroundImage = `url('${fundoDia}')`;
    }
}

function mostrarEasterEgg() {
    document.getElementById('modal_gostosinho').showModal();
}

iniciar();
atualizarFundo();
