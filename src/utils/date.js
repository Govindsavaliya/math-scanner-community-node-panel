import dayjs from "dayjs";

export const dateFormat = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

/** "5 minutes ago" style label (same wording as the legacy panel). */
export const timeAgo = (date) => {
  try {
    const seconds = dayjs().diff(date) / 1000;
    const steps = [
      [31536000, "years"],
      [2592000, "months"],
      [86400, "days"],
      [3600, "hours"],
      [60, "minutes"],
    ];
    for (const [size, label] of steps) {
      const interval = seconds / size;
      if (interval > 1) {
        const n = Math.floor(interval);
        return `${n} ${n === 1 ? label.slice(0, -1) : label} ago`;
      }
    }
    if (seconds < 10) return "just now";
    return `${Math.floor(seconds)} seconds ago`;
  } catch {
    return "Invalid date";
  }
};
