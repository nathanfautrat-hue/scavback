/**
 * Stub local du SDK @base44/sdk.
 * Le site original utilise Base44 (backend SaaS) pour l'auth, les entities
 * et les intégrations (mail, upload). On ne veut PAS de backend ici, donc
 * chaque méthode renvoie une valeur neutre (array vide, mock object, noop).
 *
 * Vite est configuré pour aliaser '@base44/sdk' vers ce fichier.
 */

const noop = () => {};
const asyncEmpty = async () => [];
const asyncNull = async () => null;

const makeEntity = (name) => ({
  list: async () => [],
  filter: async () => [],
  get: async () => null,
  create: async (data) => ({ id: `mock_${Date.now()}`, ...data }),
  update: async (id, data) => ({ id, ...data }),
  delete: async () => true,
  subscribe: () => () => {}, // returns unsubscribe noop
});

export function createClient() {
  return {
    auth: {
      me: async () => {
        // Clone visuel : on simule un utilisateur connecté pour que les tunnels
        // (Commander, Essai gratuit) soient visibles sans backend.
        return {
          id: 'mock_user',
          email: 'demo@scavback.fr',
          full_name: 'Utilisateur Démo',
          role: 'user',
        };
      },
      logout: noop,
      redirectToLogin: () => {
        // En local on ne redirige pas, on log juste
        console.warn('[stub] redirectToLogin appelé — bypass');
      },
    },
    entities: {
      Order: makeEntity('Order'),
      Message: makeEntity('Message'),
      Conversation: makeEntity('Conversation'),
      TrialRequest: makeEntity('TrialRequest'),
    },
    integrations: {
      Core: {
        UploadFile: async () => ({ file_url: '/mock-upload.bin' }),
        SendEmail: async () => ({ success: true }),
      },
    },
    functions: new Proxy({}, {
      get: () => async () => ({ data: null }),
    }),
  };
}

export default { createClient };
