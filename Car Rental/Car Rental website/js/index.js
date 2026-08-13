/* global $ */
/* global localStorage $ */
var cart = JSON.parse(localStorage.getItem('cart')) || [];

$(document).ready(function() {
    var categories = ["Sedan", "SUV", "Hatchback", "Truck", "Convertible"];
    var brands = ["Audi", "BMW", "Chevrolet", "Ford", "Honda", "Hyundai", "Mazda", "Mercedes", "Nissan", "Subaru", "Toyota", "Others"];
    var others = ["acura", "kia", "lexus", "mini", "tesla", "volkswagen", "volvo", "jeep"];
    
    function renderList(list, $element) {
        $element.empty();
        $.each(list, function(index, item) {
            $element.append(`<div class="list-item" data-type="${$element.attr('id')}" data-value="${item}">${item}</li>`);
        });
    }

    function renderProducts(products) {
        var $productGrid = $('#productGrid');
        $productGrid.empty(); // Clear existing content

        $.each(products, function(index, product) {
            var productCard = `
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="picture/${product.Image}.jpeg" class="product-image" alt="${product.Brand} ${product.Car}" 
                        data-product='${JSON.stringify(product)}'>
                    </div>
                    <h2 class="product-title">${product.Brand} ${product.Car}</h2>
                    <div class="product-details">
                        <p class="product-title">Model: ${product.Model}\n</p>
                        <p class="product-title">Type: ${product.Type}</p>
                        <p class="product-title">Price/Day: $${product.Price}</p>
                    </div>
                    <div class="availability-button-container">`;
            if (product.Quantity > 0) {
                productCard += `<p class="product-available">Available Now</p>
                                <button class="rent">Rent</button></div></div>`;
            } else {
                productCard += `<p class="product-unavailable">Unavailable</p></div></div>`;
            }
            $productGrid.append(productCard);
        });
        
        // Add click event listener for images
        $('.product-image').on('click', function() {
            var productData = $(this).data('product');
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
            showPopup(productData);
        });
        
        // Add click event listener for rent buttons
        $('.rent').on('click', function() {
            var productData = $(this).closest('.product-card').find('.product-image').data('product');
            addToCart(productData);
            window.location.href = 'reservation.php';
        });
        
        // Add click event listener for reservation buttons
        $('#cartButton').on('click', function() {
            window.location.href = 'reservation.php';
        });
    }

    function fetchAndRenderProducts(filterType, filterValue) {
        $.getJSON('cars.json', function(data) {
            var filteredProducts;
            if (filterType && filterValue) {
                filteredProducts = data.filter(function(product) {
                    if (filterType == 'Brand' && filterValue == 'Others') {
                        return others.includes(product[filterType].toLowerCase());
                    } else if (filterType == 'search') {
                        
                        
                        return product['Brand'].toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
                               product['Type'].toLowerCase().indexOf(filterValue.toLowerCase()) !== -1 ||
                               product['Car'].toLowerCase().indexOf(filterValue.toLowerCase()) !== -1
                    } else {
                        return product[filterType].toLowerCase() === filterValue.toLowerCase();
                    }
                });
            } else {
                filteredProducts = data; // No filter, return all products
            }
            renderProducts(filteredProducts);
        }).fail(function(jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });
    }
    
    function showPopup(productData) {
        $('#popupContainer').show();
        // Load details.php content into the pop-up
        $('#popupDetails').load('details.php', function() {
            // After loading, populate the details
            var product = JSON.parse(localStorage.getItem('selectedProduct'));
            // Use product data to populate the content if necessary
            var $productGrid = $('#detailGrid');
            $productGrid.empty(); // Clear existing content
        
            var productCard = `
                <div class="detail-card">
                    <h2 class="product-title">${product.Brand} ${product.Car}</h2>
                    <img src="picture/${product.Image}.jpeg" class="detail-image" alt="${product.Brand} ${product.Car}" 
                    data-product='${JSON.stringify(product)}'>
                    <div class="product-details">
                        <p class="product-title">Type: ${product.Type}</p>
                        <p class="product-title">Year: ${product.Model}</p>
                        <p class="product-title">Price/Day: $${product.Price}</p>
                        <p class="product-title">Fuel Type: ${product.Fuel_Type}</p>
                        <p class="product-title">Seats: ${product.Seats}</p>
                        <p class="product-title">Description: ${product.Description}</p>
                    </div>`;
                    
            $productGrid.append(productCard);
        });
    }

    $('#closePopup').click(function() {
        $('#popupContainer').hide();
        $('#popupDetails').empty(); // Clear the pop-up content
    });
    
    function addToCart(product) {
        cart = [product];
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    $('#categoryButton').click(function() {
        $('#brandSection').hide();
        $('#categorySection').toggle();
    });

    $('#brandButton').click(function() {
        $('#categorySection').hide();
        $('#brandSection').toggle();
    });

    $('#categoryList').on('click', '.list-item', function() {
        var category = $(this).data('value');
        fetchAndRenderProducts('Type', category);
    });

    $('#brandList').on('click', '.list-item', function() {
        var brand = $(this).data('value');
        fetchAndRenderProducts('Brand', brand);
    });
    
    // Event listener to hide area when clicking outside
    $(document).on('click', function(event) {
        var $target = $(event.target);
        if (!$target.closest('#categoryButton').length && !$target.closest('#categorySection').length) {
            $('#categorySection').hide();
        }
        if (!$target.closest('#brandButton').length && !$target.closest('#brandSection').length) {
            $('#brandSection').hide();
        }
    });
    
    $('.logo').on('click', function() {
        window.location.href = 'index.php';
    });
    
    $('#searchButton').on('click', function() {
        var keyword = $('#searchInput').val();
        if (!recentSearches.includes(keyword)) {
            recentSearches.unshift(keyword);
            if (recentSearches.length > 5) {
                recentSearches.pop();
            }
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        }
        fetchAndRenderProducts('search', $('#searchInput').val());
    });
    

    // Initialize the lists
    renderList(categories, $('#categoryList'));
    renderList(brands, $('#brandList'));

    // Fetch and render products on index.php and details.php
    if (window.location.pathname.endsWith('index.php')) {
        fetchAndRenderProducts();
    }
    
    // search suggestion
    const suggestionsList = [
    "sedan", "Toyota", "Camry",
    "SUV", "Honda", "CR-V",
    "hatchback", "Ford", "Fiesta",
    "BMW", "3 Series",
    "Audi", "Q5",
    "Mercedes", "C-Class",
    "truck", "F-150",
    "convertible", "Mazda", "MX-5",
    "Nissan", "Altima",
    "Jeep", "Wrangler",
    "Hyundai", "Sonata",
    "Kia", "Sorento",
    "Tesla", "Model S",
    "Chevrolet", "Tahoe",
    "Volkswagen", "Golf",
    "Lexus", "ES 350",
    "Subaru", "Outback",
    "Acura", "TLX",
    "Mini", "Cooper",
    "Volvo", "XC60",
    "Malibu",
    "Escape",
    "Accord",
    "CX-5",
    "Elantra",
    "Rogue",
    "Corolla",
    "Forester",
    "Silverado",
    "E-Class",
    "Q7",
    "Focus",
    "5 Series",
    "Highlander",
    "A4"];
    
    var $searchBox = $('#searchInput');
    var $suggestions = $('#suggestions');
    var recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    function showSuggestions(type, matches) {
        $suggestions.empty();
        if (matches.length > 0) {
            $suggestions.append('<span class = "sugesstion-title">' + type + '</span>');
        }
        matches.forEach(function(match) {
            $suggestions.append('<div>' + match + '</div>');
        });
        $suggestions.show();
    }
    
    function getMatches(list, query) {
        return list.filter(function(item) {
            return item.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    }
    
    $searchBox.on('focus', function() {
        if ($searchBox.val() === '') {
            showSuggestions('Recent Searches', recentSearches);
        } else {
            var query = $searchBox.val();
            var matches = getMatches(suggestionsList, query);
            showSuggestions('Suggestions', matches);
        }
    });
    
    $searchBox.on('blur', function() {
        setTimeout(function() {
            $suggestions.hide();
        }, 500);
    });

    $searchBox.on('input', function() {
        var query = $searchBox.val();
        if (query === '') {
            showSuggestions('Recent Searches', recentSearches);
        } else {
            var matches = getMatches(suggestionsList, query);
            showSuggestions('Suggestions', matches);
        }
    });

    $suggestions.on('click', 'div', function() {
        var keyword = $(this).text();
        $searchBox.val(keyword);
        $suggestions.hide();
    });
    
    $('.searchInput').attr("autocomplete", "off");
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        // Page was restored from the cache or navigated via back/forward buttons
        // Update number in cart
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        $('#cartCount').text(cart.length);
    }
});