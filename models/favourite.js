const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavouriteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dish: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

var Favourite = mongoose.model("Favourite", FavouriteSchema);

module.exports = Favourite;
