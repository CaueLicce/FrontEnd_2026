function revelar() {

    document.getElementById("imgJogador").src = "img/_vinicius_junior.png";

    document.getElementById("nome").innerText =
        "Vinícius José Paixão de Oliveira Júnior";

    document.getElementById("data").innerText =
        "12/07/2000 (25 anos)";

    document.getElementById("altura").innerText =
        "1,76 m";

    document.getElementById("posicao").innerText =
        "Ponta-esquerda / Atacante";

    document.getElementById("rank").innerText =
        "9,5";

    var elementos = document.querySelectorAll(".placeholder");

    elementos.forEach(function(el) {
        el.classList.remove("placeholder");
        el.classList.add("card-text");
    });
}
