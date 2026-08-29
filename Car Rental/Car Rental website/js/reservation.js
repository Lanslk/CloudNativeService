/* global $ */

const API_BASE_URL = 'http://${window.location.hostname}:8080/api/cars';

// === 1. 全域購物車管理模組 (Cart Manager) ===
const CartManager = {
    getKey: () => 'cart',
    getCart: () => JSON.parse(localStorage.getItem(CartManager.getKey())) || [],
    saveCart: (cart) => localStorage.setItem(CartManager.getKey(), JSON.stringify(cart)),
    clearCart: () => localStorage.removeItem(CartManager.getKey()),

    getItem: (index = 0) => CartManager.getCart()[index] || null,

    updateItem: (index, key, value) => {
        const cart = CartManager.getCart();
        if (cart[index]) {
            cart[index][key] = value;
            CartManager.saveCart(cart);
        }
    },

    removeItem: (index) => {
        const cart = CartManager.getCart();
        cart.splice(index, 1);
        CartManager.saveCart(cart);
        return cart;
    }
};

// === 2. API / 後端服務層 (Order Service) ===
const OrderService = {
    // 取得即時車輛庫存
    async fetchCarQuantity(carNo) {
        try {
            // 呼叫 Spring Boot API: fetch(`http://localhost:8080/api/cars/${carNo}`)
            const data = await $.ajax({
                url: API_BASE_URL + '/' + carNo,
                type: 'GET',
                contentType: 'application/json',
                data: JSON.stringify(carNo)
            });
            return data.quantity;
        } catch (err) {
            console.error('無法取得車輛庫存:', err);
            return 0;
        }
    },



    // 建立訂單
    async createOrder(orderData) {
        return $.ajax({
            url: 'http://localhost:8080/api/orders',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData)
        });
    },

    // 確認訂單與更新庫存
    async confirmOrderProcess(orderNo, carId, carNumber) {
        let orderRequestDto = {ordersNo : orderNo, carId : carId, carNumber: carNumber}
        return $.ajax({
            url: 'http://localhost:8080/api/orders/confirmOrder',
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify(orderRequestDto)
        });
    }
};

// === 3. 畫面繪製與控制 (UI Controller) ===
const UI = {
    async renderReservationPage() {
        const cart = CartManager.getCart();
        const $grid = $('#detailGrid').empty();

        if (cart.length === 0) {
            $grid.append('<p class="no-data">There is no reservation for now.</p>');
            return;
        }

        const product = cart[0];
        const realQuantity = await OrderService.fetchCarQuantity(product.carNo);

        const days = product.days || 1;
        const carNumber = product.carNumber || 1;
        const startDate = product.startDate || '';
        const endDate = product.endDate || '';
        const totalPrice = (product.price * days * carNumber) || 0;

        const cardHtml = `
            <div class="reservation-product-card" data-price="${product.price}">
                <div class="reservation-product-image-container">
                    <img src="images/${product.image}.jpeg" class="reservation-product-image" alt="${product.brand} ${product.car}">
                </div>
                <div class="product-details-container">
                    <h2 class="<>product-title</>">${product.brand} ${product.carName}</h2>
                    <div class="product-details">
                        <p>Type: ${product.type}</p>
                        <p>Year: ${product.modelYear}</p>
                        <p>Price/Day: $${product.price}</p>
                        <p>Fuel Type: ${product.fuelType}</p>
                        <p>Seats: ${product.seats}</p>
                        <p>Description: ${product.description}</p>
                    </div>
                </div>
                <div class="user-input-container" id="user-input-container">
                    <label>Number of Car: <input class="number-input" id="carNo-input" type="number" min="1" value="${carNumber}"> car(s)</label><br>
                    <label>Number of Day: <input class="days-input" id="days-input" type="number" min="1" value="${days}"> day(s)</label>
                    <p class="subtotal">Total: $${totalPrice}</p>
                    <p>Rent Start Date:</p>
                    <input class="start-date" id="start-date" type="date" value="${startDate}"><br>
                    <p>End Date:</p>
                    <input class="end-date" id="end-date" type="date" readonly value="${endDate}"><br>
                    <p id="carQuantity">Car Quantity: ${realQuantity}</p>
                    <button class="remove-button">Cancel Reservation</button>
                </div>
            </div>`;

        $grid.append(cardHtml);
    },

    updateSubtotalAndDates($card) {
        const price = parseFloat($card.data('price')) || 0;
        const carNumber = parseInt($card.find('#carNo-input').val()) || 1;
        const days = parseInt($card.find('#days-input').val()) || 1;
        const startDateStr = $card.find('#start-date').val();

        // 算出總金額
        const total = price * days * carNumber;
        $card.find('.subtotal').text(`Total: $${total}`);

        // 計算結束日期
        let endDateStr = '';
        if (startDateStr && !isNaN(days)) {
            const start = new Date(startDateStr);
            if (!isNaN(start.getTime())) {
                const end = new Date(start);
                end.setDate(start.getDate() + days - 1);
                endDateStr = end.toISOString().split('T')[0];
            }
        }
        $card.find('#end-date').val(endDateStr);

        // 同步寫入 LocalStorage
        CartManager.updateItem(0, 'carNumber', carNumber);
        CartManager.updateItem(0, 'days', days);
        CartManager.updateItem(0, 'startDate', startDateStr);
        CartManager.updateItem(0, 'endDate', endDateStr);
    },

    toggleModal(show, contentUrl = '') {
        const $modal = $('#popupContainer');
        if (show) {
            $modal.show();
            if (contentUrl) {
                $('#popupDetails').load(contentUrl);
            }
            $('#backToMenu, #placeOrder').hide();
            $('#confirm').show();
        } else {
            $modal.hide();
            $('#popupDetails').empty();
            $('#backToMenu, #placeOrder').show();
            $('#confirm').hide();
        }
    }
};

// === 4. 表單驗證器 (Form Validator) ===
const FormValidator = {
    rules: [
        { id: '#firstName', regex: /^[a-z ,.'-]+$/i, name: 'First Name' },
        { id: '#lastName', regex: /^[a-z ,.'-]+$/i, name: 'Last Name' },
        { id: '#email', regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, name: 'Email' },
        { id: '#phoneNo', regex: /^\d{10}$/, name: 'Phone No (10 digits)' },
        { id: '#license', regex: /^[0-9\s,'-]+$/, name: 'Driver License' },
        { id: '#address', regex: /^[a-zA-Z0-9\s,'-]+$/, name: 'Address' },
        { id: '#city', regex: /^[a-zA-Z0-9\s,'-]+$/, name: 'City' },
        { id: '#country', regex: /^[a-zA-Z0-9\s,'-]+$/, name: 'Country' },
        { id: '#zip', regex: /^[0-9\s,'-]+$/, name: 'Zip Code' }
    ],

    validate() {
        let isValid = true;
        let errorMessages = [];

        // 必填欄位通用檢查 (.details 與 #stateOptions)
        $('.details, #stateOptions').each(function () {
            const val = $(this).val().trim();
            const hasError = val === '';
            FormValidator.markField($(this), hasError);
            if (hasError) isValid = false;
        });

        if (!isValid) errorMessages.push("All details are compulsory for the order!");

        // 規則格式檢查
        FormValidator.rules.forEach(rule => {
            const $field = $(rule.id);
            if ($field.length) {
                const val = $field.val().trim();
                const fieldValid = rule.regex.test(val);
                FormValidator.markField($field, !fieldValid);
                if (!fieldValid) {
                    errorMessages.push(`${rule.name} is invalid!`);
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            alert(errorMessages.join('\n'));
        }
        return isValid;
    },

    markField($element, isError) {
        $element.css("background", isError ? "yellow" : "");
    }
};

// === 5. 事件處理器與主邏輯 (Event Handlers) ===
let state = {
    orderId: null,
    carNumber: 0,
    carId: null
};

$(document).ready(function () {
    UI.renderReservationPage();

    // 動態輸入監聽 (車輛數、天數、開租日期變動)
    $('#detailGrid').on('input change', '#carNo-input, #days-input, #start-date', function () {
        const $card = $(this).closest('.reservation-product-card');

        // 數值防呆 (不能小於 1)
        if ($(this).is('input[type="number"]')) {
            let val = parseInt($(this).val());
            if (isNaN(val) || val < 1) $(this).val(1);
        }

        UI.updateSubtotalAndDates($card);
    });

    // 取消預約按鈕
    $('#detailGrid').on('click', '.remove-button', function () {
        CartManager.clearCart();
        UI.renderReservationPage();
    });

    // 按鈕：返回前頁
    $('#backToMenu').on('click', () => window.history.back());

    // 按鈕：填寫完預約，準備下單 (彈出 CheckOut Modal)
    $('#placeOrder').on('click', async function () {
        const product = CartManager.getItem(0);
        if (!product) return;

        const carNumber = parseInt($('#carNo-input').val()) || 1;
        const startDateStr = $('#start-date').val();
        const currentDate = new Date().toISOString().slice(0, 10);

        // 檢查庫存
        const currentQty = await OrderService.fetchCarQuantity(product.carNo);
        if (currentQty <= 0) {
            alert("Sorry! There is no available car for now!");
            return;
        }
        if (carNumber > currentQty) {
            alert(`Sorry! Only ${currentQty} car(s) available for now!`);
            return;
        }

        // 檢查租借日期合法性
        if (!startDateStr || startDateStr <= currentDate) {
            FormValidator.markField($('#start-date'), true);
            alert(`Rent Start Day should be later than current date (${currentDate})`);
            return;
        }
        FormValidator.markField($('#start-date'), false);

        // 顯示 Modal
        UI.toggleModal(true, 'checkOut.php');
    });

    // 按鈕：關閉 Modal
    $('#closePopup').on('click', () => UI.toggleModal(false));
});

// 全域函式：對應 Modal 內部的 「Confirm」 按鈕
async function confirmOrder() {
    if (!FormValidator.validate()) return;

    const product = CartManager.getItem(0);
    const carQuantity = await OrderService.fetchCarQuantity(product.carNo);

    if (product.carNumber > carQuantity) {
        alert("Sorry! There is no enough available car for now!");
        UI.toggleModal(false);
        $('#carQuantity').text("Car Quantity: " + carQuantity);
        return;
    }

    state.carNumber = parseInt(product.carNumber);
    state.carId = product.id;

    // 收集表單資料
    const orderDetails = {};
    $('.details').each(function () {
        orderDetails[$(this).attr('name')] = $(this).val();
    });
    const orderCarDetails = {};
    orderCarDetails['carId'] = product.id;
    orderCarDetails['startDare'] = product.startDate;
    orderCarDetails['endDate'] = product.endDate
    orderCarDetails['carNumber'] = product.carNumber;
    orderCarDetails['days'] = product.days;
    orderDetails['ordersDetails'] = JSON.stringify(orderCarDetails);

    try {
        // 呼叫 createOrder api
        const responseOrderId = await OrderService.createOrder(orderDetails);
        state.ordersNo = responseOrderId.ordersNo;

        UI.toggleModal(false);

        // 渲染成功後的確認頁面 UI
        const $userInputContainer = $('#user-input-container').empty();
        $userInputContainer.append(`
            <p>Number of Car: ${product.carNumber} car(s)</p>
            <p>Number of Day: ${product.days} day(s)</p>
            <p>Total: $${product.price * product.days * product.carNumber}</p>
            <p>Rent Start Date: ${product.startDate}</p>
            <p>Rent End Date: ${product.endDate}</p>
        `);

        $('#detailGrid').append(`
            <div class="confirmation-box">
                <h2>Your reservation is ready, please click the link below to confirm your reservation</h2>
                <a href="#" onclick="confirmReservation(); return false;">Order confirm</a>
            </div>
        `);

        CartManager.clearCart(); // 訂單建立完成，清除暫存購物車

    } catch (err) {
        alert('Failed to place order. Please try again.');
        console.error(err);
    }
}

// 全域函式：最終點擊確認連結
async function confirmReservation() {
    try {
        await OrderService.confirmOrderProcess(state.ordersNo, state.carId, state.carNumber);
        alert("Thank you!!! Your rental information will be sent to your email");
        window.location.href = 'index.php';
    } catch (err) {
        alert("Failed to confirm reservation.");
        console.error(err);
    }
}