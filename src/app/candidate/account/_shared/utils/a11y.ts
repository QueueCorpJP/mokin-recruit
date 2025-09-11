export function idFor(fieldName: string): string {
  return `field-${fieldName}`;
}

export function describedByIdFor(fieldName: string): string {
  return `desc-${fieldName}`;
}

export function ariaPropsFor(hasError: boolean, describedById?: string) {
  const props: Record<string, string | boolean> = {};
  if (hasError) props['aria-invalid'] = true;
  if (describedById) props['aria-describedby'] = describedById;
  return props;
}
