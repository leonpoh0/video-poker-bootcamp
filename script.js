const suits = ["♥️", "♦️", "♣️", "♠️"];
let credits = 100;
let playerHand = [];
let holdCardsHand = [0, 0, 0, 0, 0]; // each boolean element to denote whether user has selected to hold the card; 0 to not hold, 1 to hold.
let deck = [];
let milliseconds = 0;
const delayInMilliseconds = 1000;

const getRandomIndex = (max) => Math.floor(Math.random() * max);

let matchPattern = document.createElement("p");
matchPattern.classList = "gameStatusMessage";
document.body.appendChild(matchPattern);

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
        return 50;
      } else if (
        firstRank === 1 &&
        playerHand[1].rank === 10 &&
        playerHand[2].rank === 11 &&
        playerHand[3].rank === 12 &&
        playerHand[4].rank === 13
      ) {
        return "Straight Flush";
      }
    }
  } else {
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
    // check for Four of a Kind
    if (uniqueRankCounters[0] === 4 && uniqueRankCounters[1] === 1) {
      return "Four of a kind";
    } // check for Full House
    else if (uniqueRankCounters[0] === 3 && uniqueRankCounters[1] === 2) {
      return "Full House";
    } // check for Flush
    else if (
      playerHand[0].suit === playerHand[1].suit &&
      playerHand[1].suit === playerHand[2].suit &&
      playerHand[2].suit === playerHand[3].suit &&
      playerHand[3].suit === playerHand[4].suit &&
      playerHand[4].suit === playerHand[0].suit
    ) {
      return "Flush";
    } // check for Straight
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
      return 4;
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
      rankOfCard[11] === 2 ||
      rankOfCard[12] === 2 ||
      rankOfCard[13] === 2 ||
      rankOfCard[1] === 2
    ) {
      return "Jacks or Better";
    }
  }
  return "Nothing";
};

function calcHandScore() {
  return payTable[winCondition()];
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

const holdCard = (i, holdIndicator) => {
  if (playerBtn.innerText === "DRAW") {
    if (holdCardsHand[i] === 0) {
      holdCardsHand[i] = 1;
      holdIndicator.innerText = "Hold";
    } else {
      holdCardsHand[i] = 0;
      holdIndicator.innerText = "";
    }
  }
};

const drawCards = () => {
  if (playerBtn.innerText === "DEAL") {
    for (let i = 0; i < 5; i += 1) {
      let cardDrawn = deck.pop();
      playerHand.push(cardDrawn);
    }
    playerBtn.innerText = "DRAW";
    matchPattern.innerText = "Select cards to hold and then draw cards.";
    createCards();
  } else if (playerBtn.innerText === "DRAW") {
    for (let i = 0; i < 5; i += 1) {
      if (holdCardsHand[i] === 0) {
        let cardDrawn = deck.pop();
        playerHand[i] = cardDrawn;
      } else {
        holdCardsHand[i] = 0; // reset to default 0
      }
      createCards();
    }
    let score = calcHandScore();
    credits += score;
    creditMessage.innerText = "CREDITS: " + credits;
    if (winCondition() === "Nothing") {
      matchPattern.innerText = "You lost this round.";
    } else {
      matchPattern.innerText = winCondition();
    }
    console.log(credits);
    const ref = setInterval(() => {
      if (milliseconds >= 3000) {
        if (playerBtn.innerText === "TRY AGAIN") {
          matchPattern.innerText = "Better luck next time. Try again.";
        }
        console.log(milliseconds);
        clearInterval(ref);
      }
      milliseconds += 1000;
    }, delayInMilliseconds);
    playerBtn.innerText = "TRY AGAIN";
  } else if (playerBtn.innerText === "TRY AGAIN") {
    console.log("test");
    playerBtn.innerText = "DEAL";
    initGame();
  }
};

const createCards = () => {
  cardsContainer.innerHTML = "";
  for (let i = 0; i < 5; i += 1) {
    const suit = document.createElement("div");
    suit.classList.add("suitCSS", playerHand[i].colour);
    suit.innerText = playerHand[i].suit;

    const name = document.createElement("div");
    name.classList.add("nameCSS", playerHand[i].colour);
    name.innerText = playerHand[i].displayName;

    let holdIndicator = document.createElement("div");
    holdIndicator.classList = "holdIndicator cardWithHoldIndicatorCSS";
    holdIndicator.innerText = "";

    const card = document.createElement("div");
    card.classList.add("cardCSS");

    const cardWithHoldIndicator = document.createElement("div");
    cardWithHoldIndicator.classList = "cardWithHoldIndicatorCSS";
    cardWithHoldIndicator.addEventListener("click", () =>
      holdCard(i, holdIndicator)
    );

    card.appendChild(name);
    card.appendChild(suit);
    cardWithHoldIndicator.append(card);
    cardWithHoldIndicator.append(holdIndicator);
    cardsContainer.append(cardWithHoldIndicator);
  }
};

function popModal() {
  var payTableModal = document.createElement("div");
  payTableModal.classList = "modal";
  document.body.appendChild(payTableModal);
  let payTableInfo = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let closeBtn = document.createElement("span");
  closeBtn.innerText = "×";
  closeBtn.classList = "close";
  closeBtn.addEventListener(
    "click",
    () => (payTableModal.style.display = "none")
  );
  /*
  window.addEventListener("click", (event) => {
    if (event.target.classList === "modal") {
      if (payTableModal) {
        payTableModal.style.display = "none";
      }
    }
  });
*/

  payTableModal.appendChild(closeBtn);
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
}

let cardsContainer = document.createElement("div");
cardsContainer.classList = "cardsContainerCSS";
document.body.appendChild(cardsContainer);

let creditMessage = document.createElement("div");
creditMessage.classList = "creditMessage";
document.body.appendChild(creditMessage);

let bottomSection = document.createElement("div");
bottomSection.classList = "bottomSection";
document.body.appendChild(bottomSection);

const playerBtn = document.createElement("button");
playerBtn.addEventListener("click", drawCards);
playerBtn.classList = "playerBtn";
bottomSection.appendChild(playerBtn);

const payTableBtn = document.createElement("button");
payTableBtn.addEventListener("click", popModal);
payTableBtn.classList = "payTableBtn";
payTableBtn.innerText = "PAY TABLE";
bottomSection.appendChild(payTableBtn);

function initGame() {
  cardsContainer.innerHTML = "";
  creditMessage.innerText = "CREDITS: " + credits;
  matchPattern.innerText = "Press deal to start.";
  playerBtn.innerText = "DEAL";
  deck = shuffleCards(createDeck());
  playerHand = [];

  for (let i = 0; i < 5; i += 1) {
    const emptyCard = document.createElement("div");
    emptyCard.classList = "emptyCard";
    cardsContainer.appendChild(emptyCard);
  }
}

initGame();
