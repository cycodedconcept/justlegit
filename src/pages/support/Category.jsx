import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/categorySlice';

const Category = ({ onCategoryChange, selectedCategory }) => {
  const dispatch = useDispatch();
  const { categories, isLoading, error } = useSelector((state) => state.categories);
  const token = localStorage.getItem('key');
  const [localSelectedCategory, setLocalSelectedCategory] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchCategories(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (selectedCategory) {
      setLocalSelectedCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const renderCategoryOptions = (categoryList, level = 0) => {
    return categoryList.map((category) => (
      <React.Fragment key={category.id}>
        {!category.children || category.children.length === 0 ? (
          <option value={category.id}>
            {`${'--'.repeat(level)} ${category.name}`}
          </option>
        ) : (
          <>
            <option disabled>{`${'--'.repeat(level)} ${category.name}`}</option>
            {renderCategoryOptions(category.children, level + 1)}
          </>
        )}
      </React.Fragment>
    ));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setLocalSelectedCategory(value);
    onCategoryChange(value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <select
        value={localSelectedCategory}
        onChange={handleCategoryChange}
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select a Category --</option>
        {categories && renderCategoryOptions(categories)}
      </select>
      {localSelectedCategory && (
        <p className="mt-2 text-sm text-gray-600">
          Selected Category ID: {localSelectedCategory}
        </p>
      )}
    </>
  );
};

export default Category;








