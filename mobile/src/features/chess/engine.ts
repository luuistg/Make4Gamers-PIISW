export type ChessColor = 'white' | 'black'
export type ChessPieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king'

export type ChessPiece = {
  color: ChessColor
  type: ChessPieceType
}

export type ChessSquare = {
  row: number
  col: number
}

export type ChessMove = {
  from: ChessSquare
  to: ChessSquare
  piece: ChessPiece
  capturedPiece?: ChessPiece | null
  capturedAt?: ChessSquare
  promotion?: ChessPieceType
  castle?: 'king' | 'queen'
  enPassant?: boolean
}

export type ChessBoard = (ChessPiece | null)[][]

type ChessCastlingRights = {
  white: {
    kingSide: boolean
    queenSide: boolean
  }
  black: {
    kingSide: boolean
    queenSide: boolean
  }
}

export type ChessPosition = {
  board: ChessBoard
  turn: ChessColor
  castlingRights: ChessCastlingRights
  enPassantTarget: ChessSquare | null
  halfmoveClock: number
  moveNumber: number
  lastMove: ChessMove | null
  history: string[]
}

export type ChessGameStatus = {
  kind: 'playing' | 'check' | 'checkmate' | 'stalemate'
  winner: ChessColor | 'draw' | null
  message: string
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const BACK_RANK: ChessPieceType[] = [
  'rook',
  'knight',
  'bishop',
  'queen',
  'king',
  'bishop',
  'knight',
  'rook',
]

const PIECE_VALUES: Record<ChessPieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
}

const INITIAL_COUNTS: Record<ChessPieceType, number> = {
  pawn: 8,
  knight: 2,
  bishop: 2,
  rook: 2,
  queen: 1,
  king: 1,
}

function createPiece(type: ChessPieceType, color: ChessColor): ChessPiece {
  return { type, color }
}

function cloneSquare(square: ChessSquare): ChessSquare {
  return { row: square.row, col: square.col }
}

function cloneBoard(board: ChessBoard): ChessBoard {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)))
}

function cloneCastlingRights(rights: ChessCastlingRights): ChessCastlingRights {
  return {
    white: { ...rights.white },
    black: { ...rights.black },
  }
}

function isInside(row: number, col: number) {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

function areSquaresEqual(first: ChessSquare, second: ChessSquare) {
  return first.row === second.row && first.col === second.col
}

function getOppositeColor(color: ChessColor): ChessColor {
  return color === 'white' ? 'black' : 'white'
}

function getPieceLetter(type: ChessPieceType) {
  switch (type) {
    case 'knight':
      return 'N'
    case 'bishop':
      return 'B'
    case 'rook':
      return 'R'
    case 'queen':
      return 'Q'
    case 'king':
      return 'K'
    default:
      return ''
  }
}

function toAlgebraic(square: ChessSquare) {
  return `${FILES[square.col]}${8 - square.row}`
}

function moveToNotation(move: ChessMove) {
  if (move.castle === 'king') {
    return 'O-O'
  }

  if (move.castle === 'queen') {
    return 'O-O-O'
  }

  const pieceLetter = getPieceLetter(move.piece.type)
  const captureMarker = move.capturedPiece || move.enPassant ? 'x' : '-'
  const promotionSuffix = move.promotion ? `=${getPieceLetter(move.promotion)}` : ''

  return `${pieceLetter}${toAlgebraic(move.from)}${captureMarker}${toAlgebraic(move.to)}${promotionSuffix}`
}

function buildInitialBoard(): ChessBoard {
  const board: ChessBoard = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null),
  )

  BACK_RANK.forEach((type, col) => {
    board[0][col] = createPiece(type, 'black')
    board[7][col] = createPiece(type, 'white')
  })

  for (let col = 0; col < 8; col += 1) {
    board[1][col] = createPiece('pawn', 'black')
    board[6][col] = createPiece('pawn', 'white')
  }

  return board
}

function getPiece(board: ChessBoard, square: ChessSquare) {
  return board[square.row]?.[square.col] ?? null
}

function getKingSquare(position: ChessPosition, color: ChessColor): ChessSquare | null {
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = position.board[row][col]

      if (piece?.type === 'king' && piece.color === color) {
        return { row, col }
      }
    }
  }

  return null
}

function getAttackDirections(type: ChessPieceType) {
  if (type === 'bishop') {
    return [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]
  }

  if (type === 'rook') {
    return [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
  }

  return [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
}

function isSquareAttacked(position: ChessPosition, square: ChessSquare, byColor: ChessColor) {
  const pawnRow = square.row + (byColor === 'white' ? 1 : -1)

  for (const colOffset of [-1, 1]) {
    const pawnCol = square.col + colOffset

    if (!isInside(pawnRow, pawnCol)) {
      continue
    }

    const piece = position.board[pawnRow][pawnCol]

    if (piece?.color === byColor && piece.type === 'pawn') {
      return true
    }
  }

  const knightOffsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ]

  for (const [rowOffset, colOffset] of knightOffsets) {
    const targetRow = square.row + rowOffset
    const targetCol = square.col + colOffset

    if (!isInside(targetRow, targetCol)) {
      continue
    }

    const piece = position.board[targetRow][targetCol]

    if (piece?.color === byColor && piece.type === 'knight') {
      return true
    }
  }

  for (const [rowOffset, colOffset] of getAttackDirections('queen')) {
    let targetRow = square.row + rowOffset
    let targetCol = square.col + colOffset

    while (isInside(targetRow, targetCol)) {
      const piece = position.board[targetRow][targetCol]

      if (!piece) {
        targetRow += rowOffset
        targetCol += colOffset
        continue
      }

      if (piece.color !== byColor) {
        break
      }

      if (
        piece.type === 'queen' ||
        (piece.type === 'bishop' && Math.abs(rowOffset) === Math.abs(colOffset)) ||
        (piece.type === 'rook' && (rowOffset === 0 || colOffset === 0))
      ) {
        return true
      }

      break
    }
  }

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue
      }

      const targetRow = square.row + rowOffset
      const targetCol = square.col + colOffset

      if (!isInside(targetRow, targetCol)) {
        continue
      }

      const piece = position.board[targetRow][targetCol]

      if (piece?.color === byColor && piece.type === 'king') {
        return true
      }
    }
  }

  return false
}

function disableRookCastlingIfNeeded(
  rights: ChessCastlingRights,
  piece: ChessPiece | null,
  square: ChessSquare,
) {
  if (!piece || piece.type !== 'rook') {
    return
  }

  if (piece.color === 'white' && square.row === 7) {
    if (square.col === 0) {
      rights.white.queenSide = false
    }

    if (square.col === 7) {
      rights.white.kingSide = false
    }
  }

  if (piece.color === 'black' && square.row === 0) {
    if (square.col === 0) {
      rights.black.queenSide = false
    }

    if (square.col === 7) {
      rights.black.kingSide = false
    }
  }
}

function makeMove(position: ChessPosition, move: ChessMove, recordHistory: boolean): ChessPosition {
  const board = cloneBoard(position.board)
  const castlingRights = cloneCastlingRights(position.castlingRights)
  const movingPiece = board[move.from.row][move.from.col]

  if (!movingPiece) {
    return position
  }

  const capturedSquare = move.capturedAt ?? move.to
  const capturedPiece =
    move.enPassant && move.capturedAt ? board[move.capturedAt.row][move.capturedAt.col] : board[move.to.row][move.to.col]

  board[move.from.row][move.from.col] = null

  if (move.enPassant && move.capturedAt) {
    board[move.capturedAt.row][move.capturedAt.col] = null
  }

  if (move.castle === 'king') {
    const rook = board[move.from.row][7]
    board[move.from.row][7] = null
    board[move.from.row][5] = rook
  }

  if (move.castle === 'queen') {
    const rook = board[move.from.row][0]
    board[move.from.row][0] = null
    board[move.from.row][3] = rook
  }

  board[move.to.row][move.to.col] = move.promotion
    ? createPiece(move.promotion, movingPiece.color)
    : movingPiece

  if (movingPiece.type === 'king') {
    castlingRights[movingPiece.color].kingSide = false
    castlingRights[movingPiece.color].queenSide = false
  }

  disableRookCastlingIfNeeded(castlingRights, movingPiece, move.from)
  disableRookCastlingIfNeeded(castlingRights, capturedPiece ?? null, capturedSquare)

  const nextEnPassantTarget =
    movingPiece.type === 'pawn' && Math.abs(move.from.row - move.to.row) === 2
      ? { row: (move.from.row + move.to.row) / 2, col: move.from.col }
      : null

  const nextHalfmoveClock =
    movingPiece.type === 'pawn' || capturedPiece
      ? 0
      : position.halfmoveClock + 1

  const nextMoveNumber =
    position.turn === 'black' ? position.moveNumber + 1 : position.moveNumber

  return {
    board,
    turn: getOppositeColor(position.turn),
    castlingRights,
    enPassantTarget: nextEnPassantTarget,
    halfmoveClock: nextHalfmoveClock,
    moveNumber: nextMoveNumber,
    lastMove: {
      ...move,
      capturedPiece: capturedPiece ?? null,
      capturedAt: move.capturedAt ? cloneSquare(move.capturedAt) : undefined,
    },
    history: recordHistory ? [...position.history, moveToNotation({ ...move, capturedPiece })] : position.history,
  }
}

function getSlidingMoves(position: ChessPosition, from: ChessSquare, piece: ChessPiece) {
  const moves: ChessMove[] = []

  for (const [rowOffset, colOffset] of getAttackDirections(piece.type)) {
    let targetRow = from.row + rowOffset
    let targetCol = from.col + colOffset

    while (isInside(targetRow, targetCol)) {
      const targetPiece = position.board[targetRow][targetCol]

      if (!targetPiece) {
        moves.push({
          from,
          to: { row: targetRow, col: targetCol },
          piece,
        })
        targetRow += rowOffset
        targetCol += colOffset
        continue
      }

      if (targetPiece.color !== piece.color) {
        moves.push({
          from,
          to: { row: targetRow, col: targetCol },
          piece,
          capturedPiece: targetPiece,
        })
      }

      break
    }
  }

  return moves
}

function getPawnMoves(position: ChessPosition, from: ChessSquare, piece: ChessPiece) {
  const moves: ChessMove[] = []
  const direction = piece.color === 'white' ? -1 : 1
  const startRow = piece.color === 'white' ? 6 : 1
  const promotionRow = piece.color === 'white' ? 0 : 7
  const oneStepRow = from.row + direction

  if (isInside(oneStepRow, from.col) && !position.board[oneStepRow][from.col]) {
    moves.push({
      from,
      to: { row: oneStepRow, col: from.col },
      piece,
      promotion: oneStepRow === promotionRow ? 'queen' : undefined,
    })

    const twoStepRow = from.row + direction * 2

    if (
      from.row === startRow &&
      isInside(twoStepRow, from.col) &&
      !position.board[twoStepRow][from.col]
    ) {
      moves.push({
        from,
        to: { row: twoStepRow, col: from.col },
        piece,
      })
    }
  }

  for (const colOffset of [-1, 1]) {
    const targetRow = from.row + direction
    const targetCol = from.col + colOffset

    if (!isInside(targetRow, targetCol)) {
      continue
    }

    const targetPiece = position.board[targetRow][targetCol]

    if (targetPiece && targetPiece.color !== piece.color) {
      moves.push({
        from,
        to: { row: targetRow, col: targetCol },
        piece,
        capturedPiece: targetPiece,
        promotion: targetRow === promotionRow ? 'queen' : undefined,
      })
    }

    if (
      position.enPassantTarget &&
      position.enPassantTarget.row === targetRow &&
      position.enPassantTarget.col === targetCol
    ) {
      const capturedAt = { row: from.row, col: targetCol }
      const capturedPiece = position.board[capturedAt.row][capturedAt.col]

      if (capturedPiece?.type === 'pawn' && capturedPiece.color !== piece.color) {
        moves.push({
          from,
          to: { row: targetRow, col: targetCol },
          piece,
          capturedPiece,
          capturedAt,
          enPassant: true,
        })
      }
    }
  }

  return moves
}

function getKnightMoves(position: ChessPosition, from: ChessSquare, piece: ChessPiece) {
  const moves: ChessMove[] = []
  const offsets = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ]

  for (const [rowOffset, colOffset] of offsets) {
    const targetRow = from.row + rowOffset
    const targetCol = from.col + colOffset

    if (!isInside(targetRow, targetCol)) {
      continue
    }

    const targetPiece = position.board[targetRow][targetCol]

    if (targetPiece?.color === piece.color) {
      continue
    }

    moves.push({
      from,
      to: { row: targetRow, col: targetCol },
      piece,
      capturedPiece: targetPiece ?? undefined,
    })
  }

  return moves
}

function getKingMoves(position: ChessPosition, from: ChessSquare, piece: ChessPiece) {
  const moves: ChessMove[] = []

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue
      }

      const targetRow = from.row + rowOffset
      const targetCol = from.col + colOffset

      if (!isInside(targetRow, targetCol)) {
        continue
      }

      const targetPiece = position.board[targetRow][targetCol]

      if (targetPiece?.color === piece.color) {
        continue
      }

      moves.push({
        from,
        to: { row: targetRow, col: targetCol },
        piece,
        capturedPiece: targetPiece ?? undefined,
      })
    }
  }

  const enemyColor = getOppositeColor(piece.color)
  const rights = position.castlingRights[piece.color]
  const homeRow = piece.color === 'white' ? 7 : 0

  if (
    from.row === homeRow &&
    from.col === 4 &&
    !isSquareAttacked(position, from, enemyColor)
  ) {
    const kingSideRook = position.board[homeRow][7]

    if (
      rights.kingSide &&
      kingSideRook?.type === 'rook' &&
      kingSideRook.color === piece.color &&
      !position.board[homeRow][5] &&
      !position.board[homeRow][6] &&
      !isSquareAttacked(position, { row: homeRow, col: 5 }, enemyColor) &&
      !isSquareAttacked(position, { row: homeRow, col: 6 }, enemyColor)
    ) {
      moves.push({
        from,
        to: { row: homeRow, col: 6 },
        piece,
        castle: 'king',
      })
    }

    const queenSideRook = position.board[homeRow][0]

    if (
      rights.queenSide &&
      queenSideRook?.type === 'rook' &&
      queenSideRook.color === piece.color &&
      !position.board[homeRow][1] &&
      !position.board[homeRow][2] &&
      !position.board[homeRow][3] &&
      !isSquareAttacked(position, { row: homeRow, col: 3 }, enemyColor) &&
      !isSquareAttacked(position, { row: homeRow, col: 2 }, enemyColor)
    ) {
      moves.push({
        from,
        to: { row: homeRow, col: 2 },
        piece,
        castle: 'queen',
      })
    }
  }

  return moves
}

function getPseudoMoves(position: ChessPosition, from: ChessSquare, piece: ChessPiece) {
  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(position, from, piece)
    case 'knight':
      return getKnightMoves(position, from, piece)
    case 'bishop':
    case 'rook':
    case 'queen':
      return getSlidingMoves(position, from, piece)
    case 'king':
      return getKingMoves(position, from, piece)
    default:
      return []
  }
}

function getLegalMovesForPiece(position: ChessPosition, from: ChessSquare) {
  const piece = getPiece(position.board, from)

  if (!piece) {
    return []
  }

  return getPseudoMoves(position, from, piece).filter((move) => {
    const nextPosition = makeMove(position, move, false)
    const kingSquare = getKingSquare(nextPosition, piece.color)

    if (!kingSquare) {
      return false
    }

    return !isSquareAttacked(nextPosition, kingSquare, getOppositeColor(piece.color))
  })
}

function getAllLegalMoves(position: ChessPosition, color = position.turn) {
  const moves: ChessMove[] = []

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = position.board[row][col]

      if (!piece || piece.color !== color) {
        continue
      }

      moves.push(...getLegalMovesForPiece(position, { row, col }))
    }
  }

  return moves
}

function getPiecePositionBonus(piece: ChessPiece, row: number, col: number) {
  const centerDistance = Math.abs(3.5 - row) + Math.abs(3.5 - col)
  const centerBonus = Math.round((4 - centerDistance) * 4)

  if (piece.type === 'pawn') {
    const advancement = piece.color === 'white' ? 6 - row : row - 1
    return advancement * 6 + centerBonus
  }

  if (piece.type === 'knight' || piece.type === 'bishop') {
    return centerBonus * 2
  }

  if (piece.type === 'queen') {
    return centerBonus
  }

  return centerBonus
}

function evaluatePosition(position: ChessPosition, perspective: ChessColor) {
  const status = getGameStatus(position)

  if (status.kind === 'checkmate') {
    return status.winner === perspective ? 100000 : -100000
  }

  if (status.kind === 'stalemate') {
    return 0
  }

  let score = 0

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = position.board[row][col]

      if (!piece) {
        continue
      }

      const multiplier = piece.color === perspective ? 1 : -1
      const material = PIECE_VALUES[piece.type]
      const positional = getPiecePositionBonus(piece, row, col)

      score += multiplier * (material + positional)
    }
  }

  const ownMoves = getAllLegalMoves(position, perspective).length
  const opponentMoves = getAllLegalMoves(position, getOppositeColor(perspective)).length
  score += (ownMoves - opponentMoves) * 2

  if (status.kind === 'check') {
    score += position.turn === perspective ? -35 : 35
  }

  return score
}

function scoreMove(move: ChessMove) {
  let score = 0

  if (move.capturedPiece) {
    score += PIECE_VALUES[move.capturedPiece.type] - Math.round(PIECE_VALUES[move.piece.type] / 10)
  }

  if (move.promotion) {
    score += PIECE_VALUES[move.promotion]
  }

  if (move.castle) {
    score += 35
  }

  const centerDistance = Math.abs(3.5 - move.to.row) + Math.abs(3.5 - move.to.col)
  score += Math.round((4 - centerDistance) * 3)

  return score
}

function minimax(
  position: ChessPosition,
  depth: number,
  alpha: number,
  beta: number,
  maximizingColor: ChessColor,
): number {
  const status = getGameStatus(position)

  if (depth === 0 || status.kind === 'checkmate' || status.kind === 'stalemate') {
    return evaluatePosition(position, maximizingColor)
  }

  const moves = getAllLegalMoves(position, position.turn).sort((firstMove, secondMove) => {
    return scoreMove(secondMove) - scoreMove(firstMove)
  })

  if (position.turn === maximizingColor) {
    let bestScore = -Infinity

    for (const move of moves) {
      const nextPosition = makeMove(position, move, false)
      bestScore = Math.max(bestScore, minimax(nextPosition, depth - 1, alpha, beta, maximizingColor))
      alpha = Math.max(alpha, bestScore)

      if (beta <= alpha) {
        break
      }
    }

    return bestScore
  }

  let bestScore = Infinity

  for (const move of moves) {
    const nextPosition = makeMove(position, move, false)
    bestScore = Math.min(bestScore, minimax(nextPosition, depth - 1, alpha, beta, maximizingColor))
    beta = Math.min(beta, bestScore)

    if (beta <= alpha) {
      break
    }
  }

  return bestScore
}

export function createInitialChessPosition(): ChessPosition {
  return {
    board: buildInitialBoard(),
    turn: 'white',
    castlingRights: {
      white: {
        kingSide: true,
        queenSide: true,
      },
      black: {
        kingSide: true,
        queenSide: true,
      },
    },
    enPassantTarget: null,
    halfmoveClock: 0,
    moveNumber: 1,
    lastMove: null,
    history: [],
  }
}

export function getSquarePiece(position: ChessPosition, row: number, col: number) {
  if (!isInside(row, col)) {
    return null
  }

  return position.board[row][col]
}

export function getLegalMovesForSquare(position: ChessPosition, row: number, col: number) {
  if (!isInside(row, col)) {
    return []
  }

  return getLegalMovesForPiece(position, { row, col })
}

export function applyChessMove(position: ChessPosition, move: ChessMove) {
  return makeMove(position, move, true)
}

export function isKingInCheck(position: ChessPosition, color: ChessColor) {
  const kingSquare = getKingSquare(position, color)

  if (!kingSquare) {
    return false
  }

  return isSquareAttacked(position, kingSquare, getOppositeColor(color))
}

export function getGameStatus(position: ChessPosition): ChessGameStatus {
  const legalMoves = getAllLegalMoves(position, position.turn)
  const inCheck = isKingInCheck(position, position.turn)

  if (legalMoves.length === 0) {
    if (inCheck) {
      const winner = getOppositeColor(position.turn)

      return {
        kind: 'checkmate',
        winner,
        message: `Jaque mate. Ganan las ${winner === 'white' ? 'blancas' : 'negras'}.`,
      }
    }

    return {
      kind: 'stalemate',
      winner: 'draw',
      message: 'Tablas por ahogado.',
    }
  }

  if (inCheck) {
    return {
      kind: 'check',
      winner: null,
      message: `Jaque a las ${position.turn === 'white' ? 'blancas' : 'negras'}.`,
    }
  }

  return {
    kind: 'playing',
    winner: null,
    message: `Turno de las ${position.turn === 'white' ? 'blancas' : 'negras'}.`,
  }
}

export function pickBotMove(position: ChessPosition, botColor: ChessColor) {
  if (position.turn !== botColor) {
    return null
  }

  const legalMoves = getAllLegalMoves(position, botColor)

  if (!legalMoves.length) {
    return null
  }

  const depth = legalMoves.length > 14 ? 1 : 2
  let bestScore = -Infinity
  let bestMoves: ChessMove[] = []

  for (const move of legalMoves.sort((firstMove, secondMove) => scoreMove(secondMove) - scoreMove(firstMove))) {
    const nextPosition = makeMove(position, move, false)
    const score = minimax(nextPosition, depth, -Infinity, Infinity, botColor)

    if (score > bestScore) {
      bestScore = score
      bestMoves = [move]
      continue
    }

    if (score === bestScore) {
      bestMoves.push(move)
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)] ?? legalMoves[0]
}

export function getCapturedPieces(position: ChessPosition, color: ChessColor) {
  const counts: Record<ChessPieceType, number> = {
    pawn: 0,
    knight: 0,
    bishop: 0,
    rook: 0,
    queen: 0,
    king: 0,
  }

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const piece = position.board[row][col]

      if (piece?.color === color) {
        counts[piece.type] += 1
      }
    }
  }

  const captured: ChessPieceType[] = []

  for (const type of Object.keys(INITIAL_COUNTS) as ChessPieceType[]) {
    const missingCount = INITIAL_COUNTS[type] - counts[type]

    for (let index = 0; index < missingCount; index += 1) {
      captured.push(type)
    }
  }

  return captured.sort((firstType, secondType) => PIECE_VALUES[secondType] - PIECE_VALUES[firstType])
}

export function formatMoveHistory(history: string[], limit = 8) {
  return history.slice(-limit).reverse()
}

export function isMoveTarget(move: ChessMove, square: ChessSquare) {
  return areSquaresEqual(move.to, square)
}
