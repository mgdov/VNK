import React from 'react'
import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    EditButton,
    TopToolbar,
    CreateButton,
    ExportButton
} from 'react-admin'
import { Card, CardContent, Typography } from '@mui/material'

const ListActions = () => (
    <TopToolbar>
        <CreateButton label="Добавить цены" />
        <ExportButton />
    </TopToolbar>
)

export default function PricesList(props) {
    return (
        <List {...props} perPage={25} sort={{ field: 'updatedAt', order: 'DESC' }} actions={<ListActions />}>
            <Datagrid rowClick="edit">
                <TextField source="id" label="ID" />
                <NumberField source="diesel" label="ДТ" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                <NumberField source="dieselEuro" label="ДТ Евро" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                <NumberField source="gas" label="Газ" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                <NumberField source="ai92" label="АИ‑92" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                <NumberField source="ai95" label="АИ‑95" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                <NumberField source="ai100" label="АИ‑100" options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
                <DateField source="updatedAt" label="Обновлено" showTime />
                <EditButton />
            </Datagrid>
        </List>
    )
}



