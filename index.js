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
}


// Peparar el juego
// ... Generar tableros
const COLS = 10
const ROWS = 10
const MAXDISPAROS = 100 // Máximo 100, pero aunque se indiquen más nop pasa nada porque parará al eliminar todos los barcos del tablero

const NADA = '  '
const AGUA = '💧'
const TOCADO = '💥'
const HUNDIDO = '🟥'
const BARCO = '🟨'

class Board {
    constructor(player, own, conEstrategia = false) {
        this.player = player
        this.own = own
        this.squares = []
        this.ships = []
        for (let i=0 ; i < COLS * ROWS ; i++) {
            this.squares.push (NADA)
            this.ships.push('')
        }
        this.conEstrategia = conEstrategia
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
            // con filas 0..9 --> console.log(`| ${i} |` , printableRow, '|')
            console.log(`| ${String.fromCharCode(i+65)} |` , printableRow, '|')
        }
        console.log(SEPARADOR)
    }

    colocarBarco (idBarco,longitud) {
        
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
            this.ships[(fila * 10) + columna] = idBarco
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

    numCasillasVivas () {
        let i = this.squares.filter (val => val === BARCO).length
        return i
    }

}

const boards = []
boards.push (new Board('A', true, false))   // Posición 0
boards.push (new Board('A', false, false))  // Posición 1
boards.push (new Board('B', true, true))   // Posición 2 - A este le damos inteligencia: B = Inteligente (A no)
boards.push (new Board('B', false, false))  // Posición 3

// Inicialización de variables
let turnoActual = 'A' // Empezamos por el jugador 'A'
boards[0].turno = 1
let ownBoard = 0
let enemyBoard = 1

// ... Colocar lo barcos
const numBarcos = [0,3,3,2,1,1] // la posición en el array es la longitud, y el valor el número de barcos de esa longitud 
let idBarco = 0
for (let i = numBarcos.length; i > 0 ; --i) { // Recorremos de mayor a menor, para que sea más fácil colocarlos
    if (numBarcos[i] > 0) {
        for (let j= 0 ; j < numBarcos[i]; j++) {
            boards[0].colocarBarco(idBarco,i) // Player A --> Own Board
            boards[2].colocarBarco(idBarco,i) // Player B --> Own Board
            idBarco++
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
    let sunk = false
    // ... ... Disparar
    if (boards[ownBoard].conEstrategia && boards[ownBoard].estrategia.length > 0) {
        shot = boards[ownBoard].estrategia.shift()
    } else {
        shot = boards[enemyBoard].proposeShot()
    }

    if (boards[(ownBoard + 2) % 4].squares[shot] === BARCO) {
        // TOCADO 
        boards[(ownBoard + 2) % 4].squares[shot] = TOCADO
        boards[enemyBoard].squares[shot] = TOCADO
        // Miramos si es hunido
        idBarco = boards[(ownBoard + 2) % 4].ships[shot] 
        if (boards[(ownBoard + 2) % 4].ships.filter(val => val == idBarco).length == 1) {
            // sólo quedaba esta casilla por tocar --> Hundido
            sunk = true
            boards[ownBoard].estrategia = []  // Limpiamos el buffer de posibles disparos
        } 
        boards[(ownBoard + 2) % 4].ships[shot] = ''
        // Actualizamos la estrategia
        if (boards[ownBoard].conEstrategia) {
            boards[ownBoard].estrategia = []
            if (((shot - 10) >= 0) && (boards[enemyBoard].squares[shot-10] === NADA)) {
                boards[ownBoard].estrategia.push(shot - 10)
            } 
            if ((shot - 1) >= 0 && (boards[enemyBoard].squares[shot-1] === NADA)) {
                boards[ownBoard].estrategia.push(shot - 1)
            } 
            if ((shot + 10) <= 99 && (boards[enemyBoard].squares[shot+10] === NADA)) {
                boards[ownBoard].estrategia.push(shot + 10)
            } 
            if ((shot + 1) <= 99 && (boards[enemyBoard].squares[shot+1] === NADA)) {
                boards[ownBoard].estrategia.push(shot + 1)
            } 
        }

    } else {
        // AGUA
        boards[(ownBoard + 2) % 4].squares[shot] = AGUA
        boards[enemyBoard].squares[shot] = AGUA
        boards[(ownBoard + 2) % 4].turno++
    }
    boards[ownBoard].torpedos--

    // Imprimir tableros
    printHeading(`Round ${boards[ownBoard].turno} for player ${boards[ownBoard].player}`)
    let shotRow = Math.floor (shot / 10)
    let shotColumn = shot % 10
    console.log(`Shot ${MAXDISPAROS-boards[ownBoard].torpedos} ponting to ${String.fromCharCode(shotRow+65)}-${shotColumn}: ${boards[enemyBoard].squares[shot]}`)
    if (sunk) {
        console.log('🎯 Sunk Ship! 👏👏👏')
    }
    console.log(`Remaining shots: ${boards[ownBoard].torpedos}`)
    boards[ownBoard].paint()
    boards[enemyBoard].paint()
    
    // Ver si se acaba el juego
    continuaJuego = true
    if ((boards[ownBoard].torpedos === 0) && (boards[(ownBoard + 2) % 4].torpedos === 0)) {
        // Se les terminaron los torpedos a ambos jugadores
        continuaJuego = false
    } else if (boards[ownBoard].squares.filter(val => val === BARCO).length === 0) {
        // No me queda ningún barco a flote
        continuaJuego = false
    } else if (boards[(ownBoard + 2) % 4].squares.filter(val => val === BARCO).length === 0) {
        // No le queda ningún barco a flote al enemigo
        continuaJuego = false
    } else {
        // Miramos si hay cambio de turno
        if ((boards[enemyBoard].squares[shot] === AGUA) || (boards[ownBoard].torpedos === 0)) {
            if (boards[(ownBoard + 2 ) % 4].torpedos > 0) {
                // Solo cambio el turno si al otro jugador todavía le quedan torpedos
                turnoActual = cambioTurno(turnoActual)
            }
        }
    }

} while (continuaJuego)

// Presentar resultados 
// gana el jugador que más casillas tenga sin tocar
let resultado = ''
i = boards[0].numCasillasVivas() - boards[2].numCasillasVivas()
if (i === 0) {
    resultado = `Empate A y B, con ${boards[0].numCasillasVivas()} casillas pendientes`
} else if (i > 0) {
    resultado = `Ganador A 🏆, con ${boards[0].numCasillasVivas()} casillas pendientes, frente a ${boards[2].numCasillasVivas()} de B`
} else {
    resultado = `Ganador B 🏆, con ${boards[2].numCasillasVivas()} casillas pendientes, frente a ${boards[0].numCasillasVivas()} de A`
}

printHeading(resultado)
console.log('Final boards:')
boards[0].paint()
boards[2].paint()



