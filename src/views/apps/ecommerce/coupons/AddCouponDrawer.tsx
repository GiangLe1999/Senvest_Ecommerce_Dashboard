// React Imports
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

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

// Third-party Imports
import { useForm, Controller } from "react-hook-form";

// Type Imports
import { toast } from "react-toastify";

import LoadingButton from "@mui/lab/LoadingButton";

import { createCoupon } from "@/app/server/actions";
import type { couponType } from "./CouponListTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { vi } from "date-fns/locale/vi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type Props = {
  open: boolean;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<couponType[]>>;
};

type FormValues = {
  code: string;
  discount_value: number;
  expiry_date: Date;
  assigned_to_email?: string;
  discount_type: "Percent" | "Value";
};

const AddCouponDrawer = (props: Props) => {
  const { open, handleClose, setData } = props;
  const [loading, setLoading] = useState(false);

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      discount_value: 0,
      expiry_date: new Date(),
      assigned_to_email: "",
      discount_type: "Percent",
    },
  });

  const handleFormSubmit = async (formValues: FormValues) => {
    setLoading(true);
    try {
      const expiryDate = new Date(formValues.expiry_date);
      expiryDate.setHours(23, 59, 59, 999);

      const result = await createCoupon({
        ...formValues,
        discount_value: Number(formValues.discount_value),
        expiry_date: expiryDate,
      });

      if (result.ok) {
        toast.success("Create coupon successfully");

        setData((prev) => [
          ...prev,
          {
            _id: result?.coupon?._id,
            code: result?.coupon?.code,
            status: result?.coupon?.status,
            discount_value: result?.coupon?.discount_value.toString(),
            expiry_date: result?.coupon?.expiry_date,
            usage_count: result?.coupon?.usage_count,
            assigned_to_email: result?.coupon?.assigned_to_email,
            discount_type: result?.coupon?.discount_type,
          },
        ]);
      } else {
        toast.error(result?.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
    handleReset();
  };

  // Handle Form Reset
  const handleReset = () => {
    handleClose();
    resetForm();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <div className="flex items-center justify-between pli-5 plb-4">
        <Typography variant="h5">Add Coupon</Typography>
        <IconButton size="small" onClick={handleReset}>
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
              Add
            </LoadingButton>
            <Button
              variant="outlined"
              color="error"
              type="reset"
              onClick={handleReset}
            >
              Discard
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default AddCouponDrawer;
