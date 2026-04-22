import { tryLegacyRequests } from "@/lib/actions/_legacy";

export const getAllContactSubmissions = async () => {
  const result = await tryLegacyRequests(
    [
      { url: "/contact-submissions", method: "get" },
      { url: "/contact", method: "get" },
      { url: "/contacts", method: "get" },
    ],
    "Contact submissions endpoint is not available."
  );

  if (!result.success) {
    return {
      success: false,
      data: [],
      message: result.message,
    };
  }

  return {
    success: true,
    data:
      result.data?.data ||
      result.data?.contacts ||
      result.data?.submissions ||
      [],
  };
};
