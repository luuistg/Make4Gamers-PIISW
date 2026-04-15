import Svg, { Circle, Path, Rect } from 'react-native-svg'

import type { ChessColor, ChessPieceType } from '@/src/features/chess/engine'

type ChessPieceIconProps = {
  type: ChessPieceType
  color: ChessColor
  size: number
}

const OUTLINE = '3'
const DETAIL = '2.6'

function getPalette(color: ChessColor) {
  if (color === 'white') {
    return {
      fill: '#f8fafc',
      stroke: '#0f172a',
      accent: '#cbd5e1',
    }
  }

  return {
    fill: '#0f172a',
    stroke: '#e2e8f0',
    accent: '#334155',
  }
}

function Pawn({ fill, stroke, accent }: { fill: string; stroke: string; accent: string }) {
  return (
    <>
      <Circle cx="50" cy="24" r="11" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Path
        d="M36 44C39 36 45 32 50 32C55 32 61 36 64 44L69 62C71 70 66 76 57 76H43C34 76 29 70 31 62L36 44Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <Rect x="30" y="76" width="40" height="8" rx="4" fill={accent} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="24" y="84" width="52" height="8" rx="4" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
    </>
  )
}

function Rook({ fill, stroke, accent }: { fill: string; stroke: string; accent: string }) {
  return (
    <>
      <Rect x="28" y="16" width="12" height="12" rx="2" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="44" y="16" width="12" height="12" rx="2" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="60" y="16" width="12" height="12" rx="2" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="30" y="28" width="40" height="11" rx="3" fill={accent} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="34" y="39" width="32" height="36" rx="7" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="28" y="75" width="44" height="9" rx="4" fill={accent} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="22" y="84" width="56" height="8" rx="4" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
    </>
  )
}

function Bishop({ fill, stroke, accent }: { fill: string; stroke: string; accent: string }) {
  return (
    <>
      <Path
        d="M50 12C57 12 63 18 63 25C63 31 58 36 53 39L64 55C67 60 66 68 61 72C57 75 52 76 50 76C48 76 43 75 39 72C34 68 33 60 36 55L47 39C42 36 37 31 37 25C37 18 43 12 50 12Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <Path d="M58 18L42 50" stroke={stroke} strokeWidth={DETAIL} strokeLinecap="round" />
      <Rect x="29" y="76" width="42" height="8" rx="4" fill={accent} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="23" y="84" width="54" height="8" rx="4" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
    </>
  )
}

function Knight({ fill, stroke, accent }: { fill: string; stroke: string; accent: string }) {
  return (
    <>
      <Path
        d="M67 22C65 17 59 14 52 14C43 14 35 19 32 27C30 33 31 39 35 45L39 50L33 61C30 67 34 76 43 76H64C70 76 74 72 73 67C72 61 66 58 61 56L54 53L52 43L58 39C65 35 69 29 67 22Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <Path d="M49 18L42 25L49 28" fill={fill} stroke={stroke} strokeWidth={DETAIL} strokeLinejoin="round" />
      <Circle cx="50" cy="29" r="3.2" fill={stroke} />
      <Path d="M42 44C47 47 54 48 61 46" stroke={accent} strokeWidth={DETAIL} strokeLinecap="round" />
      <Path d="M39 54L55 58" stroke={stroke} strokeWidth={DETAIL} strokeLinecap="round" />
      <Rect x="27" y="76" width="44" height="8" rx="4" fill={accent} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="21" y="84" width="56" height="8" rx="4" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
    </>
  )
}

function Queen({ fill, stroke, accent }: { fill: string; stroke: string; accent: string }) {
  return (
    <>
      <Circle cx="31" cy="22" r="6" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Circle cx="50" cy="16" r="6" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Circle cx="69" cy="22" r="6" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Path
        d="M29 28L36 54L50 34L64 54L71 28L76 60C77 68 71 76 62 76H38C29 76 23 68 24 60L29 28Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <Rect x="30" y="76" width="40" height="8" rx="4" fill={accent} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="24" y="84" width="52" height="8" rx="4" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
    </>
  )
}

function King({ fill, stroke, accent }: { fill: string; stroke: string; accent: string }) {
  return (
    <>
      <Rect x="46" y="10" width="8" height="20" rx="3" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="38" y="18" width="24" height="8" rx="3" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
      <Path
        d="M36 36C36 28 42 22 50 22C58 22 64 28 64 36C64 41 61 45 58 48L63 60C66 66 62 76 54 76H46C38 76 34 66 37 60L42 48C39 45 36 41 36 36Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={OUTLINE}
        strokeLinejoin="round"
      />
      <Rect x="30" y="76" width="40" height="8" rx="4" fill={accent} stroke={stroke} strokeWidth={OUTLINE} />
      <Rect x="24" y="84" width="52" height="8" rx="4" fill={fill} stroke={stroke} strokeWidth={OUTLINE} />
    </>
  )
}

export function ChessPieceIcon({ type, color, size }: ChessPieceIconProps) {
  const palette = getPalette(color)

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {type === 'pawn' ? <Pawn {...palette} /> : null}
      {type === 'rook' ? <Rook {...palette} /> : null}
      {type === 'bishop' ? <Bishop {...palette} /> : null}
      {type === 'knight' ? <Knight {...palette} /> : null}
      {type === 'queen' ? <Queen {...palette} /> : null}
      {type === 'king' ? <King {...palette} /> : null}
    </Svg>
  )
}
