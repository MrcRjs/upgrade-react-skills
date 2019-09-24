import React, {Component, useContext, useState} from 'react'
import './App.css'

const AppContext = React.createContext(undefined, undefined);

const ProductTableProvider = props => {
    const [filterText, setFilterText] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [products] = useState({PRODUCTS});

    return (
        <AppContext.Provider
            value={{
                filterText: filterText,
                inStockOnly: inStockOnly,
                products: products,
                handleFilterTextChange: filterText => {
                    setFilterText(filterText)
                },
                handleInStockChange: inStock => {
                    setInStockOnly(inStock)
                }
            }}

        >
            <div>
                {props.children}
            </div>
        </AppContext.Provider>
    );
};

const ProductCategoryRow = props => (
    <tr>
        <th colSpan="2">
            {props.category}
        </th>
    </tr>
);

const ProductRow = props => {
    const product = props.product;
    const name = product.stocked ?
        product.name :
        <span style={{color: 'red'}}>
                {product.name}
            </span>;

    return (
        <tr>
            <td>{name}</td>
            <td>{product.price}</td>
        </tr>
    );
};

const ProductTable = () => {
    const context = useContext(AppContext);
    const filterText = context.filterText;
    const inStockOnly = context.inStockOnly;

    const rows = [];
    let lastCategory = null;

    context.products.PRODUCTS.forEach((product) => {
        if (product.name.indexOf(filterText) === -1) {
            return;
        }
        if (inStockOnly && !product.stocked) {
            return;
        }
        if (product.category !== lastCategory) {
            rows.push(
                // Props: Level 3
                <ProductCategoryRow
                    category={product.category}
                    key={product.category}/>
            );
        }
        rows.push(
            // Props: Level 3
            <ProductRow
                product={product}
                key={product.name}
            />
        );
        lastCategory = product.category;
    });

    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
};

const SearchBar = () => {
    const context = useContext(AppContext);
    return (
        <form>
            <input
                type="text"
                placeholder="Search..."
                value={context.filterText}
                onChange={(e) => context.handleFilterTextChange(e.target.value)}
            />
            <p>
                <input
                    type="checkbox"
                    checked={context.inStockOnly}
                    onChange={(e) => context.handleInStockChange(e.target.checked)}
                />
                {' '}
                Only show products in stock
            </p>
        </form>
    )
};

const PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];


const App = () => (
    <ProductTableProvider>
        <SearchBar/>
        <ProductTable/>
    </ProductTableProvider>
);


export default App;

