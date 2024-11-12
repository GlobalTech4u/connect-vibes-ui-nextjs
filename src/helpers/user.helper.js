const getUser = () => {
  const user = process.browser
    ? localStorage?.getItem("user")
    : JSON.stringify({});
  return JSON.parse(user);
};

const getFullName = (firstName, lastName) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }

  return "";
};

export { getUser, getFullName };
