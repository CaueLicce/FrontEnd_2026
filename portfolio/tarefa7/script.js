function validarCPF() {

    const input = document
        .getElementById('cpf-input')
        .value
        .replace(/\D/g, '');

    const el = document.getElementById('cpf-resultado');

    el.style.display = 'block';

    if (input.length !== 11 || /^(\d)\1{10}$/.test(input)) {

        el.className = 'resultado invalido';
        el.textContent = '✗ CPF inválido.';
        return;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(input[i]) * (10 - i);
    }

    let d1 = (soma * 10) % 11;

    if (d1 === 10) {
        d1 = 0;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(input[i]) * (11 - i);
    }

    let d2 = (soma * 10) % 11;

    if (d2 === 10) {
        d2 = 0;
    }

    if (d1 === Number(input[9]) && d2 === Number(input[10])) {

        el.className = 'resultado valido';
        el.textContent = '✓ CPF válido!';

    } else {

        el.className = 'resultado invalido';
        el.textContent = '✗ CPF inválido.';
    }
}

function converterCelsius() {

    const c = parseFloat(document.getElementById('celsius').value);

    document.getElementById('fahrenheit').value =
        isNaN(c)
            ? ''
            : ((c * 9 / 5) + 32).toFixed(2);
}

function converterFahrenheit() {

    const f = parseFloat(document.getElementById('fahrenheit').value);

    document.getElementById('celsius').value =
        isNaN(f)
            ? ''
            : ((f - 32) * 5 / 9).toFixed(2);
}

document
    .getElementById('btn-media')
    .addEventListener('click', function () {

        const nome =
            document.getElementById('aluno-nome').value.trim()
            || 'Aluno';

        const n1 = Number(document.getElementById('nota1').value);
        const n2 = Number(document.getElementById('nota2').value);
        const n3 = Number(document.getElementById('nota3').value);

        const media = (n1 + n2 + n3) / 3;

        const el = document.getElementById('media-resultado');

        el.style.display = 'block';

        if (media >= 7) {

            el.className = 'resultado info';

            el.textContent =
                `✓ ${nome} — Média: ${media.toFixed(2)} → APROVADO`;

        } else if (media >= 4) {

            const falta = (10 - media).toFixed(2);

            el.className = 'resultado valido';

            el.textContent =
                `⚠ ${nome} — Média: ${media.toFixed(2)} → EXAME`;

        } else {

            el.className = 'resultado invalido';

            el.textContent =
                `✗ ${nome} — Média: ${media.toFixed(2)} → REPROVADO`;
        }
    });

function calcularTaxas() {

    const venda =
        parseFloat(document.getElementById('valor-venda').value) || 0;

    const parcelas =
        parseInt(document.getElementById('parcelas').value) || 1;

    const bandeira =
        document.getElementById('bandeira').value;

    let percentualBandeira;

    switch (bandeira) {

        case 'visa':
            percentualBandeira = 0.02;
            break;

        case 'master':
            percentualBandeira = 0.0185;
            break;

        case 'elo':
            percentualBandeira = 0.03;
            break;
    }

    const valorTaxa = venda * percentualBandeira;
    const valorJuros = venda * (0.0035 * parcelas);
    const taxaMensal = 12.50 * parcelas;

    const valorTotal =
        venda + valorTaxa + valorJuros + taxaMensal;

    const valorParc = valorTotal / parcelas;

    const fmt = v => 'R$ ' + v.toFixed(2).replace('.', ',');

    document.getElementById('r-taxa').textContent =
        fmt(valorTaxa);

    document.getElementById('r-juros').textContent =
        fmt(valorJuros);

    document.getElementById('r-mensal').textContent =
        fmt(taxaMensal);

    document.getElementById('r-total').textContent =
        fmt(valorTotal);

    document.getElementById('r-parcela').textContent =
        `${parcelas}x ${fmt(valorParc)}`;

    document.getElementById('bank-resultado').style.display =
        'block';
}

function adicionarConvidado() {

    const input = document.getElementById('convidado-input');
    const nome = input.value.trim();

    if (!nome) return;

    document.getElementById('lista-vazia')?.remove();

    const lista = document.getElementById('lista-convidados');

    const li = document.createElement('li');

    li.className = 'convidado-item';

    li.innerHTML = `
        <span class="convidado-nome">${nome}</span>

        <div class="btns-convidado">
            <button onclick="concluirConvidado(this)">
                ✓
            </button>

            <button onclick="editarConvidado(this)">
                ✎
            </button>

            <button onclick="excluirConvidado(this)">
                ✕
            </button>
        </div>
    `;

    lista.appendChild(li);

    input.value = '';
}

function concluirConvidado(btn) {

    btn.closest('.convidado-item')
        .querySelector('.convidado-nome')
        .classList.toggle('chegou');
}

function editarConvidado(btn) {

    const nomeEl =
        btn.closest('.convidado-item')
        .querySelector('.convidado-nome');

    const novoNome =
        prompt('Novo nome:', nomeEl.textContent);

    if (novoNome && novoNome.trim()) {
        nomeEl.textContent = novoNome.trim();
    }
}

function excluirConvidado(btn) {

    const li = btn.closest('.convidado-item');

    const lista =
        document.getElementById('lista-convidados');

    li.remove();

    if (!lista.querySelector('.convidado-item')) {

        const vazio = document.createElement('li');

        vazio.id = 'lista-vazia';
        vazio.className = 'lista-vazia';

        vazio.textContent =
            'Nenhum convidado adicionado ainda.';

        lista.appendChild(vazio);
    }
}
