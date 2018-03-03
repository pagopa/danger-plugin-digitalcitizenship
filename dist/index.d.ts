export declare function message(message: string): void;
export declare function warn(message: string): void;
export declare function fail(message: string): void;
export declare function markdown(message: string): void;
export declare function schedule<T>(asyncFunction: Promise<T>): void;
export default function checkDangers(): void;
