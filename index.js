const validateID = (id) => {
  const regex =
    /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/;

  if (regex.test(id) === false) {
    return {
      valid: false,
      // message: "Invalid ID number",
    };
  }

  return {
    isCitizen: getCitizenship(id),
    gender: getGender(id),
    dateOfBirth: getDateOfBirth(id),
    valid: true,
  };
};

// find Date of Birth from ID number
export const getDateOfBirth = (id) => {
  //

  const currentDay = new Date().getDay();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;

  const day = parseInt(id.substring(4, 6), 10);
  const month = parseInt(id.substring(2, 4), 10) - 1;
  let year = currentCentury + parseInt(id.substring(0, 2), 10);

  // only 16 years and above are eligible for an ID
  const validYear = currentYear - 16;

  if (
    year > validYear ||
    (year === validYear &&
      (month > currentMonth || (month === currentMonth && day > currentDay)))
  ) {
    year -= 100; // must be last century
  }

  const DOB = new Date(year, month, day);

  // validate that date is in a valid range by making sure that it wasn't 'corrected' during construction
  if (
    !DOB ||
    DOB.getDate() !== day ||
    DOB.getMonth() !== month ||
    DOB.getFullYear() !== year
  ) {
    return undefined;
  }

  return DOB;
};

// find Citizenship from ID number
const getCitizenship = (id) => {
  const code = id.substring(10, 11);
  const validCitizen = Number(code) === 0;
  return validCitizen;
};

// Find gender from ID number
const getGender = (id) => {
  const code = id.substring(6, 10);
  const gender = Number(code) < 5000 ? "female" : "male";
  return gender;
};
