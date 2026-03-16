export function creerDetecteurTripleDollar(callback, delai = 2000) {
  const buffer = [];
  return function onKey(key) {
    if (key !== '$') return false;
    buffer.push(Date.now());
    if (buffer.length > 3) buffer.shift();
    if (buffer.length === 3 && buffer[2] - buffer[0] < delai) {
      buffer.length = 0;
      callback();
      return true;
    }
    return false;
  };
}
