import { cartReducer } from './CartContext';

jest.mock('firebase/firestore', () => ({
  doc: () => ({}),
  getDoc: () => Promise.resolve({ exists: () => false }),
  setDoc: () => Promise.resolve(),
}));
jest.mock('../firebase', () => ({ auth: {}, db: {} }));
jest.mock('./AuthContext', () => ({ useAuth: () => ({ user: null }) }));

const headphones = { id: 1, name: 'Headphones', price: 50 };
const speaker = { id: 2, name: 'Speaker', price: 30 };

describe('cartReducer', () => {
  test('adds a new product with quantity 1', () => {
    const result = cartReducer([], { type: 'ADD_ITEM', product: headphones });
    expect(result).toEqual([{ ...headphones, quantity: 1 }]);
  });

  test('adding the same product again raises its quantity', () => {
    const start = [{ ...headphones, quantity: 1 }];
    const result = cartReducer(start, { type: 'ADD_ITEM', product: headphones });
    expect(result[0].quantity).toBe(2);
    expect(result).toHaveLength(1);
  });

  test('adding a product leaves the other items alone', () => {
    const start = [{ ...headphones, quantity: 3 }];
    const result = cartReducer(start, { type: 'ADD_ITEM', product: speaker });
    expect(result).toHaveLength(2);
    expect(result[0].quantity).toBe(3);
  });

  test('removes a product by id', () => {
    const start = [{ ...headphones, quantity: 1 }, { ...speaker, quantity: 1 }];
    const result = cartReducer(start, { type: 'REMOVE_ITEM', id: 1 });
    expect(result).toEqual([{ ...speaker, quantity: 1 }]);
  });

  test('updates a quantity', () => {
    const start = [{ ...headphones, quantity: 1 }];
    const result = cartReducer(start, { type: 'UPDATE_QUANTITY', id: 1, quantity: 5 });
    expect(result[0].quantity).toBe(5);
  });

  test('a quantity of zero removes the product', () => {
    const start = [{ ...headphones, quantity: 1 }];
    const result = cartReducer(start, { type: 'UPDATE_QUANTITY', id: 1, quantity: 0 });
    expect(result).toEqual([]);
  });

  test('clears the cart', () => {
    const start = [{ ...headphones, quantity: 2 }];
    expect(cartReducer(start, { type: 'CLEAR_CART' })).toEqual([]);
  });

  test('SET_CART replaces the whole cart', () => {
    const items = [{ ...speaker, quantity: 4 }];
    expect(cartReducer([], { type: 'SET_CART', items })).toEqual(items);
  });

  test('SET_CART with bad data gives an empty cart', () => {
    expect(cartReducer([{ ...speaker, quantity: 1 }], { type: 'SET_CART', items: null })).toEqual([]);
  });

  test('an unknown action returns the same cart', () => {
    const start = [{ ...headphones, quantity: 1 }];
    expect(cartReducer(start, { type: 'NOTHING' })).toBe(start);
  });

  test('does not change the original cart', () => {
    const start = Object.freeze([Object.freeze({ ...headphones, quantity: 1 })]);
    expect(() => cartReducer(start, { type: 'ADD_ITEM', product: headphones })).not.toThrow();
    expect(start[0].quantity).toBe(1);
  });
});
