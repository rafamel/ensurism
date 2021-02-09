export function getName(
  options?: { name?: string },
  schema?: { title?: string }
): string {
  let name = options && options.name ? options.name.trim() : undefined;
  if (!name && schema && schema.title) name = schema.title.trim();
  return name ? `"${name}" ` : '';
}
