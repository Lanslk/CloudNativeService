/* global $ */
/* global localStorage $ */
$(document).ready(function() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // check availability
    var carQuantity = getCarQuantity(cart);
    
    var $productGrid = $('#detailGrid');
    $productGrid.empty(); // Clear existing content
    var productCard;
    if (cart.length > 0) {
        $.each(cart, function(index, product) {
            var days = product.days || 1; // Get days from localStorage, default to 1 if not present
            var carNumber = product.carNumber || 1; // Get days from localStorage, default to 1 if not present
            var startDate = product.startDate || ''; // Get startDate from localStorage, default to empty string if not present
            var endDate = product.endDate || '';
            var productCard = `
                <div class="reservation-product-card">
                    <div class="reservation-product-image-container">
                        <img src="picture/${product.Image}.jpeg" class="reservation-product-image" alt="${product.Brand} ${product.Car}" 
                        data-product='${JSON.stringify(product)}'>
                    </div>
                    <div class="product-details-container">
                        <h2 class="product-title">${product.Brand} ${product.Car}</h2>
                        <div class="product-details">
                            <p class="product-title">Type: ${product.Type}</p>
                            <p class="product-title">Year: ${product.Model}</p>
                            <p class="product-title">Price/Day: $${product.Price}</p>
                            <p class="product-title">Fuel Type: ${product.Fuel_Type}</p>
                            <p class="product-title">Seats: ${product.Seats}</p>
                            <p class="product-title">Description: ${product.Description}</p>
                        </div>
                    </div>
                    <div class="user-input-container" id="user-input-container">
                        Number of Car: <input class="number-input" id="carNo-input" type="number" value="${carNumber}"> car(s) <br>
                        Number of Day: <input class="days-input" id="days-input" type="number" value="${days}"> day(s)
                        <p class="subtotal">Total: $${product.Price * days * carNumber}</p>
                        <p>Rent Start Date:</p>
                        <input class="start-date" id="start-date" type="date" value="${startDate}"><br>
                        <p>End Date:</p>
                        <input class="end-date" id="end-date" type="date" readonly value="${endDate}"><br>
                        <p id="carQuantity">Car Quantity:${carQuantity}</p>
                        <button class="remove-button">Cancel Reservation</button>
                    </div>
                </div>`;
            $productGrid.append(productCard);
        });
    } else {
        $productGrid.append(`<p>There is no reservation for now.</p>`);
    }
    
    // Calculate subtotal and update it when the number of cars and days changes
    $('.number-input, .days-input').on('input', function() {
        var carNumber = parseInt($('#carNo-input').val());
        var days = parseInt($('#days-input').val());
        var pricePerDay = parseFloat($(this).closest('.reservation-product-card').find('.product-details p:nth-child(3)').text().split(':')[1].trim().slice(1));
        var subtotal = carNumber * days * pricePerDay;
        $(this).closest('.reservation-product-card').find('.subtotal').text('Total: $' + subtotal);
        if (!isNaN(days) && days >= 1) {
            var productIndex = $(this).closest('.reservation-product-card').index();
            cart[productIndex].days = days; // Save days to the corresponding product in the cart array
            cart[productIndex].carNumber = carNumber; // Save days to the corresponding product in the cart array
            localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
            
            updateEndDate($(this).closest('.user-input-container'));
        }
    });

    // Event listener for removing the item from the cart
    $('.remove-button').on('click', function() {
        var productIndex = $(this).closest('.reservation-product-card').index();
        cart.splice(productIndex, 1); // Remove the product from the cart array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage
        $(this).closest('.reservation-product-card').remove(); // Remove the product card from the UI
        if (cart.length === 0) {
            $productGrid.append('<p>There is no reservation for now.</p>');
        }
    });
    
    $('.user-input-container input[type="number"]').on('change', function() {
        var value = parseInt($(this).val());
        if (isNaN(value) || value < 1) {
            $(this).val(1); // Set the value to 1 if it's less than 1 or NaN
            var number = parseInt($('#carNo-input').val());
            var days = parseInt($('#days-input').val());
            var pricePerDay = parseFloat($(this).closest('.reservation-product-card').find('.product-details p:nth-child(3)').text().split(':')[1].trim().slice(1));
            
            $(this).closest('.reservation-product-card').find('.subtotal').text('Total: $' + number * days * pricePerDay);
            
            var productIndex = $(this).closest('.reservation-product-card').index();
            if ($(this).attr('id') == "carNo-input") {
                cart[productIndex].carNumber = 1;
            } else if ($(this).attr('id') == "days-input") {
                cart[productIndex].days = 1;
                updateEndDate($(this).closest('.user-input-container'));
            }
            
            localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        }
    });
    
    // Event listener for input field for rent start day
    $('.start-date').on('change', function() {
        var startDate = $(this).val();
        var productIndex = $(this).closest('.reservation-product-card').index();
        
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[productIndex].startDate = startDate; // Save start date to the corresponding product in the cart array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        
        updateEndDate($(this).closest('.user-input-container'))
    });
    
    // Function to update the end date based on the start date and days
    function updateEndDate($container) {
        var days = parseInt($container.find('.days-input').val());
        var startDate = new Date($container.find('.start-date').val());
        
        if (!isNaN(days) && !isNaN(startDate.getTime())) {
            var endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + days - 1);
            $container.find('.end-date').val(endDate.toISOString().split('T')[0]);
        } else {
            $container.find('.end-date').val('');
        }
        
        var productIndex = $container.closest('.reservation-product-card').index();
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[productIndex].endDate = $container.find('.end-date').val(); // Save end date to the corresponding product in the cart array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
    }
    
    function showPopup(productData) {
        $('#popupContainer').show();
        // Load details.php content into the pop-up
        $('#popupDetails').load('checkOut.php');
        
        //hide and show button
        $('#backToMenu').hide();
        $('#placeOrder').hide();
        $('#confirm').show();
    }
    
    $('#backToMenu').on('click', function() {
        window.history.back();
    });
    
    $('#placeOrder').off('click').on('click', function() {
        // save to local storage
        var carNumber = parseInt($('#carNo-input').val());
        var days = parseInt($('#days-input').val());
        cart[0].days = days; // Save days to the corresponding product in the cart array
        cart[0].carNumber = carNumber; // Save days to the corresponding product in the cart array
        cart[0].startDate = $('#start-date').val();
        cart[0].endDate = $('#end-date').val();
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        
        carQuantity = getCarQuantity(cart);
        if (carQuantity == 0) {
            alert("Sorry! There is no available car for now!");
            return;
        }
        
        if (carNumber > carQuantity) {
            alert("Sorry! Only " + carQuantity + " car(s) available for now!");
            return;
        }
        
        var days = $(".start-date");
        let currentDate = new Date().toJSON().slice(0, 10);
        var inputDateCheck = true;
        $.each(days, function(index, day) {
            if ($(day).val() == '' || $(day).val() <= currentDate) {
                changeBackGround(true, day);
                inputDateCheck = false;
            } else {
                changeBackGround(false, day);
            }
        });
        
        if (!inputDateCheck) {
            alert("Rent Start Day should > current Date : " + currentDate);
            return;
        }
        
        showPopup();
    });
    
    $('#closePopup').click(function() {
        $('#popupContainer').hide();
        $('#popupDetails').empty(); // Clear the pop-up content
        
        //hide and show button
        $('#backToMenu').show();
        $('#placeOrder').show();
        $('#confirm').hide();
    });
});

function getCarQuantity(cart) {
    var quantity
    $.ajax({
        url: 'cars.json',
        dataType: 'json',
        async: false, // Makes the request synchronous
        success: function(data) {
            var filteredProducts = data.filter(function(product) {
                return product['NO'] === cart[0].NO
            })
            quantity = filteredProducts[0].Quantity;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
    return quantity;
}

function getOrderData() {
    var detailsArray = {};
    $('.details').each(function() {
        var inputName = $(this).attr('name');
        var inputValue = $(this).val();
        detailsArray[inputName] = inputValue;
    });
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    detailsArray['orders_details'] = JSON.stringify(cart[0]);
    return detailsArray;
}

var orderId;
var newQuantity;
var orderCarNo;

function confirmOrder() {
    if (!validation()) {
        return;
    } else {
        // check availability again
        var cart = JSON.parse(localStorage.getItem('cart')) || [];
        var carQuantity = getCarQuantity(cart);
        
        if (cart[0].carNumber > carQuantity) {
            alert("Sorry! There is no enough available car for now!");
            $('#popupContainer').hide();
            $('#popupDetails').empty(); // Clear the pop-up content
            
            //hide and show button
            $('#backToMenu').show();
            $('#placeOrder').show();
            $('#confirm').hide();
            $('#carQuantity').text("Car Quantity:" + carQuantity);
            return;
        }
        
        newQuantity = parseInt(carQuantity) - parseInt(cart[0].carNumber);
        orderCarNo = cart[0].NO
        
        $.ajax({
            url: 'insertOrder.php',
            type: 'POST',
            async: false, // Makes the request synchronous
            data: {
                insertParameter: getOrderData()
            },
            success: function(data) {
                orderId = data;
                $('#popupContainer').hide();
                $('#popupDetails').empty(); // Clear the pop-up content
                
                //hide button
                $('#backToMenu').hide();
                $('#placeOrder').hide();
                $('#confirm').hide();
                
                var $detailGrid = $('#detailGrid');
                
                var $userInputContainer = $('#user-input-container');
                var product = JSON.parse(localStorage.getItem('cart'))[0];
                var days = product.days || 1; // Get days from localStorage, default to 1 if not present
                var carNumber = product.carNumber || 1; // Get days from localStorage, default to 1 if not present
                var startDate = product.startDate || ''; // Get startDate from localStorage, default to empty string if not present
                var endDate = product.endDate || '';
                
                $userInputContainer.empty();
                $userInputContainer 
                var orderInfo = `
                    <p>Number of Car: ${carNumber} car(s)</p>
                    <p>Number of Day: ${days} day(s)</p>
                    <p>Total: $${product.Price * days * carNumber}</p>
                    <p>Rent Start Date: ${startDate}</p>
                    <p>Rent End Date: ${endDate}</p>
                `
                $userInputContainer.append(orderInfo);
                var content = `
                 <h2>Your reservation is ready, please click the link below to confirm your reservaion</h2>
                 <a href="#" onclick="confirmReservation()">Order confirm</a>
                 `
                 $detailGrid.append(content);
                 
                 // remove Reservation information
                localStorage.setItem('cart', JSON.stringify([]));
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Error: ' + textStatus + ' - ' + errorThrown);
            }
        });
    }
}

function confirmReservation() {
    // update json
    $.ajax({
        url: 'updateCarQuantity.php',
        type: 'POST',
        async: false,
        data: {
            NO: orderCarNo,
            newQuantity: newQuantity
        },
        success: function(response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error updating car quantity:', textStatus, errorThrown);
        }
    });
    
    // update order status
    $.ajax({
        url: 'updateOrder.php',
        type: 'POST',
        async: false,
        data: {
            order_no: orderId
        },
        success: function(response) {
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error updating car quantity:', textStatus, errorThrown);
        }
    });
    
    
    alert("Thank you!!! Your rental information will be sent to your email");
    
    
    
    window.location.href = 'index.php';
}

function validation() {
    var inputs = $(".details");
    var check = true;
    var errorMsg = '';
    
    $.each(inputs, function(index, input) {
        if ($(input).val().trim() == "") {
            check = false;
            changeBackGround(true, input);
        } else {
            changeBackGround(false, input);
        }
    });
    
    if ($("#stateOptions").val().trim() == "") {
        check = false;
        changeBackGround(true,$("#stateOptions"));
    } else {
        changeBackGround(false, $("#stateOptions"));
    }
    
    if (!check) {
        errorMsg += "All details are compulsory for the order! Please fill in\n";
    }
    
    // name validation
    if (!/^[a-z ,.'-]+$/i.test($("#firstName").val())) {
        errorMsg += "First name is invalid!\n";
        changeBackGround(true, $("#firstName"));
    } else {
        changeBackGround(false, $("#firstName"));
    }
    
    if (!/^[a-z ,.'-]+$/i.test($("#lastName").val())) {
        errorMsg += "Last name is invalid!\n";
        changeBackGround(true, $("#lastName"));
    } else {
        changeBackGround(false, $("#lastName"));
    }
    
    // email validation
    var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test($("#email").val())) {
        errorMsg += "Email is invalid!\n";
        changeBackGround(true, $("#email"));
    } else {
        changeBackGround(false, $("#email"));
    }
    
    // phone validation
    if (!/^\d{10}$/.test($("#phoneNo").val())) {
        errorMsg += "Phone No is invalid, need to be 10 digits!\n";
        changeBackGround(true, $("#phoneNo"));
    } else {
        changeBackGround(false, $("#phoneNo"));
    }
    
    // driver license validation
    if (!/^[0-9\s,'-]+$/.test($("#license").val())) {
        errorMsg += "Driver's license is invalid!\n";
        changeBackGround(true, $("#license"));
    } else {
        changeBackGround(false, $("#license"));
    }
    
    // address validation
    if (!/^[a-zA-Z0-9\s,'-]+$/.test($("#address").val())) {
        errorMsg += "Address is invalid!\n";
        changeBackGround(true, $("#address"));
    } else {
        changeBackGround(false, $("#address"));
    }
    
    // city validation
    if (!/^[a-zA-Z0-9\s,'-]+$/.test($("#city").val())) {
        errorMsg += "City/Suburb is invalid!\n";
        changeBackGround(true, $("#city"));
    } else {
        changeBackGround(false, $("#city"));
    }
    
    // country validation
    if (!/^[a-zA-Z0-9\s,'-]+$/.test($("#country").val())) {
        errorMsg += "Country is invalid!\n";
        changeBackGround(true, $("#country"));
    } else {
        changeBackGround(false, $("#country"));
    }
    
    // zip validation
    if (!/^[0-9\s,'-]+$/.test($("#zip").val())) {
        errorMsg += "Zip is invalid!\n";
        changeBackGround(true, $("#zip"));
    } else {
        changeBackGround(false, $("#zip"));
    }
    
    if (errorMsg != '') {
        alert(errorMsg);
        return false;
    } else {
        return true;
    }
}

function changeBackGround(change, input) {
    if (change) {
        $(input).css("background", "yellow")
    } else {
        $(input).css("background", "")
    }
}