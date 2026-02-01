export interface ParsedHours {
  weekday: number;
  startTime: number;
  endTime: number;
}

export interface FilterState {
  hasWine: boolean;
  hasBeer: boolean;
  hasCocktails: boolean;
  hasFood: boolean;
  hasCoffee: boolean;
  hasPatio: boolean;
  hasBarSeating: boolean;
  hasDogFriendly: boolean;
  hasNaDrinks: boolean;
}

export interface FilterHandlers {
  setHasWine: (value: boolean) => void;
  setHasBeer: (value: boolean) => void;
  setHasCocktails: (value: boolean) => void;
  setHasFood: (value: boolean) => void;
  setHasCoffee: (value: boolean) => void;
  setHasPatio: (value: boolean) => void;
  setHasBarSeating: (value: boolean) => void;
  setHasDogFriendly: (value: boolean) => void;
  setHasNaDrinks: (value: boolean) => void;
}

export type Filters = FilterState & FilterHandlers;
