function validarCPF() {
    const input = document.getElementById('cpf-input').value.replace(/\D/g, '');
    const el = document.getElementById('cpf-resultado');
    el.classList.add('ativo');

    if (input.length !== 11 || /^(\d)\1{10}$/.test(input)) {
        el.innerHTML = '<div class="erro">✗ CPF inválido.</div>';
        return;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += Number(input[i]) * (10 - i);
    let d1 = (soma * 10) % 11;
    if (d1 === 10) d1 = 0;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += Number(input[i]) * (11 - i);
    let d2 = (soma * 10) % 11;
    if (d2 === 10) d2 = 0;

    if (d1 === Number(input[9]) && d2 === Number(input[10])) {
        el.innerHTML = '<div class="sucesso">✓ CPF válido!</div>';
    } else {
        el.innerHTML = '<div class="erro">✗ CPF inválido.</div>';
    }
}

document.getElementById('cpf-input').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    this.value = v;
});

function converterCelsius() {
    const c = parseFloat(document.getElementById('celsius').value);
    document.getElementById('fahrenheit').value = isNaN(c) ? '' : ((c * 9 / 5) + 32).toFixed(2);
}

function converterFahrenheit() {
    const f = parseFloat(document.getElementById('fahrenheit').value);
    document.getElementById('celsius').value = isNaN(f) ? '' : ((f - 32) * 5 / 9).toFixed(2);
}

function calcularMedia() {
    const nome  = document.getElementById('aluno-nome').value.trim() || 'Aluno';
    const n1    = Number(document.getElementById('nota1').value);
    const n2    = Number(document.getElementById('nota2').value);
    const n3    = Number(document.getElementById('nota3').value);
    const media = (n1 + n2 + n3) / 3;
    const el    = document.getElementById('media-resultado');
    el.classList.add('ativo');

    if (media >= 7) {
        el.innerHTML = `<div class="sucesso">✓ ${nome} — Média: ${media.toFixed(2)} — APROVADO</div>`;
    } else if (media >= 4) {
        el.innerHTML = `<div class="info">⚠ ${nome} — Média: ${media.toFixed(2)} — EXAME<br>Faltam ${(10 - media).toFixed(2)} pontos para 10.</div>`;
    } else {
        el.innerHTML = `<div class="erro">✗ ${nome} — Média: ${media.toFixed(2)} — REPROVADO</div>`;
    }
}

function calcularTaxas() {
    const venda    = parseFloat(document.getElementById('valor-venda').value) || 0;
    const parcelas = parseInt(document.getElementById('parcelas').value)       || 1;
    const bandeira = document.getElementById('bandeira').value;
    let pct;
    switch (bandeira) {
        case 'visa':   pct = 0.02;   break;
        case 'master': pct = 0.0185; break;
        case 'elo':    pct = 0.03;   break;
    }
    const taxa    = venda * pct;
    const juros   = venda * (0.0035 * parcelas);
    const mensal  = 12.50 * parcelas;
    const total   = venda + taxa + juros + mensal;
    const fmt     = v => 'R$ ' + v.toFixed(2).replace('.', ',');
    const el      = document.getElementById('bank-resultado');
    el.classList.add('ativo');
    el.innerHTML  = `
        <div class="resultado-item">Taxa da bandeira: <strong>${fmt(taxa)}</strong></div>
        <div class="resultado-item">Juros: <strong>${fmt(juros)}</strong></div>
        <div class="resultado-item">Taxa mensal: <strong>${fmt(mensal)}</strong></div>
        <div class="resultado-item">Total: <strong>${fmt(total)}</strong></div>
        <div class="resultado-item sucesso">${parcelas}x de <strong>${fmt(total / parcelas)}</strong></div>`;
}

function adicionarConvidado() {
    const input = document.getElementById('convidado-input');
    const nome  = input.value.trim();
    if (!nome) return;

    const lista  = document.getElementById('lista-convidados');
    const vazio  = lista.querySelector('.lista-vazia');
    if (vazio) vazio.remove();

    const li = document.createElement('li');
    li.className = 'convidado-item';
    li.innerHTML = `
        <span>${nome}</span>
        <div>
            <button onclick="concluirConvidado(this)">✔</button>
            <button onclick="editarConvidado(this)">✏</button>
            <button onclick="excluirConvidado(this)">✕</button>
        </div>`;
    lista.appendChild(li);
    input.value = '';
    input.focus();
}

function concluirConvidado(btn) {
    btn.parentElement.previousElementSibling.classList.toggle('chegou');
}

function editarConvidado(btn) {
    const span = btn.parentElement.previousElementSibling;
    const novo = prompt('Novo nome:', span.textContent);
    if (novo && novo.trim()) span.textContent = novo.trim();
}

function excluirConvidado(btn) {
    const li    = btn.closest('.convidado-item');
    const lista = document.getElementById('lista-convidados');
    li.remove();
    if (!lista.querySelector('.convidado-item')) {
        const vazio = document.createElement('li');
        vazio.className   = 'lista-vazia';
        vazio.textContent = 'Nenhum convidado adicionado ainda.';
        lista.appendChild(vazio);
    }
}

function calcularEvento() {
    const pacote  = Number(document.getElementById('pacote').value);
    const pessoas = Number(document.getElementById('pessoas').value);
    const base    = pacote * pessoas;
    const taxa    = base * 0.10;
    let total     = base + taxa;
    let desconto  = 0;
    if (pessoas > 100) { desconto = total * 0.05; total -= desconto; }
    const fmt = v => 'R$ ' + v.toFixed(2).replace('.', ',');
    const el  = document.getElementById('resultado-evento');
    el.classList.add('ativo');
    el.innerHTML = `
        <div class="resultado-item">Valor base: <strong>${fmt(base)}</strong></div>
        <div class="resultado-item">Taxa (10%): <strong>${fmt(taxa)}</strong></div>
        <div class="resultado-item">Desconto (>100 pessoas): <strong>${fmt(desconto)}</strong></div>
        <div class="resultado-item sucesso">Total final: <strong>${fmt(total)}</strong></div>`;
}

document.getElementById('cartao').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(.{4})/g, '$1 ').trim();
    this.value = v;
});

function algoritmoLuhn(numero) {
    let soma = 0, alt = false;
    for (let i = numero.length - 1; i >= 0; i--) {
        let n = parseInt(numero[i]);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        soma += n;
        alt = !alt;
    }
    return soma % 10 === 0;
}

function validarCartao() {
    const numero    = document.getElementById('cartao').value.replace(/\D/g, '');
    const el        = document.getElementById('resultado-cartao');
    el.classList.add('ativo');

    if (numero.length < 13 || numero.length > 16) {
        el.innerHTML = '<div class="erro">✗ Número de cartão inválido.</div>';
        return;
    }

    const valido  = algoritmoLuhn(numero);
    let bandeira  = 'Desconhecida';
    if (numero.startsWith('4'))         bandeira = 'Visa';
    if (/^5[1-5]/.test(numero))        bandeira = 'Mastercard';
    if (/^(636368|438935)/.test(numero)) bandeira = 'Elo';

    el.innerHTML = `
        <div class="resultado-item">Status: <strong class="${valido ? 'sucesso' : 'erro'}">${valido ? '✓ Válido' : '✗ Inválido'}</strong></div>
        <div class="resultado-item">Bandeira: <strong>${bandeira}</strong></div>`;
}
