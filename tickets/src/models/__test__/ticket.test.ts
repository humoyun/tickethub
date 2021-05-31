import {Ticket} from '../ticket';

it('it implements optimistic concurrency control ', async (done) => {
  // create and save a ticket
  const ticket = Ticket.build({
    title: 'some ticket',
    price: 11,
    userId: 'some-user-id',
  });
  await ticket.save()
  //
  const firstInstance = await Ticket.findById(ticket.id); // same version number
  const secondInstance = await Ticket.findById(ticket.id); // same version number
  // make two separate changes to the ticket we fetched
  firstInstance!.set({ price: 21 });
  secondInstance!.set({ price: 16 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket (expect versioning error)
  try {
    await secondInstance!.save();
  } catch (error) {
    return done(); // return means what we expected
  }
  throw new Error('should not reach this point')
});

it('check version number increments in multiple saves', async () => {
  // create and save a ticket
  const ticket = Ticket.build({
    title: 'some ticket',
    price: 11,
    userId: 'some-user-id',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0)

  await ticket.save();
  expect(ticket.version).toEqual(1)

  await ticket.save();
  expect(ticket.version).toEqual(2)
})