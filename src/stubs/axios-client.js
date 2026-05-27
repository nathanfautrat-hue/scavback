/**
 * Stub de '@base44/sdk/dist/utils/axios-client'.
 * Utilisé par AuthContext.jsx (avant qu'on le simplifie).
 * Renvoie un client qui résout immédiatement avec un settings vide.
 */
export function createAxiosClient() {
  return {
    get: async () => ({ id: 'stub', public_settings: {} }),
    post: async () => ({}),
    put: async () => ({}),
    delete: async () => ({}),
  };
}

export default { createAxiosClient };
