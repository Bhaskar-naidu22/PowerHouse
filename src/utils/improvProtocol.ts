/**
 * Improv Wi-Fi BLE protocol helpers.
 * Spec: https://www.improv-wifi.com/ble/
 */

// ---- Standard Improv GATT UUIDs ----
export const IMPROV_SERVICE_UUID = '00467768-6228-2272-4663-277478268000';
export const IMPROV_CAPABILITIES_UUID = '00467768-6228-2272-4663-277478268005';
export const IMPROV_CURRENT_STATE_UUID = '00467768-6228-2272-4663-277478268001';
export const IMPROV_ERROR_STATE_UUID = '00467768-6228-2272-4663-277478268002';
export const IMPROV_RPC_COMMAND_UUID = '00467768-6228-2272-4663-277478268003';
export const IMPROV_RPC_RESULT_UUID = '00467768-6228-2272-4663-277478268004';

// ---- Current State values ----
export enum ImprovState {
  AUTHORIZATION_REQUIRED = 0x01,
  AUTHORIZED = 0x02,
  PROVISIONING = 0x03,
  PROVISIONED = 0x04,
}

// ---- Error State values ----
export enum ImprovError {
  NO_ERROR = 0x00,
  INVALID_RPC_PACKET = 0x01,
  UNKNOWN_RPC_COMMAND = 0x02,
  UNABLE_TO_CONNECT = 0x03,
  NOT_AUTHORIZED = 0x04,
  BAD_HOSTNAME = 0x05,
  UNKNOWN_ERROR = 0xff,
}

// ---- RPC Command IDs ----
export enum ImprovRpcCommand {
  SEND_WIFI_SETTINGS = 0x01,
  IDENTIFY = 0x02,
  DEVICE_INFO = 0x03,
  SCAN_WIFI = 0x04,
  GET_SET_HOSTNAME = 0x05,
  GET_SET_DEVICE_NAME = 0x06,
}

export function improvStateToLabel(state: number): string {
  switch (state) {
    case ImprovState.AUTHORIZATION_REQUIRED:
      return 'Authorization Required';
    case ImprovState.AUTHORIZED:
      return 'Authorized';
    case ImprovState.PROVISIONING:
      return 'Provisioning';
    case ImprovState.PROVISIONED:
      return 'Provisioned';
    default:
      return `Unknown (0x${state.toString(16).padStart(2, '0')})`;
  }
}

export function improvErrorToMessage(err: number): string {
  switch (err) {
    case ImprovError.NO_ERROR:
      return '';
    case ImprovError.INVALID_RPC_PACKET:
      return 'Invalid RPC packet sent to device.';
    case ImprovError.UNKNOWN_RPC_COMMAND:
      return 'Device did not recognize the command.';
    case ImprovError.UNABLE_TO_CONNECT:
      return 'Device could not connect to the Wi-Fi network. Check SSID/password.';
    case ImprovError.NOT_AUTHORIZED:
      return 'Device is not authorized. Authenticate first.';
    case ImprovError.BAD_HOSTNAME:
      return 'Hostname is not valid.';
    case ImprovError.UNKNOWN_ERROR:
      return 'Unknown error occurred on the device.';
    default:
      return `Unrecognized error code (0x${err.toString(16)}).`;
  }
}

/**
 * Build the RPC Command packet for "Send Wi-Fi Settings" (command 0x01).
 *
 * Packet layout:
 *   [command][total_data_len][ssid_len][...ssid bytes][pass_len][...password bytes][checksum]
 *
 * Checksum = sum of all preceding bytes, kept to LSB (mod 256).
 */
export function buildSendWifiSettingsPacket(ssid: string, password: string): number[] {
  const ssidBytes = utf8ToBytes(ssid);
  const passwordBytes = utf8ToBytes(password);

  if (ssidBytes.length > 255 || passwordBytes.length > 255) {
    throw new Error('SSID or password too long for Improv RPC packet.');
  }

  const data: number[] = [
    ssidBytes.length,
    ...ssidBytes,
    passwordBytes.length,
    ...passwordBytes,
  ];

  return buildRpcPacket(ImprovRpcCommand.SEND_WIFI_SETTINGS, data);
}

/**
 * Build a generic RPC packet with no payload (Identify, Device Info, Scan Wifi,
 * or "get" variants of Hostname/Device Name).
 */
export function buildEmptyRpcPacket(command: ImprovRpcCommand): number[] {
  return buildRpcPacket(command, []);
}

/**
 * Build an RPC packet for "set" style commands (Hostname / Device Name)
 * that carry a single string payload.
 */
export function buildStringRpcPacket(command: ImprovRpcCommand, value: string): number[] {
  const bytes = utf8ToBytes(value);
  if (bytes.length > 255) {
    throw new Error('Value too long for Improv RPC packet.');
  }
  return buildRpcPacket(command, [bytes.length, ...bytes]);
}

function buildRpcPacket(command: ImprovRpcCommand, data: number[]): number[] {
  if (data.length > 255) {
    throw new Error('RPC data length exceeds 255 bytes.');
  }

  const packet: number[] = [command, data.length, ...data];
  const checksum = packet.reduce((sum, byte) => (sum + byte) & 0xff, 0);
  packet.push(checksum);
  return packet;
}

/**
 * Parse an RPC Result payload into a list of strings.
 *
 * Layout:
 *   [command][total_data_len][str1_len][...str1 bytes][str2_len][...str2 bytes]...[checksum]
 *
 * Returns the parsed strings (e.g. for SEND_WIFI_SETTINGS, index 0 is the
 * redirect URL if present, possibly an empty string).
 *
 * Throws if the checksum is invalid or the packet is malformed.
 */
export function parseRpcResult(bytes: number[] | Uint8Array): {
  command: number;
  strings: string[];
} {
  const data = Array.from(bytes);
  if (data.length < 3) {
    throw new Error('RPC result packet too short.');
  }

  const command = data[0];
  const dataLength = data[1];
  const payload = data.slice(2, 2 + dataLength);
  const checksum = data[2 + dataLength];

  if (checksum === undefined) {
    throw new Error('RPC result packet missing checksum byte.');
  }

  const expectedChecksum = data
    .slice(0, 2 + dataLength)
    .reduce((sum, byte) => (sum + byte) & 0xff, 0);

  if (expectedChecksum !== checksum) {
    throw new Error(
      `RPC result checksum mismatch (expected 0x${expectedChecksum.toString(
        16
      )}, got 0x${checksum.toString(16)}).`
    );
  }

  const strings: string[] = [];
  let offset = 0;
  while (offset < payload.length) {
    const len = payload[offset];
    offset += 1;
    const strBytes = payload.slice(offset, offset + len);
    strings.push(bytesToUtf8(strBytes));
    offset += len;
  }

  return { command, strings };
}

/**
 * Parse the Capabilities characteristic into named flags.
 */
export function parseCapabilities(byteValue: number): {
  identify: boolean;
  deviceInfo: boolean;
  scanWifi: boolean;
  hostname: boolean;
} {
  return {
    identify: (byteValue & 0b0001) !== 0,
    deviceInfo: (byteValue & 0b0010) !== 0,
    scanWifi: (byteValue & 0b0100) !== 0,
    hostname: (byteValue & 0b1000) !== 0,
  };
}

// ---- UTF-8 helpers (no Buffer dependency, works in React Native) ----

export function utf8ToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let codePoint = str.codePointAt(i)!;

    if (codePoint > 0xffff) {
      // Surrogate pair consumed two JS chars; skip the next one.
      i++;
    }

    if (codePoint < 0x80) {
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0x10000) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
    }
  }
  return bytes;
}

export function bytesToUtf8(bytes: number[] | Uint8Array): string {
  const arr = Array.from(bytes);
  let result = '';
  let i = 0;
  while (i < arr.length) {
    const byte1 = arr[i];

    if (byte1 < 0x80) {
      result += String.fromCharCode(byte1);
      i += 1;
    } else if ((byte1 & 0xe0) === 0xc0) {
      const byte2 = arr[i + 1];
      const codePoint = ((byte1 & 0x1f) << 6) | (byte2 & 0x3f);
      result += String.fromCharCode(codePoint);
      i += 2;
    } else if ((byte1 & 0xf0) === 0xe0) {
      const byte2 = arr[i + 1];
      const byte3 = arr[i + 2];
      const codePoint = ((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f);
      result += String.fromCharCode(codePoint);
      i += 3;
    } else if ((byte1 & 0xf8) === 0xf0) {
      const byte2 = arr[i + 1];
      const byte3 = arr[i + 2];
      const byte4 = arr[i + 3];
      let codePoint =
        ((byte1 & 0x07) << 18) |
        ((byte2 & 0x3f) << 12) |
        ((byte3 & 0x3f) << 6) |
        (byte4 & 0x3f);
      codePoint -= 0x10000;
      result += String.fromCharCode(
        0xd800 + (codePoint >> 10),
        0xdc00 + (codePoint & 0x3ff)
      );
      i += 4;
    } else {
      // Invalid byte, skip it.
      i += 1;
    }
  }
  return result;
}

/**
 * Split a byte array into BLE-write-sized chunks (max 20 bytes per write,
 * per the Improv spec note about MTU limits on most BLE stacks).
 */
export function chunkBytes(bytes: number[], maxChunk: number = 20): number[][] {
  const chunks: number[][] = [];
  for (let i = 0; i < bytes.length; i += maxChunk) {
    chunks.push(bytes.slice(i, i + maxChunk));
  }
  return chunks;
}
