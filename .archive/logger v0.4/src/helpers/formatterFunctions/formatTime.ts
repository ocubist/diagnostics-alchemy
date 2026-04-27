export function formatTime(unixTime: number, utc = false) {
  const date = new Date(unixTime); // Already in milliseconds, no need to multiply

  let hours: string;
  let minutes: string;
  let seconds: string;

  if (utc) {
    hours = date.getUTCHours().toString().padStart(2, "0");
    minutes = date.getUTCMinutes().toString().padStart(2, "0");
    seconds = date.getUTCSeconds().toString().padStart(2, "0");
  } else {
    hours = date.getHours().toString().padStart(2, "0");
    minutes = date.getMinutes().toString().padStart(2, "0");
    seconds = date.getSeconds().toString().padStart(2, "0");
  }

  return `[${hours}:${minutes}:${seconds}]`;
}
