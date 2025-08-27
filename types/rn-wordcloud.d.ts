// src/types/rn-wordcloud.d.ts
declare module 'rn-wordcloud' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  /** A single word item used by rn-wordcloud */
  export interface WordItem {
    /** Display text */
    text: string;
    /** Weight / importance */
    value: number;
    /** Optional per-word font family override */
    fontFamily?: string;
    /** Optional sentiment flag (supported by lib) */
    sentiment?: string | number | boolean;
    /** Optional color (supported by examples) */
    color?: string;
  }

  /** Options object passed to the component */
  export interface WordCloudOptions {
    /** Words data (required) */
    words: WordItem[];
    /** Enable vertical alignment (default: true) */
    verticalEnabled?: boolean;
    /** Minimum font size (default: 10) */
    minFont?: number;
    /** Maximum font size (default: 50) */
    maxFont?: number;
    /** Font offset for extra tuning (default: 1) */
    fontOffset?: number;
    /** Container width (required) */
    width: number;
    /** Container height (required) */
    height: number;
    /** Default font family for all words */
    fontFamily?: string;
  }

  export interface WordCloudProps {
    /** Rendering & layout options */
    options: WordCloudOptions;
    /** Optional style for the outer View */
    style?: ViewStyle;
    /**
     * Fired when a word is pressed.
     * The library’s README documents `text` and `value`,
     * but we pass through the whole item for convenience.
     */
    onWordPress?: (word: WordItem) => void;
  }

  const WordCloud: ComponentType<WordCloudProps>;
  export default WordCloud;
}
