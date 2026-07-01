const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema=new Schema({
    title:{
        type:String,
        required:true
    },description:{
        type:String,
        required:true
    },difficalty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true
    },tags:{
        type:String,
        enum:['array','linedlist','graph','dp'],
        required:true
    },visibleTestCases:[
        {
         input:{
            type:String,
            required:true
         },
          output:{
            type:String,
            required:true
         }, 
         explanation:{
            type:String,
            required:true
         }   
        }
    ],
    hiddenTestCases:[
        {
         input:{
            type:String,
            required:true
         },
          output:{
            type:String,
            required:true
         }
        }
    ],
    startCoad:[
        {
            language:{
                type:String,
                required:true
            },
            boilerplateCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})

const Problem = mongoose.model('problem',problemSchema);
module.exports=Problem;