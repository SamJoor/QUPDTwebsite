export type GraduationTerm = "spring" | "summer" | "fall" | "winter";

export function getGraduationDate(year: number, term: GraduationTerm): Date {
  switch (term) {
    case "spring":
      return new Date(Date.UTC(year, 4, 15));
    case "summer":
      return new Date(Date.UTC(year, 7, 15));
    case "fall":
      return new Date(Date.UTC(year, 11, 15));
    case "winter":
      return new Date(Date.UTC(year, 0, 15));
    default:
      return new Date(Date.UTC(year, 4, 15));
  }
}

export function getReleaseDate(year: number, term: GraduationTerm): Date {
  const graduationDate = getGraduationDate(year, term);
  return new Date(
    Date.UTC(
      graduationDate.getUTCFullYear() + 10,
      graduationDate.getUTCMonth(),
      graduationDate.getUTCDate()
    )
  );
}

export function parseReleaseDateInput(input: string): Date | null {
  const trimmed = input.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;

  const [yearString, monthString, dayString] = trimmed.split("-");
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!year || !month || !day) return null;

  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  if (Number.isNaN(date.getTime())) return null;

  return date;
}
