import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import CartItem from "./CartItem/CartItem";

import useStyle from "./styles";

const Cart = ({
    cart,
    handleUpdateCartQty,
    handleRemoveCart,
    handleEmptyCart,
}) => {
    const classes = useStyle();

    const EmptyCart = () => {
        <Typography variant="subtitle1">
            You have no items in your shopping cart,
            <Link to="/" className={classes.link}>
                Start adding some
            </Link>
        </Typography>;
    };

    if (!cart.line_items) return "Loading ...";

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem
                            item={item}
                            handleUpdateCartQty={handleUpdateCartQty}
                            handleRemoveCart={handleRemoveCart}
                        />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    Subtotal: {cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button
                        onClick={handleEmptyCart}
                        className={classes.emptyButton}
                        size="large"
                        type="button"
                        variant="contained"
                        color="secondary"
                    >
                        Empty Cart
                    </Button>
                    <Button
                        component={Link}
                        to="/checkout"
                        className={classes.checkoutButton}
                        size="large"
                        type="button"
                        variant="contained"
                        color="primary"
                    >
                        Checkout
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" gutterBottom>
                Your Shopping Cart
            </Typography>
            {!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
        </Container>
    );
};

export default Cart;
