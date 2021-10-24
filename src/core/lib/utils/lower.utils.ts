export function lowerClassName(str: string): string {
  return `${str.charAt(0).toLowerCase() + str.slice(1)}`
}
