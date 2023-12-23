// O state guarda tudo que será manipulado no jogo. Ele é um objeto que guarda outros objetos.
const state = { 
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

// Definindo o caminho das imagens em uma constante para ser chamado por interpolação de strings
const pathImages = "./src/assets/icons/"

// Enumerando as cartas do jogo para recupera-las depois
const cardData = [ 
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];

// Função que sorteia ID das cartas
async function getRandomCardId() { 
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) { /* id: de qual id a img sera resgatada / fieldside: em que lado do campo ela ficará */
    const cardImage = document.createElement("img"); /* Criando um elemento dinamicamente que tem como classe "img" */
    cardImage.setAttribute("height", "100px"); /* Criando um atributo para aquele mesmo elemento e estilizando ele */
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png"); /* Setando a imagem da parte de tras da carta que encobre ela */
    cardImage.setAttribute("data-id", IdCard); /* Salvando o id da carta */
    cardImage.classList.add("card"); /* Criando uma classe para estilizar no css */

    if(fieldSide === state.playerSides.player1) { /* Só posso clicar e abrir esta carta se ela estiver do meu lado (player) */
        cardImage.addEventListener("mouseover", () => { /* Essa função vai mostrar a sua carta do lado esquerdo da tela quando voce passar o mouse em cima das suas proprias cartas */
            drawSelectedCard(IdCard);
        });

        cardImage.addEventListener("click", () => { /* essa função vai esperar o evento de clique para setar a carta no versus */
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }

    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsImages();

    // Sorteia uma carta aleatória para o computador
    let computerCardId = await getRandomCardId(); 

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    // Setando visualmente as duas cartas escolhidas por cada um
    state.fieldCards.player.src = cardData[cardId].img; 
    state.fieldCards.computer.src = cardData[computerCardId].img;

    // Checa o resultado comparando o id de uma carta com a outra 
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

// Atualizando o score visualmente 
async function updateScore() { 
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore} `
}

// Exibe o botão de ganhou ou perdeu
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

// Função que verifica quem venceu o duelo
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW"
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = "WIN"; /* O nome que está aqui tem que ser o mesmo do audio */
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "LOSE";
        state.score.computerScore++;
    }

    await playAudio(duelResults)

    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBOX, player1BOX } = state.playerSides; /* Recuperando cards na memória */
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    imgElements = computerBOX.querySelectorAll("img") /* Pegando cada uma das imagens */
    imgElements.forEach((img) => img.remove()); /* Removendo elas */
}

// Função para desenhar a carta no painel esquerdo quando o mouse estiver encima
async function drawSelectedCard(index) { 
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) { /* Quantas e para quem são as cartas */
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId(); /* Pegando uma carta aleatoria */
        const cardImage = await createCardImage(randomIdCard, fieldSide); 

        /* Pegando qual lado está chamando e pendurando a carta deste lado */
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

//
async function resetDuel() {
    state.cardSprites.avatar.src = "" /* Deixando sem carta á esquerda */
    state.actions.button.style.display = "none"; /* Escondendo o botão */

    state.fieldCards.player.style.display = "none"; /* Sumindo com as cartas */
    state.fieldCards.computer.style.display = "none";

    init();
}

// Função que toca os audios 
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try {         /* Tratamento de erro caso não encontre o audio */
        audio.play();
    } catch {}

    audio.play();
}

function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();