import React from 'react';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { FontFamily } from '../theme/fonts';

type Props = {
  children: string;
  fontSize?: number;
  colors?: [string, string];
};

/**
 * Horizontal gradient text (left → right) using Plus Jakarta Sans.
 */
export default function GradientText({
  children,
  fontSize = 35,
  colors = ['#3B5BDB', '#93C5FD'],
}: Props) {
  const width = Math.ceil(children.length * fontSize * 0.62) + 12;
  const height = Math.ceil(fontSize * 1.25);

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors[0]} />
          <Stop offset="100%" stopColor={colors[1]} />
        </SvgLinearGradient>
      </Defs>
      <SvgText
        fill="url(#titleGrad)"
        fontSize={fontSize}
        fontFamily={FontFamily.bold}
        fontWeight="700"
        x={width / 2}
        y={fontSize * 0.9}
        textAnchor="middle"
      >
        {children}
      </SvgText>
    </Svg>
  );
}
