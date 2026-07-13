import { MemoryPlatformStore } from "./memory-store.js";
import { SupabasePlatformStore } from "./supabase-store.js";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export class UnavailablePlatformStore {
  constructor() {
    this.available = false;
    this.mode = "unavailable";
  }
}

export function createPlatformStore({
  supabaseUrl = "",
  supabaseServiceRoleKey = "",
  supabaseBucket = "sleek-academia-private",
  localDemoMode = false,
  hostname = "",
  fetchImpl = globalThis.fetch,
} = {}) {
  if (supabaseUrl && supabaseServiceRoleKey) {
    return new SupabasePlatformStore({
      url: supabaseUrl,
      serviceRoleKey: supabaseServiceRoleKey,
      bucket: supabaseBucket,
      fetchImpl,
    });
  }
  if (localDemoMode && LOOPBACK_HOSTS.has(hostname)) {
    return new MemoryPlatformStore();
  }
  return new UnavailablePlatformStore();
}

export function isLoopbackHostname(hostname = "") {
  return LOOPBACK_HOSTS.has(String(hostname).toLowerCase());
}
