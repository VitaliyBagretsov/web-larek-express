import { model, Schema } from 'mongoose';

export interface IProduct {
  title: string;
  image: { fileName: string; originalName: string };
  category: string;
  description: string;
  price: number;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
  },
  image: {
    type: { fileName: String, originalName: String },
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
    default: null,
  },
});

const product = model<IProduct>('product', productSchema);

export default product;
