import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/categorySlice';

const FilterCategory = ({ onCategorySelect }) => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.categories);
  const token = localStorage.getItem('key');
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (token) {
      dispatch(fetchCategories(token));
    }
  }, [dispatch, token]);

  const toggleCategory = (id, e) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) onCategorySelect(category.id);
  };

  const renderMenu = (categories) => {
    if (!categories || categories.length === 0) return null;

    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((category) => (
          <li key={category.id} style={{ margin: '5px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => handleCategoryClick(category)}  // Handle category selection on name click
                style={{
                  backgroundColor: 'transparent',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px 10px',
                  textAlign: 'left',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {category.name}
                {category.children && category.children.length > 0 && (
                  <span
                    onClick={(e) => toggleCategory(category.id, e)}  // Pass event to stop propagation
                    style={{ cursor: 'pointer', color: '#FF962E' }}
                  >
                    {expandedCategories[category.id] ? '▼' : '▶'}
                  </span>
                )}
              </button>
            </div>
            {category.children && category.children.length > 0 && expandedCategories[category.id] && (
              <div style={{ marginLeft: '20px' }}>{renderMenu(category.children)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {isLoading && <p>Loading categories...</p>}
      {error && <p>Error: {error.message}</p>}
      {!isLoading && !error && renderMenu(categories)}
    </div>
  );
};

export default FilterCategory;
