export const stringToBytes = (input: string): number[] => {
    return Array.from(input).map((c) => c.charCodeAt(0));
}

export const bytesToString = (bytes: number[]): string => {
    return String.fromCharCode(...bytes);
}

export const JSONtoBytes = (obj: any): number[] => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint8(0, obj.sensorId);   // Byte index 0
    view.setUint8(1, obj.flatId); // Byte index 1
    view.setUint8(2, obj.buildingId)
    return Array.from(new Uint8Array(buffer));
}