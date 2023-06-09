import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/products-services';
import ProductList from './ProductList';
import CategoryList from './CategoryList';
import Price from './Price';
import NotFound from './NotFound';
import SearchInput from './SearchInput';
import { Container, IconBack, IconSearch, InputContainer, Result } from './ui';

// filter by name
function filterByName(products, name) {
  if (name === '') return products;
  const byName = products.filter((product) =>
    product.name.includes(name.toLowerCase()) ? product : null
  );

  return byName;
}

// filter by category
function filterByCategory(products, category) {
  if (category === '') return products;

  const byCategory = products.filter((product) =>
    product.category === category ? product : null
  );

  return byCategory;
}

// filter by price
function filterByPrice(products, price) {
  const { min, max } = price;
  if (max === 0) return products;
  const byPrice = products.filter((prod) =>
    prod.price >= min && prod.price <= max ? prod : null
  );

  return byPrice;
}

// filtered products
function filterProducts(products, filter) {
  const { name, category, price } = filter;

  const filteredByName = filterByName(products, name);
  const filteredByCategory = filterByCategory(filteredByName, category);
  const filteredByPrice = filterByPrice(filteredByCategory, price);
  return filteredByPrice;
}

// unique categories
function uniqueCategories(products) {
  const arrayCategories = products.map((prod) => prod.category);

  if (arrayCategories.length === 0) [];

  const categories = new Set();
  for (const cagetory of arrayCategories) {
    categories.add(cagetory);
  }

  return [...categories];
}

const SearchPage = ({ onGetID }) => {
  const initialFilter = {
    name: '',
    category: '',
    price: { min: 0, max: Infinity },
  };

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState(initialFilter);

  // unique categories
  const uniqCategories = uniqueCategories(products);

  // products filtered
  const filteredProducts = filterProducts(products, filter);

  function handleChange(event) {
    setFilter({
      ...filter,
      name: event.target.value,
    });
  }

  function handleBack() {
    setFilter(initialFilter);
  }

  const handleCagetory = (event) => {
    setFilter({
      ...filter,
      category: event.target.id,
    });
  };

  const handlePrice = (event) => {
    const name = event.target.id;
    const value = event.target.value;
    setFilter({
      ...filter,
      price: { ...filter.price, [name]: +value * 100 },
    });
  };

  useEffect(() => {
    getProducts()
      .then((products) => {
        setProducts(products);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <>
        <InputContainer>
          {/* Not found */}
          {filteredProducts.length !== products.length ? (
            <IconBack onClick={handleBack} />
          ) : (
            <IconSearch />
          )}
          <SearchInput onHandleChange={handleChange} />
        </InputContainer>
      </>
      {!filteredProducts.length && <NotFound />}
      {filteredProducts.length && (
        <>
          {filter.name === '' && (
            <>
              <CategoryList
                uniqData={uniqCategories}
                onGetCategory={handleCagetory}
                nameCategory={filter.category}
              />
              <Price onGetPriceRange={handlePrice} />
            </>
          )}
          <Container>
            {filter.name && (
              <Result>Found {filteredProducts.length} results</Result>
            )}
            <ProductList products={filteredProducts} onGetID={onGetID} />
          </Container>
        </>
      )}
    </>
  );
};

export default SearchPage;
