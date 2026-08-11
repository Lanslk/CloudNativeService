<?php


//create a connection to the database 
$conn = mysqli_connect("awseb-e-rqntn7erjh-stack-awsebrdsdatabase-8lwqs91idnrh.cjk60e66eklv.us-east-1.rds.amazonaws.com","uts","password", "assignment2");
if (!$conn)
    die("Could not connect to Server");


// insert orders
$order_no = $_REQUEST['order_no'];

$update_string = "update car_orders set status = 'confirmed' where orders_no = '".$order_no."'";

if (mysqli_query($conn, $update_string)) {
    echo "Success update record";
} else {
    echo "Error updating record: " . $conn->error;
}

// close connection
mysqli_close($conn);
?>
