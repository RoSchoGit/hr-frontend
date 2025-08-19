export const DueDateUtils = {
    dueInDays: (dueDate?: string | Date | null): number | null => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    },

    dueText: (dueDate?: string | Date | null): string => {
        const days = DueDateUtils.dueInDays(dueDate);
        if (days === null) return "";
        if (days < 0) return "überfällig";
        if (days === 0) return "heute fällig";
        if (days === 1) return "noch 1 Tag";
        return `noch ${days} Tage`;
    },

    formattedDate: (dueDate?: string | Date | null): string => {
        return dueDate
            ? new Date(dueDate).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
            })
            : "";
    },

    dueColors: (dueDate?: string | Date | null) => {
        const days = DueDateUtils.dueInDays(dueDate);
        return days !== null && days < 0
            ? { bg: "#fee2e2", text: "#991b1b" }
            : { bg: "#e5e7eb", text: "#1f2937" };
    },
};
