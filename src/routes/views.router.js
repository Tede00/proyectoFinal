import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js';

const {getProduct} = new ProductManager('./products.json')

const router = Router()

const products = []

// en ruta raíz
router.get('/', (req, res)=>{
    res.render('home', { 
        
        role: 'admin',
        title: 'Home',
        products
    })
})

router.get('/realtimeproducts', async(req,res )=>{
    const products = await getProduct()
    res.render('products', {
        products
    })
})
export default router