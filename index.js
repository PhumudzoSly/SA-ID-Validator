export const validateIdNumber = (idNumber) => {
  // regex pattern using the Luhn algorithm
  const ex =
    /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/;

  // if the ID number is not valid
  if (ex.test(idNumber) === false) {
    return {
      valid: false,
    };
  }

  return {
    valid: true,
    gender: getGender(idNumber),
    DOB: getDateOfBirth(idNumber),
    isCitizen: getCitizenship(idNumber),
  };
};

// Find gender from ID number
export const getGender = (idNumber) => {
  const genderCode = idNumber.substring(6, 10);
  const gender = Number(genderCode) < 5000 ? "female" : "male";
  return gender;
};

// find Citizenship from ID number
export const getCitizenship = (idNumber) => {
  const citizenshipCode = idNumber.substring(10, 11);
  const isCitizen = Number(citizenshipCode) === 0;
  return isCitizen;
};

// find Date of Birth from ID number
export const getDateOfBirth = (idNumber) => {
  // get year, and assume the century
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDay();

  let yearPart = currentCentury + parseInt(idNumber.substring(0, 2), 10);

  const monthPart = parseInt(idNumber.substring(2, 4), 10) - 1;

  const dayPart = parseInt(idNumber.substring(4, 6), 10);

  // only 16 years and above are eligible for an ID
  const eligibleYear = currentYear - 16;
  // make sure the ID's DOB is not below 16 years from today, if so it's last century issue
  if (
    yearPart > eligibleYear ||
    (yearPart === eligibleYear &&
      (monthPart > currentMonth ||
        (monthPart === currentMonth && dayPart > currentDay)))
  ) {
    yearPart -= 100; // must be last century
  }

  const dateOfBirth = new Date(yearPart, monthPart, dayPart);

  // validate that date is in a valid range by making sure that it wasn't 'corrected' during construction
  if (
    !dateOfBirth ||
    dateOfBirth.getFullYear() !== yearPart ||
    dateOfBirth.getMonth() !== monthPart ||
    dateOfBirth.getDate() !== dayPart
  ) {
    return undefined;
  }

  return dateOfBirth;
};
