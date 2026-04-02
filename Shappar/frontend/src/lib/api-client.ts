const DEFAULT_API_BASE_URL = 'http://localhost:8040';

type ApiClientOptions = RequestInit & {
  idToken?: string;
};

type ErrorResponseBody = {
  message?: string;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

function buildHeaders({ body, headers, idToken }: ApiClientOptions) {
  const requestHeaders = new Headers(headers);

  if (
    body &&
    !(body instanceof FormData) &&
    !requestHeaders.has('Content-Type')
  ) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (idToken) {
    requestHeaders.set('Authorization', `Bearer ${idToken}`);
  }

  return requestHeaders;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const json: unknown = await response.json();

    return json;
  }

  const text = await response.text();

  return text.length > 0 ? text : null;
}

function getErrorMessage(status: number, body: unknown) {
  if (
    body &&
    typeof body === 'object' &&
    'message' in body &&
    typeof (body as ErrorResponseBody).message === 'string'
  ) {
    return (body as ErrorResponseBody).message!;
  }

  return `Request failed with status ${status}`;
}

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
) {
  const response = await fetch(new URL(path, getApiBaseUrl()).toString(), {
    ...options,
    headers: buildHeaders(options),
  });
  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(response.status, body),
      response.status,
      body,
    );
  }

  return body as T;
}
