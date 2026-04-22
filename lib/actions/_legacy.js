import api from "@/api/api";

const withToken = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

const getMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export const tryLegacyRequests = async (requests, fallbackMessage) => {
  let lastError = null;

  for (const request of requests) {
    try {
      const response = await api.request(request);
      return {
        success: true,
        data: response?.data,
        response,
      };
    } catch (error) {
      lastError = error;

      // Missing routes are expected while probing legacy endpoints.
      if (error?.response?.status === 404) {
        continue;
      }

      return {
        success: false,
        message: getMessage(error, fallbackMessage),
        error,
      };
    }
  }

  return {
    success: false,
    message: getMessage(lastError, fallbackMessage),
    error: lastError,
  };
};

export { getMessage, withToken };
