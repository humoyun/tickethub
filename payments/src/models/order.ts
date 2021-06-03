import { OrderStatus } from 'bay-common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import mongoose from 'mongoose';

interface OrderProps {
  id: string;
  version: number;
  status: OrderStatus;
  userId: string;
  price: number
}

interface OrderDoc extends mongoose.Document {
  version: number;
  status: OrderStatus;
  userId: string;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(props: OrderProps): OrderDoc;
};

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (props: OrderProps) => {
  return new Order({
    _id: props.id,
    status: props.status,
    version: props.version,
    userId: props.userId,
    price: props.price
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export default Order;