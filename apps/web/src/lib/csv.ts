/**
 * CSV export for the lifecycle matrix. Kept dependency-free so the table can
 * be taken into a spreadsheet without trusting a client-side library.
 */

export function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function toCsv(rows: string[][]): string {
  return rows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(",")).join("\r\n");
}
