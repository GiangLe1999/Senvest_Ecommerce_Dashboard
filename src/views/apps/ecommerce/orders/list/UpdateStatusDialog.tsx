"use client";

// MUI Imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FormControl, Grid, InputLabel, MenuItem } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { AdminStatusEnum } from "@/types/apps/ecommerceTypes";
import { useForm } from "react-hook-form";
import { object, minLength, string, pipe } from "valibot";
import Select from "@mui/material/Select";

// Component Imports
import { FormHelperText } from "@mui/material";

// Third Parties
import { Controller, type Control } from "react-hook-form";
import { updateProcessingStatus } from "@/app/server/actions";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: { _id: string; status: AdminStatusEnum };
};

const schema = object({
  admin_status: pipe(string(), minLength(1, "This field is required")),
});

export type ChangeAdminStatusFormValues = {
  admin_status: AdminStatusEnum;
};

const statuses = [
  { label: "Pending", value: AdminStatusEnum.pending },
  { label: "Processing", value: AdminStatusEnum.processing },
  { label: "Shipped", value: AdminStatusEnum.shipped },
  { label: "Delivered", value: AdminStatusEnum.delivered },
  { label: "Cancelled", value: AdminStatusEnum.cancelled },
  { label: "Refunded", value: AdminStatusEnum.refunded },
];

const UpdateStatusDialog = ({ open, setOpen, payment }: Props) => {
  const [loading, setLoading] = useState(false);

  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeAdminStatusFormValues>({
    resolver: valibotResolver(schema),
    defaultValues: {
      admin_status: payment.status,
    },
  });

  const handleFormSubmit = async (formValues: ChangeAdminStatusFormValues) => {
    try {
      setLoading(true);
      const res = await updateProcessingStatus(
        payment._id,
        formValues.admin_status,
      );

      if (res.ok) {
        toast.success("Update status successfully");
        setOpen(false);
        setLoading(false);
        window.location.reload();
      } else {
        setLoading(false);
        return toast.error(res?.error);
      }
    } catch (error) {
      setLoading(false);
      return toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setValue("admin_status", payment.status);
  }, [payment.status, setValue]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          variant="h4"
          className="flex flex-col gap-2 text-center py-6 sm:px-12 px-6"
        >
          Update processing status
        </DialogTitle>
        <DialogContent className="overflow-visible sm:px-12 px-6 pb-10">
          <Typography mb={8}>
            Are you sure you want to update the processing status of this order?
          </Typography>

          <form onSubmit={handleSubmit((data) => handleFormSubmit(data))}>
            <Controller
              name="admin_status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.admin_status}>
                  <InputLabel>Select Status</InputLabel>
                  <Select {...field} label="Select Category" disabled={loading}>
                    {statuses?.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.admin_status && (
                    <FormHelperText>
                      {errors.admin_status.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Grid container spacing={5} mt={3}>
              <Grid item sm={6} xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    handleClose();
                  }}
                  className="py-2.5 text-[17px]"
                  type="button"
                >
                  Cancel
                </Button>
              </Grid>

              <Grid item sm={6} xs={12}>
                <LoadingButton
                  type="submit"
                  loading={loading}
                  loadingPosition="start"
                  variant="contained"
                  color="error"
                  fullWidth
                  className="py-2.5 text-[17px]"
                >
                  Update
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateStatusDialog;
