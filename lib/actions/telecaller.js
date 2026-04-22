import { fetchTelleCallerDailyReport } from "@/lib/actions/file_action";
import { tryLegacyRequests, withToken } from "@/lib/actions/_legacy";

export const fetchDashboardData = async (token) => {
  const result = await tryLegacyRequests(
    [
      { url: "/telecaller/dashboard", method: "get", ...withToken(token) },
      { url: "/dashboard/telecaller", method: "get", ...withToken(token) },
      { url: "/telecaller/summary", method: "get", ...withToken(token) },
    ],
    "Telecaller dashboard endpoint is not available."
  );

  if (!result.success) {
    return {
      success: false,
      totals: {},
      graphData: [],
      data: [],
      message: result.message,
    };
  }

  const payload = result.data?.data || result.data || {};

  return {
    success: true,
    totals: payload?.totals || {},
    graphData: payload?.graphData || [],
    data: payload?.reports || payload?.data || [],
  };
};

export { fetchTelleCallerDailyReport };

export const deleteTelecallerReport = async (token, id) => {
  const result = await tryLegacyRequests(
    [
      { url: `/telecaller/reports/${id}`, method: "delete", ...withToken(token) },
      { url: `/reports/telecaller/${id}`, method: "delete", ...withToken(token) },
      { url: `/telecaller/daily-reports/${id}`, method: "delete", ...withToken(token) },
    ],
    "Delete telecaller report endpoint is not available."
  );

  return {
    success: result.success,
    message:
      result.data?.message ||
      result.message ||
      (result.success ? "Report deleted successfully." : "Failed to delete report."),
  };
};

export const setTelecallersData = async (token, username, assignmentUrl) => {
  const payload = { username, assignmentUrl, url: assignmentUrl };
  const result = await tryLegacyRequests(
    [
      { url: "/telecaller/assignments", method: "post", data: payload, ...withToken(token) },
      { url: "/telecaller/assignment", method: "post", data: payload, ...withToken(token) },
      { url: `/telecaller/${username}/assignment`, method: "post", data: payload, ...withToken(token) },
    ],
    "Telecaller assignment endpoint is not available."
  );

  return {
    success: result.success,
    data: result.data?.data || result.data,
    message:
      result.data?.message ||
      result.message ||
      (result.success ? "Assignment added successfully." : "Failed to add assignment."),
  };
};
