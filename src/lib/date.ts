export const formatDate = (date: Date | number) => new Intl.DateTimeFormat("en-US").format(date);
