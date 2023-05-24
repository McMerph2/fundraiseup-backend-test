import { getRandomStr } from "../utils/getRandomStr";
import type { Customer } from "./Customer";

export const anonymiseCustomer = <T extends Customer>(customer: T): T => {
  const emailPostfix = customer.email.substring(customer.email.indexOf("@"));

  return {
    ...customer,
    firstName: getRandomStr(8),
    lastName: getRandomStr(8),
    email: `${getRandomStr(8)}${emailPostfix}`,
    address: {
      ...customer.address,
      line1: getRandomStr(8),
      line2: getRandomStr(8),
      postcode: getRandomStr(8),
    },
  };
};
