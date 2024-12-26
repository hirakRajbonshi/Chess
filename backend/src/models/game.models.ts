import mongoose, { Schema } from "mongoose";

const gameSchema = new Schema(
  {
    player1: {
      type: String,
      required: true,
    },
    player2: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    moves: {
      type: String,
    },
  },
  {
    timestamps: true, // will auto added create date and update date
  }
);

export const Game = mongoose.model("User", gameSchema);
