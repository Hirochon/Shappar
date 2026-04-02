import { getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const DEFAULT_API_BASE_URL = 'http://localhost:8040';

type ErrorResponseBody = {
  detail?: string;
  message?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;
  readonly body: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.body = data;
  }
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

function serializeBody(body: unknown) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

async function buildHeaders(
  headers: HeadersInit | undefined,
  body: unknown,
) {
  const requestHeaders = new Headers(headers);

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (!requestHeaders.has('Authorization') && auth.currentUser) {
    const idToken = await getIdToken(auth.currentUser);

    requestHeaders.set('Authorization', `Bearer ${idToken}`);
  }

  return requestHeaders;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (text.length === 0) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return JSON.parse(text) as unknown;
  }

  return text;
}

function getErrorMessage(status: number, data: unknown) {
  if (typeof data === 'string' && data.length > 0) {
    return data;
  }

  if (data && typeof data === 'object') {
    if (
      'message' in data &&
      typeof (data as ErrorResponseBody).message === 'string'
    ) {
      return (data as ErrorResponseBody).message!;
    }

    if (
      'detail' in data &&
      typeof (data as ErrorResponseBody).detail === 'string'
    ) {
      return (data as ErrorResponseBody).detail!;
    }
  }

  if (status === 401) {
    return 'Unauthorized';
  }

  return `Request failed with status ${status}`;
}

function getUnexpectedErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return 'Network request failed';
}

async function request<T>(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(new URL(path, getApiBaseUrl()).toString(), {
      ...options,
      body: options.body,
      headers: await buildHeaders(options.headers, options.body),
    });
    const data = await parseResponseBody(response);

    if (!response.ok) {
      throw new ApiError(
        getErrorMessage(response.status, data),
        response.status,
        data,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(getUnexpectedErrorMessage(error), 0, null);
  }
}

export const apiClient = {
  get<T>(path: string, options?: RequestInit) {
    return request<T>(path, {
      ...options,
      method: 'GET',
    });
  },
  post<T>(path: string, body: unknown, options?: RequestInit) {
    return request<T>(path, {
      ...options,
      body: serializeBody(body),
      method: 'POST',
    });
  },
  patch<T>(path: string, body: unknown, options?: RequestInit) {
    return request<T>(path, {
      ...options,
      body: serializeBody(body),
      method: 'PATCH',
    });
  },
  delete<T>(path: string, options?: RequestInit) {
    return request<T>(path, {
      ...options,
      method: 'DELETE',
    });
  },
};
