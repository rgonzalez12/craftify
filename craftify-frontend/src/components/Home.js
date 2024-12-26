import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    api.get('items/')
      .then(response => {
        setItems(response.data);
      })
      .catch(() => {
        console.error('Error fetching items');
      });
  }, []);

  if (items === null) {
    return <p>Loading items...</p>;
  }

  return (
    <div className="container">
      <h2>Items for Sale</h2>
      <div className="items-container">
        {items.length > 0 ? (
          <div className="items-grid">
            {items.map(item => (
              <div key={item.id} className="item-card">
                <h3>{item.name}</h3>
                <p>
                  {item.description.split(' ').slice(0,20).join(' ')}
                  {item.description.split(' ').length > 20 ? '...' : ''}
                </p>
                <p>Price: ${item.price}</p>
                <p>Seller: {item.seller.username}</p>
                <Link to={`/items/${item.id}`} className="button">View Item</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No items available for sale at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default Home;