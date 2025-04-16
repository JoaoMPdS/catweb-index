
export function dateFromString(str: string) {
   const [day, month, year] = str.split('/').map(Number);
   return new Date(year, month - 1, day);
}