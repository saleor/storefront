export const formatDate = (date: Date | number) =>
	new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
