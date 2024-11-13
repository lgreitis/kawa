import AsyncLock from "async-lock";

export class RateLimiter {
  private lock: AsyncLock;
  private minimumInterval: number;
  private targetInterval: number;
  private timeWindowDuration: number;
  private maxAllowedInWindow: number;

  private window: Date[] = [];

  private lastTake = 0;

  constructor(minimumInterval: number, targetInterval: number, timeWindow: number) {
    this.lock = new AsyncLock();
    this.window = [];
    this.minimumInterval = minimumInterval;
    this.targetInterval = targetInterval;
    this.timeWindowDuration = timeWindow;

    this.maxAllowedInWindow = Math.floor(timeWindow / targetInterval);
    this.lastTake = Date.now() - minimumInterval;
  }

  public async wait(): Promise<void> {
    await this.lock.acquire("rateLimiter", async () => {
      const waitDuration = this.calculateWaitDuration();

      if (waitDuration > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitDuration));
      }

      this.lastTake = new Date().getTime();
      this.window.push(new Date());
    });
  }

  private calculateWaitDuration(): number {
    this.flushExpiredRecords();
    if (this.window.length === 0) {
      return 0;
    }

    const now = Date.now();
    const minWait = this.lastTake + this.minimumInterval - now;

    const load = this.window.length / this.maxAllowedInWindow;

    const waitMillis = minWait + (this.targetInterval - minWait) * load;
    return Math.max(0, waitMillis);
  }

  private flushExpiredRecords(): void {
    const now = new Date();

    while (
      this.window.length > 0 &&
      now.getTime() - this.window[0].getTime() > this.timeWindowDuration
    ) {
      this.window.shift();
    }
  }
}
