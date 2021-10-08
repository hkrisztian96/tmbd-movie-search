export type ImdbMovieSuggestionData = {
  d: ImdbMovieSuggestion[];
}

type ImdbMovieSuggestion = {
  id: string;
  l: string; // Movie title
}