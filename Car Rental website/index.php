<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/mystyle.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script type="text/javascript" src="js/index.js"></script>
<body>
<?php include 'header.html'; ?>
<div class="page__content-container">
    <div class="product-grid" id = "productGrid">
    </div>
</div>
<!-- Pop-up Container -->
<div id="popupContainer" class="popup-container">
    <div class="popup-content">
        <span id="closePopup" class="close-popup">&times;</span>
        <div id="popupDetails">
            <!-- Details from details.php will be loaded here -->
        </div>
    </div>
</div>
<!-- Floating Cart Button !-->
<div id="cartButton" class="cart-button">
    <i class="fa fa-shopping-cart"></i>
</div>
</body>
</html>