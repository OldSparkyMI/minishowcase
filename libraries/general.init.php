<?php

/**
 * INIT PROCESSES
 */
	
	
	/* INIT PROCESSES */
	
	/* alerts init */
	$alert_message = array();
	
	// if DOCUMENT_ROOT does not exist, define it
	if (!isset($_SERVER['DOCUMENT_ROOT'])) {
		// if SCRIPT_FILENAME does not exist, define it
		if (isset($_SERVER['SCRIPT_FILENAME'])) {
			$_SERVER['DOCUMENT_ROOT'] = str_replace('\\', '/', substr($_SERVER['SCRIPT_FILENAME'], 0, 0-strlen($_SERVER['PHP_SELF'])));
		} else {
			$_SERVER['DOCUMENT_ROOT'] = '/';
		}
	}
	
	$_dir_file = dirname(dirname(__FILE__));
	$_dir_path = dirname($_SERVER["DOCUMENT_ROOT"] . $_SERVER['PHP_SELF']);
	
 	if ($_dir_file != $_dir_path) {
		if (!isset($settings['minishowcase_url'])
			|| ($settings['minishowcase_url'] == "")) {
			die ("<p style=\"margin:6px;padding:20px;text-align:left;font-size:18px;background:#f60;color:#FFF;\">ALERT: if you are including minishowcase with PHP into a website, please set the <code>\$minishowcase_url</code> variable in the <code>/config/settings.php</code> file</p>");
		}
	}
	
	// check for init num of thumbnails
	// if zero or smaller, alert
	if ($settings['max_thumbnails']<=0) {
		$settings['max_thumbnails'] = 6;
		$alert_message[] = "Max number of thumbnails cannot be 0 or 'false', it has been set to 6. Please check your settings in the /config/settings.php file";
	}
	
	
	/* theme data inclusion */
	$theme_not_found = false;
	$theme_data = ROOT."themes/".$settings['use_theme']."/data.php";
	$use_default_theme = "default";
	
	if (!file_exists($theme_data)) {
		if ($settings['use_theme'] != $use_default_theme) $theme_not_found = true;
		$theme_data = ROOT."themes/".$use_default_theme."/data.php";
	}
	
	
	/* include selected theme */
	if (!@include $theme_data) {
		$alert_message[] = "The selected theme <b>".$settings['use_theme']."</b> could not be found<br />";
		if ($theme_not_found) $alert_message[] = "Also, the <b>default</b> theme is not in the themes folder<br />";
		$alert_message[] = "Please check and/or reinstall the themes.";
	}
	
	
	/* theme assignment */
	$selected_theme = $settings['use_theme'];
	
	
	/* check if default gallery is set and if it exists */
	$g_default_name_exists = (file_exists("galleries/".$settings['gallery_default_name'])) ? "true" : "false";
	
	
	/* discover locale */
	$default_language = "en";
	$locale_string = (empty($_SERVER['HTTP_ACCEPT_LANGUAGE']))
		? $default_language
		: substr($_SERVER['HTTP_ACCEPT_LANGUAGE'],0,2);
	
	
	/* import language file */
	$set_language = $settings['set_language'];
	
	if ($settings['auto_set_language'] && file_exists(ROOT.'languages/'.$locale_string.'.php')) {
		$set_language = $locale_string;
	} else if (!file_exists(ROOT.'languages/'.$set_language.'.php')) {
		if (file_exists(ROOT.'languages/'.$default_language.'.php')) {
			$set_language = $default_language;
		} else {
			$alert_message[] = "There's a problem with the language files. Please check the /languages/ folder for suitable files, or reinstall if not found.";
		}
	}
	
	if (isset($_GET["lang"])) $set_language = htmlentities($_GET["lang"]);
	$langfile = ROOT.'languages/'.$set_language.'.php';
	require_once($langfile);
	
	/* check version of GD libraries */
	if (function_exists('gd_info')) {
		$gda = gd_info();
		$gd['version'] = $gda['GD Version'];
		//ereg is deprecated
                //$gd['num'] = ereg_replace('[[:alpha:][:space:]()]+','',$gda['GD Version']);
                $gd['num'] = preg_replace('/[[:alpha:][:space:]()]+/', '', $gda['GD Version']);
		$gd['freetype'] = $gda["FreeType Support"];
		$gd['gif_read'] = $gda["GIF Read Support"];
		$gd['gif_make'] = $gda["GIF Create Support"];
		$gd['jpg'] = $gda["JPEG Support"];
		$gd['png'] = $gda["PNG Support"];
		//$gd['t1lib'] = $gd_array["T1Lib Support"];
		//$gd['wbmp'] = $gd_array["WBMP Support"];
		//$gd['xbm'] = $gd_array["XBM Support"];
	
		$gd_info = '';
		foreach ($gda as $key => $val) { $gd_info .= $key.'='.$val.'; '; };
		if ($settings['thumbnail_debug']) { $alert_message[] = $gd_info; };
	}
	
	
	/* let user know we're not caching images due to
	 * /cache/ folder not being writable */
	if ($settings['thumbnail_debug']
		&& $settings['create_thumbnails']
		&& !is_writable(ROOT.'cache/')
		) {
		$alert_message[] = "Images are not being cahed. /cache/ directory must be writable (chmod 0777) for caching images and thumbnails.";
	}
	
	
	
	/* menu width */
	$menu_width = 300;
	$content_width = $settings['gallery_width'] - $menu_width - 10;
	
	//if select menu
	if ($settings['use_select_menu']) {
		$menu_width = 0;
		$content_width = $settings['gallery_width'] - $menu_width;
	}
	
	
	/* CACHED IMAGE/THUMB/GALLERY PREFIXS
	 * this shall be added to images & thumbnail names and
	 * cached gallery folders */
	$settings['gallery_prefix'] = "cache_";
	$settings['image_prefix'] = "img_";
	$settings['thumbnail_prefix'] = "th_";
	
	
	
	/* width of thumbnails container (relative to gallery width) */
	$thumbs_width = $content_width;
	$make_thumbnails = $settings['create_thumbnails'];
	
	
	/* set size of thumbs according to num of thumbs to be shown */
	$thumb_li_size = floor($thumbs_width/$settings['max_thumbnails'])-20;
	$thumbnail_max_size = (!$settings['use_select_menu'])
		? $thumb_li_size + 1
		: $thumb_li_size + 1;
	
	
	/* max image width */
	$max_image_width = $settings['gallery_width'] - 200;
	
	
	/* show hidden galleries */
	$show_hidden_gallery = (isset($_REQUEST["show"])) ? $_REQUEST["show"] : "";
	
	/* END OF FILE */
?>