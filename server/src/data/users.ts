import bcrypt from "bcryptjs";

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456789", 10),
    phoneNumber: "123456789",
    address: "Mirpur-1",
    city: "Dhaka",
    state: "Dhaka",
    country: "Bangladesh",
    zip: "1216",
    location: "House-9",
    isAdmin: true,
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456789", 10),
    phoneNumber: "123456789",
    address: "Mirpur-1",
    city: "Dhaka",
    state: "Dhaka",
    country: "Bangladesh",
    zip: "1216",
    location: "House-9",
    isAdmin: true,
  },
  {
    firstName: "Muktadir",
    lastName: "Ahamed",
    email: "muktadir@example.com",
    password: bcrypt.hashSync("123456789", 10),
    phoneNumber: "123456789",
    address: "Mirpur-1",
    city: "Dhaka",
    state: "Dhaka",
    country: "Bangladesh",
    zip: "1216",
    location: "House-9",
    isAdmin: true,
  },
];

export default users;
