// Initializers
const socket = io()

// API calls
const deleteProduct = async (id) => {
    await fetch(`/api/products/${id}`, {
        method: 'DELETE'
    });
}

const updateProduct = async (id) => {
    const [form, data] = parseDatafromForm();
    await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    form.reset();
}

const createProduct = async (e) => {
    e.preventDefault();
    const [form, data] = parseDatafromForm();

    await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    form.reset();
}

const getProducts = async () => {
    const response = await fetch('/api/products');
    return response.json();
}

// Websockets

socket.on('producto-agregado', async (message) => {
    await renderProductList();
})

socket.on('producto-eliminado', async (message) => {
    await renderProductList();
})

socket.on('producto-actualizado', async (message) => {
    await renderProductList();
})

// Utils
const parseDatafromForm = () => {
    const noteForm = document.getElementById('Form');
    let formData = new FormData(Form);
    let jsonData = {};
                            
    formData.forEach((value, key) => {
        jsonData[key] = value
    });

    return [noteForm, jsonData];
}

const renderProductList = async () => {
    const products = await getProducts();
    const productListElement = document.getElementById('productos');
    productListElement.innerHTML =''
    products.forEach((product) => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <div class="text-white bg-secondary m-1 card card-body rounded-0 animate__animated animate__fadeInUp mb-2 rounded-2">
                <div class="d-flex justify-content-between flex-column">
                    <h1 class="card-title h3">${product.title}</h1>
                </div>
                <p>${product.description}</p>
                <p>$${product.price}</p>
                <div>
                    <button class="btn btn-danger delete" onclick="deleteProduct(${product.id})" data-id=${product.id}>Borrar</button>
                    <button class="btn btn-light update" onclick="updateProduct(${product.id})" data-id=${product.id}>Actualizar</button>
                </div>
            </div>`;
        productListElement.appendChild(productItem);
    });
}

renderProductList();