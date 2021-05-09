### Tickets Service API Table

| Route            | Method | Payload                         | Goal                       |
| ---------------- | ------ | ------------------------------- | -------------------------- |
| /api/tickets     | GET    | -                               | Retrieve all tickets       |
| /api/tickets/:id | GET    | -                               | Retrieve a specific ticket |
| /api/tickets     | POST   | `{title: string,price: string}` | create a ticket            |
| /api/tickets     | PUT    | `{title: string,price: string}` | delete a ticket            |
