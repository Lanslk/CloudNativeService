<?php


//create a connection to the database 
$conn = mysqli_connect("awseb-e-rqntn7erjh-stack-awsebrdsdatabase-8lwqs91idnrh.cjk60e66eklv.us-east-1.rds.amazonaws.com","uts","password", "assignment2");
if (!$conn)
    die("Could not connect to Server");


// insert orders
$insertArray = $_REQUEST['insertParameter'];

$insert_string = "insert into car_orders values ('0', 'unconfirmed', ";
$x = 0;
foreach ($insertArray as $key => $value) {
    $insert_string = $insert_string."'".$value."'";
    if ($x == sizeof($insertArray) - 1) {
        $insert_string = $insert_string.");";
    } else {
        $insert_string = $insert_string.", ";
    }
    $x = $x + 1;
}

if (mysqli_query($conn, $insert_string)) {
    echo mysqli_insert_id($conn);
} else {
    echo "Error inserting record: " . $conn->error;
}

// close connection
mysqli_close($conn);
?>
