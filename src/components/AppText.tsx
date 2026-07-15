import React, { forwardRef } from 'react';
import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextProps,
  type TextInputProps,
} from 'react-native';
import { interStyle } from '../theme/fonts';

type TextRef = React.ElementRef<typeof RNText>;
type TextInputRef = React.ElementRef<typeof RNTextInput>;

/** Drop-in Text that always uses Plus Jakarta Sans (with weight → face mapping). */
export const Text = forwardRef<TextRef, TextProps>(function Text(
  { style, ...props },
  ref,
) {
  return <RNText ref={ref} {...props} style={interStyle(style)} />;
});

/** Drop-in TextInput that always uses Plus Jakarta Sans. */
export const TextInput = forwardRef<TextInputRef, TextInputProps>(
  function TextInput({ style, ...props }, ref) {
    return <RNTextInput ref={ref} {...props} style={interStyle(style)} />;
  },
);
