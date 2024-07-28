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

import type { categoryType } from "./ProductCategoryTable";
import { getChangedFields } from "@/utils/getChangedFields";
import { updateCategory } from "@/app/server/actions";

type Props = {
  originalCategory: categoryType | undefined;
  open: boolean;
  handleClose: () => void;
  setData: Dispatch<SetStateAction<categoryType[]>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type FormValues = {
  vi_name: string;
  en_name: string;
  vi_description: string;
  en_description: string;
};

const EditCategoryDrawer = (props: Props) => {
  // Props
  const { open, setOpen, setData, originalCategory } = props;

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
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      vi_name: originalCategory?.name?.vi || "",
      en_name: originalCategory?.name?.en || "",
      vi_description: originalCategory?.description?.vi || "",
      en_description: originalCategory?.description?.en || "",
    },
  });

  // Handle Form Submit
  const handleFormSubmit = async (formValues: FormValues) => {
    const formattedOriginalCategory = {
      en_name: originalCategory?.name?.en || "",
      vi_name: originalCategory?.name?.vi || "",
      en_description: originalCategory?.description?.en || "",
      vi_description: originalCategory?.description?.vi || "",
      status: originalCategory?.status || "Published",
      image: originalCategory?.image || "",
    };

    const formattedFormValues = {
      en_name: formValues.en_name,
      vi_name: formValues.vi_name,
      en_description: formValues.en_description,
      vi_description: formValues.vi_description,
      status: status || "Published",
      image: fileName || "",
    };

    const changedFields = getChangedFields({
      initialFormData: formattedOriginalCategory,
      currentFormData: formattedFormValues,
    });

    if (Object.keys(changedFields).length === 0) {
      return toast.error("No changes made to the category", {
        position: "top-left",
      });
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("_id", originalCategory?._id || "");

    if (changedFields.image && file) {
      formData.append("file", file);
    }

    if (changedFields.en_name) {
      formData.append("name[en]", formValues.en_name);
    }

    if (changedFields.vi_name) {
      formData.append("name[vi]", formValues.vi_name);
    }

    if (changedFields.en_description) {
      formData.append("description[en]", formValues.en_description);
    }

    if (changedFields.vi_description) {
      formData.append("description[vi]", formValues.vi_description);
    }

    if (changedFields.status) {
      formData.append("status", status);
    }

    try {
      const result = await updateCategory(formData);

      if (result.ok) {
        toast.success("Update category successfully");

        setData((prev) => {
          const newCategory = result?.category || {};
          const newData = [...prev];

          const index = newData.findIndex(
            (category) => category._id === originalCategory?._id,
          );

          newData[index] = {
            ...newData[index],
            name: {
              en: newCategory?.name?.en,
              vi: newCategory?.name?.vi,
            },
            image: newCategory?.image || "",
            description: {
              en: newCategory?.description?.en,
              vi: newCategory?.description?.vi,
            },
            status: newCategory?.status,
          };

          return newData;
        });
        setOpen(false);
      } else {
        console.log;
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
    if (originalCategory) {
      setValue("vi_name", originalCategory?.name?.vi || "");
      setValue("en_name", originalCategory?.name?.en || "");
      setValue("vi_description", originalCategory?.description?.vi || "");
      setValue("en_description", originalCategory?.description?.en || "");
      setFileName(originalCategory?.image || "");
      setStatus(originalCategory?.status || "Published");
    }
  }, [originalCategory, setValue]);

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
        <Typography variant="h5">Edit Category</Typography>
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
            name="vi_name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Vietnamese name"
                placeholder="Vietnamese name"
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
                placeholder="English name"
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
              htmlFor="contained-button-update-file"
              className="min-is-fit"
            >
              Choose
              <input
                hidden
                id="contained-button-update-file"
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
            </Select>
          </FormControl>
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

export default EditCategoryDrawer;
