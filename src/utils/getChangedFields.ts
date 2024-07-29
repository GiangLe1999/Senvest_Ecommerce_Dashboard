function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

export const getChangedFields = ({
  initialFormData,
  currentFormData,
}: {
  initialFormData: any;
  currentFormData: any;
}) => {
  const changedFields = Object.keys(currentFormData).reduce((acc, key) => {
    const initialValue = initialFormData[key as keyof typeof initialFormData];
    const currentValue = currentFormData[key as keyof typeof currentFormData];

    const isArray = Array.isArray(currentValue) && Array.isArray(initialValue);

    const arraysAreEqual =
      isArray &&
      initialValue.length === currentValue.length &&
      initialValue.every((val: any, index: number) =>
        deepEqual(val, currentValue[index]),
      );

    if (
      (!isArray && !deepEqual(initialValue, currentValue)) ||
      (isArray && !arraysAreEqual)
    ) {
      acc[key as keyof typeof currentFormData] = currentValue;
    }

    return acc;
  }, {} as any);

  return changedFields;
};
