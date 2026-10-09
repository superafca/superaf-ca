/* Side-effect-free estimate arithmetic. No network, contacts, or customer records. */
(() => {
  'use strict';
  const data = globalThis.SUPERAF_PRICE_DATA;
  const bands = ['sedan', 'mid', 'truck'];
  const ranks = ['easy', 'medium', 'hard'];
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  function matchVehicle(year, make, model) {
    if (!/^\d{4}$/.test(String(year))) return null;
    return data.vehicles.find(v => v.name === make)?.models.find(v =>
      v.name === model && Number(year) >= v.from && Number(year) <= v.to) || null;
  }
  function ppfPrice(pack, film, band, rank, parts = [], finish = 'clear') {
    if (!['front', 'custom', 'max'].includes(pack) || !own(data.filmBases, film) ||
        !bands.includes(band) || !ranks.includes(rank)) throw new Error('Invalid PPF selection');
    const kind = pack === 'max' ? 'max' : 'front';
    const base = data.filmBases[film][rank][kind] + data.sizeBumps[band][kind];
    const extra = pack === 'custom' ? [...new Set(parts)].reduce((n, id) => {
      const row = data.parts.find(p => p.id === id);
      if (!row) throw new Error('Unknown add-on');
      return n + row.price;
    }, 0) : 0;
    return base + extra + (pack === 'max' && film === 'pp10' && finish === 'colour' ? data.colourUpcharge : 0);
  }
  function fixedPrice(table, count, film) {
    if (!count) return 0;
    if (!own(table, count) || !own(table[count], film)) throw new Error('Invalid window selection');
    return table[count][film];
  }
  function calculate(state) {
    const matched = matchVehicle(state.year, state.make, state.model);
    // An entry in the vehicle catalog is NOT approval of a guaranteed quote.
    const special = Boolean(state.special) || (state.make === 'Tesla' && state.model === 'Cybertruck');
    const exactVehicle = matched && !special;
    const activeBands = matched ? [matched.band] : bands.includes(state.size) ? [state.size] : bands;
    const activeRanks = matched ? [matched.rank] : ranks;
    const lines = [];
    if (state.ppf) {
      const options = activeBands.flatMap(b => activeRanks.map(r => ppfPrice(
        state.pack, state.film, b, r, state.parts, state.finish)));
      lines.push({id:'ppf', label:({front:'FRONT',custom:'FRONT+',max:'MAX'})[state.pack] +
        ' · HARD PP ' + (state.film === 'pp5' ? '5YR' : '10YR'),
        min:Math.min(...options), max:Math.max(...options)});
    }
    if (state.tint) {
      if (!['carbon','ceramic'].includes(state.tintFilm)) throw new Error('Invalid tint film');
      const kind = state.tintFilm === 'carbon' ? 'Carbon' : 'Ceramic';
      const f = fixedPrice(data.tintFront, state.front, state.tintFilm);
      const r = fixedPrice(data.tintRear, state.rear, state.tintFilm);
      if (f) lines.push({id:'tint-front',label:`${kind} tint · ${state.front} front windows`,min:f,max:f});
      if (r) lines.push({id:'tint-rear',label:`${kind} tint · ${state.rear} rear windows`,min:r,max:r});
      if (!['none','windshield','visor'].includes(state.zone)) throw new Error('Invalid tint zone');
      const z = state.zone === 'windshield' ? data.tintWindshield[state.tintFilm] :
        state.zone === 'visor' ? data.tintVisor[state.tintFilm] : 0;
      if (z) lines.push({id:'tint-zone',label:`${kind} tint · ${state.zone}`,min:z,max:z});
    }
    if (state.glass) {
      if (!own(data.glass, state.glassFilm)) throw new Error('Invalid glass film');
      const g = data.glass[state.glassFilm];
      lines.push({id:'glass',label:`${state.glassFilm === 'clear' ? 'Clear' : 'Tinted'} glass protection`,min:g,max:g});
    }
    const min = lines.reduce((n,l) => n+l.min, 0), max = lines.reduce((n,l) => n+l.max, 0);
    return {min,max,lines,matched,empty:!lines.length,hasRange:min!==max,
      type:!lines.length?'empty':state.ppf?exactVehicle?'vehicle-estimate':'ballpark':'menu-estimate',
      verified:false,special};
  }
  globalThis.SuperafPriceEngine = Object.freeze({matchVehicle,ppfPrice,calculate});
})();
