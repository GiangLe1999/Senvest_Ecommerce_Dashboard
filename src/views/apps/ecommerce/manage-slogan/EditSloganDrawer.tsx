// React Imports
import { useState, useEffect } from "react";
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

import { updateSlogan } from "@/app/server/actions";
import { getChangedFields } from "@/utils/getChangedFields";
import type { sloganType } from "./SloganListTable";

type Props = {
  originalSlogan: sloganType | undefined;
  open: boolean;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<sloganType[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type FormValues = {
  content: string;
  status: string;
  order: string;
};

const EditSloganDrawer = (props: Props) => {
  // Props
  const { open, setOpen, setData, originalSlogan } = props;

  // States
  const [loading, setLoading] = useState(false);

  // Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      content: "",
      status: "",
      order: "",
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: FormValues) => {
    const changedFields = getChangedFields({
      initialFormData: originalSlogan,
      currentFormData: formValues,
    });

    if (Object.keys(changedFields).length === 0) {
      setLoading(false);

      return toast.error("No changes made to the slogan", {
        position: "top-left",
      });
    }

    setLoading(true);

    try {
      const result = await updateSlogan({
        ...changedFields,
        _id: originalSlogan?._id,
      });

      if (result.ok) {
        toast.success("Update slogan successfully");

        setData((prev) => {
          const newSlogan = result?.slogan || {};
          const newData = [...prev];

          const index = newData.findIndex(
            (slogan) => slogan._id === originalSlogan?._id,
          );

          newData[index] = {
            ...newData[index],
            content: newSlogan?.content,
            order: newSlogan?.order,
            status: newSlogan?.status,
            updatedAt: newSlogan?.updatedAt,
          };

          return newData;
        });
        setOpen(false);
      } else {
        toast.error(result?.error, {
          position: "top-left",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-left",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (originalSlogan) {
      setValue("content", originalSlogan?.content);
      setValue("status", originalSlogan?.status);
      setValue("order", originalSlogan?.order);
    }
  }, [originalSlogan, setValue]);

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
        <Typography variant="h5">Edit Slogan</Typography>
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
            name="content"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Content"
                placeholder="Content"
                {...(errors.content && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Select Status</InputLabel>
                <Select {...field} label="Select Status">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="order"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Order"
                type="number"
                placeholder="Order"
                {...(errors.order && {
                  error: true,
                  helperText: "This field is required.",
                })}
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

export default EditSloganDrawer;
