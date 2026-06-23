export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  speakingTime: string;
  avgWordLength: number;
  longestWord: string;
  topKeywords: { word: string; count: number }[];
}
