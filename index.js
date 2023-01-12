// PSEUDO-CODIGO

// Peparar el juego
// ... Generar tableros
// ... Colocar lo barcos
// Jugar
// Mientras a ambos les quedan barcos por hundir y quedan disparos por hacer
// ... ... Disparar
// ... ... Si agua
// ... ... ... Cambio de turno
// ... ... Sino
// ... ... ... Ver si está hundido
// ... ... ... Preparar estrategia del próximo disparo
// Presentar resultados 

// FUNCIONES

function printHeading (text) {
    const pad = '='.repeat(text.length)
    console.log (`====${pad}====`)
    console.log (`=== ${text} ===`)
    console.log (`====${pad}====`)
}

function printShoot (round, player, shootNumber, shootPlace, result) {
    console.log (`Round ${round} for ${player}`)
    console.log (`Shoot #${shootNumber} pointing to ${shootPlace} : ${result}`)
}

function cambioTurno (turnoParam) {
    if (turnoParam === 'A') {
        ownBoard = 2
        enemyBoard = 3
        return 'B'
    } else {
        ownBoard = 0
        enemyBoard = 1
        return 'A'
    }
    // boards[ownBoard].turno++
}


// Peparar el juego
// ... Generar tableros
const COLS = 10
const ROWS = 10
const MAXDISPAROS = 100

const NADA = '  '
const AGUA = '💧'
const TOCADO = '💥'
const HUNDIDO = '🟥'
const BARCO = '🟨'

class Board {
    constructor(player, own) {
        this.player = player
        this.own = own
        this.squares = []
        for (let i=0 ; i < COLS * ROWS ; i++) {
            this.squares.push (NADA)
        }
        this.estrategia = []      // esta es la memoria para la estrategia en función del resultado del disparo anterior
        this.torpedos = MAXDISPAROS
        this.turno = 0
    }

    paint() {
        let SEPARADOR = '-'.repeat(28)
        if (this.own === true) {
            console.log(`Player ${this.player} (Own board)`)
        } else {
            console.log(`Player ${this.player} (Enemy's board)`)
        }
        console.log(SEPARADOR)
        console.log('|      0 1 2 3 4 5 6 7 8 9 |')
        console.log(SEPARADOR)
        for (let i=0; i<ROWS; i++) {
            let printableRow = ''
            for (let j=0; j<COLS; j++) {
                printableRow = printableRow + this.squares[i*COLS + j] 
            }
            console.log(`| ${i} |` , printableRow, '|')
        }
        console.log(SEPARADOR)
    }

    colocarBarco (longitud) {
        
        // mientras no colisiona con otros busco posición
        
        let noColisiona = true
        let fila = 0
        let columna = 0
        let orientacion = 0

        do {
            noColisiona = true
            // Buscamos orientación y coordenadas a probar
            orientacion = Math.floor(Math.random() * 2)
            // orientacion = 0 --> Horizontal
            // orientacion = 1 --> vertical
            if (orientacion === 0) {
                // Horizontal
                fila = Math.floor(Math.random() * 10)
                columna = Math.floor(Math.random() * (11 - longitud ))
            } else {
                // Vertical
                fila = Math.floor(Math.random() * (11 - longitud))
                columna = Math.floor(Math.random() * 10)
            }
            // Vamos a ver si colisiona
            let workRow = fila
            let workColumn = columna
            for (let i = 0; i < longitud; i++) {
                if (this.squares[(workRow * 10) + workColumn] === BARCO) {
                    noColisiona = false
                }
                if (orientacion === 0) {
                    workColumn++
                } else {
                    workRow++
                }
            }

        } while (noColisiona == false)
        
        // registro el barco en el tablero
        for (let i = 0; i < longitud; i++) {
            this.squares[(fila * 10) + columna] = BARCO
            if (orientacion === 0) {
                columna++
            } else {
                fila++
            }
        }    

    }

    proposeShot () {
        let i = Math.floor(Math.random() * this.squares.length)
        // Recorro el tablero a partir de una posición aleatoria buscando un lugar donde no haya disparado
        do {
            i = (i + 1) % this.squares.length
        } while (this.squares[i] != NADA);
        return i
    }

}

const boards = []
boards.push (new Board('A', true))   // Posición 0
boards.push (new Board('A', false))  // Posición 1
boards.push (new Board('B', true))   // Posición 2
boards.push (new Board('B', false))  // Posición 3

// Inicialización de variables
let turnoActual = 'A' // Empezamos por el jugador 'A'
boards[0].turno = 1
let ownBoard = 0
let enemyBoard = 1

// ... Colocar lo barcos
const numBarcos = [0,3,3,2,1,1] // la posición en el array es la longitud, y el valor el número de barcos de esa longitud 
for (let i = 0; i < numBarcos.length ; i++) {
    if (numBarcos[i] > 0) {
        for (let j= 0 ; j < numBarcos[i]; j++) {
            boards[0].colocarBarco(i) // Player A --> Own Board
            boards[2].colocarBarco(i) // Player B --> Own Board
        }    
    }
}

// Mostrar tableros iniciales
printHeading('The Battleship simulator starts')
boards[0].paint()
boards[2].paint()

// Jugar
printHeading('The game starts')

// Mientras a ambos les quedan barcos por hundir y quedan disparos por hacer
let continuaJuego = true
do {
    let shot = 0
    // ... ... Disparar
    if (boards[ownBoard].estrategia.length > 0) {
        shot = boards[ownBoard].estrategia.shift()
    } else {
        shot = boards[enemyBoard].proposeShot()
    }

    if (boards[(ownBoard + 2) % 4].squares[shot] === BARCO) {
        // TOCADO 
        boards[(ownBoard + 2) % 4].squares[shot] = TOCADO
        boards[enemyBoard].squares[shot] = TOCADO
    } else {
        // AGUA
        boards[(ownBoard + 2) % 4].squares[shot] = AGUA
        boards[enemyBoard].squares[shot] = AGUA
        boards[(ownBoard + 2) % 4].turno++
    }
    boards[ownBoard].torpedos--

    // ... ... Si agua
    // ... ... ... Cambio de turno
    // ... ... Sino
    // ... ... ... Ver si está hundido
    // ... ... ... Preparar estrategia del próximo disparo

    // Imprimir tableros
    printHeading(`Round ${boards[ownBoard].turno} for player ${boards[ownBoard].player}`)
    console.log(`Shot ${MAXDISPAROS-boards[ownBoard].torpedos} ponting to ${shot}: ${boards[enemyBoard].squares[shot]}`)
    boards[ownBoard].paint()
    boards[enemyBoard].paint()
    
    // Ver si se acaba el juego
    continuaJuego = true
    if (boards[ownBoard].torpedos === 0) {
        // se me acabaron los disparos
        continuaJuego = false
    } else if (boards[ownBoard].squares.filter(val => val === BARCO).length === 0) {
        // No me queda ningún barco a flote
        continuaJuego = false
    } else if (boards[(ownBoard + 2) % 4].squares.filter(val => val === BARCO).length === 0) {
        // No le queda ningún barco a flote al enemigo
        continuaJuego = false
    } else {
        // Miramos si hay cambio de turno
        if (boards[enemyBoard].squares[shot] === AGUA) {
            turnoActual = cambioTurno(turnoActual)
        }
    }

} while (continuaJuego)
// Presentar resultados 



