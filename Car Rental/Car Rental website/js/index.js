/* global $ */

// === 全域變數與常數設定 ===
const API_BASE_URL = 'http://${window.location.hostname}:8080/api/cars';
let allCarsData = []; // 暫存 API 取得的車輛資料，做前端篩選/搜尋用
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

let suggestionsList = []

$(document).ready(function () {
    initApp();
});

// === 1. 主初始化流程 ===
function initApp() {
    bindEventListeners();

    // 如果在 index 頁面，自動載入 Spring Boot API 資料
    if (window.location.pathname.endsWith('index.php') || window.location.pathname === '/') {
        fetchCarsFromAPI();
        fetchCategoriesFromAPI();
        fetchBrandsFromAPI();
    }
}

// === 2. API 資料溝通層 ===
function fetchCarsFromAPI() {
    fetch(API_BASE_URL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
            return response.json();
        })
        .then(cars => {
            allCarsData = cars; // 存入記憶體
            renderProducts(allCarsData);
        })
        .catch(error => {
            console.error('抓取 Spring Boot 車輛資料失敗：', error);
            $('#productGrid').html('<p class="error-msg">無法載入車輛資料，請檢查後端 API 服務。</p>');
        });
}

function fetchCategoriesFromAPI() {
    fetch(API_BASE_URL + '/types')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
            return response.json();
        })
        .then(categories => {
            suggestionsList = suggestionsList.concat(categories);
            renderFilterLists(categories, $('#categoryList'));
        })
        .catch(error => {
            console.error('抓取 Spring Boot 車輛種類失敗：', error);
            $('#productGrid').html('<p class="error-msg">無法載入車輛種類，請檢查後端 API 服務。</p>');
        });
}

function fetchBrandsFromAPI() {
    fetch(API_BASE_URL + '/brands')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
            return response.json();
        })
        .then(brands => {
            suggestionsList = suggestionsList.concat(brands);
            renderFilterLists(brands, $('#brandList'));
        })
        .catch(error => {
            console.error('抓取 Spring Boot 車輛廠牌失敗：', error);
            $('#productGrid').html('<p class="error-msg">無法載入車輛廠牌，請檢查後端 API 服務。</p>');
        });
}

// === 3. 畫面繪製 (UI Render) ===
function renderFilterLists(list, $element) {
    renderList(list, $element);
}

function renderList(list, $element) {
    $element.empty();
    $.each(list, function (index, item) {
        $element.append(`<div class="list-item" data-type="${$element.attr('id')}" data-value="${item}">${item}</div>`);
    });
}

function renderProducts(products) {
    const $productGrid = $('#productGrid');
    $productGrid.empty();

    if (!products || products.length === 0) {
        $productGrid.html('<p class="no-data">查無符合條件的車輛</p>');
        return;
    }

    products.forEach(product => {
        const brand = product.brand || product.Brand || '';
        const carName = product.car || product.carName || product.model || '';
        const model = product.modelYear || product.ModelYear || '';
        const type = product.type || product.Type || '';
        const price = product.price || product.Price || 0;
        const image = product.image || product.Image || 'default';
        const quantity = product.quantity !== undefined ? product.quantity : (product.Quantity || 0);

        const isAvailable = quantity > 0;
        const productJsonStr = JSON.stringify(product).replace(/'/g, "&apos;");

        const productCard = `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="images/${image}.jpeg" class="product-image" alt="${brand} ${carName}" data-product='${productJsonStr}'>
                </div>
                <h2 class="product-title">${brand} ${carName}</h2>
                <div class="product-details">
                    <p class="product-title">Model: ${model}</p>
                    <p class="product-title">Type: ${type}</p>
                    <p class="product-title">Price/Day: $${price}</p>
                </div>
                <div class="availability-button-container">
                    ${isAvailable
            ? `<p class="product-available">Available Now</p><button class="rent">Rent</button>`
            : `<p class="product-unavailable">Unavailable</p>`}
                </div>
            </div>`;
        $productGrid.append(productCard);
    });
}

function showPopup(product) {
    $('#popupContainer').show();
    $('#popupDetails').load('details.php', function () {
        const $productGrid = $('#detailGrid');
        $productGrid.empty();

        const brand = product.brand || product.Brand || '';
        const carName = product.car || product.carName || '';
        const image = product.image || product.Image || '';
        const type = product.type || product.Type || '';
        const model = product.modelYear || product.ModelYear || '';
        const price = product.price || product.Price || 0;
        const fuelType = product.fuel_Type || product.Fuel_Type || 'N/A';
        const seats = product.seats || product.Seats || 'N/A';
        const description = product.description || product.Description || '';

        const detailCard = `
            <div class="detail-card">
                <h2 class="product-title">${brand} ${carName}</h2>
                <img src="images/${image}.jpeg" class="detail-image" alt="${brand} ${carName}">
                <div class="product-details">
                    <p class="product-title">Type: ${type}</p>
                    <p class="product-title">Year: ${model}</p>
                    <p class="product-title">Price/Day: $${price}</p>
                    <p class="product-title">Fuel Type: ${fuelType}</p>
                    <p class="product-title">Seats: ${seats}</p>
                    <p class="product-title">Description: ${description}</p>
                </div>
            </div>`;
        $productGrid.append(detailCard);
    });
}

// === 4. 資料篩選邏輯 (Filter Logic) ===
function filterProducts(filterType, filterValue) {
    let url = API_BASE_URL;
    const params = new URLSearchParams();

    if (filterType === 'Type') {
        params.append('type', filterValue);
    } else if (filterType === 'Brand') {
        params.append('brand', filterValue);
    } else if (filterType === 'search') {
        params.append('keyword', filterValue);
    }
    let URL = url;
    // 組合 URL：例如 http://localhost:8080/api/cars?brand=Toyota
    if (params.toString()) {
        url += '?' + params.toString();
    }

    fetch(url)
        .then(response => response.json())
        .then(cars => renderProducts(cars))
        .catch(error => console.error('篩選 API 呼叫失敗:', error));
}

// === 5. 事件監聽 (Event Delegation) ===
function bindEventListeners() {
    // 使用 事件代理 監聽動態產生的卡片按鈕
    $('#productGrid')
        .on('click', '.product-image', function () {
            const productData = $(this).data('product');
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
            showPopup(productData);
        })
        .on('click', '.rent', function () {
            const productData = $(this).closest('.product-card').find('.product-image').data('product');
            addToCart(productData);
            window.location.href = 'reservation.php';
        });

    // 選單切換
    $('#categoryButton').click(() => { $('#brandSection').hide(); $('#categorySection').toggle(); });
    $('#brandButton').click(() => { $('#categorySection').hide(); $('#brandSection').toggle(); });

    $('#categoryList').on('click', '.list-item', function () {
        filterProducts('Type', $(this).data('value'));
    });

    $('#brandList').on('click', '.list-item', function () {
        filterProducts('Brand', $(this).data('value'));
    });

    // 點擊空白處關閉選單
    $(document).on('click', function (event) {
        const $target = $(event.target);
        if (!$target.closest('#categoryButton, #categorySection').length) $('#categorySection').hide();
        if (!$target.closest('#brandButton, #brandSection').length) $('#brandSection').hide();
    });

    // 彈出視窗關閉
    $('#closePopup').click(function () {
        $('#popupContainer').hide();
        $('#popupDetails').empty();
    });

    // 搜尋功能
    $('#searchButton').on('click', executeSearch);

    // 搜尋建議關鍵字點擊
    const $searchBox = $('#searchInput');
    const $suggestions = $('#suggestions');

    $searchBox.attr("autocomplete", "off")
        .on('focus input', function () {
            const query = $(this).val().trim();
            if (query === '') {
                showSuggestions('Recent Searches', recentSearches);
            } else {
                const matches = suggestionsList.filter(item => item.toLowerCase().includes(query.toLowerCase()));
                showSuggestions('Suggestions', matches);
            }
        })
        .on('blur', function () {
            setTimeout(() => $suggestions.hide(), 300);
        });

    $suggestions.on('click', 'div', function () {
        const keyword = $(this).text();
        if (keyword !== 'Recent Searches' && keyword !== 'Suggestions') {
            $searchBox.val(keyword);
            $suggestions.hide();
            executeSearch();
        }
    });

    $('.logo').on('click', () => { window.location.href = 'index.php'; });
    $('#cartButton').on('click', () => { window.location.href = 'reservation.php'; });
}

function executeSearch() {
    const keyword = $('#searchInput').val().trim();
    if (keyword && !recentSearches.includes(keyword)) {
        recentSearches.unshift(keyword);
        if (recentSearches.length > 5) recentSearches.pop();
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    filterProducts('search', keyword);
}

function showSuggestions(type, matches) {
    const $suggestions = $('#suggestions');
    $suggestions.empty();
    if (matches.length > 0) {
        $suggestions.append(`<span class="sugesstion-title">${type}</span>`);
        matches.forEach(match => $suggestions.append(`<div>${match}</div>`));
        $suggestions.show();
    } else {
        $suggestions.hide();
    }
}

function addToCart(product) {
    cart = [product];
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 瀏覽器上一頁/下一頁快取處理
window.addEventListener('pageshow', function (event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        $('#cartCount').text(cart.length);
    }
});