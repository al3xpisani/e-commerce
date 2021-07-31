import React, { useState, useEffect } from "react";
import {
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";

import { commerce } from "../../lib/commerce";
import FormInput from "./FormInput";

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState("");
    const [shippingSubdivisions, setshippingSubdivisions] = useState([]);
    const [shippingSubdivision, setshippingSubdivision] = useState("");
    const [shippingOptions, setshippingOptions] = useState([]);
    const [shippingOption, setshippingOption] = useState("");

    const methods = useForm();

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } =
            await commerce.services.localeListShippingCountries(
                checkoutTokenId
            );
        setShippingCountry(Object.keys(countries)[0]);
        setShippingCountries(countries);
    };

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(
            countryCode
        );
        setshippingSubdivision(Object.keys(subdivisions)[0]);
        setshippingSubdivisions(subdivisions);
    };

    const fetchShippingOptions = async (checkoutTokenId, country, region) => {
        const options = await commerce.checkout.getShippingOptions(
            checkoutTokenId,
            { country, region }
        );
        setshippingOptions(options);
        setshippingOption(options[0].id);
    };

    const mapCountriesObjToArray = Object.entries(shippingCountries).map(
        ([code, name]) => ({ id: code, label: name })
    );
    const mapSubdivisionsObjToArray = Object.entries(shippingSubdivisions).map(
        ([code, name]) => ({ id: code, label: name })
    );
    const options = shippingOptions.map((shipOption) => ({
        id: shipOption.id,
        label: `${shipOption.description} - (${shipOption.price.formatted_with_symbol})`,
    }));

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, []);

    //The second useEffect has a dependency, it will be executed
    //as soon as shippingCountry is loaded
    useEffect(() => {
        if (shippingCountry) fetchSubdivisions(shippingCountry);
    }, [shippingCountry]);

    useEffect(() => {
        if (shippingOption)
            fetchShippingOptions(
                checkoutToken.id,
                setShippingCountry,
                shippingSubdivision
            );
    }, [shippingSubdivision]);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Shipping Address
            </Typography>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit((data) =>
                        next({
                            ...data,
                            shippingCountry,
                            shippingSubdivision,
                            shippingOption,
                        })
                    )}
                >
                    <Grid container spacing={3}>
                        <FormInput
                            required
                            name="firstName"
                            label="First Name"
                        />
                        <FormInput required name="lastName" label="Last Name" />
                        <FormInput required name="address1" label="Address" />
                        <FormInput required name="email" label="Email" />
                        <FormInput required name="city" label="City" />
                        <FormInput
                            required
                            name="zip"
                            label="Zip / Postal Code"
                        />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shippint Country</InputLabel>
                            <Select
                                value={shippingCountry}
                                fullWidth
                                onChange={(e) =>
                                    setShippingCountry(e.target.value)
                                }
                            >
                                {mapCountriesObjToArray.map((country) => (
                                    <MenuItem
                                        key={country.id}
                                        value={country.id}
                                    >
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select
                                value={shippingSubdivision}
                                fullWidth
                                onChange={(e) =>
                                    setshippingSubdivision(e.target.value)
                                }
                            >
                                {mapSubdivisionsObjToArray.map((subDiv) => (
                                    <MenuItem key={subDiv.id} value={subDiv.id}>
                                        {subDiv.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select
                                value={shippingOption}
                                fullWidth
                                onChange={(e) =>
                                    setshippingOption(e.target.value)
                                }
                            >
                                {options.map((op) => {
                                    <MenuItem key={op.id} value={op.id}>
                                        {op.label}
                                    </MenuItem>;
                                })}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button component={Link} to="/cart" variant="outlined">
                            Back to Cart
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                        >
                            Next
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};

export default AddressForm;
