
// game variables
let counter = 0;
let won = false;
let winner = " ";
let field = ["0", " ", " ", " ", " ", " ", " ", " ", " ", " "];
let player = "X";
let scoreX = 0;
let scoreO = 0;

let draw = false;
let lockscore = false;
let lock1 = false;
let lock2 = false;
let lock3 = false;
let lock4 = false;
let lock5 = false;
let lock6 = false;
let lock7 = false;
let lock8 = false;
let lock9 = false;


document.getElementById("1").onclick = function () {
    if (player == "X" && lock1 == false) {
        field[1] = "X";
        document.getElementById("1").innerHTML = field[1];
        player = "O";
        lock1 = true;
    } else if (player == "O" && lock1 == false) {
        field[1] = "O";
        document.getElementById("1").innerHTML = field[1];
        player = "X";
        lock1 = true;
    }
    gamestatus();
}
document.getElementById("2").onclick = function () {
    if (player == "X" && lock2 == false) {
        field[2] = "X";
        document.getElementById("2").innerHTML = field[2];
        player = "O";
        lock2 = true;
    } else if (player == "O" && lock2 == false) {
        field[2] = "O";
        document.getElementById("2").innerHTML = field[2];
        player = "X";
        lock2 = true;
    }
    gamestatus();
}
document.getElementById("3").onclick = function () {
    if (player == "X" && lock3 == false) {
        field[3] = "X";
        document.getElementById("3").innerHTML = field[3];
        player = "O";
        lock3 = true;
    } else if (player == "O" && lock3 == false) {
        field[3] = "O";
        document.getElementById("3").innerHTML = field[3];
        player = "X";
        lock3 = true;
    }
    gamestatus();
}
document.getElementById("4").onclick = function () {
    if (player == "X" && lock4 == false) {
        field[4] = "X";
        document.getElementById("4").innerHTML = field[4];
        player = "O";
        lock4 = true;
    } else if (player == "O" && lock4 == false) {
        field[4] = "O";
        document.getElementById("4").innerHTML = field[4];
        player = "X";
        lock4 = true;
    }
    gamestatus();
}
document.getElementById("5").onclick = function () {
    if (player == "X" && lock5 == false) {
        field[5] = "X";
        document.getElementById("5").innerHTML = field[5];
        player = "O";
        lock5 = true;
    } else if (player == "O" && lock5 == false) {
        field[5] = "O";
        document.getElementById("5").innerHTML = field[5];
        player = "X";
        lock5 = true;
    }
    gamestatus();
}
document.getElementById("6").onclick = function () {
    if (player == "X" && lock6 == false) {
        field[6] = "X";
        document.getElementById("6").innerHTML = field[6];
        player = "O";
        lock6 = true;
    } else if (player == "O" && lock6 == false) {
        field[6] = "O";
        document.getElementById("6").innerHTML = field[6];
        player = "X";
        lock6 = true;
    }
    gamestatus();
}
document.getElementById("7").onclick = function () {
    if (player == "X" && lock7 == false) {
        field[7] = "X";
        document.getElementById("7").innerHTML = field[7];
        player = "O";
        lock7 = true;
    } else if (player == "O" && lock7 == false) {
        field[7] = "O";
        document.getElementById("7").innerHTML = field[7];
        player = "X";
        lock7 = true;
    }
    gamestatus();
}
document.getElementById("8").onclick = function () {
    if (player == "X" && lock8 == false) {
        field[8] = "X";
        document.getElementById("8").innerHTML = field[8];
        player = "O";
        lock8 = true;
    } else if (player == "O" && lock8 == false) {
        field[8] = "O";
        document.getElementById("8").innerHTML = field[8];
        player = "X";
        lock8 = true;
    }
    gamestatus();
}
document.getElementById("9").onclick = function () {

    if (player == "X" && lock9 == false) {
        field[9] = "X";
        document.getElementById("9").innerHTML = field[9];
        player = "O";
        lock9 = true;
    } else if (player == "O" && lock9 == false) {
        field[9] = "O";
        document.getElementById("9").innerHTML = field[9];
        player = "X";
        lock9 = true;
    }
    gamestatus();
}

function gamestatus() {
    counter++;
    document.getElementById("status").innerHTML = "Spieler: " + player;
    checkwinner();
    console.log(field);
    console.log(winner);
    console.log(won);
}

function checkwinner() {
    const topLeft = field[1];
    const topMiddle = field[2];
    const topRight = field[3];

    const middleLeft = field[4];
    const middleMiddle = field[5];
    const middleRight = field[6];

    const bottomLeft = field[7];
    const bottomMiddle = field[8];
    const bottomRight = field[9];

    if (topLeft == topMiddle && topMiddle == topRight && topLeft != " ") { //oben links nach rechts
        winner = topLeft;
        won = true;
        console.log("tescht");
    } else if (middleLeft == middleMiddle && middleMiddle == middleRight && middleLeft != " ") {  //mitte links nach rechts
        winner = middleLeft;
        won = true;
    } else if (bottomLeft == bottomMiddle && bottomMiddle == bottomRight && bottomLeft != " ") { //unten links nach rechts
        winner = bottomLeft;
        won = true;
    } else if (topLeft == middleLeft && middleLeft == bottomLeft && topLeft != " ") {  //oben nach unten links
        winner = topLeft;
        won = true;
    } else if (topMiddle == middleMiddle && middleMiddle == bottomMiddle  && topMiddle != " ") { //oben nach unten mitte
        winner = topMiddle;
        won = true;
    } else if (topRight == middleRight && middleRight == bottomRight && topRight != " ") { //oben nach unten rechts
        winner = topRight;
        won = true;
    } else if (topLeft == middleMiddle && middleMiddle == bottomRight && topLeft != " ") { //oben links nach unten rechts diagonal
        winner = topLeft;
        won = true;
    } else if (bottomLeft == middleMiddle && middleMiddle == topRight && bottomLeft != " ") { //unten links nach oben rechts diagonal
        winner = bottomLeft;
        won = true;
    } else if (field.filter(box => box == " ").length == 0) { //  } else if (field[1] != " " && field[2] != " " && field[3] != " " && field[4] != " " && field[5] != " " && field[6] != " " && field[7] != " " && field[8] != " " && field[9] != " ") {

        document.getElementById("status").innerHTML = "Unentschieden";
    }

    if (winner != " ") {
        if (winner == "X" && lockscore == false) {
            scoreX++;
        } else if (winner == "O" && lockscore == false) {
            scoreO++;
        }
        lockscore = true;

        lock1 = true;
        lock2 = true;
        lock3 = true;
        lock4 = true;
        lock5 = true;
        lock6 = true;
        lock7 = true;
        lock8 = true;
        lock9 = true;

        document.getElementById("status").innerHTML = "GEWONNEN! Gewinner: Player " + winner;
        document.getElementById("scores").innerHTML = "Player X: " + scoreX + "<p>Player O: " + scoreO;
    }
}


function reset() {
    won = false;
    winner = " ";
    field = ["0", " ", " ", " ", " ", " ", " ", " ", " ", " "];
    player = "X";

    lockscore = false;
    lock1 = false;
    lock2 = false;
    lock3 = false;
    lock4 = false;
    lock5 = false;
    lock6 = false;
    lock7 = false;
    lock8 = false;
    lock9 = false;
    document.getElementById("1").innerHTML = field[1];
    document.getElementById("2").innerHTML = field[2];
    document.getElementById("3").innerHTML = field[3];
    document.getElementById("4").innerHTML = field[4];
    document.getElementById("5").innerHTML = field[5];
    document.getElementById("6").innerHTML = field[6];
    document.getElementById("7").innerHTML = field[7];
    document.getElementById("8").innerHTML = field[8];
    document.getElementById("9").innerHTML = field[9];
}


// Dark Theme// check for saved "lightMode" in localStorage
let lightMode = localStorage.getItem("lightMode");

const lightModeToggle = document.querySelector("#icon");

const enablelightMode = () => {
    // 1. Add the class to the body
    document.body.classList.add("lightMode");
    icon.src = "moon.png"
    // 2. Update lightMode in localStorage
    localStorage.setItem("lightMode", "enabled");
}

const disablelightMode = () => {
    // 1. Remove the class from the body
    document.body.classList.remove("lightMode");
    icon.src = "sun.png"
    // 2. Update lightMode in localStorage 
    localStorage.setItem("lightMode", null);
}

// If the user already visited and enabled lightMode
// start things off with it on
if (lightMode === "enabled") {
    enablelightMode();
}

// When someone clicks the button
lightModeToggle.addEventListener("click", () => {
    // get their lightMode setting
    lightMode = localStorage.getItem("lightMode");

    // if it not current enabled, enable it
    if (lightMode !== "enabled") {
        enablelightMode();
        // if it has been enabled, turn it off  
    } else {
        disablelightMode();
    }
});