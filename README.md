memory
======

A simple memory program to demonstrate keypress navigation and crossdomain request using php
The program demostrates how to sned crossdomain request using PHP and ajax.

COLOR MEMORY PROGRAM INSTALL INSTRUCTION
----------------------------------------


SERVER REQUIREMENTS
-------------------
PHP 5.1+ and apache /IIS server

INSTALL INSTRUCTION
-------------------
1. Extract the contents of the zip file to the server.
2. Open the index.html file in Firefox browser. 
TESTED ON FIREFOX 23.0.1

SOLUTION
--------
To overcome cross domain server request error, I used php script to get the color data from the server. 
Alternate solutions I researched 
1.	ADD THE PHP header("Access-Control-Allow-Origin: http://www.youdomain.com/"); to server 
2.	Header set Access-Control-Allow-Origin: http://www.yourdomain.com/  to .HTACESS file.
3.	Using jsonp dataformat to return the data from the server will eliminate the need for changes on the server.
Application URL: http://greatertamil.com/portfolio/memory

REFERENCE
---------
1. www.github.com
2. www.stackoverflow.com

Contact: praveenjelish@ymail.com

