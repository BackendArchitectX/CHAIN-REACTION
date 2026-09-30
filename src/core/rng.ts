export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function between(rng: () => number, min: number, max: number) {
  return min + (max - min) * rng();
}

export function integer(rng: () => number, min: number, max: number) {
  return Math.floor(between(rng, min, max + 1));
}
