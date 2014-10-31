<?php

$file = $_GET['file'];
$width = $_GET['width'];
$height = $_GET['height'];

?>

<html>
<head>
	<title>JW Player for Flash</title>
	
<style type="text/css">
html, body {
overflow: hidden;
}
</style>
	
</head>
<body topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" style="margin: 0px 0px 0px 0px;">
<div id="container" name="container" style="margin: 10px 10px 10px 10px;"><a href="http://www.macromedia.com/go/getflashplayer" target="_blank;">Get the Flash Player</a> to see this player.</div>

<script src="swfobject.js" type="text/javascript"></script>
<script type="text/javascript">
var s1 = new SWFObject("player.swf","ply","<?php echo $width?>","<?php echo $height?>","9","#FFFFFF"); 
s1.addParam("allowfullscreen","true"); 
s1.addParam("allowscriptaccess","always");
s1.addParam("flashvars","file=../<?php echo $file ?>&autostart=true"); 
s1.write("container");
</script>

</body>
</html>