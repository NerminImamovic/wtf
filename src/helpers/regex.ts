function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export function createFuzzyMatchRegex(text) {
  const pattern = text
    .split('')
    .map((el: string) => escapeRegExp(el))
    .join('.*');

  return new RegExp(`.*${pattern}.*`, 'ig');
}
