"use client";

// React Imports
import { useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Component Imports
import { Grid } from "@mui/material";

const ProductOrganize = () => {
  // States
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  return (
    <Card>
      <CardHeader title="Organize" />
      <CardContent>
        <Grid container spacing={10}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Household">Household</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Management">Management</MenuItem>
                <MenuItem value="Automotive">Automotive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Select Status</InputLabel>
              <Select
                label="Select Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProductOrganize;
