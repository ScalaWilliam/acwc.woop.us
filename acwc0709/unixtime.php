<?php

$tt = strtotime((string)$_GET['time']." UTC+0000");
$mt = time();
$diff = $tt-$mt;
echo round($diff/3600). " ".$diff;

?>
