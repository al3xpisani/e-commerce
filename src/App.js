import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { commerce } from "./lib/commerce";

// import Products from './components/products/products'
// import NavBar from './components/Navbar/Navbar'

//more practical way to import components instead of
// do it in several lines
import { Navbar, Cart, Products, Checkout } from "./components";

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});

    const fetchProducts = async () => {
        await commerce.products.list().then(({ data }) => {
            console.log(data);
            setProducts(data);
        });
    };

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    };

    const handleAddToCart = async (productID, quantity) => {
        const { cart } = await commerce.cart.add(productID, quantity);
        setCart(cart);
    };

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity });
        setCart(cart);
    };

    const handleRemoveCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);
        setCart(cart);
    };

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        setCart(cart);
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);
    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
            </div>
            <Switch>
                <Route exact path="/">
                    <Products
                        products={products}
                        handleAddToCart={handleAddToCart}
                    />
                </Route>
                <Route exact path="/cart">
                    <Cart
                        cart={cart}
                        handleUpdateCartQty={handleUpdateCartQty}
                        handleRemoveCart={handleRemoveCart}
                        handleEmptyCart={handleEmptyCart}
                    />
                </Route>
                <Route exact path="/checkout">
                    <Checkout cart={cart} />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
