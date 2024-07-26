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

import type { categoryType } from "./ProductCategoryTable";
import { createCategory } from "@/app/server/actions";

type Props = {
  open: boolean;
  handleClose: () => void;
  categoryData: categoryType[];
  setData: (data: categoryType[]) => void;
};

type FormValues = {
  vi_name: string;
  en_name: string;
  vi_description: string;
  en_description: string;
};

const AddCategoryDrawer = (props: Props) => {
  // Props
  const { open, handleClose, categoryData, setData } = props;

  // States
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Published");
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
      vi_name: "",
      en_name: "",
      vi_description: "",
      en_description: "",
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: FormValues) => {
    setLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    formData.append("name[en]", formValues.en_name);
    formData.append("name[vi]", formValues.vi_name);
    formData.append("description[en]", formValues.en_description);
    formData.append("description[vi]", formValues.vi_description);
    formData.append("status", status);

    try {
      const result = await createCategory(formData);

      if (result.ok) {
        toast.success("Tạo danh mục thành công");

        setData([
          {
            totalEarning: 0,
            totalProduct: 0,
            categoryTitle: formValues.vi_name,
            image: result?.category?.image || "",
            description: formValues.vi_description,
            id: result?.category?._id,
          },
          ...categoryData,
        ]);
      } else {
        toast.error(result?.error);
      }
    } catch (error) {
      toast.error("Tạo danh mục thất bại");
    }

    setLoading(false);
    handleReset();
  };

  // Handle Form Reset
  const handleReset = () => {
    handleClose();
    resetForm({
      vi_name: "",
      en_name: "",
      vi_description: "",
      en_description: "",
    });
    setFileName("");
    setFile(null);
    setStatus("Published");
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
        <Typography variant="h5">Add Category</Typography>
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
            name="vi_name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Vietnamese name"
                placeholder="Đồ lưu niệm"
                {...(errors.vi_name && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />
          <Controller
            name="en_name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="English name"
                placeholder="Souvenir"
                {...(errors.en_name && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />
          <Controller
            name="vi_description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Vietnamese Description"
                placeholder="Enter a description..."
                multiline
                rows={4}
                {...(errors.vi_description && {
                  error: true,
                  helperText: "This field is required.",
                })}
              />
            )}
          />
          <Controller
            name="en_description"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="English Description"
                placeholder="Enter a description..."
                multiline
                rows={4}
                {...(errors.en_description && {
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
              htmlFor="contained-button-file"
              className="min-is-fit"
            >
              Choose
              <input
                hidden
                id="contained-button-file"
                type="file"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </Button>
          </div>
          <FormControl fullWidth>
            <InputLabel id="plan-select">Category Status</InputLabel>
            <Select
              fullWidth
              id="select-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Category Status"
              labelId="status-select"
            >
              <MenuItem value="Published">Published</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Scheduled">Scheduled</MenuItem>
            </Select>
          </FormControl>
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

export default AddCategoryDrawer;
