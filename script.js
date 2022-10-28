const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Array de imagenes
const items = [
  { name: "Abeja", image: "./imagenes/Abeja.png" },
  { name: "Cocodrilo", image: "./imagenes/Cocodrilo.png" },
  { name: "Guacamaya", image: "./imagenes/Guacamaya.png" },
  { name: "Gorilla", image: "./imagenes/Gorilla.png" },
  { name: "Tigre", image: "./imagenes/Tigre.png" },
  { name: "Mono", image: "./imagenes/Mono.png" },
  { name: "Camaleon", image: "./imagenes/Camaleon.png" },
  { name: "Pirana", image: "./imagenes/Pirana.png" },
  { name: "Anaconda", image: "./imagenes/Anaconda.png" },
  { name: "Perezoso", image: "./imagenes/Perezoso.png" },
  { name: "Cacatua", image: "./imagenes/Cacatua.png" },
  { name: "Tucan", image: "./imagenes/Tucan.png" },
];

//Se inicia lo que es el tiempo
let seconds = 0,
  minutes = 0;
//Se inicia lo que es los movimientos 
let movesCount = 0,
  winCount = 0;

//Contador
const timeGenerator = () => {
  seconds += 1;
  //Minutos
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //Contador de el tiempo que pasa
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Tiempo:</span>${minutesValue}:${secondsValue}`;
};

//Calculando los movimientos
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Movimientos:</span>${movesCount}`;
};

//Acomodar las imagenes de forma aleatoria
const generateRandom = (size = 4) => {
  //Temporal de array
  let tempArray = [...items];
  let cardValues = [];
  //Aqui se pone lo que es el tamaño de como esta acomodado de 4x4
  size = (size * size) / 2;
  //Se seleciona de forma aleatoria los objetos
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //Se barajea 
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Columnas
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Carta
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Si a carta no coincide con la imagen ignorara el click
      if (!card.classList.contains("matched")) {
        //Voltea la carta que escogiste
        card.classList.add("flipped");
        //una condicional de la primera carta
        if (!firstCard) {
          //Se convertira en la primera carta
          firstCard = card;
          //Se convierte en la primera carta
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //Se incrementa e contador con los movimientos
          movesCounter();
          //Segunda carta y se evalua
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //Si coinciden las imagenes se ignorara la proxima vez que los clickes
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard.style.background = "green"
            firstCard.style.padding = "8px"
            secondCard.style.background = "green"
            secondCard.style.padding = "8px"
            //Con esto hara que ahora sera la primera carta
            firstCard = false;
            //El contador hara que incremente cada vez que coincidan 
            winCount += 1;
            //Aqui se compueba las veces que coincidio con las cartas
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Has Ganado!</h2>
            <h4>Movimientos: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //Si las cartas no coinciden
            //Vuelven a la normalidad
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard.style.background = "red"
            firstCard.style.padding = "8px"
            secondCard.style.background = "red"
            secondCard.style.padding = "8px"
            
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");

              tempFirst.style.background = "white"
              tempFirst.style.padding = "0px"
              tempSecond.style.background = "white"
              tempSecond.style.padding = "0px"
            }, 900);
          }
        }
      }
    });
  });
};

//Empezar el juego
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //Aqui se esconden los elementos
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Emepezar el tiempo
  interval = setInterval(timeGenerator, 1000);
  //Inicia los movimientos
  moves.innerHTML = `<span>Movimientos:</span> ${movesCount}`;
  initializer();
});

//Parar el juego
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Inicia las funciones y valores
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};