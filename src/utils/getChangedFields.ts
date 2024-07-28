export const getChangedFields = ({
  initialFormData,
  currentFormData,
}: {
  initialFormData: any;
  currentFormData: any;
}) => {
  const changedFields = Object.keys(currentFormData).reduce((acc, key) => {
    if (
      currentFormData[key as keyof typeof currentFormData] !==
      initialFormData[key as keyof typeof initialFormData]
    ) {
      acc[key as keyof typeof currentFormData] =
        currentFormData[key as keyof typeof currentFormData];
    }

    return acc;
  }, {} as any);

  return changedFields;
};
