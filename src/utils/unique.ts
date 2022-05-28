export const unique = <T>(arr: T[]): T[] => [...new Set(arr.map(item => JSON.stringify(item)))]
  .map(item => JSON.parse(item as string));
