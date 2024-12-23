export class BN {
  private value: bigint;

  constructor(value: bigint);
  constructor(value: number | string, decimals?: number);
  constructor(
    ...[value, decimals]: [number | string | bigint, decimals?: number]
  ) {
    this.value = decimals
      ? typeof value === "bigint"
        ? value * BigInt(Math.pow(10, decimals))
        : BigInt(Number(value) * Math.pow(10, decimals))
      : BigInt(Number(value));
  }

  mul(other: BN) {
    return new BN(this.value * other.value);
  }

  add(other: BN) {
    return new BN(this.value + other.value);
  }

  pow(y: BN) {
    return this.value ** y.value;
  }

  static toNumber(self: BN, decimals?: number) {
    return Number(
      decimals ? self.value / BigInt(Math.pow(10, decimals)) : self.value
    );
  }

  static toBigInt(self: BN, decimals?: number) {
    return decimals ? self.value / BigInt(Math.pow(10, decimals)) : self.value;
  }
}
