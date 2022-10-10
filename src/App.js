import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { experimentalStyled as styled } from '@mui/material/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Pagination,
    Stack
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
// import static_products from './data/products.json'

const Item = styled(Paper)(() => ({
    textAlign: 'center',
    padding: '1rem 1rem 0.33rem 1rem'
}));

axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-type": "application/json"
    }
});

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function App() {
    const [products, setProducts] = useState();
    const [loaded, setLoaded] = useState(false);
    const [modal, setModal] = useState({ open: false, data: null });
    const [start, setStart] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function fetchData() {
            if (Object.is(loaded, false)) {
                const response = await axios.get('/data/products.json');
                setProducts(response);
            }
        }
        fetchData().then(() => {
            setLoaded(true);
        });
    }, [loaded]);

    const handleOpen = (data) => {
        setModal({ open: true, data: data });
    };

    const handleClose = () => {
        setModal({ open: false, data: null });
    };

    const handlePaginationChange = (_, page) => {
        setStart(page * 12 - 12);
        setPage(page);
    }

    const ProductModal = ( { open = true, data }) => {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    {data?.name} - {formatter.format(data?.price)}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Grid container spacing={3} columns={12}>
                            <Grid xs={4}>
                                <img src={data?.image} alt={data.name} style={{ width: '100%' }}/>
                            </Grid>
                            <Grid xs={8}>{data?.desc}<br /><br />Supplier: {data?.supplierName}</Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Add to Favorites</Button>
                    <Button onClick={handleClose}>
                        Add to Cart
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const ProductPagination = () => {
        const count = Math.ceil(products?.data?.length / 12);
        return (
            <Stack spacing={2} className="pagination">
                <Pagination count={count} page={page} siblingCount={0} onChange={handlePaginationChange} />
            </Stack>
        );
    }

    return (
        <div className="app">
            <header className="header">
                <img src="https://static.ateasesystems.net/images/facilis-logo.png" alt="company logo" />
            </header>
            <section>
                {!loaded && (<p className="loading">Loading...</p>)}
                {loaded && <ProductPagination /> }
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {loaded && (products?.data?.filter((_, index) => (index >= start && index < start + 12))).map((data, index) => (
                        <Grid xs={4} sm={4} md={4} key={index}>
                            <Item onClick={() => handleOpen(data)}>
                                <img src={data?.image} alt={data?.name} />
                                <p>{data?.name}</p>
                                <p>{formatter.format(data?.price)}</p>
                            </Item>
                        </Grid>
                    ))}
                </Grid>
                {loaded && <ProductPagination /> }
                {loaded && modal?.open && modal?.data && <ProductModal closeModal={handleClose} data={modal?.data} />}
            </section>
        </div>
    );
}

export default App;
