const mongoose = require('mongoose');

const sellSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author:{
    type:String,
    require:true
  },
   category:{
    type:String,
    require:true
   },


  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]{1}[0-9]{9}$/, // Valid Indian mobile number starting with 6-9
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/, // Valid 6-digit Indian pincode not starting with 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: {
    type: [String], // Array of image URLs
    required: true,
    validate: {
      validator: function(value) {
        return value.length <= 3; // Ensures no more than 3 images are stored
      },
      message: 'You can only upload up to 3 images.',
    }
  },
  isSold: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
    views: {
    type: Number,
    default: 0
  },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  dateAdded: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });


const Sell = mongoose.model('Sell', sellSchema);

module.exports = Sell;





