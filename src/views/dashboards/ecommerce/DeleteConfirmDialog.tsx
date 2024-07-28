"use client";

// MUI Imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  onConfirmDelete: () => Promise<void>;
};

const DeleteConfirmDialog = ({
  open,
  setOpen,
  loading,
  onConfirmDelete,
}: Props) => {
  const handleClose = () => {
    setOpen(false);
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
            Do you really want to delete this document?
          </Typography>

          <Grid container spacing={5}>
            <Grid item sm={6} xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  handleClose();
                }}
                className="py-2.5 text-[17px]"
              >
                Cancel
              </Button>
            </Grid>

            <Grid item sm={6} xs={12}>
              <LoadingButton
                loading={loading}
                loadingPosition="start"
                variant="contained"
                onClick={onConfirmDelete}
                color="error"
                fullWidth
                className="py-2.5 text-[17px]"
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

export default DeleteConfirmDialog;
