// PSEUDO-CODIGO

// Peparar el juego
// ... Generar tableros
// ... Colocar lo barcos
// Jugar
// Mientras a ambos les quedan barcos por hundir y quedan disparos por hacer
// ... Mientras no hay cambio de turno
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

function cambioTurno (shift) {
    if shift = 'A' {
        return 'B'
    } else {
        return 'A'
    }
}

function colocarBarco (player, length, coordX , coordY, direction) {

}

// Peparar el juego
// ... Generar tableros
const COLS = 10
const ROWS = 10

const AGUA = '💧'
const TOCADO = '💥'
const HUNDIDO = '🟥'
const BARCO = '🟨'

let shift = 'A'

class Board {
    constructor(player, own) {
        this.player = player
        this.own = own
        this.squares = []
        for (let i=0 ; i < COLS * ROWS ; i++) {
            this.squares.push (' ')
        }
    }

    paint() {
        console.log(`Player ${this.player}`)
        for (let i=0; i<ROWS; i++) {
            let printableRow = ''
            for (let j=0; j<COLS; j++) {
                printableRow = printableRow + this.squares[i*COLS + j] 
            }
            console.log(printableRow)
        }
    }
}

const boards = []
boards.push (new Board('A', true))
boards.push (new Board('A', false))
boards.push (new Board('B', true))
boards.push (new Board('A', false))

// ... Colocar lo barcos



// Jugar
// Mientras a ambos les quedan barcos por hundir y quedan disparos por hacer
// ... Mientras no hay cambio de turno
// ... ... Disparar
// ... ... Si agua
// ... ... ... Cambio de turno
// ... ... Sino
// ... ... ... Ver si está hundido
// ... ... ... Preparar estrategia del próximo disparo
// Presentar resultados 

console.log ('final')
boards[1].paint()