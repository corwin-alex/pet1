import { useState, useCallback } from 'react'

const BOARD_SIZE = 12
const WIN_COUNT = 5

function App() {
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [isDraw, setIsDraw] = useState(false)

  const calculateWinner = useCallback((squares) => {
    // Проверка горизонталей
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col <= BOARD_SIZE - WIN_COUNT; col++) {
        const line = []
        for (let i = 0; i < WIN_COUNT; i++) {
          line.push(row * BOARD_SIZE + col + i)
        }
        const [a, b, c, d, e] = line
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c] &&
          squares[a] === squares[d] &&
          squares[a] === squares[e]
        ) {
          return { winner: squares[a], line }
        }
      }
    }

    // Проверка вертикалей
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row <= BOARD_SIZE - WIN_COUNT; row++) {
        const line = []
        for (let i = 0; i < WIN_COUNT; i++) {
          line.push((row + i) * BOARD_SIZE + col)
        }
        const [a, b, c, d, e] = line
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c] &&
          squares[a] === squares[d] &&
          squares[a] === squares[e]
        ) {
          return { winner: squares[a], line }
        }
      }
    }

    // Проверка диагоналей (слева направо, сверху вниз)
    for (let row = 0; row <= BOARD_SIZE - WIN_COUNT; row++) {
      for (let col = 0; col <= BOARD_SIZE - WIN_COUNT; col++) {
        const line = []
        for (let i = 0; i < WIN_COUNT; i++) {
          line.push((row + i) * BOARD_SIZE + col + i)
        }
        const [a, b, c, d, e] = line
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c] &&
          squares[a] === squares[d] &&
          squares[a] === squares[e]
        ) {
          return { winner: squares[a], line }
        }
      }
    }

    // Проверка диагоналей (справа налево, сверху вниз)
    for (let row = 0; row <= BOARD_SIZE - WIN_COUNT; row++) {
      for (let col = WIN_COUNT - 1; col < BOARD_SIZE; col++) {
        const line = []
        for (let i = 0; i < WIN_COUNT; i++) {
          line.push((row + i) * BOARD_SIZE + col - i)
        }
        const [a, b, c, d, e] = line
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c] &&
          squares[a] === squares[d] &&
          squares[a] === squares[e]
        ) {
          return { winner: squares[a], line }
        }
      }
    }

    return null
  }, [])

  const checkDraw = useCallback((squares) => {
    return squares.every(square => square !== null)
  }, [])

  const handleClick = useCallback((index) => {
    if (board[index] || winner || isDraw) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)

    const result = calculateWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
    } else if (checkDraw(newBoard)) {
      setIsDraw(true)
    } else {
      setIsXNext(!isXNext)
    }
  }, [board, isXNext, winner, isDraw, calculateWinner, checkDraw])

  const handleReset = useCallback(() => {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine([])
    setIsDraw(false)
  }, [])

  const getStatusMessage = () => {
    if (winner) {
      return `🏆 Победил Игрок ${winner === 'X' ? '1' : '2'} (${winner})!`
    }
    if (isDraw) {
      return '🤝 Ничья!'
    }
    return `Ход игрока ${isXNext ? '1' : '2'} (${isXNext ? 'X' : 'O'})`
  }

  return (
    <div className="game-container">
      <h1>Крестики-нолики 12×12</h1>
      
      <div className="status">{getStatusMessage()}</div>
      
      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell ? cell.toLowerCase() : ''} ${winningLine.includes(index) ? 'winning' : ''} ${winner || isDraw ? 'disabled' : ''}`}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner || isDraw}
          >
            {cell}
          </button>
        ))}
      </div>
      
      <button className="reset-button" onClick={handleReset}>
        Начать заново
      </button>

      {(winner || isDraw) && (
        <div className="modal-overlay" onClick={handleReset}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{winner ? '🎉 Победа!' : '🤝 Ничья!'}</h2>
            <p>
              {winner 
                ? `Игрок ${winner === 'X' ? '1' : '2'} (${winner}) выиграл!`
                : 'Победила дружба!'}
            </p>
            <button className="reset-button" onClick={handleReset}>
              Играть снова
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
