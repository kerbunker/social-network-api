const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

// set up reaction data - only access inside thought
const ReactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal => dateFormat(createdAtVal))
    }
  },
  {
    toJSON: {
      getters: true
    },
    id: false
  }
)

// set up thoughts data
const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    username: {
      type: String,
      required: true
    },
    // set up an array of reactions
    reactions: [ReactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get the number of reactions in the reactions array
ThoughtSchema.virtual("reactionCount").get(function() {
  return this.reactions.length;
});

// export the thought data
const Thought = model("Thought", ThoughtSchema);
module.exports = Thought;