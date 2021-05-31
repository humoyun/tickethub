import { OrderStatus } from 'bay-common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import Order from './order';


// here `id` is added to TicketProps as opposed to Ticket model in tickets service
// because here in orders service ticket is just exact copy of the ticket which was
// created in tickets service, we are not building new ticket here

// mapping: _id (mongodb representation in Tickets mongo db) => id (Ticket model representation in order service)
interface TicketProps {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(props: TicketProps): TicketDoc;
  findByEvent(e: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)


// id => _id (as mongo saves id as _id)
// because it was saved as _id in Tickets mongo db
ticketSchema.statics.build = (props: TicketProps) => {
  return new Ticket({ _id: props.id, title: props.title, price: props.price })
}

// here `e.version` is version in tickets-db, so orders-ticket-replica-db always 1 step behind 
// tickets-db, so when we search we should subtract 1 
ticketSchema.statics.findByEvent = (e: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: e.id,
    version: e.version - 1
  });
}

// run query to look at all orders. find an order where the ticket 
// is the ticket we just found *and* the orders status is not cancelled
// if we find an order from that means the ticket is reserved
ticketSchema.methods.isReserved = async function(): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this as TicketDoc,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  });

  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;