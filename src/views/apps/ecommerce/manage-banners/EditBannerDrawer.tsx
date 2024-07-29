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

import { updateBanner } from "@/app/server/actions";
import type { bannerType } from "./BannerListTable";
import { getChangedFields } from "@/utils/getChangedFields";

type Props = {
  originalBanner: bannerType | undefined;
  open: boolean;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<bannerType[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type FormValues = {
  name: string;
  status: string;
  order: string;
};

const EditBannerDrawer = (props: Props) => {
  // Props
  const { open, setOpen, setData, originalBanner } = props;

  // States
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      status: "",
      order: "",
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: FormValues) => {
    const formattedOriginalBanner = {
      name: originalBanner?.name || "",
      order: originalBanner?.order || "",
      status: originalBanner?.status,
      image: originalBanner?.image || "",
    };

    const formattedFormValues = {
      name: formValues.name,
      order: formValues.order,
      status: formValues.status,
      image: fileName,
    };

    const changedFields = getChangedFields({
      initialFormData: formattedOriginalBanner,
      currentFormData: formattedFormValues,
    });

    if (Object.keys(changedFields).length === 0) {
      setLoading(false);

      return toast.error("No changes made to the banner", {
        position: "top-left",
      });
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("_id", originalBanner?._id || "");

    if (changedFields.image && file) {
      formData.append("file", file);
    }

    if (changedFields.name) {
      formData.append("name", formValues.name);
    }

    if (changedFields.order) {
      formData.append("order", formValues.order);
    }

    if (changedFields.status) {
      formData.append("status", formValues.status);
    }

    try {
      const result = await updateBanner(formData);

      if (result.ok) {
        toast.success("Update category successfully");

        setData((prev) => {
          const newBanner = result?.banner || {};
          const newData = [...prev];

          const index = newData.findIndex(
            (banner) => banner._id === originalBanner?._id,
          );

          newData[index] = {
            ...newData[index],
            name: newBanner?.name,
            image: newBanner?.image,
            order: newBanner?.order,
            status: newBanner?.status,
            updatedAt: newBanner?.updatedAt,
          };

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

  // Handle File Upload
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files.length > 0) {
      const file = files[0];

      setFileName(file.name);
      setFile(file);
    }
  };

  useEffect(() => {
    if (originalBanner) {
      setValue("name", originalBanner?.name);
      setValue("status", originalBanner?.status);
      setValue("order", originalBanner?.order);
      setFileName(originalBanner?.image);
    }
  }, [originalBanner, setValue]);

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
        <Typography variant="h5">Edit Banner</Typography>
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
              htmlFor="edit-banner-file"
              className="min-is-fit"
            >
              Choose
              <input
                hidden
                id="edit-banner-file"
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

export default EditBannerDrawer;
