export const renderTemplate = (
  template: string,
  data: Record<string, string>
) => {
  let output = template;

  for (const key in data) {
    output = output.replace(new RegExp(`{{${key}}}`, "g"), escapeHtml(data[key]));
  }

  return output;
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
