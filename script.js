let memes = [];
let allProducts = [];
let currentPage = 1;
let totalPages = 1;

const totalProducts = 20;
const itemsPerPage = 10;

fetch("https://api.imgflip.com/get_memes")
.then(response => {
    if (!response.ok) throw new Error(`HTTP error during meme fetch | Status: ${response.status}`);
    return response.json();
})
.then(json => {
    memes = json.data.memes;
    console.log(memes);

    allProducts = generateProducts();
    totalPages = Math.ceil(allProducts.length / itemsPerPage);
    displayItems();
    updatePaginationButtons();
})
.catch(err => { 
    console.error("There was an error while fetching memes :(")

    allProducts = generateProducts();
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
            rating: `${rating}/10 (${Math.floor(Math.random() * 100) + 1})`
        })
    }

    return products;
}

function displayItems() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

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
    // TODO
    throw new Error("Not implemented yet.")
}