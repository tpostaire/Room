import { Indexed } from '@/util/TypeUtils'

export interface ProviderEntry {
  key: string;
  endpoint: string;
}

export interface Provider {
  entries: ProviderEntry[];
}

export type Providers = Indexed<Provider>;

export type ProviderInput = Indexed<Indexed<string>>;

export function mapProvider (input: {[key: string]: string}) {
  const provider: Provider = {
    entries: []
  }
  for (const entry in input) {
    provider.entries.push({
      key: entry,
      endpoint: input[entry]
    })
  }
  return provider
}

export function mapProviders (input: ProviderInput): Providers {
  const providers: Providers = {}

  for (const provider in input) {
    if (input.hasOwnProperty(provider)) { providers[provider] = mapProvider(input[provider]) }
  }

  return providers
}
