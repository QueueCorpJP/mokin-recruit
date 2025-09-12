export type Option = { value: string; label: string };

export function toOptions(values: string[]): Option[] {
  return values.map(v => ({ value: v, label: v }));
}
