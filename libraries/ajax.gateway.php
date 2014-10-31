<?php

 /**
  * AJAX SERVICE GATEWAY
  */
  	
	require_once("general.bootstrap.php");
	
	//error_reporting(E_ALL);
	error_reporting(0);
	
	$base_path = dirname(dirname(__FILE__));
	
	$framework = $settings['use_prototype'];
	$double_encoding = $settings['set_double_encoding'];
	
	if ($settings['use_prototype'] == 1) {
	
		//// USE PROTOTYPE FRAMEWORK
		import_request_variables("g","g_");
		
		$return_value = "";
		
		switch ($g_f)
		{
			case "galleries":
				$return_value = get_galleries();
				break;
				
			case "data":
				$return_value = get_data($g_id);
				break;
				
			case "thumbs":
				$return_value = get_thumbs($g_id, $g_thmin, $g_thmax);
				break;
				
			case "image":
				$return_value = get_image($g_num, $g_img, $g_name);
				break;
			
			default: 
				$return_value = "ERROR";
				break;
		}
		
		print $return_value;
		
	} else {
	
		//// USE CPAINT FRAMEWORK
		require_once("cpaint2.inc.php");
	
		$cp = new cpaint();
		$cp->register('get_galleries');
		$cp->register('get_data');
		$cp->register('get_thumbs');
		$cp->register('get_image');
		$cp->start();
		$cp->return_data();
	
	}
	
	/////////////////////////////////////////////////////////////////////
	
	////// GET GALLERIES //////////////////////
	
	function scan_galleries($folder)
	{
		global $settings;
		global $base_path;
		
		$galleries = array();
		
		// open directory and parse file list
		if ($dh = opendir("$base_path/$folder")) {
		
			// iterate over file list & print filenames
			while (($filename = readdir($dh)) !== false) {
				if ((strpos($filename,".") !== 0)
					&& (strpos($filename,"_") !== 0)
					&& (is_dir("$base_path/$folder/$filename"))
					) {
						// Ignore if this is an FLV thumbnail, we'll display the thumbnail for the FLV video
						if (isFLVThumbnail("$base_path/$folder/$filename"))
							continue;
						
						$galleries[] = $filename;
						
						// We can optionally scan sub-directories too
						if ($settings['show_sub_galleries'])
						{
							$subs = scan_galleries("$folder/$filename");
							foreach ($subs as $sub) {
								$galleries[] = "$filename/$sub";
							}
						}
				}
			}
			// close directory
			closedir($dh);
			
		}
		else
		{
			return $galleries;
		}
		
		$sorting = $settings['gallery_sorting'];
		
		if ($sorting > 5) $sorting = 2;
		
		//// sort files
		$galleries = sortGalleries($galleries, $sorting);	

		return $galleries;
	}	
	
	function get_galleries()
	{
		global $settings;
		global $base_path;
		
		$_double = $settings['set_double_encoding'];
		
		$output = "";
		$galleries = scan_galleries("galleries");
		
		//// sort files
		$galleries = sortGalleries($galleries, $sorting);
		
		if ($galleries != 'null') {
			foreach ($galleries as $key => $filename) {
				$gallery_files = count(scanDirImages("$base_path/galleries/$filename"));
				if ($settings['show_empty_galleries'] || $gallery_files > 0)
				{
					$password = password_exists($base_path, $filename, $settings['password_filename']);
					$output .= $filename.":".$gallery_files.":".$password."|";
				}
			}
		} else {
			$output = "error with sorting "+$sorting;
		}
		
		$encoding = ($_double) ? "utf8" : "";
		
		return_encoded($output, $encoding);
	}
	
	////// GET DATA //////////////////////
	
	function get_data($_id)
	{
		global $settings;
		global $base_path;
		
		$_double = $settings['set_double_encoding'];
		
		$id = ($_double) ? Url_decode($_id) : rawurldecode($_id);
			
		$info = "null";
		
		if (file_exists("$base_path/galleries/$id/".$settings['info_file'])) {
			$info = implode("",file("$base_path/galleries/$id/".$settings['info_file']));
		}
		
		$encoding = ($_double) ? "utf8" : "raw";
		
		return_encoded($info, $encoding);
	}
	
	//// GET THUMBNAILS ////////
	
	function get_thumbs($_id, $th_min, $th_max)
	{
		global $settings;
		global $thumbnail_max_size;
		global $base_path;
		
		$_double = $settings['set_double_encoding'];
		
		$id = ($_double) ? Url_decode($_id) : rawurldecode($_id);
			
		$all_thumbs = array();
		$exif_date = array();
		$thumbs = array();
		$names = array();
		
		// set directory name
		$dir = "$base_path/galleries/$id";
		
		// if thumbnails
		$th_dir = "$base_path/cache/".$settings['gallery_prefix'].$id;
		if (($settings['cache_thumbnails']) && (!is_dir($th_dir))) {
			if ($settings['show_sub_galleries'])
			{
				// Recursively create the sub directories for caching the images
				$folders = split("/", $id);
				$th_dir = "$base_path/cache/".$settings['gallery_prefix'];
				foreach ($folders as $f)
				{
					$th_dir .= "$f/";
					$mthd = mkdir($th_dir, 0777);
					if ($mthd) {
						@chmod($th_dir, 0777);
						@chown($th_dir, fileowner($_SERVER["PHP_SELF"]));
					}
				}
			}
			else
			{
				$mthd = mkdir($th_dir, 0777);
				if ($mthd) {
					@chmod($th_dir, 0777);
					@chown($th_dir, fileowner($_SERVER["PHP_SELF"]));
				}
			}
		}
		
		// open directory and parse file list
		$num = 0;
		if ($dh = opendir($dir)) {
			// iterate over file list & output all filenames
			while (($filename = readdir($dh)) !== false) {
				$pinfo = pathinfo($filename);
				if ((strpos($filename,"_") !== 0)
				&& (strpos($filename,".") !== 0)
				&& (!in_array($filename, $hidden_files))
				&& (in_array(strToLower($pinfo["extension"]),$settings['allowed_extensions']))
				) {
					$full_filename = "$base_path/galleries/$id/$filename";
					
					// Check that this is not a thumbnail for an FLV file
					if (isFLVThumbnail($full_filename))
						continue;
						
					$all_thumbs[] = $filename;
				}
			}
			// close directory
			closedir($dh);
		}
			
		$all_thumbs = sortFiles($all_thumbs, $settings['thumbnail_sorting'], "$base_path/galleries/$id/");
		
		if ($all_thumbs != 'null') {
			for ($num=0; $num<count($all_thumbs); $num++) {
				if ($num >= $th_min && $num <= $th_max) {
					$thumbs[] = $all_thumbs[$num];
				}
			}
		} else {
			$output = "error with sorting ("+$settings['thumbnail_sorting']+")";
			$encoding = ($_double) ? "url" : "raw";
			return_encoded($output, $encoding);
			exit;
		}
		
		$names = $thumbs;
		
		if (count($thumbs)>0) {
			
			$output = "";
			$n = 0;
			
			foreach ($thumbs as $key => $filename) {
				$img = $filename;
				$caption = $filename;
				$galleryPath = "$base_path/galleries/$id/";
				$thumbnailPath = "$base_path/cache/".$settings['gallery_prefix']."$id/";
				$imgPath = $galleryPath.$img;
				$imageThumb = $thumbnailPath.$settings['thumbnail_prefix'].$img;
				$thumb = (file_exists($imageThumb)) ? "1" : "0";

				$size = @getimagesize($imgPath, $info);
				// For the video, set to a fixed size
				if (isFLV("../".$img))
					$size = array($settings['video_size_width'], $settings['video_size_height']);
				
				// Attempt to get the IPTC caption from the image (used by Picasa, etc)
				if ($settings['show_iptc_caption']) {
					if (is_array($info) && isset($info["APP13"])) {
					    $iptc = @iptcparse($info["APP13"]);
						if (is_array($iptc)) {
							$caption = $caption . ": " . $iptc["2#120"][0]; 
							$caption = str_replace(";", ",", $caption);
							$caption = str_replace(array(".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".gif", ".GIF"), "", $caption);
						}
					}
				}	
				
				//if ($size) {
					$output .= $img.";".$caption.";".$size[0].";".$size[1].";".$thumb."|";
					$n++;
				//}
			}
			
			$output .= $n;
			
		} else {
			$output = "null";
		}
		
		$encoding = ($_double) ? "url" : "raw";
		
		return_encoded($output, $encoding);
	}
	
	//// GET THUMBNAILS ////////
	
	function get_image($num, $_img, $_name)
	{
		global $settings;
		
		$_double = $settings['set_double_encoding'];
		
		$img = ($_double) ? Url_decode($_img) : rawurldecode($_img);
		$name = ($_double) ? Url_decode($_name) : rawurldecode($_img);
		
		$image_path_array = split("/",$img);
		$image_name = array_pop($image_path_array);
		$gallery_name = array_pop($image_path_array);
		$cached_image = "cache/"
			.$settings['gallery_prefix'].$gallery_name."/"
			.$settings['image_prefix'].$image_name;
		
		$desc = (file_exists("../".$_img.".txt"))
			? file_get_contents("../".$_img.".txt")
			: "null";
			
		if (file_exists("../".$cached_image)) {
			$img = $cached_image;
		}

		$size = @getimagesize("../".$img, $info);
		
		// For the video, set to a fixed size
		if (isFLV("../".$img))
			$size = array($settings['video_size_width'], $settings['video_size_height']);

		// Attempt to get the IPTC caption from the image (used by Picasa, etc)
		if ($settings['show_iptc_caption']) {
			if (is_array($info) && isset($info["APP13"])) {
			    $iptc = @iptcparse($info["APP13"]);
				if (is_array($iptc)) {
					$name = $name . ": " . $iptc["2#120"][0]; 
					$name = str_replace(";", ",", $name);
					$name = str_replace(array(".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".gif", ".GIF"), "", $name);
				}
			}
		}
		
		$output = $num.";".$img.";".$name.";".$size[0].";".$size[1].";".$desc;
		
		$encoding = ($_double) ? "url" : "utf8";
		
		return_encoded($output, $encoding);
	}
	
	//// RETURN DATA
	function return_encoded($value, $mode)
	{
		global $framework;
		
		$encoded_value = '';
		
		switch ($mode) {
			case "url":
				$encoded_value = Url_encode($value);
				break;
			case "utf8":
				$encoded_value = utf8_encode($value);
				break;
			case "raw":
				$encoded_value = rawurlencode($value);
				break;
			default:
				$encoded_value = $value;
				break;
		}
		
		if ($framework==1) {
			print $encoded_value;
			
		} else {
			global $cp;
			$cp->set_data($encoded_value);
			return;
		} 
	}
?>