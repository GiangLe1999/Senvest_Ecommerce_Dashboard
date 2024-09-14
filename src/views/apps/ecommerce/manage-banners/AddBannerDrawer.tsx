// React Imports
import { useState, useRef } from "react";
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

import { createBanner } from "@/app/server/actions";
import type { bannerType } from "./BannerListTable";

type Props = {
  open: boolean;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<bannerType[]>>;
};

type FormValues = {
  name: string;
  status: string;
  order: string;
  link: string;
  line_1_vi: string;
  line_1_en: string;
  line_2_vi: string;
  line_2_en: string;
  line_3_vi: string;
  line_3_en: string;
  button_text_vi: string;
  button_text_en: string;
};

const AddBannerDrawer = (props: Props) => {
  // Props
  const { open, handleClose, setData } = props;

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
      link: "",
      line_1_vi: "",
      line_1_en: "",
      line_2_vi: "",
      line_2_en: "",
      line_3_vi: "",
      line_3_en: "",
      button_text_vi: "",
      button_text_en: "",
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
    formData.append("link", formValues.link);
    formData.append("line_1_vi", formValues.line_1_vi);
    formData.append("line_1_en", formValues.line_1_en);
    formData.append("line_2_vi", formValues.line_1_vi);
    formData.append("line_2_en", formValues.line_2_en);
    formData.append("line_3_vi", formValues.line_3_vi);
    formData.append("line_3_en", formValues.line_3_en);
    formData.append("button_text_vi", formValues.button_text_vi);
    formData.append("button_text_en", formValues.button_text_en);

    try {
      const result = await createBanner(formData);

      if (result.ok) {
        toast.success("Create banner successfully");

        setData((prev) => [
          ...prev,
          {
            _id: result?.banner?._id,
            name: result?.banner?.name,
            status: result?.banner?.status,
            link: result?.banner?.link,
            order: result?.banner?.order,
            image: result?.banner?.image,
            line_1_vi: result?.banner?.line_1_vi,
            line_1_en: result?.banner?.line_1_en,
            line_2_vi: result?.banner?.line_2_vi,
            line_2_en: result?.banner?.line_2_en,
            line_3_vi: result?.banner?.line_3_vi,
            line_3_en: result?.banner?.line_3_en,
            button_text_vi: result?.banner?.button_text_vi,
            button_text_en: result?.banner?.button_text_en,
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
            name="link"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Link"
                placeholder="Link"
                {...(errors.link && {
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

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="line_1_vi"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Vietnamese Line 1"
                  placeholder="Vietnamese Line 1"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />

            <Controller
              name="line_1_en"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="English Line 1"
                  placeholder="English Line 1"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />

            <Controller
              name="line_2_vi"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Vietnamese Line 2"
                  placeholder="Vietnamese Line 2"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />

            <Controller
              name="line_2_en"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="English Line 2"
                  placeholder="English Line 2"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />
            <Controller
              name="line_3_vi"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Vietnamese Line 3"
                  placeholder="Vietnamese Line 3"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />

            <Controller
              name="line_3_en"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="English Line 3"
                  placeholder="English Line 3"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />

            <Controller
              name="button_text_vi"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Vietnamese Button"
                  placeholder="Vietnamese Button"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />

            <Controller
              name="button_text_en"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="English Button"
                  placeholder="English Button"
                  {...(errors.link && {
                    error: true,
                    helperText: "This field is required.",
                  })}
                />
              )}
            />
          </div>

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
