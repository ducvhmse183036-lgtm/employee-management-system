export function payloadFor(fields, values) {
  return Object.fromEntries(
    fields
      .filter((f) => !f.readOnly)
      .map((f) => [
        f.name,
        f.type === 'checkbox'
          ? Boolean(values[f.name])
          : values[f.name] === '' || values[f.name] == null
            ? null
            : f.type === 'number' || f.numeric
              ? Number(values[f.name])
              : typeof values[f.name] === 'string'
                ? values[f.name].trim()
                : values[f.name],
      ]),
  )
}
