// Base API functions
export async function postData(path: string, data: any) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`API Error (${res.status}) at ${path}:`, result);
      const error = new Error(result.message || `API Error (${res.status})`);
      (error as any).response = {
        ...result,
        status: res.status,
        statusText: res.statusText
      };
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`Request failed for ${path}:`, error);
    throw error;
  }
}

export async function getData(path: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
    console.log(`API Request: ${url}`);
    
    const res = await fetch(url, { 
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`API Error (${res.status}) at ${path}:`, result);
      const error = new Error(result.message || `API Error (${res.status})`);
      (error as any).response = {
        ...result,
        status: res.status,
        statusText: res.statusText
      };
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`Request failed for ${path}:`, error);
    throw error;
  }
}

export async function putData(path: string, data: any) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
      method: 'PUT',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`API Error (${res.status}) at ${path}:`, result);
      const error = new Error(result.message || `API Error (${res.status})`);
      (error as any).response = {
        ...result,
        status: res.status,
        statusText: res.statusText
      };
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`Request failed for PUT ${path}:`, error);
    throw error;
  }
}

export async function deleteData(path: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
      method: 'DELETE',
      credentials: "include",
      headers: {
        'Accept': 'application/json'
      }
    });

    // For DELETE requests, we might not always have a response body
    if (res.status === 204) {
      return null;
    }
    
    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`API Error (${res.status}) at ${path}:`, result);
      const error = new Error(result.message || `API Error (${res.status})`);
      (error as any).response = {
        ...result,
        status: res.status,
        statusText: res.statusText
      };
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error(`Request failed for DELETE ${path}:`, error);
    throw error;
  }
}

// Authentication API
export const authAPI = {
  // User registration
  signup: (data: { name: string; email: string; phone: string; password: string }) => 
    postData('/auth/signup', data),
    
  // Verify OTP for signup
  verifySignupOtp: (data: { phone: string; otp: string }) =>
    postData('/auth/verify-signup-otp', data),
    
  // Email login
  loginWithEmail: (data: { email: string; password: string }) => 
    postData('/auth/login/email', data),
    
  // OTP login flow
  requestOtp: (data: { phone: string }) =>
    postData('/auth/login/request-otp', data),
    
  verifyLoginOtp: (data: { phone: string; otp: string }) =>
    postData('/auth/login/verify-otp', data),
    
  // Session management
  logout: () => 
    postData('/auth/logout', {}),
    
  // Password reset flow
  forgotPassword: (data: { phone: string }) => 
    postData('/auth/request-password-reset', data),
    
  resetPassword: (data: { phone: string; otp: string; new_password: string }) => 
    postData('/auth/reset-password', data),
    
  // User profile management
  getProfile: () => 
    getData('/auth/profile'),
    
  updateProfile: (data: { name?: string; email?: string; phone?: string }) => 
    putData('/auth/profile', data),
    
  deleteAccount: () => 
    deleteData('/auth/profile')
};

// Trading APIs
export const tradingAPI = {
  // Swing Trading
  analyzeSwingChart: (file: File, timeframe: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timeframe', timeframe);
    
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/swing/chart`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(res => res.json());
  },
  
  getSwingHistory: (limit: number = 50) => 
    getData(`/swing/history?limit=${limit}`),
    
  // Scalp Trading
  analyzeScalpChart: (file: File, timeframe: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timeframe', timeframe);
    
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/scalp/chart`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(res => res.json());
  },
  
  getScalpHistory: (limit: number = 50) => 
    getData(`/scalp/history?limit=${limit}`)
};

// Market Data API
export const marketAPI = {
  getCurrencyPairs: () => 
    getData('/market/currency-pairs'),
    
  getPerformanceData: () => 
    getData('/market/performance'),
    
  getMarketStatistics: () => 
    getData('/market/statistics')
};

// News API
export const newsAPI = {
  getNews: () => 
    getData('/news'),
    
  getNewsArticle: (id: string) => 
    getData(`/news/${id}`)
};

// Forum API
export const forumAPI = {
  getPosts: () => 
    getData('/forum/posts'),
    
  createPost: (data: { title: string; content: string }) => 
    postData('/forum/posts', data),
    
  getPost: (id: string) => 
    getData(`/forum/posts/${id}`),
    
  addComment: (postId: string, content: string) => 
    postData(`/forum/posts/${postId}/comments`, { content }),
    
  likePost: (postId: string) => 
    postData(`/forum/posts/${postId}/like`, {})
};

// Tools API
export const toolsAPI = {
  getCalculators: () => 
    getData('/tools/calculators'),
    
  calculate: (calculatorId: string, params: Record<string, any>) => 
    postData(`/tools/calculate/${calculatorId}`, params)
};
