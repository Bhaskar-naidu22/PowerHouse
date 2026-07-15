import {
  StyleSheet,
  type TextStyle,
  type StyleProp,
} from 'react-native';

/**
 * Plus Jakarta Sans family names match linked TTF filenames / PostScript names.
 * Use via <Text> / <TextInput> from `components/AppText`.
 * Works on both Android and iOS when fonts are linked.
 */
export const FontFamily = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semiBold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
} as const;

const WEIGHT_TO_FAMILY: Record<string, string> = {
  '100': FontFamily.regular,
  '200': FontFamily.regular,
  '300': FontFamily.regular,
  '400': FontFamily.regular,
  normal: FontFamily.regular,
  '500': FontFamily.medium,
  '600': FontFamily.semiBold,
  '700': FontFamily.bold,
  bold: FontFamily.bold,
  '800': FontFamily.extraBold,
  '900': FontFamily.extraBold,
};

export function interStyle(
  style?: StyleProp<TextStyle>,
): StyleProp<TextStyle> {
  const flat = StyleSheet.flatten(style) || {};
  const weight = flat.fontWeight != null ? String(flat.fontWeight) : '400';
  const fontFamily =
    typeof flat.fontFamily === 'string' && flat.fontFamily.length > 0
      ? flat.fontFamily
      : WEIGHT_TO_FAMILY[weight] ?? FontFamily.regular;

  // Apply Plus Jakarta Sans last. Use fontWeight 'normal' so it overrides
  // earlier weight styles — undefined is ignored by RN.
  return [style, { fontFamily, fontWeight: 'normal' }];
}
