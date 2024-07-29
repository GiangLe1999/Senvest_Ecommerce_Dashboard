// React Imports
import { useState, useRef } from "react";
import type { ChangeEvent } from "react";

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

import { createBanner } from "@/app/server/actions";
import type { bannerType } from "./BannerListTable";

type Props = {
  open: boolean;
  handleClose: () => void;
  bannerData: bannerType[];
  setData: (data: bannerType[]) => void;
};

type FormValues = {
  name: string;
  status: string;
  order: string;
};

const AddBannerDrawer = (props: Props) => {
  // Props
  const { open, handleClose, bannerData, setData } = props;

  // States
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      status: "",
      order: "",
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: FormValues) => {
    setLoading(true);

    const formData = new FormData();

    if (!file) {
      toast.error("Please upload a banner image", {
        position: "top-left",
      });
      setLoading(false);

      return;
    }

    formData.append("file", file);
    formData.append("name", formValues.name);
    formData.append("status", formValues.status);
    formData.append("order", formValues.order);

    try {
      const result = await createBanner(formData);

      if (result.ok) {
        toast.success("Create banner successfully");

        setData([
          {
            _id: result?.banner?._id,
            name: result?.banner?.name,
            status: result?.banner?.status,
            updatedAt: result?.banner?.updatedAt,
            order: result?.banner?.order,
            image: result?.banner?.image,
          },
          ...bannerData,
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
      name: "",
      status: "",
      order: "",
    });
    setFileName("");
    setFile(null);
  };

  // Handle File Upload
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files.length > 0) {
      const file = files[0];

      setFileName(file.name);
      setFile(file);
    }
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
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                placeholder="Name"
                {...(errors.name && {
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

          <div className="flex items-center gap-4">
            <TextField
              size="small"
              placeholder="No file chosen"
              variant="outlined"
              value={fileName}
              className="flex-auto"
              InputProps={{
                readOnly: true,
                endAdornment: fileName ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => setFileName("")}
                    >
                      <i className="ri-close-line" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
            <Button
              component="label"
              variant="outlined"
              htmlFor="add-banner-file"
              className="min-is-fit"
            >
              Choose
              <input
                hidden
                id="add-banner-file"
                type="file"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </Button>
          </div>

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

export default AddBannerDrawer;
