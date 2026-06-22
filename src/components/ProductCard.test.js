import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { CartProvider, useCart } from '../context/CartContext';

const mockProduct = {
  id: 1,
  name: 'Wireless Headphones',
  category: 'Electronics',
  price: 59.99,
  image: 'https://placehold.co/300x300',
  description: 'Test product',
};

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <CartProvider>{ui}</CartProvider>
    </BrowserRouter>
  );
}

// Small helper component to inspect cart state during tests
function CartItemCount() {
  const { itemCount } = useCart();
  return <span data-testid="item-count">{itemCount}</span>;
}

beforeEach(() => {
  localStorage.clear();
});

test('renders product name, category, and price', () => {
  renderWithProviders(<ProductCard product={mockProduct} />);
  expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  expect(screen.getByText('Electronics')).toBeInTheDocument();
  expect(screen.getByText('$59.99')).toBeInTheDocument();
});

test('clicking "Add to Cart" increases the cart item count', () => {
  renderWithProviders(
    <>
      <ProductCard product={mockProduct} />
      <CartItemCount />
    </>
  );

  expect(screen.getByTestId('item-count').textContent).toBe('0');

  fireEvent.click(screen.getByText('Add to Cart'));

  expect(screen.getByTestId('item-count').textContent).toBe('1');
});

test('clicking "Add to Cart" twice increments quantity, not a duplicate entry', () => {
  renderWithProviders(
    <>
      <ProductCard product={mockProduct} />
      <CartItemCount />
    </>
  );

  fireEvent.click(screen.getByText('Add to Cart'));
  fireEvent.click(screen.getByText('Add to Cart'));

  expect(screen.getByTestId('item-count').textContent).toBe('2');
});
