const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_born_formatted").get(function () {
  if (this.date_of_birth) {
    return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
  } else {
    return " ";
  }
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  if (this.date_of_death) {
    return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
  } else {
    return "Present";
  }
});

AuthorSchema.virtual("date_born_input_format").get(function () {
  if (this.date_of_birth) {
    return DateTime.fromJSDate(this.date_of_birth).toFormat("yyyy-MM-dd");
  }
});

AuthorSchema.virtual("date_of_death_input_format").get(function () {
  if (this.date_of_death) {
    return DateTime.fromJSDate(this.date_of_death).toFormat("yyyy-mm-dd");
  } else {
    return "";
  }
});

module.exports = mongoose.model("Author", AuthorSchema);
