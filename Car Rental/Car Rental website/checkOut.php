<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/mystyle.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<body>
<div class="detal-grid" id = "detailGrid">
    <table id="deliveryTable" align="center">
        <h2 align="center">Order details</h2>
        <tr align="center">
            <td colspan="2">
                <h3>FIRST NAME<font color="red"> *</font></h3>
                <input class="details" name="first_name" id="firstName" type="text" length="30" size="30">
            </td>
            <td colspan="2">
                <h3>LAST NAME<font color="red"> *</font></h3>
                <input class="details" name="last_name" id="lastName" type="text" length="30" size="30">
            </td>
        </tr>
        <tr align="center">
            <td colspan="2">
                <h3>EMAIL<font color="red"> *</font></h3>
                <input class="details" name="email" id="email" type="text" length="30" size="30">
            </td>
            <td colspan="2">
                <h3>PHEONE NO<font color="red"> *</font></h3>
                <input class="details" name="phone_no" id="phoneNo" type="text" length="30" size="30">
            </td>
        </tr>
        <tr align="center">
            <td colspan="4">
                <h3>Driver's License<font color="red"> *</font></h3>
                <input class="details" name="license" id="license" type="text" length="80" size="80">
            </td>
        </tr>
        <tr align="center">
            <td colspan="4">
                <h3>ADDRESS<font color="red"> *</font></h3>
                <input class="details" name="address" id="address" type="text" length="80" size="80">
            </td>
        </tr>
        <tr align="center">
            <td>
                <h3>CITY/SUBURB<font color="red"> *</font></h3>
                <input class="details" name="city" id="city" type="text" length="20" size="20">
            </td>
            <td>
                <h3>STATE<font color="red"> *</font></h3>
                <select class="details" id="stateOptions" name = "state">
                    <option value="">Select a state</option>
                    <option value="NSW">NSW</option>
                    <option value="VIC">VIC</option>
                    <option value="QLD">QLD</option>
                    <option value="WA">WA</option>
                    <option value="SA">SA</option>
                    <option value="TAS">TAS</option>
                    <option value="ACT">ACT</option>
                    <option value="NT">NT</option>
                    <option value="Others">Others</option>
                </select>
            </td>
            <td>
                <h3>COUNTRY<font color="red"> *</font></h3>
                <input class="details" name="country" id="country" type="text" length="20" size="20">
            </td>
            <td>
                <h3>ZIP<font color="red"> *</font></h3>
                <input class="details" name="zip" id="zip" type="text" length="20" size="20">
            </td>
        </tr>
    </table>
</div>
</body>
</html>