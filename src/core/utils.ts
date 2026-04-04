function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h = h & h;
  }
  return h;
}

export function shuffle<T extends { id?: string | number }>(array: T[]): T[] {
  return [...array].sort((a, b) => {
    const hashA = simpleHash(String(a.id ?? a));
    const hashB = simpleHash(String(b.id ?? b));
    return hashA - hashB;
  });
}
