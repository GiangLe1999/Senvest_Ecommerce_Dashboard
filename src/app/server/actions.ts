"use server";

import axiosInstance from "@/configs/axios";

// Data Imports
import { db as eCommerceData } from "@/fake-db/apps/ecommerce";
import { db as userData } from "@/fake-db/apps/userList";
import { db as statisticsData } from "@/fake-db/pages/widgetExamples";
import { AdminStatusEnum } from "@/types/apps/ecommerceTypes";

export const getEcommerceData = async () => {
  return eCommerceData;
};

export const getUserData = async () => {
  return userData;
};

export const getStatisticsData = async () => {
  return statisticsData;
};

// Categories
export const createCategory = async (formData: FormData) => {
  const { data } = await axiosInstance.post(
    "/admin-categories/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const getAdminCategories = async () => {
  try {
    const { data } = await axiosInstance("/admin-categories");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateCategory = async (formData: FormData) => {
  const { data } = await axiosInstance.put(
    "/admin-categories/update",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const deleteCategory = async (_id: string) => {
  const { data } = await axiosInstance.delete(
    `/admin-categories/delete/${_id}`,
  );

  return data;
};

// Products
export const getAdminProducts = async () => {
  try {
    const { data } = await axiosInstance("/admin-products");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAdminProduct = async (_id: string) => {
  try {
    const { data } = await axiosInstance.get(`/admin-products/${_id}`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (productData: any) => {
  const { data } = await axiosInstance.post(
    "/admin-products/create",
    productData,
  );

  return data;
};

export const uploadProductVideos = async (formData: FormData) => {
  const { data } = await axiosInstance.post(
    "/admin-products/videos",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const updateProductVideos = async (formData: FormData) => {
  const { data } = await axiosInstance.put("/admin-products/videos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateProduct = async (updateData: any) => {
  const { data } = await axiosInstance.put(
    "/admin-products/update",
    updateData,
  );

  return data;
};

export const deleteProduct = async (_id: string) => {
  const { data } = await axiosInstance.delete(`/admin-products/delete/${_id}`);

  return data;
};

export const removeProductVideos = async (_id: string) => {
  const { data } = await axiosInstance.put("/admin-products/delete-videos", {
    _id,
  });

  return data;
};

// Variant
export const createVariant = async (formData: FormData) => {
  const { data } = await axiosInstance.post(
    "/admin-variants/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const updateVariant = async (formData: FormData) => {
  const { data } = await axiosInstance.put("/admin-variants/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Banners
export const getAdminBanners = async () => {
  try {
    const { data } = await axiosInstance("/admin-banners");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createBanner = async (formData: FormData) => {
  const { data } = await axiosInstance.post("/admin-banners/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateBanner = async (formData: FormData) => {
  const { data } = await axiosInstance.put("/admin-banners/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteBanner = async (_id: string) => {
  const { data } = await axiosInstance.delete(`/admin-banners/delete/${_id}`);

  return data;
};

// Slogans
export const getAdminSlogans = async () => {
  try {
    const { data } = await axiosInstance("/admin-slogans");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createSlogan = async (formData: {
  content: {
    en: string;
    vi: string;
  };
  status: string;
  order: string;
}) => {
  const { data } = await axiosInstance.post("/admin-slogans/create", formData);

  return data;
};

export const updateSlogan = async (formData: {
  _id: string;
  content?: {
    en: string;
    vi: string;
  };
  status?: string;
  order?: string;
}) => {
  const { data } = await axiosInstance.put("/admin-slogans/update", formData);

  return data;
};

export const deleteSlogan = async (_id: string) => {
  const { data } = await axiosInstance.delete(`/admin-slogans/delete/${_id}`);

  return data;
};

// Reviews
export const getTotalReviews = async () => {
  try {
    const { data } = await axiosInstance("/admin-reviews/total-reviews");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const publishReview = async ({ _id }: { _id: string }) => {
  try {
    const { data } = await axiosInstance.put("/admin-reviews/publish-review", {
      _id,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteReview = async ({ _id }: { _id: string }) => {
  try {
    const { data } = await axiosInstance.delete(
      "/admin-reviews/delete-review/" + _id,
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Orders
export const getOrders = async () => {
  try {
    const { data } = await axiosInstance("/admin-payments");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderById = async (_id: string) => {
  try {
    const { data } = await axiosInstance(`/admin-payments/${_id}`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProcessingStatus = async (
  _id: string,
  status: AdminStatusEnum,
) => {
  try {
    const { data } = await axiosInstance.put(`/admin-payments/${_id}`, {
      status,
    });

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Users
export const getAllUsers = async () => {
  try {
    const { data } = await axiosInstance(`/admin-users`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (_id: string) => {
  try {
    const { data } = await axiosInstance(`/admin-users/${_id}`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Coupons
export const getAdminCoupons = async () => {
  try {
    const { data } = await axiosInstance("/admin-coupons");

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createCoupon = async (body: {
  code: string;
  discount_value: number;
  discount_type: "Percent" | "Value";
  expiry_date: Date;
  max_usage_count: number;
}) => {
  const { data } = await axiosInstance.post("/admin-coupons/create", body);

  return data;
};

export const updateCoupon = async (updateData: {
  code?: string;
  discount_value?: number;
  discount_type?: "Percent" | "Value";
  expiry_date?: Date;
  max_usage_count?: number;
}) => {
  const { data } = await axiosInstance.put("/admin-coupons/update", updateData);

  return data;
};

export const deleteCoupon = async (_id: string) => {
  const { data } = await axiosInstance.delete(`/admin-coupons/delete/${_id}`);

  return data;
};

// Subscribers
export const getSubscribers = async () => {
  try {
    const { data } = await axiosInstance("/admin-subscribers");

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Contacts
export const getContacts = async () => {
  try {
    const { data } = await axiosInstance("/admin-contacts");

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Questions
export const getQuestions = async () => {
  try {
    const { data } = await axiosInstance("/admin-questions");

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Donations
export const getDonations = async () => {
  try {
    const { data } = await axiosInstance("/admin-donations");

    return data;
  } catch (error) {
    console.log(error);
  }
};
