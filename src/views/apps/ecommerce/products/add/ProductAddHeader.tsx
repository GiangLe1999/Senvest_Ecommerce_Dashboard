// MUI Imports
import type { FC } from "react";

import Link from "next/link";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

interface Props {
  loading: boolean;
}

const ProductAddHeader: FC<Props> = ({ loading }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div>
        <Typography variant="h4" className="mbe-1">
          Add a new product
        </Typography>
        <Typography>Orders placed across your store</Typography>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button variant="outlined" color="error">
          <Link href="/products/list">Discard</Link>
        </Button>
        <LoadingButton
          loading={loading}
          loadingPosition="start"
          variant="contained"
          type="submit"
        >
          Publish Product
        </LoadingButton>
      </div>
    </div>
  );
};

export default ProductAddHeader;
