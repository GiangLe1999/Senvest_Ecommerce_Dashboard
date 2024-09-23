import type { NextPage } from "next";

import { getQuestions } from "@/app/server/actions";
import QuestionListTable from "@/views/apps/ecommerce/questions/QuestionListTable";

interface Props {}

const Page: NextPage<Props> = async () => {
  const data = await getQuestions();

  return <QuestionListTable questions={data?.questions} />;
};

export default Page;
