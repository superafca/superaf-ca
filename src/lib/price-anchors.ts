import { filmFromPrice, glassPrice, tintFrontPrice, tintVisorPrice, tintWindshieldPrice } from "./site.ts";
import { money } from "./utils.ts";

/** Sedan/crossover, HARD PP 5YR, easy. Derived from the estimator. Do not duplicate the table. */
export const fullFrontFrom = filmFromPrice("front", "sedan", "pp5", "easy").from;
export const fullBodyFrom = filmFromPrice("max", "sedan", "pp5", "easy").from;
export const windshieldFilm = glassPrice("clear");
export const tintFrontsFrom = tintFrontPrice(2, "carbon");
export const tintFrontsCeramic = tintFrontPrice(2, "ceramic");
export const frontPlusFrom = filmFromPrice("custom", "sedan", "pp5", "easy", ["cups"]).from;
export const windshieldTintFrom = tintWindshieldPrice("carbon");
export const windshieldTintCeramic = tintWindshieldPrice("ceramic");
export const visorFrom = tintVisorPrice("carbon");

export const fullFrontLabel = money(fullFrontFrom);
export const fullBodyLabel = money(fullBodyFrom);
export const windshieldFilmLabel = money(windshieldFilm);
export const frontPlusLabel = money(frontPlusFrom);
export const tintFrontsLabel = money(tintFrontsFrom);
export const tintFrontsCeramicLabel = money(tintFrontsCeramic);
export const windshieldTintLabel = money(windshieldTintFrom);
export const windshieldTintCeramicLabel = money(windshieldTintCeramic);
export const visorLabel = money(visorFrom);

export const PRICE_GUARANTEE =
  "From prices: sedan/crossover, HARD PP® 5YR. Prices subject to change. Price is locked in only upon purchase, deposit, or confirmed booking.";
