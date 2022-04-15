import { useState } from 'react';

import Header from './components/Layout/Header';
import Meals from './components/Meals/Meals';
import Cart from './components/Cart/Cart';
import CartProvider from './store/CartProvider';
import CheckOut from './components/Cart/CheckOut';

function App() {
  const [cartIsShown, setCartIsShown] = useState(false);
  const [addressIsShown, setAddressIsShown] = useState(false);


  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  const hideAddressHandler = () => {
    setAddressIsShown(false);
  };

  const hideAndShow = () =>{
    setAddressIsShown(true);
    setCartIsShown(false);
  }

  return (
    <CartProvider>
      {cartIsShown && <Cart onClose={hideCartHandler} onOrder={hideAndShow} />}
      {addressIsShown && <CheckOut onClose={hideAddressHandler} />}
      <Header onShowCart={showCartHandler} />
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
}

export default App;