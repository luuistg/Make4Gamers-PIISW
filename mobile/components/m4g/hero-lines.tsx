import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg'

export function HeroLines() {
  return (
    <Svg width="100%" height={110} viewBox="0 0 1200 260">
      <Defs>
        <SvgLinearGradient id="limeLine" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#bef264" stopOpacity="0" />
          <Stop offset="20%" stopColor="#bef264" stopOpacity="0.9" />
          <Stop offset="80%" stopColor="#bef264" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#bef264" stopOpacity="0" />
        </SvgLinearGradient>
        <SvgLinearGradient id="glowField" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#84cc16" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>

      <Rect x="0" y="0" width="1200" height="260" fill="url(#glowField)" />
      <Path
        d="M20 170 C160 70, 340 250, 520 160 C700 70, 880 250, 1180 120"
        fill="none"
        stroke="url(#limeLine)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Path
        d="M20 200 C210 120, 360 240, 590 170 C820 100, 980 210, 1180 170"
        fill="none"
        stroke="url(#limeLine)"
        strokeWidth={2}
        strokeOpacity={0.72}
        strokeLinecap="round"
      />
    </Svg>
  )
}
