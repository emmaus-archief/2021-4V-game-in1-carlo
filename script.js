/// @ts-check
/// <reference path=".gitpod/p5.global-mode.d.ts" />
"use strict";

/* Game opdracht
   Informatica - Emmauscollege Rotterdam
   Template voor een game in JavaScript met de p5 library

   Begin met dit template voor je game opdracht,
   voeg er je eigen code aan toe.
 */

// globale variabelen die je gebruikt in je game

const HOME = 0
const SPELEN = 1;
const GAMEOVER = 2;
const mainColor = "green";
const secondaryColor = "black";
var spelStatus = SPELEN;

const TetriminoVariaties = [  // Alle verschillende soorten blokjes die je kunt hebben
    [[1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // Straight tetromino
    [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // Square tetromino
    [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // T-tetromino
    [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // J-tetromino
    [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // L-tetromino
    [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], // S-tetromino
    [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]  // Z-tetromino
];

var score = 0; // aantal behaalde punten
var rotationOffset1;
var rotationOffset2;
var curBlock = Array.from(Array(4), () => new Array(4));
var curBlockPos = new Array(6);
var bord = Array.from(Array(16), () => new Array(10)); // 2D array - 16 hoog en 10 breed

// functies die je gebruikt in je game

// Reset het spel naar beginstand
var reset = function () {
    //zet var bord naar 0
    for (var i = 0; i < 16; i++) {      // bord is 16 hoog
        for (var j = 0; j < 10; j++) {  // bord is 10 breed
            bord[i][j] = 0;
        }
    }
    newCurBlock();
}

/* setup
   de code in deze functie wordt één keer uitgevoerd door
   de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
    // Maak een canvas (rechthoek) waarin je je speelveld kunt tekenen
    createCanvas(1280, 720);

    // Kleur de achtergrond wit, zodat je het kunt zien
    background(secondaryColor);
    stroke(mainColor);

    spelStatus = HOME;

    //Zet alle variabelen naar de beginstand
    reset();
}

/*
 * CurBlockPos slaat belangerijke info op over de staat van de curBlock
 * CurBlockPos heeft 6 stukken info:
 * 1: de y coordinaat van linksboven
 * 2: de x coordinaat van linksboven
 * 3: de rotatie (1 - 4, waarvan 1 geen rotatie is, en 4 driekwart gedraad is)
 * 4: de soort tetromino
 * 5: de y coordinaat van rechtsonder
 * 6: de x coordinaat van rechtsonder
*/
var newCurBlock = function () {

    var randomTetrimino = Math.floor(Math.random() * 7); // Pakt een random tetrimino

    curBlock = TetriminoVariaties[randomTetrimino];      // Zet de random tetrimino in curBlock

    curBlockPos = [0, 4, 1, randomTetrimino, 0, 0];
}

var rotateBlock = function () {
    var TempCurBlock = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    
    if(curBlockPos[3] > 1) {                    // Normale blokken (T, J, L, S, Z)
        TempCurBlock[0][2] = curBlock[0][0]; // Eng patroon ineens (misschien ga ik dit ooit efficient doen)
        TempCurBlock[2][2] = curBlock[0][2]; // Nog niet uitgewerkt hoe tho
        TempCurBlock[2][0] = curBlock[2][2];
        TempCurBlock[0][0] = curBlock[2][0];

        TempCurBlock[1][2] = curBlock[0][1];
        TempCurBlock[2][1] = curBlock[1][2];
        TempCurBlock[1][0] = curBlock[2][1];
        TempCurBlock[0][1] = curBlock[1][0];
        TempCurBlock[1][1] = 1;

        updateCurBlockPos2();

    } else if (curBlockPos[3] === 0) {          // Straight Tetrimino
        TempCurBlock[0][0] = curBlock[0][0];
        TempCurBlock[1][0] = curBlock[0][1];
        TempCurBlock[2][0] = curBlock[0][2];
        TempCurBlock[3][0] = curBlock[0][3];

        TempCurBlock[0][0] = curBlock[0][0];
        TempCurBlock[0][1] = curBlock[1][0];
        TempCurBlock[0][2] = curBlock[2][0];
        TempCurBlock[0][3] = curBlock[3][0];

        updateCurBlockPos2();

    } else {                                    // Square Tetrimino
        TempCurBlock = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

        updateCurBlockPos2();
    }
    
    curBlock = TempCurBlock;
}

var updateCurBlockPos2 = function () {
    // Update de rotatievariabele
    if (curBlockPos[2] === 4) {
        curBlockPos[2] = 1;
    } else {
        curBlockPos[2]++;
    }
}

// Berekent met variabelen waar het meest rechtse en onderste punt is van curBlock
// Deze functie gebruikt de curBlockPos variabele, dus hij hoeft niet parameters te hebben
var calcRightBottomPos = function () {

    // Straight
    if (curBlockPos[3] === 0) {

        //Kijkt naar de verschillende mogelijke rotaties
        switch (curBlockPos[2]) {
            // Blok staat evenwijdig naar de grond, x waarde heeft 3 verschil, y waarde heeft geen verschil
            case 1:
                curBlockPos[4] = curBlockPos[0];
                curBlockPos[5] = curBlockPos[1] + 3;
                break;
            // Blok staat loodrecht aan grond, x waarde heeft geen verschil, y waarde heeft 3 verschil
            case 2:
                curBlockPos[4] = curBlockPos[0] + 3;
                curBlockPos[5] = curBlockPos[1];
                break;
            // Blok staat evenwijdig naar de grond, x waarde heeft 3 verschil, y waarde heeft geen verschil
            case 3:
                curBlockPos[4] = curBlockPos[0];
                curBlockPos[5] = curBlockPos[1] + 3;
                break;
            // Blok staat loodrecht aan grond, x waarde heeft geen verschil, y waarde heeft 3 verschil
            case 4:
                curBlockPos[4] = curBlockPos[0] + 3;
                curBlockPos[5] = curBlockPos[1];
                break;
        }
    }


    // Alle blokken met een 3x3 grid (2 - 7)
    else if (curBlockPos[3] != 0 || 1) {
         switch (curBlockPos[2]) {
             case 1:
                 curBlockPos[4] = curBlockPos[0] + 1;
                 curBlockPos[5] = curBlockPos[1] + 2;
                 break;
             case 2:
                 curBlockPos[4] = curBlockPos[0] + 2;
                 curBlockPos[5] = curBlockPos[1] + 1;
                 break;
             case 3:
                 curBlockPos[4] = curBlockPos[0] + 1;
                 curBlockPos[5] = curBlockPos[1] + 2;
                 break;
             case 4:
                 curBlockPos[4] = curBlockPos[0] + 2;
                 curBlockPos[5] = curBlockPos[1] + 1;
                 break;
         }
    }

    // Square, blijft altijd hetzelfde
    else {
        curBlockPos[4] = curBlockPos[0] + 1;
        curBlockPos[5] = curBlockPos[1] + 1;
    }
}



function keyPressed() {
    switch (keyCode) {
        // blokkenrotatie, keycode 88 staat voor x
        case 88:
            rotateBlock();
            break;

        // blok naar links bewegen
        case 37:
            if (curBlockPos[1] + rotationOffset1 > 0) {
                curBlockPos[1]--;
            }
            break;

        // blok naar rechts bewegen
        case 39:
            if (curBlockPos[1] - rotationOffset2 < 7) {
                curBlockPos[1]++;
            }
            break;

        // Blok naar beneden
        case 40:
            curBlockPos[0]++;
            break;
        // Hard drop (pijltje naar boven)
        case 38:
            while(curBlockPos[0] != 0){
                curBlockPos[0]++;
                checkCollision();
            }
        // Press enter to play stuff
        case 13:
            spelStatus = SPELEN;
            break;
    }
}

// Check of curBlock iets raakt
var checkCollision = function () {
    calcRightBottomPos();

    // als de curBlock de grond raakt
    if (curBlockPos[4] === 15) {
        placeBlock();
    };

    for(var i = 0; i < 4; i++){
        if(     bord        [curBlockPos[4] + 1]                [i + curBlockPos[1]]    === 1){
            if( curBlock    [curBlockPos[4] - curBlockPos[0]]   [i]                     === 1){
                placeBlock();
            };
        };
    };
};

var placeBlock = function() {
    // Zet curBlock in het bord (Gepakt van de eerste for loop in de draw functie)

    for (var i = 0; i < curBlock.length; i++) {
        for (var j = 0; j < curBlock[i].length; j++) {
            if (curBlock[i][j] === 1) {
                bord[curBlockPos[0] + i][curBlockPos[1] + j] = 1;
            }
        }
    }

    // Pakt een nieuw blok
    newCurBlock();
}

var getBlockRotationOffset = function () {
    if(curBlockPos[3] === 0) { // Straight
        switch (curBlockPos[2]) {
            case 1:
                rotationOffset1 = 0;
                rotationOffset2 = -1;
                break;
            case 2:
                rotationOffset1 = 0;
                rotationOffset2 = 2;
                break;
            case 3:
                rotationOffset1 = 0;
                rotationOffset2 = -1;
                break;
            case 4:
                rotationOffset1 = 0;
                rotationOffset2 = 2;
                break;
        }

    } else if(curBlockPos[3] === 1) { // Square
        rotationOffset1 = 0;
        rotationOffset2 = 1;

    } else {
        switch (curBlockPos[2]) {
            case 1:
                rotationOffset1 = 0;
                rotationOffset2 = 0;
                break;
            case 2:
                rotationOffset1 = 1;
                rotationOffset2 = 0;
                break;
            case 3:
                rotationOffset1 = 0;
                rotationOffset2 = 0;
                break;
            case 4:
                rotationOffset1 = 0;
                rotationOffset2 = 1;
                break;
        }
    }
}

/**
 * draw
 * de code in deze functie wordt meerdere keren per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
    switch (spelStatus) {
        case HOME:
            // Home menu tekenen

            textSize(40);
            fill(mainColor);
            text("TETRIS", 550, 240, 426, 240);
            text("Press enter to play :)", 426, 360, 426, 240);

            //if(true){
            //    spelStatus = SPELEN;
            //}
            break;

        case SPELEN:
            // Stuff to calc every frame
            calcRightBottomPos();
            getBlockRotationOffset();

            // Zet het huidige blokje in het bord, het werkt vgm best goed ik heb geen idee meer hoe lol
            for(var i = 0; i < curBlock.length; i++){
                for(var j = 0; j < curBlock[i].length; j++){
                    if (curBlock[i][j] === 1) {
                        bord[curBlockPos[0]+i][curBlockPos[1] + j] = 1;
                    }
                }
            }

            // Tekent het bord
            for (var i = 0; i < 16; i++) {      // bord is 16 hoog
                for (var j = 0; j < 10; j++) {  // bord is 10 breed
                    if (bord[i][j] === 1) {
                        stroke(secondaryColor);
                        fill(mainColor);
                    } else {
                        stroke(mainColor);
                        fill(secondaryColor);
                    }
                    rect(j * 45 + 426, i * 45, 45, 45); // Tekent veld per blokje
                }
            }

            // Precies hetzelfde als voor de draw, maar dan zet ie hem naar 0, zodat hij niet het bord opneemt wanneer het blokje op een andere positie is
            for(var i = 0; i < curBlock.length; i++){
               for(var j = 0; j < curBlock[i].length; j++){
                    if (curBlock[i][j] === 1) {
                       bord[curBlockPos[0]+i][curBlockPos[1] + j] = 0;
                    }
               }
            }

            // Functie doet iets elke seconden
            if (frameCount % 50 == 0) {

                // Beweegt het blok naar beneden
                curBlockPos[0]++;
            }
            checkCollision();

            // Verwijderd het huidige blokje uit het bord
            fill(0, 0, 0);
            //@ts-ignore
            fill(126, 18, 140);
            text(curBlockPos[1] + " " + curBlockPos[0] + " " + curBlockPos[5] + " " + curBlockPos[4] + " " + curBlock, 10, 710, 70, 80);
            break;
    }
}