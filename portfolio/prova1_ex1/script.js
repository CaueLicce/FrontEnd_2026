function mostrarImagem() {
    var div = document.getElementById("resultado");

    var img = document.createElement("img");
    img.src = "img/tabela.png"; // caminho da imagem (ajuste se necessário)
    img.width = 500;

    div.appendChild(img);
}
