export const stringToBytes = (input: string): number[] => {
    return Array.from(input).map((c) => c.charCodeAt(0));
}

export const bytesToString = (bytes: number[]): string => {
    return String.fromCharCode(...bytes);
}