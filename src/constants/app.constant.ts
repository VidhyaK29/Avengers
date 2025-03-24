export const TABLE_COLUMNS = {

    SUPPLIER_COLUMN: [{ key: 'name', header: 'Supplier Name' },
        { key: 'email', header: 'Email' },
        { key: 'phone', header: 'Phone' },
        { key: 'address', header: `Address`}],
    
    ORDER_COLUMN: [{ key: 'id', header: 'Order ID' },
        { key: 'date', header: 'Ordered Date' },
        { key: 'status', header: 'Status' },
        { key: 'total', header: 'Total' }],

    CUSTOMER_COLUMN: [
            { key: 'name', header: 'Customer Name' },
            { key: 'email', header: 'Email' },
            { key: 'phone', header: 'Phone' },
            { key: 'address', header: `Address`}],

    PRODUCT_COLUMN: [
                { key: 'name', header: 'Product Name' },
                { key: 'weight', header: 'Weight' },
                { key: 'price', header: 'Price' },
                { key: 'dimensions', header: 'Dimensions' }
              ]
              
}

