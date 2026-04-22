import { tryLegacyRequests, withToken } from "@/lib/actions/_legacy";

export const submitDailyVisitReport = async (token, payload) => {
  const result = await tryLegacyRequests(
    [
      { url: "/field-staff/reports", method: "post", data: payload, ...withToken(token) },
      { url: "/reports/field-staff", method: "post", data: payload, ...withToken(token) },
      { url: "/field-staff/visit-report", method: "post", data: payload, ...withToken(token) },
    ],
    "Field staff visit report endpoint is not available."
  );

  return {
    success: result.success,
    data: result.data?.data || result.data,
    message:
      result.data?.message ||
      result.message ||
      (result.success ? "Visit report submitted successfully." : "Failed to submit visit report."),
    error: result.success ? undefined : result.message,
  };
};

export const getDailyVisitReports = async (token, date = null) => {
  const params = date ? { date } : undefined;
  const result = await tryLegacyRequests(
    [
      { url: "/field-staff/reports", method: "get", params, ...withToken(token) },
      { url: "/reports/field-staff", method: "get", params, ...withToken(token) },
      { url: "/field-staff/visit-report", method: "get", params, ...withToken(token) },
    ],
    "Field staff reports endpoint is not available."
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
