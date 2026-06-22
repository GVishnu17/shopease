import { cartReducer } from './CartContext';

const sampleProduct = { id: 1, name: 'Wireless Headphones', price: 59.99 };
const secondProduct = { id: 2, name: 'Smart Watch', price: 89.99 };

describe('cartReducer', () => {
  test('adds a new item to an empty cart', () => {
    const newState = cartReducer([], { type: 'ADD_ITEM', product: sampleProduct });
    expect(newState).toHaveLength(1);
    expect(newState[0]).toMatchObject({ id: 1, quantity: 1 });
  });

  test('increments quantity when adding an existing item', () => {
    const initialState = [{ ...sampleProduct, quantity: 1 }];
    const newState = cartReducer(initialState, { type: 'ADD_ITEM', product: sampleProduct });
    expect(newState).toHaveLength(1);
    expect(newState[0].quantity).toBe(2);
  });

  test('adds a second, different item as a separate entry', () => {
    const initialState = [{ ...sampleProduct, quantity: 1 }];
    const newState = cartReducer(initialState, { type: 'ADD_ITEM', product: secondProduct });
    expect(newState).toHaveLength(2);
  });

  test('removes an item from the cart', () => {
    const initialState = [
      { ...sampleProduct, quantity: 1 },
      { ...secondProduct, quantity: 2 },
    ];
    const newState = cartReducer(initialState, { type: 'REMOVE_ITEM', id: 1 });
    expect(newState).toHaveLength(1);
    expect(newState[0].id).toBe(2);
  });

  test('updates the quantity of an existing item', () => {
    const initialState = [{ ...sampleProduct, quantity: 1 }];
    const newState = cartReducer(initialState, { type: 'UPDATE_QUANTITY', id: 1, quantity: 5 });
    expect(newState[0].quantity).toBe(5);
  });

  test('removes the item if quantity is updated to 0 or below', () => {
    const initialState = [{ ...sampleProduct, quantity: 1 }];
    const newState = cartReducer(initialState, { type: 'UPDATE_QUANTITY', id: 1, quantity: 0 });
    expect(newState).toHaveLength(0);
  });

  test('clears the entire cart', () => {
    const initialState = [
      { ...sampleProduct, quantity: 1 },
      { ...secondProduct, quantity: 2 },
    ];
    const newState = cartReducer(initialState, { type: 'CLEAR_CART' });
    expect(newState).toHaveLength(0);
  });

  test('returns unchanged state for an unknown action type', () => {
    const initialState = [{ ...sampleProduct, quantity: 1 }];
    const newState = cartReducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(newState).toEqual(initialState);
  });
});
