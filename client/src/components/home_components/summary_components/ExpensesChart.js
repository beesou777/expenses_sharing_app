import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { currencyFormatter } from '../../../helper/homeHelper';

export default function ExpensesChart({data}) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Month" /> 
                <YAxis tickFormatter={(value)=> "$"+value} />
                <Tooltip formatter={(value, name, props) => currencyFormatter.format(value)}/>
                <Legend />
                <Bar dataKey="Grocery" stackId="a" fill="#7bdff2" />
                <Bar dataKey="Food" stackId="a" fill="#f1c0e8" />
                <Bar dataKey="Housing" stackId="a" fill="#E78EA9" />
                <Bar dataKey="Utilities" stackId="a" fill="#fbc4ab" />
                <Bar dataKey="Entertainment" stackId="a" fill="#CDB699" />
                <Bar dataKey="Transportation" stackId="a" fill="#ccd5ae" />
                <Bar dataKey="Insurance" stackId="a" fill="#a1c5e7" />
                <Bar dataKey="Others" stackId="a" fill="#bcb6f6" />
            </BarChart>
        </ResponsiveContainer>
    )
}
