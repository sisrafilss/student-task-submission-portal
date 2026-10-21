import { getCookie } from '@/services/auth/tokenHandler';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api/v1';

const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
  const { headers, ...restOptions } = options;

  let accessToken: string | undefined;
  try {
    accessToken = await getCookie('accessToken');
  } catch {
    accessToken = undefined;
  }

  const headersInit: Record<string, string> = {
    ...((headers as Record<string, string>) || {}),
  };

  if (accessToken) {
    headersInit['Authorization'] = `Bearer ${accessToken}`;
  }

  if (!headersInit['Content-Type'] && !(restOptions.body instanceof FormData)) {
    headersInit['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    headers: headersInit,
    ...restOptions,
  });

  return response;
};

export const serverFetch = {
  get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: 'GET' }),
  post: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: 'POST' }),
  put: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: 'PUT' }),
  patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: 'PATCH' }),
  delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: 'DELETE' }),
};

