import React from 'react'
import {
    Create,
    SimpleForm,
    NumberInput,
    required
} from 'react-admin'
import { Typography, Box, Divider } from '@mui/material'

const currencyProps = {
    step: 0.01,
    min: 0,
}

export default function PricesCreate(props) {
    return (
        <Create {...props} title="Добавить цены на топливо">
            <SimpleForm>
                <Box mb={2}>
                    <Typography variant="h6">Цены на топливо</Typography>
                    <Divider />
                </Box>
                <NumberInput source="diesel" label="Дизельное топливо" validate={[required()]} {...currencyProps} />
                <NumberInput source="dieselEuro" label="Дизельное топливо евро" validate={[required()]} {...currencyProps} />
                <NumberInput source="gas" label="Газ" validate={[required()]} {...currencyProps} />
                <NumberInput source="ai92" label="Бензин АИ‑92" validate={[required()]} {...currencyProps} />
                <NumberInput source="ai95" label="Бензин АИ‑95" validate={[required()]} {...currencyProps} />
                <NumberInput source="ai100" label="Бензин АИ‑100" validate={[required()]} {...currencyProps} />
            </SimpleForm>
        </Create>
    )
}



