<?php
$fileQuery = (isset($_GET['load'])) ? htmlentities($_GET['load']) : die();
$_show = false;
switch($fileQuery) {
	case "init":
		$includeFile = "libraries/ajax.init.js";
		$fileType = "javascript";
		$_show = false;
		break;
	case "gallery":
		$includeFile = "styles/gallery.css";
		$fileType = "css";
		$_show = false;
		break;
	case "config":
		$includeFile = "config/settings.php";
		$fileType = "plain";
		$_show = true;
		break;
	default: die(); break;
}
require(dirname(dirname(__FILE__))."/libraries/general.bootstrap.php");
header("Content-type: text/$fileType");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
$ic_html_path = dirname( dirname(__FILE__) ) . "/" . $includeFile;
if ($_show) {
	$ic_html = file_get_contents( $ic_html_path );
	$ic_html = preg_replace( '/<\?php|\?>/', "", $ic_html );
	echo $ic_html;
} else {
	echo get_include_contents($ic_html_path);
}
?>