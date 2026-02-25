export const formattedDate = (date: string) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = d.toLocaleString("en-IN", {
    month: "short",
  });
  const dd = d.toLocaleString("en-IN", {
    day: "2-digit",
  });
  return `${dd} ${mm}, ${yyyy}`;
};
