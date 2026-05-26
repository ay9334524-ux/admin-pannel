// Use environment variable for API URL (set VITE_API_URL in .env).
// Production default: https://api.mecfinders.com/api
const PROD = import.meta.env.PROD;
const PROD_API = 'https://api.mecfinders.com/api';
const DEV_API = 'http://localhost:3000/api';
export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || (PROD ? PROD_API : DEV_API);

const getAccessToken = (): string | null => localStorage.getItem('accessToken');
const getRefreshToken = (): string | null => localStorage.getItem('refreshToken');

const clearSession = () => {
  localStorage.removeItem('admin');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const onSessionExpired = () => {
  clearSession();
  // Notify the app shell so it can render the login screen and update URL.
  window.dispatchEvent(new CustomEvent('admin:session-expired'));
};

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

// In-flight refresh promise so concurrent 401s only trigger one refresh call.
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  refreshInFlight = (async () => {
    try {
      const resp = await fetch(`${API_BASE}/admin/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!resp.ok) return false;
      const data = await resp.json();
      if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken);
      if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      return Boolean(data?.accessToken);
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

// Generic fetch wrapper with 401 token refresh.
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  _retry = false,
): Promise<T> => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  // Try refresh exactly once on 401 (except for the refresh/login endpoints).
  if (response.status === 401 && !_retry && !endpoint.includes('/admin/refresh-token') && !endpoint.includes('/admin/login')) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(endpoint, options, true);
    }
    onSessionExpired();
  }

  // We rely on JSON responses; fall back to text-only error if not JSON.
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `API request failed (${response.status})`);
  }

  // Return data.data if it exists (backend wraps response in { success, data })
  return data?.data !== undefined ? data.data : data;
};

// ==================== ADMIN AUTH API ====================
export const adminAuthApi = {
  login: (email: string, password: string) =>
    apiRequest<{ accessToken: string; refreshToken: string; admin: any }>(
      '/admin/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),
  logout: () => apiRequest<{ message: string }>('/admin/logout', { method: 'POST' }),
  me: () => apiRequest<{ admin: any }>('/admin/profile'),
};

export const apiHelpers = {
  clearSession,
  hasSession: () => Boolean(getAccessToken() && localStorage.getItem('admin')),
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

// ==================== COUPONS API (Admin) ====================
export const couponsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ coupons: any[]; pagination: any }>(`/coupons/admin/coupons${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiRequest<{ coupon: any }>(`/coupons/admin/coupons/${id}`),

  create: (data: {
    code: string;
    description?: string;
    discountType: 'FIXED' | 'PERCENTAGE';
    discountValue: number;
    maxUsagePerUser?: number;
    maxTotalUsage?: number;
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    expiresAt: string;
  }) =>
    apiRequest<{ message: string; coupon: any }>('/coupons/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{
    description: string;
    maxUsagePerUser: number;
    maxTotalUsage: number;
    minOrderAmount: number;
    maxDiscountAmount: number;
    isActive: boolean;
  }>) =>
    apiRequest<{ message: string; coupon: any }>(`/coupons/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  expire: (id: string) =>
    apiRequest<{ message: string; coupon: any }>(`/coupons/admin/coupons/${id}/expire`, {
      method: 'PATCH',
    }),

  delete: (id: string) =>
    apiRequest<{ message: string }>(`/coupons/admin/coupons/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== DASHBOARD API (Admin) ====================
export const dashboardApi = {
  getStats: () => apiRequest<{ stats: any; recentBookings: any[] }>('/admin/dashboard/stats'),
};

// ==================== PAYOUT QUEUE & WALLET AUDIT ====================
// ==================== BANNERS API (Admin) ====================
export interface AdminBanner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  ctaLabel?: string;
  order: number;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  regionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const bannersApi = {
  getAll: () => apiRequest<{ banners: AdminBanner[] }>('/admin/banners'),
  create: (data: Partial<AdminBanner>) =>
    apiRequest<{ banner: AdminBanner; message: string }>('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<AdminBanner>) =>
    apiRequest<{ banner: AdminBanner; message: string }>(`/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    apiRequest<{ message: string }>(`/admin/banners/${id}`, {
      method: 'DELETE',
    }),
};

export const adminPayoutsApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.status != null) q.set('status', String(params.status));
    if (params?.page != null) q.set('page', String(params.page));
    if (params?.limit != null) q.set('limit', String(params.limit));
    const qs = q.toString();
    return apiRequest<{ payouts: any[]; pagination: any }>(`/admin/payouts${qs ? `?${qs}` : ''}`);
  },
  approve: (id: string, adminNotes?: string) =>
    apiRequest<{ payout: any; razorpayStatus: string }>(`/admin/payouts/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes: adminNotes ?? '' }),
    }),
  reject: (id: string, reason?: string) =>
    apiRequest<{ payout: any }>(`/admin/payouts/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason ?? '' }),
    }),
};

export const adminWalletLogsApi = {
  list: (params?: { category?: string; mechanicId?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.mechanicId) q.set('mechanicId', params.mechanicId);
    if (params?.page != null) q.set('page', String(params.page));
    if (params?.limit != null) q.set('limit', String(params.limit));
    const qs = q.toString();
    return apiRequest<{ logs: any[]; pagination: any }>(`/admin/wallet/logs${qs ? `?${qs}` : ''}`);
  },
};
