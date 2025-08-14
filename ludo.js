// Event listnenr for reset the game

let resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click",function(){ localStorage.removeItem("ludoBoard");
  console.log("LudoBoard is removed")
  location.reload();
})

let tokenColors = ["red", "green", "yellow", "blue"];
let tokenStartPosition = { red: 2, green: 15, yellow: 28, blue: 41 };
let turnCount = 0;
let state = {
  diceRoll: 0,
  turn: "red",
  tokenPosition: {
    red: [-1, -1, -1, -1],
    green: [-1, -1, -1, -1],
    yellow: [-1, -1, -1, -1],
    blue: [-1, -1, -1, -1],
  },
  canRoll: true,
};
tokenBase = {
  red: document.querySelectorAll(".redToken"),
  green: document.querySelectorAll(".greenToken"),
  yellow: document.querySelectorAll(".yellowToken"),
  blue: document.querySelectorAll(".blueToken"),
};

let tokenPaths = {
  red: getTokenPath("red"),
  green: getTokenPath("green"),
  yellow: getTokenPath("yellow"),
  blue: getTokenPath("blue"),
};

let diceIcons = [
  "fa-dice-one",
  "fa-dice-two",
  "fa-dice-three",
  "fa-dice-four",
  "fa-dice-five",
  "fa-dice-six",
];

let diceIcon = document.getElementById("diceIcon");
console.log(diceIcon);

function getTokenPath(color) {
  let tokenStart = tokenStartPosition[color];

  let path = Array.from(
    { length: 52 - tokenStart + 1 },
    (_, i) => tokenStart + i
  );

  let colorPath = Array.from({ length: 6 }, (_, i) => color + (i + 1));

  let restPath = Array.from({ length: tokenStart - 2 }, (_, i) => i + 1);

  path.push(...restPath, ...colorPath);

  return path;
}

// Event listener for clicking the token
tokenColors.forEach((color) => {
  tokenBase[color].forEach((element, index) => {
    element.addEventListener("click", (ele) => {
      moveToken(color, index, getTokenPath(color));
    });
  });
});

// functin for rolling Dice
function rollDice() {
  // removeHighlight();
  if (!state.canRoll) alert("Please move your token");
  // updateLocal();
  if (state.canRoll == true) {
    state.diceRoll = Math.ceil(Math.random() * 6);
    diceIcon.classList.remove(...diceIcons);
    diceIcon.classList.add(diceIcons[state.diceRoll - 1]);
    addHighlight(state.turn);
  } else return;

  if (!canMove()) {
    turnPlayer();
    removeHighlight();
  }
  console.log(
    state.diceRoll,
    "turn" + state.turn,
    "dice number is" + state.diceRoll
  );
  savedState();
}

// function for adding class highlight
function addHighlight(color) {
  let tokenPos = state.tokenPosition[color];
  let moveableToken = tokenPos.filter((num) => num < 57 && num > -1);
  console.log(moveableToken);
  if (moveableToken.length !== 0 || state.diceRoll === 6) {
    let tokenArray = document.querySelectorAll(`.${color}Token`);
    tokenArray.forEach((element) => {
      element.classList.add("highlight");
    });
  } else return;
}

function removeHighlight() {
  tokenColors.forEach((element) => {
    tokenArray = document.querySelectorAll(`.${element}Token`);
    tokenArray.forEach((ele) => ele.classList.remove("highlight"));
  });
}

// function to clear the movement of token i.e. the token can move or not;
function canMove() {
  let canMove = false;
  const tokenPos = state.tokenPosition[state.turn];
  const outToken = tokenPos.filter((num) => num !== -1);
  console.log(outToken);
  console.log(tokenPos);

  if (tokenPos.every((num) => num + state.diceRoll > 57)) {
    state.canRoll = true;
    canMove = false;
  }else if (tokenPos.some((num) => num !== -1) && state.diceRoll === 6) {
    state.canRoll = false;
    canMove = true;
  } else if (tokenPos.every((num) => num === -1) && state.diceRoll !== 6) {
    state.canRoll = true;
    canMove = false;
  } else if (tokenPos.every((num) => num === -1) && state.diceRoll === 6) {
    state.canRoll = false;
    canMove = true;
  } else if (outToken.some((num) => num + state.diceRoll < 57)) {
    state.canRoll = false;
    canMove = true;
  } 
  return canMove;
}

// function for knowing the turn of the player
function turnPlayer() {
 
  // if(state.diceRoll ===6 || state.tokenPosition[state.turn].some((ele)=>ele + state.diceRoll ===56)){
  //   hasSpecialChance = true;
  //   turnCount;
  //   return;
  // }
  // else
 if(state.diceRoll !==6){
   if (state.diceRoll !== 6 && turnCount < 3) {
      state.turn = tokenColors[turnCount + 1];
      turnCount++;
    } 
    else if (turnCount === 3 && state.diceRoll !== 6) {
      state.turn = tokenColors[0];
      turnCount = 0;
    } 
    else state.turn;
 }
//  else{
//   state.hasSpecialChance = true;
//  }
  // state.hasSpecialChance = false;
  updateTurn();

  // document.querySelector(`#${state.turn}Dice`).append(diceIcon);
  // diceIcon.style.color = `${state.turn}`;
}

function updateTurn() {
  diceIcon.style.color = state.turn;
  document.getElementById(`${state.turn}Dice`).append(diceIcon);
}
updateTurn();

// functin for movement of token
function moveToken(color, index, path) {
  console.log(state.turn);
  if (color !== state.turn || state.canRoll === true) return;
  if (state.tokenPosition[color][index] >= 57) {
    state.canRoll = true;
    return;
  }

  console.log("moveToken function is called in start");
  if (canMove()) {
    if (state.diceRoll === 6 && state.tokenPosition[color][index] == -1) {
      state.tokenPosition[color][index] = 0;

      let parent = document.querySelector(`[data-index = "${path[0]}"]`);
      parent.append(tokenBase[color][index]);
      state.canRoll = true;
    } 
    else if (
      state.tokenPosition[color][index] !== -1 &&
      state.tokenPosition[color][index] < 57
    ) {
      let targetCell = document.querySelector(
        `[data-index = "${
          path[state.tokenPosition[color][index] + state.diceRoll]
        }"]`
      );
      // targetCell.append(tokenBase[color][index]);
      console.log(path);
       
    
      
        if (targetCell !== null || undefined) {
          // state.tokenPosition[color][index] =
          //   state.tokenPosition[color][index] + state.diceRoll;
            state.canRoll = true;

          // targetCell.append(tokenBase[color][index]);
         
         moveTokenToTarget(color,index);
          // await delay (500)
          if(!checkReturnToken(color,index,targetCell)){
            turnPlayer();
          }
          else{
            console.log("token is moved back to home");
          }
          


         
           console.log("moveToken function is called in end");
          // turnPlayer();
       
        } 
      }
     
    }

    // turnPlayer();
      else turnPlayer();
  
   removeHighlight();
   savedState();
  }
 


function checkReturnToken(color,index,target){
 let firstChild = target.children[0];
 console.log(firstChild);
   if (
        firstChild !== undefined &&
        firstChild.tagName === "SPAN" &&
        target.children[0] !== tokenBase[color][index]
      ) {
     let colorToken = firstChild.getAttribute("id").slice(0, -2);
     let indexNumber = firstChild.getAttribute("id").slice(-1);
        if(color !== colorToken) {
          returnHome(colorToken, indexNumber);
          return true;
       }
         else if(state.tokenPosition[color][index ] === 56){
        console.log("Token reached at home position")
          return true;
        }

  
      // return false; 
        
    }
    return false;
}
async function returnHome(color, index) {
  let startPos = document.getElementById(`${color}${index}`);
  let returnToken = document.getElementById(`${color}0${index}`);

  
  let tokenPos = state.tokenPosition[color][index - 1];
  let pathArray = tokenPaths[color]
  pathArray.unshift(startPos);
  console.log(pathArray);
  for (let pos = tokenPos; pos > -1; pos--) {
    let targetBox = document.querySelector(`[data-index = "${pathArray[pos]}"]`);
    await delay(150);
  
    if (pos == 0) {
      // await delay(600);
      startPos.append(returnToken);

    } else {
      // await delay(600);
      targetBox.append(returnToken);
    }
   
  }
 
  
  state.tokenPosition[color][index-1] = -1;
  pathArray.shift();
  savedState();
}

async function moveTokenToTarget(color,index){
  let moveableToken = document.getElementById(`${color}0${index+1 }`);
  let tokenPos= state.tokenPosition[color][index] + 1;
  let targetPos = state.tokenPosition[color][index] + state.diceRoll;

  for(let pos = tokenPos; pos<= targetPos; pos++){
  
    let target = document.querySelector(`[data-index = "${tokenPaths[color][pos]}"]`);
    await delay(200);
     target.append(moveableToken);

  }

   state.tokenPosition[color][index] = state.tokenPosition[color][index] + state.diceRoll;
}

function savedState() {
  localStorage.setItem("ludoBoard", JSON.stringify(state));
}

function updateLocal() {
  let sterlizedData = localStorage.getItem("ludoBoard");

  if (! sterlizedData) {
    return;
  }
  state = JSON.parse(sterlizedData);

  let colors = Object.keys(state.tokenPosition);
  colors.forEach((color) => {
    let eachTokenPos = state.tokenPosition[color];
    eachTokenPos.forEach((pos, index) => {
      if (pos === -1 || pos >= 57) return;
      let targetPosition = document.querySelector(
        `[data-index = "${tokenPaths[color][pos]}"]`
      );
      let token = document.getElementById(`${color}0${index + 1}`);

      if (!targetPosition) {
        return;
      } else {
        targetPosition.append(token);
      }
    });
  });
  document.getElementById("diceIcon").style.color = state.turn;
  document
    .getElementById(`${state.turn}Dice`)
    .append(document.getElementById("diceIcon"));
  diceIcon.classList.remove(...diceIcons);
  diceIcon.classList.add(diceIcons[state.diceRoll - 1]);
}

updateLocal();
console.log(state.turn);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
