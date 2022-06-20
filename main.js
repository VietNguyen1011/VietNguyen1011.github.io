var keyArray = [
    'b6c076719bmshb61e92da0e0c093p105dd0jsnd8c36b2b6198',
    '9125a26629msh5c477ed0a9da054p16cb61jsnf3081c35eef6',       // fb
    '0d415d55edmshb0e69a3fd0da359p1af487jsnef42958ed047',       // gg main
    'b421cfabc2msh6e4cf1f802fb220p1364bbjsn5f1bdc38d685',       // gg vietdao
    '1d6508e9e0msh1e7c6204a6d58d1p1528d2jsn3944ddaa8e8c'        // gg 03    
]

const fetchData = async (keyApi) => {        //fetch func
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': keyApi,
            'X-RapidAPI-Host': 'shoes-collections.p.rapidapi.com'
        }
    };

    const response = await fetch('https://shoes-collections.p.rapidapi.com/shoes', options);
    const status = response.status;
    const shoes = await response.json();

    return {
        status: status,             // fetchData is an async func, it return a Promise that resolve an object
        shoes: shoes
    };
}

const getData = async () => {               // pick an available api key
    let result = [];
    for (let i = 0; i < keyArray.length; i++) {
        let keyApi = keyArray[i];

        const data = await fetchData(keyApi);

        if (data.status === 429) {
            console.error('429');
            continue;
        } else {
            result = data.shoes;
            break;
        }
    }
    // return (products.innerHTML = result.map(item => {
    //     let {id, name, price, image} = item
    //     return `
    //         <div id="product-id-${id}" class="item">
    //             <img width="215" src="${image}">
    //             <div class="details">
    //                 <h3>${name}</h3>
    //                 <div class="price-quantity">
    //                     <h2>${price}$</h2>
    //                     <div class="button">
    //                         <i onclick="decrement(${id})" class="bi bi-dash"></i>
    //                         <div id="${id}" class="quantity">0</div>
    //                         <i onclick="increment(${id})" class="bi bi-plus"></i>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>`
    // }).join(''));
    return result;
};

var products = document.getElementById('products');
let page = 0;
let pageSize = 2;
let currentPage = 1;

const renderShoes = async () => {
    const shoesArray = await getData();
    // render pagination
    page = Math.ceil(shoesArray.length / pageSize);
    let pageNumber = '';
    for (let i = 0; i <= (page + 1); i++) {
        if (i === 0) {
            pageNumber += `<button onclick="previousPage()" class="button-pag button-prev" id="prev"><</button>`;
        }
        else if (i === (page + 1)) {
            pageNumber += `<button onclick="nextPage()" class="button-pag button-next" id="next">></button>`;
        }
        else {
            pageNumber += `<button onclick="choosePage(${i})" class="button-pag button-number" id="${i}">${i}</button>`;
        }
    }
    document.getElementById('pagination').innerHTML = pageNumber;
    // create HTML
    let shoesEachPage = shoesArray.filter((shoes, index) => {            //get the objects that their index satisfies the condition
        let start = (currentPage - 1) * pageSize;
        let end = currentPage * pageSize;

        if (index >= start && index < end) {
            return true;
        }
    });
    return (products.innerHTML = shoesEachPage.map(shoes => {
        let { id, name, price, image } = shoes;
        return `
            <div id="product-id-${id}" class="item">
                <img width="265" src="${image}">
                <div class="details">
                    <h3>${name}</h3>
                    <div class="price-quantity">
                        <h2>${price}$</h2>
                        <div class="button">
                            <i onclick="decrement(${id})" class="bi bi-dash"></i>
                            <div id="${id}" class="quantity">0</div>
                            <i onclick="increment(${id})" class="bi bi-plus"></i>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join(''));
}

const previousPage = () => {
    if (currentPage > 1) {
        currentPage--;                      //render shoes again after decrease currentPagE 
    }
    renderShoes();
}
const nextPage = () => {
    if (currentPage < page) {
        currentPage++;                      //render shoes again after increase currentPage
    }
    renderShoes();
}
const choosePage = (page) => {
    currentPage = page;
    renderShoes();
}

renderShoes();