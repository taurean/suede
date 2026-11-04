// Timemore Mirror Dot over Web Bluetooth. Chrome/Edge only; localhost counts as
// a secure context. Protocol notes come from the explorer at /prototype/scale,
// whose decode and auto-zero logic this copies unchanged.

export type Sample = { at: number; grams: number };

// Assumed: the weight characteristic fff1 lives in service fff0. Chrome only
// exposes services listed up front.
const SERVICE_UUID = 0xfff0;

// Frames: a5 5a | type u16 | length u16 | payload. Type 0x0101 is weight:
// payload bytes 0-3 are a signed big-endian int32 in tenths of a gram.
// The scale re-zeroes itself after ~1s of stable weight: the raw reading jumps
// straight to exactly 0 in one frame. A fast lift can also reach 0 in one frame,
// but only an auto-zero follows a steady reading. So a one-frame jump to 0 counts
// as an auto-zero only when it comes from more than AUTO_ZERO_MIN_TENTHS and the
// reading held within AUTO_ZERO_STEADY_TENTHS for AUTO_ZERO_STEADY_MS first. The
// lost amount is carried forward.
const AUTO_ZERO_MIN_TENTHS = 50;
const AUTO_ZERO_STEADY_TENTHS = 1;
const AUTO_ZERO_STEADY_MS = 700; // under the scale's ~1s, so jitter in its timing still counts

type Characteristic = {
	properties: { notify: boolean; indicate: boolean };
	value?: DataView;
	startNotifications(): Promise<Characteristic>;
	addEventListener(type: 'characteristicvaluechanged', cb: () => void): void;
};
type Service = { getCharacteristics(): Promise<Characteristic[]> };
type Device = {
	name?: string;
	gatt?: { connect(): Promise<{ getPrimaryServices(): Promise<Service[]> }>; disconnect(): void };
	addEventListener(type: 'gattserverdisconnected', cb: () => void): void;
};
type Bluetooth = { requestDevice(opts: object): Promise<Device> };

/** Turns raw frames into absolute grams, compensating for the scale's auto-zero. */
export function createDecoder() {
	let rawTenths: number | null = null;
	let carriedTenths = 0;
	let steadySince = 0; // when the raw reading last moved by more than AUTO_ZERO_STEADY_TENTHS

	return function decodeGrams(view: DataView, at: number): number | null {
		if (view.byteLength < 12 || view.getUint8(0) !== 0xa5 || view.getUint8(1) !== 0x5a) return null;
		if (view.getUint16(2) !== 0x0101) return null;
		const next = view.getInt32(6);
		const wasSteady = at - steadySince >= AUTO_ZERO_STEADY_MS;
		if (
			next === 0 &&
			rawTenths !== null &&
			Math.abs(rawTenths) > AUTO_ZERO_MIN_TENTHS &&
			wasSteady
		) {
			carriedTenths += rawTenths;
		}
		if (rawTenths === null || Math.abs(next - rawTenths) > AUTO_ZERO_STEADY_TENTHS)
			steadySince = at;
		rawTenths = next;
		return (rawTenths + carriedTenths) / 10;
	};
}

/** Opens the device picker and calls onSample for every weight frame. Returns a disconnect function. */
export async function connectScale(
	onSample: (sample: Sample) => void,
	onDisconnect: () => void
): Promise<() => void> {
	const bluetooth = (navigator as Navigator & { bluetooth?: Bluetooth }).bluetooth;
	if (!bluetooth) throw new Error('Web Bluetooth unavailable. Use Chrome or Edge on localhost.');

	const device = await bluetooth.requestDevice({
		acceptAllDevices: true,
		optionalServices: [SERVICE_UUID]
	});
	device.addEventListener('gattserverdisconnected', onDisconnect);
	const server = await device.gatt!.connect();
	const decodeGrams = createDecoder();

	for (const service of await server.getPrimaryServices()) {
		for (const char of await service.getCharacteristics()) {
			if (!char.properties.notify && !char.properties.indicate) continue;
			char.addEventListener('characteristicvaluechanged', () => {
				const at = Date.now();
				const grams = decodeGrams(char.value!, at);
				if (grams !== null) onSample({ at, grams });
			});
			await char.startNotifications();
		}
	}
	return () => device.gatt?.disconnect();
}
