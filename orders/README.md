### Orders Service API Table

| Route           | Method | Payload                         | Goal                       |
| --------------- | ------ | ------------------------------- | -------------------------- |
| /api/orders     | GET    | -                               | Retrieve all orders        |
| /api/orders/:id | GET    | -                               | Retrieve a specific orders |
| /api/orders     | POST   | `{title: string,price: string}` | create a orders            |
| /api/orders/:id | DELETE | `{title: string,price: string}` | delete a order             |
