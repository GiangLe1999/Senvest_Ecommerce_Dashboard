// React Imports
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

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

import { createSlogan } from "@/app/server/actions";
import type { sloganType } from "./SloganListTable";

type Props = {
  open: boolean;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<sloganType[]>>;
};

type FormValues = {
  order: string;
  status: string;
  vi_content: string;
  en_content: string;
};

const AddSloganDrawer = (props: Props) => {
  // Props
  const { open, handleClose, setData } = props;

  // States
  const [loading, setLoading] = useState(false);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      order: "",
      status: "",
      vi_content: "",
      en_content: "",
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: FormValues) => {
    setLoading(true);

    try {
      const result = await createSlogan({
        content: {
          vi: formValues.vi_content,
          en: formValues.en_content,
        },
        status: formValues.status,
        order: formValues.order,
      });

      if (result.ok) {
        toast.success("Create slogan successfully");

        setData((prev) => [
          ...prev,
          {
            _id: result?.slogan?._id,
            content: result?.slogan?.content,
            status: result?.slogan?.status,
            updatedAt: result?.slogan?.updatedAt,
            order: result?.slogan?.order,
          },
        ]);
      } else {
        console.log;
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
    resetForm({
      vi_content: "",
      en_content: "",
      status: "",
      order: "",
    });
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
        <Typography variant="h5">Add Banner</Typography>
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
            name="vi_content"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Vietnamese Content"
                placeholder="Vietnamese Content"
                {...(errors.vi_content && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />

          <Controller
            name="en_content"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="English Content"
                placeholder="English Content"
                {...(errors.en_content && {
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

export default AddSloganDrawer;
