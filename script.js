
const canvas = document.getElementById('canvas1');
const dropdown = document.getElementById('animation');
const ctx = canvas.getContext('2d');
const rockOption = document.getElementById('paper');

const winOrLose = document.querySelector('.win-or-lose');
const userChoice = document.getElementById('choose');
const userScore = document.querySelector('.user-score');
const form = document.querySelector('.game-form');
const computerScore = document.querySelector('.computer-score');
const ties = document.querySelector('.ties-wrapper');
const resetBtn = document.getElementById("reset-btn");

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const rpsImage = new Image();
rpsImage.src = 'images/rpsSpritesheet.png'
const spriteWidth = 87; // ≈ the width of the spritesheet image divided my the amt of columns
const spriteHeight = 167; // ≈ the height of the spritesheet image divided my the amt of rows
let frameX = 0, frameY = 2; //rock is the default
let gameFrame = 0;
const slowDownAnimations = 34; //will slow down animation by 34


let gameScore = {
    wins: 0,
    loses: 0,
    ties: 0,
};

// this is a closure and it has a flag/boolean in order to make a function only runs once
  function once(funcParam) {
    let returnedVal = null;
    return function(val) {
        if(!returnedVal) {
            returnedVal = funcParam(val);
        }
        return returnedVal;
    };
  };


  function randomNumber() {
      return Math.floor(Math.random() * 3) ;
  }


let computerChoice = once(randomNumber);


function determineWinner(userChoice, computerChoice) {
  
    switch (true) {
        //rock cases
        case(userChoice === 2 && computerChoice() === 1):      
            winOrLose.innerHTML = 'Computer wins!';  
            gameScore.loses += 1;
            computerScore.innerHTML = gameScore.loses;
            break;
        case(userChoice === 2 && computerChoice() === 0):
            winOrLose.innerHTML = 'You win!';
            gameScore.wins += 1;
            userScore.innerHTML = gameScore.wins;
            break;
        case(userChoice === 2 && computerChoice() === 2):
            winOrLose.innerHTML = "It's a tie";
            gameScore.ties += 1;
            ties.innerHTML = gameScore.ties;
            break;
        //paper cases
        case(userChoice === 1 && computerChoice() === 0):
            winOrLose.innerHTML = 'Computer wins!';
            gameScore.loses += 1;
            computerScore.innerHTML = gameScore.loses;
            break;
        case(userChoice === 1 && computerChoice() === 2):
            winOrLose.innerHTML = 'You win!';
            gameScore.wins += 1;
            userScore.innerHTML = gameScore.wins;
            break;
        case(userChoice === 1 && computerChoice() === 1):
            winOrLose.innerHTML = "It's a tie";
            gameScore.ties += 1;
            ties.innerHTML = gameScore.ties;
            break;
        //scissor cases
        case(userChoice === 0 && computerChoice() === 1):
            winOrLose.innerHTML = 'You win!';
            gameScore.wins += 1;
            userScore.innerHTML = gameScore.wins;
            break;
            case(userChoice === 0 && computerChoice() === 0):
            winOrLose.innerHTML = "It's a tie!";
            ties.innerHTML = gameScore.ties;
            gameScore.ties += 1;
            break;
        case(userChoice === 0 && computerChoice() === 2):
            winOrLose.innerHTML = "Computer wins!"; 
            gameScore.loses += 1;
            computerScore.innerHTML = gameScore.loses;
            break; 
    }

  }

 

function startAnimation() { 
   setTimeout(() => {
        let userMove = frameY;

        //determines the winner after 2 seconds
        if(userChoice.value.trim().toLowerCase() === 'scissors') {
            userMove = 0;
            determineWinner(userMove, computerChoice);
        } else if (userChoice.value.trim().toLowerCase() === 'paper') {
            userMove = 1;
            determineWinner(userMove, computerChoice);
        } else {
            userMove = 2; //rock
            determineWinner(userMove, computerChoice);
        }
        
   }, 2000);

}

function convertValues() {
    let userMove = frameY;
    if(userChoice.value.trim().toLowerCase() === 'scissors') {
        userMove = 0;
    } else if (userChoice.value.trim().toLowerCase() === 'paper') {
        userMove = 1;       
    } else {
        userMove = 2; //rock
    }

    return userMove;
}

function restartGame() {
     
    //generate a new unique random number and set equal to the random number from last round
    let newcomputerChoice = once(randomNumber);

    if(computerChoice() !== newcomputerChoice()) {
        computerChoice = newcomputerChoice;
    } else {
        let anotherChoice = once(randomNumber);
        computerChoice = anotherChoice;
    }   
    // Reset the frames back to the beginning 
    frameX = 0;
    frameY = 2; // Reset to rock as default

    winOrLose.innerHTML = ''; // Clear the result message
    userChoice.value = ''; // Clear user input

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); //resets the canvas

}

function validateInput() {
    let isValidInput;
    if(userChoice.value.trim().toLowerCase() != "rock" &&
       userChoice.value.trim().toLowerCase() != "paper" &&
       userChoice.value.trim().toLowerCase() != "scissors") {
        isValidInput = false; 
        alert('try again');
        window.location.reload();
    } else {
        isValidInput = true;
    }
    return isValidInput;
  }


function drawStatic() {
    //the computer's hand
    ctx.drawImage(rpsImage, 
        frameX * spriteWidth, computerChoice() * spriteHeight, spriteWidth, spriteHeight, //the rectangular area you want to crop out from the spritesheet
        500, 300, spriteWidth, spriteHeight //where you want the cropped img to display on the canvas  
    ); 

//the player's hand
ctx.drawImage(rpsImage, 
    frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, //the rectangular area you want to crop out from the spritesheet
    0, 300, spriteWidth, spriteHeight //where you want the cropped img to display on the canvas  
    ); 

    requestAnimationFrame(drawStatic);
}


function animate() {
            let isRunning = true;
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); //clears the canvas on every iteration
    
           

            //the computer's hand
                ctx.drawImage(rpsImage, 
                    frameX * spriteWidth, computerChoice() * spriteHeight, spriteWidth, spriteHeight, //the rectangular area you want to crop out from the spritesheet
                    500, 300, spriteWidth, spriteHeight //where you want the cropped img to display on the canvas  
               ); 
       

            //the player's hand
            ctx.drawImage(rpsImage, 
                frameX * spriteWidth, convertValues() * spriteHeight, spriteWidth, spriteHeight, //the rectangular area you want to crop out from the spritesheet
                0, 300, spriteWidth, spriteHeight //where you want the cropped img to display on the canvas  
                ); 
                

                if(frameX == 5) {
                    frameX++ //added this to remove strange duplication of the user's hand
                    //stops the animation on the last frame
                    if(frameX == 6) {
                        isRunning = false;
                        return; 
                    }
                }
                
                if(isRunning) {
                    // because of this if statement this code block will only run every 24 frames, slowing down the animation by 24
                    if(gameFrame % slowDownAnimations == 0) {
                        if(frameX < 5) {
                            frameX++;
                        } else {
                            frameX = 0;
                        }

                    }
                }

                    gameFrame++;
                


             requestAnimationFrame(animate);
     };

     
     drawStatic();


     form.addEventListener('submit', (e) => {
            e.preventDefault();
            validateInput();
            animate();  
            setTimeout(restartGame, 4000);
    })

    resetBtn.addEventListener('click', () => {
        window.location.reload();
    })


   

    

   


    

