const suits = ["♥️", "♦️", "♣️", "♠️"];
let credits = 100;
let playerHand = [];
let holdCardsHand = [0, 0, 0, 0, 0]; // each boolean element to denote whether user has selected to hold the card; 0 to not hold, 1 to hold.
let deck = [];
let milliseconds = 0;
const delayInMilliseconds = 1000;

const getRandomIndex = (max) => Math.floor(Math.random() * max);

let gameStatusMessage = document.getElementById("gameStatusMessageId");
let creditMessage = document.getElementById("creditMessageId");

let payTable = {
  "Royal Flush": 800,
  "Straight Flush": 50,
  "Four of a kind": 25,
  "Full House": 9,
  Flush: 6,
  Straight: 4,
  "Three of a Kind": 3,
  "Two Pairs": 2,
  "Jacks or Better": 1,
  Nothing: -1,
};

const winCondition = () => {
  playerHand.sort((a, b) => a.rank - b.rank);
  let firstRank = playerHand[0].rank;
  let rankTally = {};
  for (let i = 0; i < 5; i += 1) {
    let rankOfCard = playerHand[i].rank;
    if (rankOfCard in rankTally) {
      rankTally[rankOfCard] += 1;
    } else {
      rankTally[rankOfCard] = 1;
    }
  }
  // put counts of same ranks in an array and sort them
  let uniqueRankCounters = [];
  for (rankOfCard in rankTally) {
    uniqueRankCounters.push(rankTally[rankOfCard]);
  }
  uniqueRankCounters.sort((a, b) => b - a);
  if (
    playerHand[0].suit === playerHand[1].suit &&
    playerHand[1].suit === playerHand[2].suit &&
    playerHand[2].suit === playerHand[3].suit &&
    playerHand[3].suit === playerHand[4].suit &&
    playerHand[4].suit === playerHand[0].suit
  ) {
    // check if Royal Flush
    if (
      playerHand[0].rank === 1 &&
      playerHand[1].rank === 10 &&
      playerHand[2].rank === 11 &&
      playerHand[3].rank === 12 &&
      playerHand[4].rank === 13
    ) {
      return "Royal Flush";
    } else {
      // check if Straight Flush
      if (
        playerHand[1].rank === firstRank + 1 &&
        playerHand[2].rank === firstRank + 2 &&
        playerHand[3].rank === firstRank + 3 &&
        playerHand[4].rank === firstRank + 4
      ) {
        return "Straight Flush";
      }
    }
  } else {
    // check for Four of a Kind
    if (uniqueRankCounters[0] === 4 && uniqueRankCounters[1] === 1) {
      return "Four of a kind";
    } // check for Full House
    else if (uniqueRankCounters[0] === 3 && uniqueRankCounters[1] === 2) {
      return "Full House";
    }
  } // check for Flush
  if (
    playerHand[0].suit === playerHand[1].suit &&
    playerHand[1].suit === playerHand[2].suit &&
    playerHand[2].suit === playerHand[3].suit &&
    playerHand[3].suit === playerHand[4].suit &&
    playerHand[4].suit === playerHand[0].suit
  ) {
    return "Flush";
  } // check for Straight - 2 cases
  else if (
    playerHand[1].rank === firstRank + 1 &&
    playerHand[2].rank === firstRank + 2 &&
    playerHand[3].rank === firstRank + 3 &&
    playerHand[4].rank === firstRank + 4
  ) {
    return "Straight";
  } else if (
    firstRank === 1 &&
    playerHand[1].rank === 10 &&
    playerHand[2].rank === 11 &&
    playerHand[3].rank === 12 &&
    playerHand[4].rank === 13
  ) {
    return "Straight";
  } // check for Three of a Kind
  else if (
    uniqueRankCounters[0] === 3 &&
    uniqueRankCounters[1] === 1 &&
    uniqueRankCounters[2] === 1
  ) {
    return "Three of a Kind";
  } // check for Two Pairs
  else if (
    uniqueRankCounters[0] === 2 &&
    uniqueRankCounters[1] === 2 &&
    uniqueRankCounters[2] === 1
  ) {
    return "Two Pairs";
  } // check for Jacks or Better
  else if (
    rankTally[11] === 2 ||
    rankTally[12] === 2 ||
    rankTally[13] === 2 ||
    rankTally[1] === 2
  ) {
    return "Jacks or Better";
  }
  return "Nothing";
};

function calcHandScore() {
  return payTable[winCondition()];
}

function getCard(i) {
  let cardId = "card" + String(i);
  return document.getElementById(cardId);
}

function getCardHoldIndicator(i) {
  let holdId = "hold" + String(i);
  return document.getElementById(holdId);
}

const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

const createDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    let cardColour = "black";
    if (suitIndex === 0 || suitIndex === 1) {
      cardColour = "red";
    }
    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let cardDisplayName = `${rankCounter}`;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === "1") {
        cardName = "ace";
        cardDisplayName = "A";
      } else if (cardName === "11") {
        cardName = "jack";
        cardDisplayName = "J";
      } else if (cardName === "12") {
        cardName = "queen";
        cardDisplayName = "Q";
      } else if (cardName === "13") {
        cardName = "king";
        cardDisplayName = "K";
      }

      // Create a new card with the current name, suit, and rank
      const cardInfo = {
        name: cardName,
        suit: currentSuit,
        displayName: cardDisplayName,
        colour: cardColour,
        rank: rankCounter,
      };
      // Add the new card to the deck
      newDeck.push(cardInfo);
    }
  }

  // Return the completed card deck
  return newDeck;
};

const holdCard = (i) => {
  let cardHoldIndicator = getCardHoldIndicator(i);
  if (actionBtn.innerText === "DRAW") {
    if (holdCardsHand[i] === 0) {
      holdCardsHand[i] = 1;
      cardHoldIndicator.innerText = "Hold";
      cardHoldIndicator.classList.add("holdIndicatorBackground");
    } else {
      holdCardsHand[i] = 0;
      cardHoldIndicator.innerText = "";
      cardHoldIndicator.classList = "holdIndicator";
    }
  }
};

const drawCards = () => {
  if (actionBtn.innerText === "DEAL") {
    for (let i = 0; i < 5; i += 1) {
      let cardDrawn = deck.pop();
      playerHand.push(cardDrawn);
      createCards(i);
    }
    actionBtn.innerText = "DRAW";
    gameStatusMessage.innerText = "Select cards to hold and then draw cards.";
  } else if (actionBtn.innerText === "DRAW") {
    for (let i = 0; i < 5; i += 1) {
      if (holdCardsHand[i] === 0) {
        let cardDrawn = deck.pop();
        playerHand[i] = cardDrawn;
        createCards(i);
      } else {
        holdCardsHand[i] = 0; // reset to default 0
      }
    }
    let score = calcHandScore();
    credits += score;
    creditMessage.innerText = "CREDITS: " + credits;
    if (winCondition() === "Nothing") {
      gameStatusMessage.innerText = "You lost this round.";
    } else {
      gameStatusMessage.innerText = winCondition();
    }
    const ref = setInterval(() => {
      if (milliseconds >= 3000) {
        if (actionBtn.innerText === "TRY AGAIN") {
          if (gameStatusMessage.innerText === "You lost this round.") {
            gameStatusMessage.innerText = "Better luck next time. Try again.";
          } else {
            gameStatusMessage.innerText = "Play again?";
          }
        }
        clearInterval(ref);
      }
      milliseconds += 1000;
    }, delayInMilliseconds);
    actionBtn.innerText = "TRY AGAIN";
  } else if (actionBtn.innerText === "TRY AGAIN") {
    actionBtn.innerText = "DEAL";
    initGame();
  }
};

const createCards = (i) => {
  let cardAtPosition = getCard(i);
  cardAtPosition.innerHTML = "";
  cardAtPosition.classList = "filledCard";

  const suit = document.createElement("div");
  suit.classList.add("suitCSS", playerHand[i].colour);
  suit.innerText = playerHand[i].suit;

  const name = document.createElement("div");
  name.classList.add("nameCSS", playerHand[i].colour);
  name.innerText = playerHand[i].displayName;

  cardAtPosition.append(suit, name);
  cardAtPosition.addEventListener("click", () => holdCard(i));
};

let payTableModal = document.getElementById("modal-body");
let payTableInfo = document.createElement("table");
let thead = document.createElement("thead");
let tbody = document.createElement("tbody");
payTableInfo.appendChild(thead);
payTableInfo.appendChild(tbody);
payTableModal.appendChild(payTableInfo);

let headingRow = document.createElement("tr");
let heading1 = document.createElement("th");
heading1.innerText = "Poker Hand";
let heading2 = document.createElement("th");
heading2.innerText = "Score";
headingRow.append(heading1, heading2);
thead.append(headingRow);

for (i in payTable) {
  const conditionRow = document.createElement("tr");
  const pokerCondition = document.createElement("td");
  const pokerHandScore = document.createElement("td");
  pokerCondition.innerText = i;
  pokerHandScore.innerText = payTable[i];
  conditionRow.append(pokerCondition, pokerHandScore);
  tbody.appendChild(conditionRow);
}
payTableModal.style.display = "block";

const actionBtn = document.getElementById("actionBtn");
actionBtn.addEventListener("click", drawCards);

function initGame() {
  for (let i = 0; i < 5; i += 1) {
    let cardAtPosition = getCard(i);
    cardAtPosition.classList = "emptyCard";
    cardAtPosition.innerHTML = "";
    let cardHoldIndicator = getCardHoldIndicator(i);
    cardHoldIndicator.classList = "holdIndicator";
    cardHoldIndicator.innerText = "";
  }
  creditMessage.innerText = "CREDITS: " + credits;
  gameStatusMessage.innerHTML = "Press deal to start.";
  actionBtn.innerText = "DEAL";
  deck = shuffleCards(createDeck());
  playerHand = [];
}

initGame();
