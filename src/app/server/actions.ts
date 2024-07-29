"use server";

import axiosInstance from "@/configs/axios";

// Data Imports
import { db as eCommerceData } from "@/fake-db/apps/ecommerce";
import { db as academyData } from "@/fake-db/apps/academy";
import { db as vehicleData } from "@/fake-db/apps/logistics";
import { db as invoiceData } from "@/fake-db/apps/invoice";
import { db as userData } from "@/fake-db/apps/userList";
import { db as permissionData } from "@/fake-db/apps/permissions";
import { db as profileData } from "@/fake-db/pages/userProfile";
import { db as faqData } from "@/fake-db/pages/faq";
import { db as pricingData } from "@/fake-db/pages/pricing";
import { db as statisticsData } from "@/fake-db/pages/widgetExamples";

export const getEcommerceData = async () => {
  return eCommerceData;
};

export const getAcademyData = async () => {
  return academyData;
};

export const getLogisticsData = async () => {
  return vehicleData;
};

export const getInvoiceData = async () => {
  return invoiceData;
};

export const getUserData = async () => {
  return userData;
};

export const getPermissionsData = async () => {
  return permissionData;
};

export const getProfileData = async () => {
  return profileData;
};

export const getFaqData = async () => {
  return faqData;
};

export const getPricingData = async () => {
  return pricingData;
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

export const createProduct = async (formData: FormData) => {
  const { data } = await axiosInstance.post(
    "/admin-products/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const updateProduct = async (formData: FormData) => {
  const { data } = await axiosInstance.put("/admin-products/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteProduct = async (_id: string) => {
  const { data } = await axiosInstance.delete(`/admin-products/delete/${_id}`);

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
