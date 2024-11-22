import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const IconItem = ({ itemCount = 0, onClick }) => {
  return (
    <div className="relative inline-block cursor-pointer" onClick={onClick}>
      <FontAwesomeIcon
        icon={faShoppingCart}
        className="w-100"
        style={{fontSize: '25px', cursor: 'pointer'}}
      />
      {itemCount > 0 && (
        <div 
          className="absolute -top-3 -right-3 bg-red-500 text-white text-xs 
            rounded-full h-6 min-w-6 flex items-center justify-center px-1.5
            border-2 border-white shadow-sm"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </div>
      )}
    </div>
  );
};

export default IconItem;