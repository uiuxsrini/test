<?php

if(isset($_POST['the_name'])){
    $to = 'uiuxsrini@gmail.com';
    $subject = 'Received Feedback';
    $message = '';
    $message.= '<p><strong>Name:</strong></p><p>'.$_POST['the_name'].'</p>';
    $message.= '<p><strong>Email:</strong></p><p>'.$_POST['the_email'].'</p>';
    $message.= '<p><strong>Feedback:</strong></p><p>'.$_POST['the_feedback'].'</p>';
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers.= 'From: '. $_POST['email'] . "\r\n" .
        'Reply-To: '. $_POST['email']  . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    mail($to, $subject, $message, $headers);

//    print_r($_POST);
}


