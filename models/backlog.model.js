import mongoose from 'mongoose';
import { number } from 'zod';

const BacklogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
   date:{
    type: Date,
       required: true,
       default: Date.now,
   },
   problems: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      itemModel: {
        type: String,
        required: true,
        enum: ['LeetcodeProblem', 'CFProblem', 'SQLProblem']
      },
      is_solved:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'problem.is_solved',
        required: true,
       }
    }
  ]
   });
   

export const backlog = mongoose.model("backlog",BacklogSchema);






