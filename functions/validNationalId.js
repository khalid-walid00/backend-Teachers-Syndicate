
const validator = require('validator');
/**
 * @param nationalId 
 * @returns
 */
 function isValidEgyptianNationalId(nationalId) {
    if (!validator.isNumeric(nationalId) || nationalId.length !== 14) {
        return false;
    }

    const centuryDigit = nationalId[0];
    if (centuryDigit !== "2" && centuryDigit !== "3") {
        return false;
    }

    const year = (centuryDigit === "2" ? "19" : "20") + nationalId.slice(1, 3);
    const month = nationalId.slice(3, 5);
    const day = nationalId.slice(5, 7);

    const dateString = `${year}-${month}-${day}`;
    if (!validator.isDate(dateString, { format: "YYYY-MM-DD", strictMode: true })) {
        return false;
    }

    return true;
}

module.exports = isValidEgyptianNationalId