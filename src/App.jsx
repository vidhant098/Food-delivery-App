import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Navbar from './Navbar.jsx';
import Api from './Api.jsx';
import Register from './Register.jsx';
import ResetPass from './ResetPass.jsx';
import Login from './Login.jsx';
import Cart from './Cart.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const addToCart = (meal) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === meal.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...currentItems,
        {
          id: meal.id,
          name: meal.name,
          image: meal.image,
          price: meal.ingredients.length * 50,
          prepTimeMinutes: meal.prepTimeMinutes,
          quantity: 1,
        },
      ];
    });
  };

  const updateCartQuantity = (mealId, nextQuantity) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === mealId ? { ...item, quantity: Math.max(0, nextQuantity) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
          <Navbar cartCount={cartCount} />
          <Routes>
            <Route path="/" element={<Api cartItems={cartItems} cartCount={cartCount} onAddToCart={addToCart} />} />
            <Route path="/api" element={<Api cartItems={cartItems} cartCount={cartCount} onAddToCart={addToCart} />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  cartCount={cartCount}
                  onUpdateQuantity={updateCartQuantity}
                />
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPass />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


