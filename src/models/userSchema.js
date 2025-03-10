"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole[UserRole["ADMIN"] = 0] = "ADMIN";
    UserRole[UserRole["ALUMNI"] = 1] = "ALUMNI";
    UserRole[UserRole["ALUMNIADMIN"] = 2] = "ALUMNIADMIN";
})(UserRole || (UserRole = {}));
var NameSuffixes;
(function (NameSuffixes) {
    NameSuffixes["JR"] = "Jr.";
    NameSuffixes["SR"] = "Sr.";
    NameSuffixes["THIRD"] = "III";
    NameSuffixes["FOURTH"] = "IV";
})(NameSuffixes || (NameSuffixes = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "Male";
    Gender["FEMALE"] = "Female";
    Gender["NONBINARY"] = "Non-binary";
})(Gender || (Gender = {}));
function isValidLinkedIn(url) {
    var linkedInRegex = /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/;
    return linkedInRegex.test(url);
}
function isValidContactNumber(number) {
    var contactNumberRegex = /^(\+63|09)[0-9]{9}$/;
    return contactNumberRegex.test(number);
}
var UserSchema = new mongoose_1.Schema({
    role: { type: Number, required: true },
    studentId: { type: Number },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    suffix: { type: String },
    currentAddress: { type: mongoose_1.Schema.Types.ObjectId },
    bio: { type: String },
    linkedIn: { type: String, validate: {
            validator: isValidLinkedIn,
            message: "Invalid LinkedIn contact number."
        }
    },
    contactNumbers: { type: [String], validate: {
            validator: isValidContactNumber,
            message: "Invalid contact number."
        }
    }
}, {
    timestamps: true
});
console.log(isValidContactNumber("09473217995"));
exports.default = UserSchema;
