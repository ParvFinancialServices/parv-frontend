import { tryLegacyRequests } from "@/lib/actions/_legacy";

export const getAllTestimonials = async () => {
  const result = await tryLegacyRequests(
    [
      { url: "/testimonials", method: "get" },
      { url: "/testimonial", method: "get" },
    ],
    "Testimonials endpoint is not available."
  );

  if (!result.success) {
    return {
      success: false,
      testimonials: [],
      message: result.message,
    };
  }

  return {
    success: true,
    testimonials:
      result.data?.data || result.data?.testimonials || result.data || [],
  };
};

export const createTestimonial = async (payload) => {
  const body = payload instanceof FormData ? payload : payload;
  const result = await tryLegacyRequests(
    [
      { url: "/testimonials", method: "post", data: body },
      { url: "/testimonial", method: "post", data: body },
    ],
    "Create testimonial endpoint is not available."
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
    message: result.data?.message || "Testimonial created successfully.",
  };
};
