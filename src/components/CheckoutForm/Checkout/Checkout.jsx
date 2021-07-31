import React, { useState, useEffect } from "react";
import {
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    CircularProgress,
    Divider,
    Button,
    CssBaseline,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import useStyles from "./styles";

import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
import { ContactSupportOutlined } from "@material-ui/icons";

const steps = ["Shipping address", "Payment details"];

const Checkout = ({ cart }) => {
    const classes = useStyles();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});
    const [checkoutToken, setCheckoutToken] = useState(null);

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {
                    type: "cart",
                });
                setCheckoutToken(token);
            } catch (error) {
                history.pushState("/");
            }
        };
        generateToken();
    }, [cart]);
    //above line. evertyime cart changes, the useEffect is called again
    const Confirmation = () => {
        return <div>Confirmation</div>;
    };

    const Form = () =>
        activeStep === 0 ? (
            <AddressForm checkoutToken={checkoutToken} next={next} />
        ) : (
            <PaymentForm
                backStep={backStep}
                shippingData={shippingData}
                checkoutToken={checkoutToken}
            />
        );

    //read below the previous data of activeStep
    const nextStep = () =>
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () =>
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);
        nextStep();
    };

    //CssBaseLine materialUI format for mobile devices

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper
                        activeStep={activeStep}
                        className={classes.stepper}
                    >
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <Confirmation />
                    ) : (
                        checkoutToken && <Form />
                    )}
                </Paper>
            </main>
        </>
    );
};

export default Checkout;
