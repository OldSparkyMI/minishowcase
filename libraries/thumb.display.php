<?php

require_once("ImageHelper.php");

/**
  * THUMBS DISPLAY
  */

	//// import init file ////
	require_once("general.bootstrap.php");
	
	//// debug mode
	$th_debug_flag = false;//$settings['thumbnail_debug'];
	
	$error_msg = '';
	$center_image = true;
	
	// debug
	$th_debug = (isset($settings['thumbnail_debug']))
		? $settings['thumbnail_debug']
		: false;
	
	// check if image path is encoded
	$en = (isset($_GET["en"]))
		? true
		: false;
	
	//// receives the original image as [?img=relative/path/to/image.jpg] ////
	// get image path
	$img = false;
	if (isset($_GET["img"])) {
		if ($settings['set_double_encoding']) {
			$img = "../".Url_decode(htmlentities($_GET["img"]));
		} else {
			$img = "../".str_replace("\\","",htmlentities($_GET["img"]));
		}
	} else {
		$img = false;
	}
	
	// check if big image to cache
	$pic = (isset($_GET["pic"]))
		? true
		: false;
	
	$_prefix = ($pic)
		? $settings['image_prefix']
		: $settings['thumbnail_prefix'];
	
	// image is square?
	$sq = (isset($_GET["sq"]))
		? htmlentities($_GET["sq"])
		: false;
	
	// image is preview thumbnail
	$pr = (isset($_GET["pr"]))
		? htmlentities($_GET["pr"])
		: false;
	
	// image max size
	$img_maxsize = (isset($_GET["max"])) ? htmlentities($_GET["max"]) : 80;
	
	// image quality
	$img_quality = (isset($_GET["q"]))
		? htmlentities($_GET["q"])
		: (($sq)
			? (($pr)
				? $settings['preview_thumbnail_quality']
				: $settings['thumbnail_quality'])
			: $settings['thumbnail_quality']);
	
	// cache thumbnail
	$cache_thumb = (isset($_GET["c"]))
		? true
		: false;
	
	// delete existing thumbnail
	$unlink = (isset($_GET["u"]))
		? true
		: false;
	
	$thumb = '';	
	$image = '';
	
	//// cache images (if enabled)
	if ($settings['gallery_sorting'])
	{
		// This might not be the best way to go about it, but it seems to work
		$current_gallery = str_replace("../galleries/", "", dirname($img));
	}
	else
	{
		//    \|/Doesn't deal with the nested sub folders
		$current_gallery = array_pop(split("/", dirname($img)));
	}
	$cache_thumb_dir = "../cache/"
		.$settings['gallery_prefix']
		.$current_gallery;	
	
	$img_load = $img;
        
	// If we have a flash video, see first if we have a thumbnail to go with it
	if (strpos(strtolower($img), "flv") !== FALSE)
	{
		if (strpos($img, "flv") !== FALSE)
			$img = str_replace(".flv", ".jpg", $img);
		else
			$img = str_replace(".FLV", ".JPG", $img);
			
		$img_load = $img;
		
		if (!file_exists($img))
		{
			// Guess there is no thumbnail, just load camcorder version.
			$img_load = "../images/camcorder_1.jpg";
		}
	}
	
        // in img_load is the path to the image
        // so init our ThumbnailHelper
        $imageHelper = new ImageHelper($img_load, $settings);
        
	if ($imageHelper->isImageUsable()) {
		
            //// resize image ////
            $th_w = $imageHelper->getThumbnailWidth();
            $th_h = $imageHelper->getThumbnailHeight();
            $move_w = $move_h = 0;
            $w = $h = 0;

            if ($imageHelper->isLandscape()) {

                    //// Landscape Picture ////
                    if ($imageHelper->isSquare()) {
                            $h = $img_maxsize;
                            $w = (($th_w * $h) / $th_h);
                            $move_w = (($th_w - $th_h) / 2);
                            $w = $img_maxsize;
                            $th_w = $th_h;
                    } else {
                            $w = $img_maxsize;
                            $h = (($th_h * $w) / $th_w);
                    }

            } else {

                    //// Portrait Picture ////
                    if ($imageHelper->isSquare()) {
                            $w = $img_maxsize;
                            $h = (($th_h * $w) / $th_w);
                            $move_h = (($th_h - $th_w) / 2);
                            $h = $img_maxsize;
                            $th_h = $th_w;
                    } else {
                            $h = $img_maxsize;
                            $w = (($th_w * $h) / $th_h);
                    }
            }

            //// create thumbnail ////
            $thumb = imagecreatetruecolor($w, $h);
            imagefill($thumb, 255, 255, 255);
            
            // create image and rotate
            $image = $imageHelper->getImage();
        } else {
            $error_msg = "!! BAD IMG";
            $error = error_get_last();
            if (is_array($error)){
                $error_msg .= " - ".$error['message'];
            }
        }
	
	
	//// if there's an error reading the original image
	//// output an error image
	// see if it failed
	if (!$th_debug_flag && (!$image | $image=='' | $error_msg!='')) {
		
		// do not cache
		$cache_thumb = '';
		$error_size = $img_maxsize;
		// create a white image
		$thumb  = imagecreatetruecolor($error_size, $error_size);
		$lightgrey = imagecolorallocate($thumb, 234, 234, 234);
		$grey = imagecolorallocate($thumb, 66, 66, 66);
		$black  = imagecolorallocate($thumb, 0, 0, 0);
		$white  = imagecolorallocate($thumb, 255, 255, 255);
		$orange  = imagecolorallocate($thumb, 255, 66, 0);
		$bg_color = $grey;
		$fg_color = $white;
		imagefilledrectangle($thumb, 0, 0, $error_size, $error_size, $bg_color);
			
		// output an errmsg
		$fnum = ($img_maxsize >= 70) ? 2 : 1;
		$msg_height = 12;
		$msg_array = explode(":",$error_msg);
		for ($i=0; $i<count($msg_array); $i++) {
			imagestring($thumb, $fnum, 2, 2+($msg_height*$i), $msg_array[$i], $fg_color);
		}
	
		/// up the image quality
		$img_quality = 100;
		
	} else {
		$created = imagecopyresampled($thumb, $image, 0, 0, $move_w, $move_h, $w, $h, $th_w, $th_h);
		
	}
	
	$thumb_url = $cache_thumb_dir."/"
		.$_prefix
		.basename($img);
		
	if ($unlink) $delete = @unlink($thumb_url);
        
	if ($cache_thumb) {
		$thumbCreated = imagejpeg($thumb, $thumb_url, $img_quality);
	}
	
	//// display created image ////
	header("Content-type: image/jpeg");
	imagejpeg($thumb, NULL, $img_quality);
	
	//// destroy images (free memory)
        //// ToDo: somethimes this is a string (e.g. if we got german umlauts
        //// in the path) --> we can't destroy the image
        //// but this shouldn't be a problem, because imagejpeg is used with
        //// null and we only store the image in memory
	imagedestroy($image);
	imagedestroy($thumb);
	
	/* END */
?>