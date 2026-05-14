function validarCPF(){

    const input = document
        .getElementById('cpf-input')
        .value
        .replace(/\D/g,'');

    const el = document.getElementById('cpf-resultado');

    if(input.length !== 11){

        el.innerHTML = `
            <div class="erro">
                CPF inválido
            </div>
        `;

        return;
    }

    el.innerHTML = `
        <div class="sucesso">
            CPF válido
        </div>
    `;
}

function converterCelsius(){

    const c = parseFloat(
        document.getElementById('celsius').value
    );

    document.getElementById('fahrenheit').value =
        isNaN(c)
        ? ''
        : ((c * 9/5) + 32).toFixed(2);
}

function converterFahrenheit(){

    const f = parseFloat(
        document.getElementById('fahrenheit').value
    );

    document.getElementById('celsius').value =
        isNaN(f)
        ? ''
        : ((f - 32) * 5/9).toFixed(2);
}

function calcularMedia(){

    const nome =
        document.getElementById('aluno-nome').value;

    const n1 =
        Number(document.getElementById('nota1').value);

    const n2 =
        Number(document.getElementById('nota2').value);

    const n3 =
        Number(document.getElementById('nota3').value);

    const media = (n1+n2+n3)/3;

    const el = document.getElementById('media-resultado');

    if(media >= 7){

        el.innerHTML = `
            <div class="sucesso">
                ${nome} aprovado com média ${media.toFixed(2)}
            </div>
        `;

    }else if(media >= 4){

        el.innerHTML = `
            <div>
                ${nome} em exame com média ${media.toFixed(2)}
            </div>
        `;

    }else{

        el.innerHTML = `
            <div class="erro">
                ${nome} reprovado com média ${media.toFixed(2)}
            </div>
        `;
    }
}

function calcularTaxas(){

    const venda =
        Number(document.getElementById('valor-venda').value);

    const parcelas =
        Number(document.getElementById('parcelas').value);

    const bandeira =
        document.getElementById('bandeira').value;

    let taxa = 0;

    switch(bandeira){

        case 'visa':
            taxa = 0.02;
            break;

        case 'master':
            taxa = 0.0185;
            break;

        case 'elo':
            taxa = 0.03;
            break;
    }

    const valorTaxa = venda * taxa;
    const juros = venda * (0.0035 * parcelas);
    const mensal = 12.50 * parcelas;
    const total = venda + valorTaxa + juros + mensal;

    document.getElementById('bank-resultado').innerHTML = `
        <div class="resultado-item">
            Taxa: R$ ${valorTaxa.toFixed(2)}
        </div>

        <div class="resultado-item">
            Juros: R$ ${juros.toFixed(2)}
        </div>

        <div class="resultado-item">
            Total: R$ ${total.toFixed(2)}
        </div>
    `;
}

function adicionarConvidado(){

    const input =
        document.getElementById('convidado-input');

    const nome = input.value.trim();

    if(!nome) return;

    const lista =
        document.getElementById('lista-convidados');

    const li = document.createElement('li');

    li.className = 'convidado-item';

    li.innerHTML = `
        <span>${nome}</span>

        <div>

            <button onclick="concluirConvidado(this)">
                ✔
            </button>

            <button onclick="editarConvidado(this)">
                ✏
            </button>

            <button onclick="excluirConvidado(this)">
                ❌
            </button>

        </div>
    `;

    lista.appendChild(li);

    input.value = '';
}

function concluirConvidado(btn){

    btn.parentElement
       .previousElementSibling
       .classList.toggle('chegou');
}

function editarConvidado(btn){

    const span =
        btn.parentElement.previousElementSibling;

    const novoNome =
        prompt('Novo nome:', span.textContent);

    if(novoNome){
        span.textContent = novoNome;
    }
}

function excluirConvidado(btn){

    btn.parentElement.parentElement.remove();
}

function calcularEvento(){

    const pacote =
        Number(document.getElementById('pacote').value);

    const pessoas =
        Number(document.getElementById('pessoas').value);

    const base = pacote * pessoas;
    const taxa = base * 0.10;

    let total = base + taxa;
    let desconto = 0;

    if(pessoas > 100){

        desconto = total * 0.05;
        total -= desconto;
    }

    document.getElementById('resultado-evento').innerHTML = `
        <div class="resultado-item">
            Valor Base: R$ ${base.toFixed(2)}
        </div>

        <div class="resultado-item">
            Taxa: R$ ${taxa.toFixed(2)}
        </div>

        <div class="resultado-item">
            Desconto: R$ ${desconto.toFixed(2)}
        </div>

        <div class="resultado-item sucesso">
            Total Final: R$ ${total.toFixed(2)}
        </div>
    `;
}

function algoritmoLuhn(numero){

    let soma = 0;
    let alternar = false;

    for(let i = numero.length - 1; i >= 0; i--){

        let n = parseInt(numero[i]);

        if(alternar){

            n *= 2;

            if(n > 9){
                n -= 9;
            }
        }

        soma += n;

        alternar = !alternar;
    }

    return soma % 10 === 0;
}

function validarCartao(){

    const numero =
        document.getElementById('cartao')
        .value
        .replace(/\D/g,'');

    const resultado =
        document.getElementById('resultado-cartao');

    if(numero.length < 13 || numero.length > 16){

        resultado.innerHTML = `
            <div class="erro">
                Cartão inválido
            </div>
        `;

        return;
    }

    const valido = algoritmoLuhn(numero);

    let bandeira = 'Desconhecida';

    if(numero.startsWith('4')){
        bandeira = 'Visa';
    }

    if(/^5[1-5]/.test(numero)){
        bandeira = 'Mastercard';
    }

    resultado.innerHTML = `
        <div class="resultado-item">
            Status:
            <strong class="${valido ? 'sucesso' : 'erro'}">
                ${valido ? 'Válido' : 'Inválido'}
            </strong>
        </div>

        <div class="resultado-item">
            Bandeira: ${bandeira}
        </div>
    `;
}
