<?php
/**
 * Author : Praveen Jelish, praveenjelish@ymail.com
 * PHP code to retrive data from the cross domain server.
 * Regular expression is used to extract the color data from the server data. 
 * The color codes are returned in JSON format
 */
$jsonString = file_get_contents('http://labs.funspot.tv/worktest_color_memory/colours.conf');
    $nMatches = preg_match_all ('/[!^#(a-zA-Z0-9)]{7}/i', $jsonString,$matches, PREG_SET_ORDER); //preg match looks for 7 charecters and number in any order followed by hash symbol
	$matches =array_merge ($matches,$matches); //merge arrays to create 18 colors
	shuffle($matches); //randomize the array elements for the game. 
echo json_encode($matches); //encode the array in json and send it back to javascript
?>