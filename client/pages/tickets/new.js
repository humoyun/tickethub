import React from 'react';

const NewTicket = () => {
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState();

  return (<div>
    <h3>Create new ticket</h3>
    <form>
      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)}></input>
      </div>
      <div className="form-group">
        <label>Title</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)}></input>
      </div>
    </form>
  </div>);
}

export default NewTicket;