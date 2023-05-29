export const formatDate = (date: Date, format: string) => {
    if (!(date instanceof Date)) {
        return date;
    }

    const hourFormat: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "numeric",
        hour12: false,
    };

    if (format === "status") {
        return new Intl.DateTimeFormat("es", hourFormat).format(date);
    }
};
