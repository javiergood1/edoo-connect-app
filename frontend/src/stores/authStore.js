import { create } from 'zustand';
import { authService } from '../services/api';

const useAuthStore = create((set, get) => ({
  // Estado
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Acciones
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('edoo_token', token);
      localStorage.setItem('edoo_user', JSON.stringify(user));
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Error al iniciar sesión',
      });
      return { success: false, error: error.message };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      const { user, token } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('edoo_token', token);
      localStorage.setItem('edoo_user', JSON.stringify(user));
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Error al registrar usuario',
      });
      return { success: false, error: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('edoo_token');
    localStorage.removeItem('edoo_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadUserFromStorage: () => {
    try {
      const token = localStorage.getItem('edoo_token');
      const userStr = localStorage.getItem('edoo_user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Error al cargar usuario desde localStorage:', error);
      get().logout();
    }
  },

  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    localStorage.setItem('edoo_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Refrescar información del usuario desde el servidor
  refreshUser: async () => {
    try {
      const response = await api.get('/auth/profile');
      if (response.success) {
        const updatedUser = response.data.user;
        set({ user: updatedUser });
        localStorage.setItem('edoo_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
