// React Imports
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

// MUI Imports
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";

// Third-party Imports
import { useForm, Controller } from "react-hook-form";

// Type Imports
import { toast } from "react-toastify";

import LoadingButton from "@mui/lab/LoadingButton";

import { updateBanner, updateCoupon } from "@/app/server/actions";
import type { couponType } from "./CouponListTable";
import { getChangedFields } from "@/utils/getChangedFields";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { vi } from "date-fns/locale/vi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type Props = {
  originalCoupon: any | undefined;
  open: boolean;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<couponType[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type FormValues = {
  code: string;
  discount_value: number;
  expiry_date: Date;
  assigned_to_email?: string;
  discount_type: "Percent" | "Value";
  max_usage_count: number;
};

const EditCouponDrawer = (props: Props) => {
  const { open, setOpen, setData, originalCoupon } = props;

  // States
  const [loading, setLoading] = useState(false);

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      discount_value: 0,
      expiry_date: new Date(),
      assigned_to_email: "",
      discount_type: "Percent",
      max_usage_count: 0,
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: FormValues) => {
    const formattedOriginalCoupon = {
      code: originalCoupon?.code || "",
      discount_value: originalCoupon?.discount_value || 0,
      expiry_date: new Date(originalCoupon?.expiry_date).toISOString(),
      ...(originalCoupon?.assigned_to_email && {
        assigned_to_email: originalCoupon?.assigned_to_email,
      }),
      discount_type: originalCoupon?.discount_type,
      max_usage_count: originalCoupon?.max_usage_count || 0,
    };

    const formattedFormValues = {
      code: formValues.code,
      discount_value: Number(formValues.discount_value),
      expiry_date: new Date(formValues.expiry_date).toISOString(),
      discount_type: formValues.discount_type,
      ...(formValues?.assigned_to_email && {
        assigned_to_email: formValues?.assigned_to_email,
      }),
      max_usage_count: Number(formValues.max_usage_count),
    };

    const changedFields = getChangedFields({
      initialFormData: formattedOriginalCoupon,
      currentFormData: formattedFormValues,
    });

    if (Object.keys(changedFields).length === 0) {
      setLoading(false);

      return toast.error("No changes made to the coupon", {
        position: "top-left",
      });
    }

    setLoading(true);

    try {
      if (changedFields.expiry_date) {
        const expiryDate = new Date(changedFields.expiry_date);
        changedFields.expiry_date = expiryDate.setHours(23, 59, 59, 999);
      }

      const result = await updateCoupon({
        ...changedFields,
        _id: originalCoupon?._id,
      });

      if (result.ok) {
        toast.success("Update coupon successfully");

        setData((prev) => {
          const newCoupon = result?.coupon || {};
          const newData = [...prev];

          const index = newData.findIndex(
            (coupon) => coupon._id === originalCoupon?._id,
          );

          newData[index] = {
            ...newData[index],
            code: newCoupon?.code,
            status: newCoupon?.status,
            discount_value: newCoupon?.discount_value.toString(),
            expiry_date: newCoupon?.expiry_date,
            usage_count: newCoupon?.usage_count,
            assigned_to_email: newCoupon?.assigned_to_email,
            discount_type: newCoupon?.discount_type,
            max_usage_count: newCoupon?.max_usage_count.toString(),
          } as any;

          return newData;
        });
        setOpen(false);
      } else {
        toast.error(result?.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (originalCoupon) {
      setValue("code", originalCoupon?.code);
      setValue("discount_value", originalCoupon?.discount_value);
      setValue("discount_type", originalCoupon?.discount_type);
      setValue("expiry_date", new Date(originalCoupon?.expiry_date));
      setValue("assigned_to_email", originalCoupon?.assigned_to_email);
      setValue("max_usage_count", originalCoupon?.max_usage_count);
    }
  }, [originalCoupon, setValue]);

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={() => setOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <div className="flex items-center justify-between pli-5 plb-4">
        <Typography variant="h5">Edit Coupon</Typography>
        <IconButton size="small" onClick={() => setOpen(false)}>
          <i className="ri-close-line text-2xl" />
        </IconButton>
      </div>
      <Divider />
      <div className="p-5">
        <form
          onSubmit={handleSubmit((data) => handleFormSubmit(data))}
          className="flex flex-col gap-5"
        >
          <Controller
            name="code"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Code"
                placeholder="Code"
                {...(errors.code && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />

          <Controller
            name="discount_value"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Discount Value"
                placeholder="Discount Value"
                type="number"
                {...(errors.discount_value && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />

          <Controller
            name="discount_type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.discount_type}>
                <InputLabel>Discount Type</InputLabel>
                <Select {...field} label="Select Status">
                  <MenuItem value="Percent">Percent (%)</MenuItem>
                  <MenuItem value="Value">Value (VND)</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="expiry_date"
            control={control}
            render={({ field }) => (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  slotProps={{
                    textField: {
                      error: false,
                    },
                  }}
                  className="w-full"
                  label="Expiry Date"
                  {...field}
                />
              </LocalizationProvider>
            )}
          />

          <Controller
            name="max_usage_count"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Max Usage"
                placeholder="Max Usage"
                type="number"
                {...(errors.max_usage_count && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />

          <Controller
            name="assigned_to_email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Assigned To Email (Optional)"
                placeholder="Assigned To Email"
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              variant="contained"
              type="submit"
            >
              Update
            </LoadingButton>
            <Button
              variant="outlined"
              color="error"
              type="reset"
              onClick={() => setOpen(false)}
            >
              Discard
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default EditCouponDrawer;
