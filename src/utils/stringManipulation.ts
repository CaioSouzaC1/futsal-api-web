export const addEllipsis = (str: string) => {
  if (str.length <= 9) {
    return str;
  }
  return str.substring(0, 9) + "...";
};
