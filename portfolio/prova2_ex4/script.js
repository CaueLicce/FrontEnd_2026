function add() {

    var novoCard = document.createElement("div");
    novoCard.classList.add("grupo");

    novoCard.innerHTML = `
        <h2>Jogador</h2>
        <p><strong>Nome:</strong> Lucas Paquetá</p>
        <p><strong>Data:</strong> 27/08/1997</p>
        <p><strong>Altura:</strong> 1,80 m</p>
        <p><strong>Posição:</strong> Meio-campista</p>
        <p><strong>Rank:</strong> 8,8</p>
        <img src="img/Lucas_Paqueta.png" width="150">
    `;

    document.body.appendChild(novoCard);
}
