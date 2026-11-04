// Brews and bean bags in IndexedDB. Raw API, no wrapper dependency.

import type { Description, DescribedAttribute, RatedAttribute } from './cva';
import type { EspressoFields } from './espresso';
import type { PourOverFields } from './pourover';
import type { StepResult } from './steps';

const DB_NAME = 'drawdown';
const DB_VERSION = 1;

export type Bag = {
	id: string;
	roaster: string;
	producer: string;
	region: string;
	altitude: string;
	variety: string;
	process: string;
	roastDate: string;
};

export type Brew = {
	id: string;
	/** ISO 8601 with the local time zone offset. */
	startedAt: string;
	endedAt: string;
	/** The chosen dose. */
	dose: number;
	steps: StepResult[];
	/** Absolute scale readings; `t` is ms since startedAt. Flow is derived from these. */
	samples: { t: number; g: number }[];
	bagId: string | null;
	grinder: string;
	grindSetting: string;
	dialedIn: boolean;
	review: {
		descriptions: Record<DescribedAttribute, Description>;
		ratings: Record<RatedAttribute, number>;
		score: number;
	};
} & (EspressoFields | PourOverFields);

/** The most recent brew marked dialed in for this method, if any. */
export function latestDialedIn<T extends Pick<Brew, 'method' | 'dialedIn' | 'startedAt'>>(
	brews: T[],
	method: Brew['method']
): T | null {
	const matches = brews.filter((b) => b.method === method && b.dialedIn);
	matches.sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
	return matches[0] ?? null;
}

function open(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const db = request.result;
			const brews = db.createObjectStore('brews', { keyPath: 'id' });
			brews.createIndex('startedAt', 'startedAt');
			brews.createIndex('bagId', 'bagId');
			db.createObjectStore('bags', { keyPath: 'id' });
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function run<T>(
	store: 'brews' | 'bags',
	mode: IDBTransactionMode,
	action: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
	const db = await open();
	return new Promise((resolve, reject) => {
		const request = action(db.transaction(store, mode).objectStore(store));
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	}).finally(() => db.close()) as Promise<T>;
}

export const saveBrew = (brew: Brew) => run('brews', 'readwrite', (s) => s.put(brew));
export const saveBag = (bag: Bag) => run('bags', 'readwrite', (s) => s.put(bag));
export const listBagBrews = (bagId: string) =>
	run<Brew[]>('brews', 'readonly', (s) => s.index('bagId').getAll(bagId));
export const listBags = () => run<Bag[]>('bags', 'readonly', (s) => s.getAll());

/** ISO 8601 in local time with offset, e.g. 2026-11-03T08:15:02-08:00. */
export function localIso(ms: number): string {
	const d = new Date(ms);
	const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');
	const offset = -d.getTimezoneOffset();
	const sign = offset >= 0 ? '+' : '-';
	return (
		`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
		`T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
		`${sign}${pad(Math.trunc(offset / 60))}:${pad(offset % 60)}`
	);
}
