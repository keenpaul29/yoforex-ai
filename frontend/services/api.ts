import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/auth
});

// Request interceptor for adding auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    // Since we're using HTTP-only cookies for auth, we don't need to add Authorization header
    // The cookies will be automatically included with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses
    return response.data;
  },
  (error: AxiosError) => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
        console.error('Authentication required');
        // You might want to redirect to login or refresh token here
      } else if (error.response.status === 403) {
        // Handle forbidden
        console.error('Access forbidden');
      } else if (error.response.status === 404) {
        // Handle not found
        console.error('Resource not found');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
    }
    
    // Return a rejected promise with the error
    return Promise.reject(error);
  }
);

/**
 * Generic function to handle API requests with error handling
 */
export const fetchWithErrorHandling = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await api({
      url: endpoint,
      method: 'GET',
      ...config,
    });
    return response.data as T;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Specific API methods
export const dashboardApi = {
  getPrices: () => fetchWithErrorHandling<Array<{
    pair: string;
    price: number;
    change: number;
  }>>('/prices/prices'),

  getNews: () => fetchWithErrorHandling<{
    top_news: Array<{
      headline: string;
      summary: string;
      time: string;
      source: string;
      url: string;
      sentiment: string;
    }>;
    daily_insight: any;
    risk_reminder: any;
    market_events: any[];
  }>('/news/'),

  // Add more API methods as needed
};

export default api;
