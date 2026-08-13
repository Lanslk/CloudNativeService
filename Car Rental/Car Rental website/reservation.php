<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/mystyle.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script type="text/javascript" src="js/reservation.js"></script>
<body>
<?php include 'header.html'; ?>
<div class="page__content-container">
    <!-- Reservation content goes here -->
    <h2>Your Reservation</h2>
    <div class="detal-grid" id = "detailGrid">
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
<!-- Floating Button -->
<div id="backToMenu" class="backToMenu-button">
    <span id="">Back To Menu</span>
</div>
<div id="placeOrder" class="placeOrder-button">
    <span id="">Place Order</span>
</div>
<div id="confirm" class="confirm-button" onclick="confirmOrder()">
    <span id="">Confirm</span>
</div>
</body>
</html>