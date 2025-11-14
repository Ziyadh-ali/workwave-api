export const getDayRange = (date: Date): { startOfDay: Date; endOfDay: Date } => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
};


export const IST_OFFSET_MINUTES = 5.5 * 60;

export const toIST = (date: Date) => {
    // return a new Date representing the same instant shifted by +5:30
    return new Date(date.getTime() + IST_OFFSET_MINUTES * 60_000);
};

export const fromIST = (date: Date) => {
    // convert a Date that represents an IST local time into the UTC moment to store
    return new Date(date.getTime() - IST_OFFSET_MINUTES * 60_000);
};