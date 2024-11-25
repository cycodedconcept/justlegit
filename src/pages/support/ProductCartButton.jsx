import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductCartButton = ({ product, cart, onAddToCart, className = '' }) => {
  // Explicitly check if the product is already in cart using ID comparison
  const isInCart = Array.isArray(cart) && 
    cart.some(cartItem => Number(cartItem.id) === Number(product.id));

  const handleClick = (e) => {
    e.preventDefault(); // Prevent any form submission
    if (!isInCart) {
      onAddToCart(product);
    }
  };

  return (
    <button 
      className={`${className}`}
      onClick={handleClick}
      disabled={isInCart}
    >
      <FontAwesomeIcon icon={faShoppingCart} className="mx-2" />
      {isInCart ? 'Already in Cart' : 'Add to Cart'}
    </button>
  );
};

export default ProductCartButton;