let memes = [];
let allProducts = [];
let currentPage = 1;
let totalPages = 1;

const totalProducts = 20;
const itemsPerPage = 10;

let filteredProducts = [];

fetch("https://api.imgflip.com/get_memes")
.then(response => {
    if (!response.ok) throw new Error(`HTTP error during meme fetch | Status: ${response.status}`);
    return response.json();
})
.then(json => {
    memes = json.data.memes;
    console.log(memes);

    allProducts = generateProducts();
    filteredProducts = allProducts;
    totalPages = Math.ceil(allProducts.length / itemsPerPage);
    displayItems();
    updatePaginationButtons();

    const topProduct = determineTopProduct(allProducts);

    document.querySelector(".top-card").innerHTML = `
    <div class="top-badge">TOP CHOICE</div>
    <img src="${topProduct.image}" class="top-image" alt="Top Product Image">
    <div class="top-card-content">
        <p class="top-title">${topProduct.title}</p>
        <p class="top-rating">${topProduct.rating}</p>
        <p class="top-description">${topProduct.desc}</p>
        <p class="top-price">${topProduct.price}</p>
    </div>
    `
})
.catch(err => { 
    console.error("There was an error while fetching memes :(")

    allProducts = generateProducts();
    filteredProducts = allProducts;
    totalPages = Math.ceil(allProducts.length / itemsPerPage);
    displayItems();
    updatePaginationButtons();
})


// Helpers

function generateProducts() {
    const brands        = ["Technica", "Nanoware", "Hermann", "Starforge", "Circuitta"];
    const types         = ["Laptop", "Headphones", "Monitor", "Keyboard", "Smartwatch"];
    const adjectives    = ["fast", "sleek", "durable", "powerful", "lightweight", "affordable"];
    const features      = ["battery life", "performance", "display", "connectivity", "design"];

    let products = []
    for (let i = 0; i < totalProducts; i++) {
        const brand         = getRandomItem(brands);
        const type          = getRandomItem(types);
        const adjective     = getRandomItem(adjectives);
        const feature       = getRandomItem(features);

        const modelNumber   = Math.floor(Math.random() * 9000 + 1000);
        const price         = Math.floor(Math.random() * 1900 + 100);   // 100 to 2000 eur
        const rating        = Math.floor(Math.random() * 10) + 1;       // 1 to 10 rating

        const placeholder_size = 300 + Math.floor(Math.random() * 100)

        products.push({
            // image: fallback link if imgflip is unreachable
            image:  `${memes.length ? memes[i].url : `https://placehold.co/${placeholder_size}x${placeholder_size}?font=roboto` }`,
            title:  `${brand} ${type} ${modelNumber}`,
            desc:   `This is a ${adjective} ${type.toLowerCase()} with excellent ${feature}.`,
            price:  `${price}`,
            rating: `${rating}/10 (${Math.floor(Math.random() * 100) + 1} reviews)`
        })
    }

    return products;
}

function displayItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    let content = "";
    for (product of paginatedProducts) { 
        console.log(product);
        
        content += `
        <div class="card">
            <img src="${product.image}" class="product_image">
            <p class="title">${product.title}</p>
            <p class="rating">${product.rating}</p>
            <p class="description">${product.desc}</p>
            <p class="price">${product.price}</p>
        </div>
        `
    };

    document.querySelector(".product-list").innerHTML = content;
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
}


// Pagination logic

function updatePaginationButtons() {
    document.getElementById("prev-button").disabled = currentPage === 1;
    document.getElementById("next-button").disabled = currentPage === totalPages;

    document.getElementById("page-counter").textContent = `Page ${currentPage} of ${totalPages}`;
    console.log(`current: ${currentPage} | total: ${totalPages}`)

    // Blink animation to make the transition smoother and less disturbing to look at

    const productContainer = document.querySelector(".product-list");
    productContainer.classList.add("blink");
    
    productContainer.addEventListener("animationend", () => {
        productContainer.classList.remove("blink");
    })
}

function handlePrev() {
    if (currentPage > 1) {
        currentPage--;
        displayItems();
        updatePaginationButtons();
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
}

function handleNext() {
    if (currentPage < totalPages) {
        currentPage++;
        displayItems();
        updatePaginationButtons();
        window.scrollTo({ top: 0, behavior: "smooth" })
    }
}


// Search logic

function searchProductsByName(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    filteredProducts = allProducts.filter(p => 
        p.title.toLowerCase().includes(lowerPrompt)
        ||
        p.desc.toLowerCase().includes(lowerPrompt)
    );

    currentPage = 1;
    totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    displayItems();
    updatePaginationButtons();
}

function search() {
    const prompt = document.getElementById("search-input").value;
    searchProductsByName(prompt);    
}

// Top product logic

const determineTopProduct = (productList) => {
    // TODO write your code here
    return productList.reduce((top, current) => {
        return current.rating > top.rating
        ? current
        : top;
    }, productList[0])
}