export interface LatencyOptions {
  minMs?: number;
  maxMs?: number;
  enableFailures?: boolean;
  failureRate?: number; // 0 to 1 (e.g. 0.04 for 4%)
}

let globalSimulateFailures = false;

export function setGlobalFailureSimulation(enabled: boolean): void {
  globalSimulateFailures = enabled;
}

export function isGlobalFailureSimulationEnabled(): boolean {
  return globalSimulateFailures;
}

export async function simulateNetworkLatency<T>(
  action: () => T | Promise<T>,
  options: LatencyOptions = {}
): Promise<T> {
  const minMs = options.minMs ?? 150;
  const maxMs = options.maxMs ?? 500;
  const enableFailures = options.enableFailures ?? globalSimulateFailures;
  const failureRate = options.failureRate ?? 0.04;

  const delayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (enableFailures && Math.random() < failureRate) {
    throw new Error("SIMULATED_NETWORK_FAILURE: Network timeout or connection drop occurred.");
  }

  return await action();
}
