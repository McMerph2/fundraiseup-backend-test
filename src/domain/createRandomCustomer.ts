import { faker } from "@faker-js/faker";

export const createRandomCustomer = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  address: {
    line1: faker.location.streetAddress(),
    line2: faker.location.secondaryAddress(),
    postcode: faker.location.zipCode(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    country: faker.location.countryCode(),
  },
  createdAt: new Date(),
});
