export function formatCurrencyVND(amount: string | number) {
  // Convert the string to a number
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }

  if (isNaN(amount)) {
    return  new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(0);
  }

  // Format the number as VND currency
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

const now = new Date();

const utc_timestamp = Date.UTC(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  now.getUTCHours(),
  now.getUTCMinutes(),
  now.getUTCSeconds(),
  now.getUTCMilliseconds()
);

export function getPriceForVariant(variant: any): string {
  if (
    !variant?.discountedPrice ||
    !variant?.discountedFrom ||
    !variant?.discountedTo
  ) {
    return variant?.price;
  }

  const discountedFrom = new Date(variant?.discountedFrom).getTime();
  const discountedTo = new Date(variant?.discountedTo).getTime();

  if (utc_timestamp >= discountedFrom && utc_timestamp <= discountedTo) {
    return variant?.discountedPrice;
  } else {
    return variant?.price;
  }
}

export function isDiscounted(variant: any): boolean {
  if (
    !variant?.discountedPrice ||
    !variant?.discountedFrom ||
    !variant?.discountedTo
  ) {
    return false;
  }

  const discountedFrom = new Date(variant?.discountedFrom).getTime();
  const discountedTo = new Date(variant?.discountedTo).getTime();

  return utc_timestamp >= discountedFrom && utc_timestamp <= discountedTo;
}
