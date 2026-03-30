const API_URL = 'http://localhost:5130';

/**
 * Decodifica o payload de um JWT sem bibliotecas externas.
 */
export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Verifica se um token JWT ainda é válido (não expirou).
 */
export function isTokenValid(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export const authService = {
  /**
   * POST /auth/login — retorna o token JWT
   */
  login: async ({ email, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    return data.token;
  },

  /**
   * POST /auth/register — retorna o token JWT
   */
  register: async ({ name, email, password }) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar conta');
    }

    return data.token;
  },
};
