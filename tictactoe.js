// === FIREBASE INITIALISIERUNG ===
// ERSETZE DIESE KONFIGURATION MIT DEINER EIGENEN!
const firebaseConfig = {
  apiKey: "AIzaSyCb279ZmIfzGCvF7ipv3Yr2_VnIf0e9yFs",
  authDomain: "tictactoe-online-ez.firebaseapp.com",
  databaseURL: "https://tictactoe-online-ez-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tictactoe-online-ez",
  storageBucket: "tictactoe-online-ez.firebasestorage.app",
  messagingSenderId: "294223876689",
  appId: "1:294223876689:web:22fd36b0eb1179aea81e70"
};


// Firebase initialisieren
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// === SPIEL VARIABLEN ===
let currentPlayerId = null;
let currentPlayerName = "";
let currentRoomId = null;
let currentSymbol = null;
let isMyTurn = false;

// === SPIELER LOGIN ===
function login() {
    const playerName = document.getElementById('playerName').value;
    if (!playerName) {
        alert("Bitte gib deinen Namen ein!");
        return;
    }

    currentPlayerName = playerName;
    currentPlayerId = generatePlayerId();

    document.getElementById('login-section').style.display = 'none';
    document.getElementById('game-section').style.display = 'block';
    document.getElementById('playerInfo').innerHTML = `Spieler: ${playerName}`;
}

// === SPIEL FUNKTIONEN ===
function createGame() {
    const roomId = generateRoomCode();
    currentRoomId = roomId;
    currentSymbol = "X";
    
    const gameState = {
        field: ["0", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        currentPlayer: "X",
        players: {
            X: { 
                id: currentPlayerId, 
                name: currentPlayerName 
            },
            O: null  // Explizit null setzen
        },
        winner: null,
        status: "waiting",
        scores: {
            X: 0,
            O: 0
        },
        createdAt: Date.now()
    };
    
    console.log("Erstelle neues Spiel:", roomId);
    
    const gameRef = database.ref('games/' + roomId);
    gameRef.set(gameState)
        .then(() => {
            console.log("Spiel erfolgreich erstellt");
            listenToGame(roomId);
            
            document.getElementById('roomInfo').innerHTML = `
                <h3>Spielraum: ${roomId}</h3>
                <p>Warte auf zweiten Spieler...</p>
                <p>Dein Symbol: ${currentSymbol}</p>
                <p><strong>Gib diesen Code dem zweiten Spieler: ${roomId}</strong></p>
                <button onclick="showAllGames()">Debug: Zeige alle Spiele</button>
            `;
        })
        .catch((error) => {
            console.error("Fehler beim Erstellen:", error);
            alert("Fehler beim Erstellen des Spiels: " + error.message);
        });
}

function joinGame() {
    const roomCode = document.getElementById('roomCode').value.toUpperCase();
    if (!roomCode) {
        alert("Bitte gib einen Raum-Code ein!");
        return;
    }
    
    currentRoomId = roomCode;
    
    const gameRef = database.ref('games/' + roomCode);
    
    // Prüfen ob Raum existiert
    gameRef.once('value').then((snapshot) => {
        if (!snapshot.exists()) {
            alert("Raum existiert nicht!");
            return;
        }
        
        const gameState = snapshot.val();
        
        console.log("Aktueller Spielzustand:", gameState);
        console.log("Spieler O:", gameState.players.O);
        
        // KORREKTUR: Prüfe auf undefined oder null
        const isPlayerOFree = gameState.players.O === null || 
                              gameState.players.O === undefined || 
                              (typeof gameState.players.O === 'object' && Object.keys(gameState.players.O).length === 0);
        
        const isPlayerXFree = gameState.players.X === null || 
                              gameState.players.X === undefined || 
                              (typeof gameState.players.X === 'object' && Object.keys(gameState.players.X).length === 0);
        
        console.log("Ist Spieler O frei?", isPlayerOFree);
        console.log("Ist Spieler X frei?", isPlayerXFree);
        
        if (isPlayerOFree) {
            currentSymbol = "O";
            console.log("Beitreten als Spieler O");
            
            // Spieler O hinzufügen
            const playerOData = { 
                id: currentPlayerId, 
                name: currentPlayerName 
            };
            
            gameRef.update({
                'players/O': playerOData,
                'status': 'playing'
            }).then(() => {
                console.log("Spieler O erfolgreich hinzugefügt:", playerOData);
                listenToGame(roomCode);
                document.getElementById('roomInfo').innerHTML = `
                    <h3>Spielraum: ${currentRoomId}</h3>
                    <p>Beigetreten als Spieler O</p>
                    <p>Spieler X: ${gameState.players.X?.name || 'Unbekannt'}</p>
                    <p>Dein Symbol: ${currentSymbol}</p>
                `;
            });
            
        } else if (isPlayerXFree) {
            currentSymbol = "X";
            console.log("Beitreten als Spieler X");
            
            const playerXData = { 
                id: currentPlayerId, 
                name: currentPlayerName 
            };
            
            gameRef.update({
                'players/X': playerXData,
                'status': 'playing'
            }).then(() => {
                console.log("Spieler X erfolgreich hinzugefügt:", playerXData);
                listenToGame(roomCode);
                document.getElementById('roomInfo').innerHTML = `
                    <h3>Spielraum: ${currentRoomId}</h3>
                    <p>Beigetreten als Spieler X</p>
                    <p>Spieler O: ${gameState.players.O?.name || 'Unbekannt'}</p>
                    <p>Dein Symbol: ${currentSymbol}</p>
                `;
            });
            
        } else {
            console.log("Beide Plätze belegt - Spieler X:", gameState.players.X, "Spieler O:", gameState.players.O);
            alert("Raum ist bereits voll! Spieler X: " + 
                  (gameState.players.X?.name || "unbekannt") + 
                  ", Spieler O: " + 
                  (gameState.players.O?.name || "unbekannt"));
        }
        
    }).catch((error) => {
        console.error("Fehler beim Beitreten:", error);
        alert("Fehler: " + error.message);
    });
}

// === ECHTZEIT UPDATES ===
function listenToGame(roomId) {
    const gameRef = database.ref('games/' + roomId);
    
    gameRef.on('value', (snapshot) => {
        const gameState = snapshot.val();
        if (!gameState) {
            console.log("Spielraum wurde gelöscht");
            return;
        }
        
        console.log("Spielupdate erhalten:", gameState);
        updateGameUI(gameState);
        updateGameStatus(gameState);
    });
}

function updateGameUI(gameState) {
    // Spielfeld aktualisieren
    for (let i = 1; i <= 9; i++) {
        document.getElementById(i.toString()).innerHTML = gameState.field[i];
    }

    // Spielstatus anzeigen
    document.getElementById('roomInfo').innerHTML = `
        <h3>Spielraum: ${currentRoomId}</h3>
        <p>Spieler X: ${gameState.players.X?.name || 'Wartet...'}</p>
        <p>Spieler O: ${gameState.players.O?.name || 'Wartet...'}</p>
        <p>Dein Symbol: ${currentSymbol}</p>
    `;
}

function updateGameStatus(gameState) {
    // Prüfen ob ich am Zug bin
    isMyTurn = (gameState.currentPlayer === currentSymbol);
    
    if (gameState.status === "waiting") {
        document.getElementById('status').innerHTML = "Warte auf zweiten Spieler...";
    } else if (gameState.winner) {
        if (gameState.winner === "draw") {
            document.getElementById('status').innerHTML = "Unentschieden!";
        } else {
            document.getElementById('status').innerHTML = 
                `🎉 SPIEL VORBEI! Gewinner: Spieler ${gameState.winner}`;
        }
        
        // Score anzeigen
        const scoreX = gameState.scores?.X || 0;
        const scoreO = gameState.scores?.O || 0;
        document.getElementById('scores').innerHTML = 
            `Spieler X: ${scoreX}<p>Spieler O: ${scoreO}`;
            
    } else {
        document.getElementById('status').innerHTML = 
            `Aktueller Spieler: ${gameState.currentPlayer} ${isMyTurn ? '(DU bist dran!)' : ''}`;
    }
}

// === ZUG MACHEN ===
function makeMove(cellId) {
    if (!isMyTurn || !currentRoomId) {
        alert("Du bist nicht am Zug!");
        return;
    }
    
    const gameRef = database.ref('games/' + currentRoomId);
    
    gameRef.once('value').then((snapshot) => {
        const gameState = snapshot.val();
        
        // Prüfen ob Feld frei ist
        if (gameState.field[cellId] !== " ") {
            alert("Feld ist bereits belegt!");
            return;
        }
        
        // Prüfen ob Spiel bereits beendet
        if (gameState.winner) {
            alert("Spiel ist bereits beendet!");
            return;
        }
        
        // **NEU: Temporäres Feld mit dem aktuellen Zug erstellen**
        const updatedField = [...gameState.field]; // Kopie des Feldes
        updatedField[cellId] = currentSymbol; // Zug hinzufügen
        
        console.log("Altes Feld:", gameState.field);
        console.log("Neues Feld mit Zug:", updatedField);
        
        // **Gewinner mit dem AKTUALISIERTEN Feld prüfen**
        const gameResult = checkWinner(updatedField, cellId);
        console.log("Gewinner-Check ergibt:", gameResult);
        
        // Updates vorbereiten
        const updates = {};
        updates[`field/${cellId}`] = currentSymbol; // Feld updaten
        
        // Spieler wechseln
        const nextPlayer = currentSymbol === "X" ? "O" : "X";
        updates['currentPlayer'] = nextPlayer;
        
        // Wenn es einen Gewinner oder Unentschieden gibt
        if (gameResult) {
            updates['winner'] = gameResult;
            
            // Score aktualisieren
            if (gameResult === "X" || gameResult === "O") {
                updates[`scores/${gameResult}`] = (gameState.scores?.[gameResult] || 0) + 1;
            }
        }
        
        // Update zu Firebase senden
        gameRef.update(updates)
            .then(() => {
                console.log("Zug erfolgreich gemacht auf Feld", cellId);
                if (gameResult) {
                    console.log("Spiel beendet! Ergebnis:", gameResult);
                }
            })
            .catch((error) => {
                console.error("Fehler beim Zug:", error);
            });
        
    }).catch((error) => {
        console.error("Fehler beim Zug:", error);
    });
}

// === HILFSFUNKTIONEN ===
function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function checkWinner(field, lastMove) {
    // DEINE VOLLSTÄNDIGE GEWINN-PRÜFLOGIK
    const topLeft = field[1];
    const topMiddle = field[2];
    const topRight = field[3];

    const middleLeft = field[4];
    const middleMiddle = field[5];
    const middleRight = field[6];

    const bottomLeft = field[7];
    const bottomMiddle = field[8];
    const bottomRight = field[9];

    let winner = null;

    // Gewinnbedingungen prüfen
    if (topLeft == topMiddle && topMiddle == topRight && topLeft != " ") {
        winner = topLeft;
    } else if (middleLeft == middleMiddle && middleMiddle == middleRight && middleLeft != " ") {
        winner = middleLeft;
    } else if (bottomLeft == bottomMiddle && bottomMiddle == bottomRight && bottomLeft != " ") {
        winner = bottomLeft;
    } else if (topLeft == middleLeft && middleLeft == bottomLeft && topLeft != " ") {
        winner = topLeft;
    } else if (topMiddle == middleMiddle && middleMiddle == bottomMiddle && topMiddle != " ") {
        winner = topMiddle;
    } else if (topRight == middleRight && middleRight == bottomRight && topRight != " ") {
        winner = topRight;
    } else if (topLeft == middleMiddle && middleMiddle == bottomRight && topLeft != " ") {
        winner = topLeft;
    } else if (bottomLeft == middleMiddle && middleMiddle == topRight && bottomLeft != " ") {
        winner = bottomLeft;
    }
    
    // Unentschieden prüfen
    const isDraw = field.filter(box => box == " ").length === 0;
    
    if (winner) {
        return winner; // "X" oder "O"
    } else if (isDraw) {
        return "draw"; // Unentschieden
    } else {
        return null; // Spiel läuft weiter
    }
}

function isBoardFull(field) {
    for (let i = 1; i <= 9; i++) {
        if (field[i] === " ") return false;
    }
    return true;
}

// === EVENT LISTENER FÜR DAS SPIELFELD ===
for (let i = 1; i <= 9; i++) {
    document.getElementById(i.toString()).onclick = function () {
        makeMove(i);
    };
}

// Reset Funktion anpassen
function reset() {
    if (!currentRoomId) return;

    const gameRef = database.ref('games/' + currentRoomId);
    const resetState = {
        field: ["0", " ", " ", " ", " ", " ", " ", " ", " ", " "],
        currentPlayer: "X",
        winner: null,
        status: "playing"
    };

    gameRef.update(resetState);
}


// === AUTOMATISCHE RAUMBEREINIGUNG ===
function cleanupOldGames() {
    const gamesRef = database.ref('games');
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000); // 1 Stunde
    
    console.log("🧹 Starte Cleanup...");
    
    gamesRef.once('value').then((snapshot) => {
        let deletedCount = 0;
        const updates = {};
        console.log("🧹 Überprüfe Spiele zur Bereinigung...");
        snapshot.forEach((childSnapshot) => {
            const game = childSnapshot.val();
            const gameId = childSnapshot.key;
            
            // Lösche Spiele die:
            const isVeryOld = game.createdAt < oneHourAgo; // Älter als 1 Stunde
            const isFinished = game.winner && game.createdAt < (now - 10 * 60 * 1000); // Beendet + 10 min
            const isWaitingTooLong = game.status === "waiting" && game.createdAt < (now - 30 * 60 * 1000); // Wartet zu lang
            const wasManuallyClosed = game.manuallyClosed; // Manuell geschlossen
            
            if (isVeryOld || isFinished || isWaitingTooLong || wasManuallyClosed || game.status === "closed") {
                updates[gameId] = null; // Zum Löschen markieren
                deletedCount++;
                console.log("🗑️ Lösche:", gameId, {
                    status: game.status,
                    winner: game.winner,
                    alter: Math.round((now - game.createdAt) / 60000) + "min"
                });
            }
        });
        
        // Alle Löschungen auf einmal durchführen
        if (Object.keys(updates).length > 0) {
            gamesRef.update(updates)
                .then(() => console.log(`✅ ${deletedCount} alte Spiele gelöscht`))
                .catch(err => console.error("❌ Fehler beim Löschen:", err));
        } else {
            console.log("✅ Keine alten Spiele gefunden");
        }
    });
}

// === MANUELLES RAUM SCHLIESSEN ===
function closeRoom() {
    if (!currentRoomId) {
        alert("Kein aktiver Raum");
        return;
    }
    
    if (confirm("Raum wirklich schließen? Das beendet das Spiel für alle Spieler.")) {
        const gameRef = database.ref('games/' + currentRoomId);
        
        // Erst als "manuallyClosed" markieren (für andere Spieler)
        gameRef.update({
            manuallyClosed: true,
            status: "closed",
            closedBy: currentPlayerName,
            closedAt: Date.now()
        }).then(() => {
            console.log("✅ Raum als geschlossen markiert:", currentRoomId);
            
            // Dann lokal zurücksetzen
            currentRoomId = null;
            document.getElementById('roomInfo').innerHTML = `
                <h3>🏁 Raum geschlossen</h3>
                <p>Von: ${currentPlayerName}</p>
            `;
            document.getElementById('status').innerHTML = "Spiel beendet";
            
            // Spielfeld zurücksetzen
            for (let i = 1; i <= 9; i++) {
                document.getElementById(i.toString()).innerHTML = " ";
            }
            
            // Nach 3 Sekunden komplett löschen
            setTimeout(() => {
                gameRef.remove()
                    .then(() => console.log("✅ Raum endgültig gelöscht"))
                    .catch(err => console.log("ℹ️ Raum bereits gelöscht"));
            }, 3000);
            
        }).catch(error => {
            console.error("❌ Fehler:", error);
            alert("Raum konnte nicht geschlossen werden");
        });
        cleanupOldGames(); 
    }
}

