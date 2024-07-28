"use client";

// MUI Imports
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { toast } from "react-toastify";

import { deleteCategory } from "@/app/server/actions";
import type { categoryType } from "./ProductCategoryTable";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  deletedCategoryId: string | undefined;
  setData: Dispatch<SetStateAction<categoryType[]>>;
};

const DeleteCategoryDialog = ({
  open,
  setOpen,
  deletedCategoryId,
  setData,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const confirmDeleteCategory = async () => {
    setLoading(true);

    try {
      if (deletedCategoryId) {
        const result = await deleteCategory(deletedCategoryId);

        if (result.ok) {
          toast.success("Delete category successfully");

          setData((prev) => {
            return prev.filter(
              (category) => category._id !== deletedCategoryId,
            );
          });
        } else {
          console.log;
          toast.error(result?.error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }

    setLoading(false);
    handleClose();
  };

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle
          variant="h4"
          className="flex flex-col gap-2 text-center py-6 sm:px-12 px-6"
        >
          Are you sure?
        </DialogTitle>
        <DialogContent className="overflow-visible sm:px-12 px-6 pb-10 text-center">
          <Typography mb={2}>This process cannot be undone</Typography>
          <Typography mb={8}>
            Do you really want to delete this category?
          </Typography>

          <Grid container spacing={5}>
            <Grid item sm={6} xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </Grid>

            <Grid item sm={6} xs={12}>
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="contained"
                onClick={confirmDeleteCategory}
                color="error"
                fullWidth
              >
                Delete
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteCategoryDialog;
