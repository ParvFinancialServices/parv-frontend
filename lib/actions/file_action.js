import { tryLegacyRequests, withToken } from "@/lib/actions/_legacy";

export const fetchTelleCallerDailyReport = async (token, date = null) => {
  const config = withToken(token);
  const params = date ? { date } : undefined;
  const result = await tryLegacyRequests(
    [
      { url: "/telecaller/reports", method: "get", params, ...config },
      { url: "/reports/telecaller", method: "get", params, ...config },
      { url: "/telecaller/daily-reports", method: "get", params, ...config },
    ],
    "Telecaller reports endpoint is not available."
  );

  if (!result.success) {
    return {
      success: false,
      reports: [],
      message: result.message,
    };
  }

  return {
    success: true,
    reports: result.data?.reports || result.data?.data || [],
  };
};

export const submitTelecallerSummary = async (token, payload) => {
  const result = await tryLegacyRequests(
    [
      {
        url: "/telecaller/reports",
        method: "post",
        data: payload,
        ...withToken(token),
      },
      {
        url: "/reports/telecaller",
        method: "post",
        data: payload,
        ...withToken(token),
      },
      {
        url: "/telecaller/daily-reports",
        method: "post",
        data: payload,
        ...withToken(token),
      },
    ],
    "Submit telecaller summary endpoint is not available."
  );

  if (!result.success) {
    return {
      success: false,
      message: result.message,
    };
  }

  return {
    success: true,
    data: result.data?.data || result.data,
    message: result.data?.message || "Summary submitted successfully.",
  };
};
