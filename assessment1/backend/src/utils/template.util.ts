export const renderTemplate = (
  template: string,
  data: Record<string, string>
) => {
  let output = template;

  for (const key in data) {
    output = output.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
  }

  return output;
};