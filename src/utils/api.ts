// Use environment variable for API URL (set VITE_API_URL in .env)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get access token from localStorage
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Common headers with JWT Bearer token
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic fetch wrapper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// ==================== SERVICES API ====================
export const servicesApi = {
  getCategories: () => apiRequest<{ categories: any[] }>('/services/categories'),
  
  seedCategories: () => 
    apiRequest<{ message: string; categories: any[] }>('/services/categories/seed', { method: 'POST' }),
  
  updateCategoryStatus: (id: string, status: string) =>
    apiRequest<{ message: string; category: any }>(`/services/categories/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getAll: (params?: { categoryId?: string; status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ services: any[] }>(`/services${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest<{ service: any }>(`/services/${id}`),

  create: (data: {
    name: string;
    description?: string;
    categoryId: string;
    basePrice: number;
    estimatedTime?: number;
    icon?: string;
  }) =>
    apiRequest<{ message: string; service: any }>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{
    name: string;
    description: string;
    categoryId: string;
    basePrice: number;
    estimatedTime: number;
    icon: string;
    status: string;
  }>) =>
    apiRequest<{ message: string; service: any }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/services/${id}`, { method: 'DELETE' }),
};

// ==================== REGIONS API ====================
export const regionsApi = {
  getAll: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ regions: any[] }>(`/regions${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest<{ region: any }>(`/regions/${id}`),

  create: (data: { name: string; state: string; country?: string }) =>
    apiRequest<{ message: string; region: any }>('/regions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{ name: string; state: string; country: string; status: string }>) =>
    apiRequest<{ message: string; region: any }>(`/regions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/regions/${id}`, { method: 'DELETE' }),
};

// ==================== PRICING API ====================
export const pricingApi = {
  getAll: (params?: { serviceId?: string; regionId?: string; status?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ pricing: any[] }>(`/pricing${query ? `?${query}` : ''}`);
  },

  getByRegion: (regionId: string) =>
    apiRequest<{ pricing: any[] }>(`/pricing/region/${regionId}`),

  getByService: (serviceId: string) =>
    apiRequest<{ pricing: any[] }>(`/pricing/service/${serviceId}`),

  getById: (id: string) => apiRequest<{ pricing: any }>(`/pricing/${id}`),

  calculate: (data: {
    basePrice: number;
    gstPercent?: number;
    platformFeePercent?: number;
    travelCharge?: number;
  }) =>
    apiRequest<{ breakdown: any }>('/pricing/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  upsert: (data: {
    serviceId: string;
    regionId: string;
    basePrice: number;
    gstPercent?: number;
    platformFeePercent?: number;
    travelCharge?: number;
  }) =>
    apiRequest<{ message: string; pricing: any }>('/pricing', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{
    basePrice: number;
    gstPercent: number;
    platformFeePercent: number;
    travelCharge: number;
    status: string;
  }>) =>
    apiRequest<{ message: string; pricing: any }>(`/pricing/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/pricing/${id}`, { method: 'DELETE' }),
};

// ==================== SUPPORT API ====================
export const supportApi = {
  getAll: (params?: { status?: string; priority?: string; category?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ queries: any[] }>(`/support${query ? `?${query}` : ''}`);
  },

  getStats: () => apiRequest<{ stats: any }>('/support/stats'),

  getById: (id: string) => apiRequest<{ query: any }>(`/support/${id}`),

  create: (data: {
    userId: string;
    subject: string;
    message: string;
    category?: string;
    priority?: string;
  }) =>
    apiRequest<{ message: string; query: any }>('/support', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, data: { status: string; resolution?: string }) =>
    apiRequest<{ message: string; query: any }>(`/support/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  assign: (id: string, assignedTo: string) =>
    apiRequest<{ message: string; query: any }>(`/support/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo }),
    }),
};

// ==================== USERS API (Admin) ====================
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ users: any[]; pagination: any }>(`/admin/users${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest<{ user: any; stats: any }>(`/admin/users/${id}`),

  updateStatus: (id: string, status: string) =>
    apiRequest<{ message: string; user: any }>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  ban: (id: string, data: { banType: 'PERMANENT' | 'TEMPORARY'; reason: string; duration?: number }) =>
    apiRequest<{ message: string; user: any }>(`/admin/users/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  unban: (id: string, data?: { reason?: string }) =>
    apiRequest<{ message: string; user: any }>(`/admin/users/${id}/unban`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),
};

// ==================== MECHANICS API (Admin) ====================
export const mechanicsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; search?: string; isOnline?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ mechanics: any[]; pagination: any }>(`/admin/mechanics${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest<{ mechanic: any; stats: any }>(`/admin/mechanics/${id}`),

  updateStatus: (id: string, status: string) =>
    apiRequest<{ message: string; mechanic: any }>(`/admin/mechanics/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  ban: (id: string, data: { banType: 'PERMANENT' | 'TEMPORARY'; reason: string; duration?: number }) =>
    apiRequest<{ message: string; mechanic: any }>(`/admin/mechanics/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  unban: (id: string, data?: { reason?: string }) =>
    apiRequest<{ message: string; mechanic: any }>(`/admin/mechanics/${id}/unban`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),
};

// ==================== BOOKINGS API (Admin) ====================
export const bookingsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; paymentMethod?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ bookings: any[]; pagination: any }>(`/admin/bookings${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest<{ booking: any }>(`/admin/bookings/${id}`),

  updateStatus: (id: string, status: string, reason?: string) =>
    apiRequest<{ message: string; booking: any }>(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    }),
};

// ==================== DASHBOARD API (Admin) ====================
export const dashboardApi = {
  getStats: () => apiRequest<{ stats: any; recentBookings: any[] }>('/admin/dashboard/stats'),
};
