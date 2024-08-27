// MUI Imports
import Grid from "@mui/material/Grid";

// Component Imports
import TotalReviews from "@views/apps/ecommerce/manage-reviews/TotalReviews";
import ReviewsStatistics from "@views/apps/ecommerce/manage-reviews/ReviewsStatistics";
import ManageReviewsTable from "@views/apps/ecommerce/manage-reviews/ManageReviewsTable";

// Data Imports
import {  getTotalReviews } from "@/app/server/actions";

const eCommerceManageReviews = async () => {
  // Vars
  const data = await getTotalReviews();

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6}>
        <TotalReviews totalReviews = {data.reviews} reviewsByDayOfWeek = {data.reviewsByDayOfWeek}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ReviewsStatistics reviewsByDayOfWeek = {data.reviewsByDayOfWeek}/>
      </Grid>
      <Grid item xs={12}>
        <ManageReviewsTable reviewsData={data.reviewTable} />
      </Grid>
    </Grid>
  );
};

export default eCommerceManageReviews;
