export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    // GitHub API error response
    const message = error.response.data.message || 'An error occurred';
    const status = error.response.status;
    return new ApiError(message, status);
  }
  return new ApiError('Network error occurred', 500);
}; 