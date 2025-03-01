export function getCurrentUTCDateTime(): string {
  const now = new Date();
  return now.toISOString().replace("T", " ").slice(0, 19);
}
