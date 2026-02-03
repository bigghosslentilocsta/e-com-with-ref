import{Schema,model} from 'mongoose';
//create cart schema
const cartSchema = new Schema({
    product:{
        type:Schema.Types.ObjectId,
        ref:"product",
        required: true
    },
    quantity:{
        type:Number,
        default:1,
        min:1
    }
},
{ _id: false
});
const userSchema=new Schema({
    userName:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    cart:{
        type:[cartSchema],
        default:[]
    }
},
{
    timestamps: true,
    versionKey: false
}
);
export const UserModel=model("user",userSchema);