const pad = (value: number) => value.toString().padStart(2, "0");

export const generateReferenceNumber = (date = new Date()) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const randomSegment = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `PDO-${year}${month}${day}-${randomSegment}`;
};

export const formatSubmittedAt = (date: Date) =>
  new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(date);
