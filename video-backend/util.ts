export function getRandomItem<T>(map: Map<any, T>) {
  const items = Array.from(map);
  return items[Math.floor(Math.random() * items.length)][1];
}
