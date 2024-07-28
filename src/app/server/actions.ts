"use server";

import axiosInstance, { publicAxiosInstance } from "@/configs/axios";

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

export const getCategories = async () => {
  try {
    const data = await publicAxiosInstance("/categories");

    return data;
  } catch (error) {
    console.log(error);
  }
};

// Products
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
