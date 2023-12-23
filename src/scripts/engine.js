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
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
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
        img: `${pathImages}blue-eyes-white-dragon.png`,
        WinOf: [1, 4, 7, 10],
        LoseOf: [2, 5, 8, 11],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}dark-magician.png`,
        WinOf: [2, 5, 8, 11],
        LoseOf: [0, 3, 6, 9],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0, 3, 6, 9],
        LoseOf: [1, 4, 7, 10],
    },
    {
        id: 3,
        name: "Winged Dragon of Ra",
        type: "Paper",
        img: `${pathImages}winged-dragon-of-ra.png`,
        WinOf: [1, 4, 7, 10],
        LoseOf: [2, 5, 8, 11],
    },
    {
        id: 4,
        name: "Slifer, The Sky Dragon",
        type: "Rock",
        img: `${pathImages}slifer-the-sky-dragon.jpg`,
        WinOf: [2, 5, 8, 11],
        LoseOf: [0, 3, 6, 9],
    },
    {
        id: 5,
        name: "Obelisk, the Tormentor",
        type: "Scissors",
        img: `${pathImages}obelisk-the-tormentor.jpg`,
        WinOf: [0, 3, 6, 9],
        LoseOf: [1, 4, 7, 10],
    },
    {
        id: 6,
        name: "Horakhty, Creator of Light",
        type: "Paper",
        img: `${pathImages}horakhty-creator-of-light.png`,
        WinOf: [1, 4, 7, 10],
        LoseOf: [2, 5, 8, 11],
    },
    {
        id: 7,
        name: "Raviel, Lord of Phantasms",
        type: "Rock",
        img: `${pathImages}raviel-lord-of-phantasms.png`,
        WinOf: [2, 5, 8, 11],
        LoseOf: [0, 3, 6, 9],
    },
    {
        id: 8,
        name: "Rainbow Dragon",
        type: "Scissors",
        img: `${pathImages}rainbow-dragon.png`,
        WinOf: [0, 3, 6, 9],
        LoseOf: [1, 4, 7, 10],
    },
    {
        id: 9,
        name: "Hamon Lord of Striking Thunder",
        type: "Paper",
        img: `${pathImages}hamon-lord-of-striking-thunder.png`,
        WinOf: [1, 4, 7, 10],
        LoseOf: [2, 5, 8, 11],
    },
    {
        id: 10,
        name: "Uria Lord of Searing Flames",
        type: "Rock",
        img: `${pathImages}uria-lord-of-searing-flames.jpg`,
        WinOf: [2, 5, 8, 11],
        LoseOf: [0, 3, 6, 9],
    },
    {
        id: 11,
        name: "Armtyle The Chaos Phantom",
        type: "Scissors",
        img: `${pathImages}amtyle-the-chaos-phantom.png`,
        WinOf: [0, 3, 6, 9],
        LoseOf: [1, 4, 7, 10],
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
    cardImage.setAttribute("src", pathImages + "card-back.png"); /* Setando a imagem da parte de tras da carta que encobre ela */
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

    await showHiddenCardsFieldsImages(true);
    await hiddenCardDetails();
    await drawCardsInFields(cardId, computerCardId); // Setando visualmente as duas cartas escolhidas por cada um

    // Checa o resultado comparando o id de uma carta com a outra 
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInFields(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
  }
  
async function showHiddenCardsFieldsImages(value) {
    if(value === true) {
        state.fieldCards.player.style.display="block";
        state.fieldCards.computer.style.display="block";
    } 

    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

//Criando função que reseta campos de detalhe das cartas do lado esquerdo
async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

// Exibe o botão de ganhou ou perdeu
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

// Atualizando o score visualmente 
async function updateScore() { 
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

// Função que verifica quem venceu o duelo
async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];
  
    if (playerCard.WinOf.includes(computerCardId)) {
      duelResults = "win";
      state.score.playerScore++;
    }
  
    if (playerCard.LoseOf.includes(computerCardId)) {
      duelResults = "lose";
      state.score.computerScore++;
    }
  
    await playAudio(duelResults);
  
    return duelResults;
  }

async function removeAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides; /* Recuperando cards na memória */

    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img") /* Pegando cada uma das imagens */
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
    showHiddenCardsFieldsImages(false);

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();