"use client";

// React Imports
import type { FC } from "react";

// MUI Imports

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import type { BoxProps } from "@mui/material/Box";

// Third-party Imports
import { useDropzone } from "react-dropzone";

// Component Imports
import type { UseFormSetValue } from "react-hook-form";

import { FormHelperText } from "@mui/material";

import CustomAvatar from "@core/components/mui/Avatar";

// Styled Component Imports
import AppReactDropzone from "@/libs/styles/AppReactDropzone";
import type { AddProductFormValues } from "./ProductAddOrEditForm";

type FileProp = {
  name: string;
  type: string;
  size: number;
};

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  "& .dropzone": {
    minHeight: "unset",
    padding: theme.spacing(12),
    [theme.breakpoints.down("sm")]: {
      paddingInline: theme.spacing(5),
    },
    "&+.MuiList-root .MuiListItem-root .file-name": {
      fontWeight: theme.typography.body1.fontWeight,
    },
  },
}));

interface Props {
  index: number;
  files: File[];
  setValue: UseFormSetValue<AddProductFormValues>;
  error: any;
}

const ProductImage: FC<Props> = ({ index, files, setValue, error }) => {
  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setValue(`variants.${index}.images`, [
        ...files,
        ...acceptedFiles.map((file: File) => Object.assign(file)),
      ]);
    },
  });

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          width={38}
          height={38}
          alt={file.name}
          src={URL.createObjectURL(file as any)}
        />
      );
    } else {
      return <i className="ri-file-text-line" />;
    }
  };

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files;

    const filtered = uploadedFiles.filter(
      (i: FileProp) => i.name !== file.name,
    );

    setValue(`variants.${index}.images`, [...filtered]);
  };

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name} className="pis-4 plb-3">
      <div className="file-details">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <Typography className="file-name font-medium" color="text.primary">
            {file.name}
          </Typography>
          <Typography className="file-size" variant="body2">
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className="ri-close-line text-xl" />
      </IconButton>
    </ListItem>
  ));

  const handleRemoveAllFiles = () => {
    setValue(`variants.${index}.images`, []);
  };

  return (
    <Dropzone>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="flex items-center flex-col gap-2 text-center">
          <CustomAvatar variant="rounded" skin="light" color="secondary">
            <i className="ri-upload-2-line" />
          </CustomAvatar>
          <Typography variant="h5">
            Drag and Drop Variant Images Here
          </Typography>
          <Typography color="text.disabled" mb={2}>
            or
          </Typography>
          <Button variant="outlined" size="small">
            Browse Image
          </Button>
        </div>
      </div>

      {error ? <FormHelperText error>{error?.message}</FormHelperText> : ""}

      {files.length ? (
        <>
          <List>{fileList}</List>
          <div className="mt-5 text-right">
            <Button
              color="error"
              variant="outlined"
              onClick={handleRemoveAllFiles}
            >
              Remove All
            </Button>
          </div>
        </>
      ) : null}
    </Dropzone>
  );
};

export default ProductImage;
