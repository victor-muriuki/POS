import React from 'react';

function ItemCard({ item }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text">Quantity: {item.quantity}</p>
        <p className="card-text">Selling Price: ${item.selling_price.toFixed(2)}</p>
        {item.supplier ? (
          <p className="card-text">
            Supplier: {item.supplier.name} <br />
            Contact: {item.supplier.contact || 'N/A'} <br />
            Email: {item.supplier.email || 'N/A'}
          </p>
        ) : (
          <p className="text-muted">No supplier info</p>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
