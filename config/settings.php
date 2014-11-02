<?php

/**
 * SETTINGS FILE
 * change this variables according to your personal likings
 */
 	
 	
 	/**** DEBUG FLAGS **************************************/
 	
 	/* NOTE: some of these debug flags are not hooked up yet */
 	
 	/* GALLERY DEBUG FLAG
	 * VALUES: [ true | false ]
 	 * if set to 'true' some GALLERY debug info will be shown
 	 * NOTE: debug support is being added, so limited
 	 * debug information might be offered now */
 	$settings['gallery_debug'] = false;
 	
 	/* AJAX/JAVASCRIPT DEBUG FLAG
	 * VALUES: [ true | false ]
 	 * if set to 'true' some AJAX debug info will be shown
 	 * NOTE: debug support is being added, so limited
 	 * debug information might be offered now */
 	$settings['javascript_debug'] = false;
 	
 	/* THUMBNAIL DEBUG FLAG
	 * VALUES: [ true | false ]
 	 * if set to 'true' some THUMBNAIL debug info will be shown
 	 * NOTE: debug support is being added, so limited
 	 * debug information might be offered now */
 	$settings['thumbnail_debug'] = false;


	
	/*** MENU VARIABLES ****************************************/
	
	
	/* use select menu instead of lateral gallery menu
	 * VALUES: [ true | false ] 
	 * NOTE: if you change this setting all your thumbnails
	 * will be resized. please rebuild them afterwards */
	$settings['use_select_menu'] = false;
	
	/* use double thumb navigation menu
	 * VALUES: [ true | false ] 
	 * if set to 'true' the thumbnail numeric navigation menu
	 * will also appear at the bottom of the thumbnails */
	$settings['use_double_nav_menu'] = false;
 	
  	
  	
  	/**** INCLUDE VARIABLES **************************************/
  	
  	/* absolute url of index.php file
	 * VALUES: [ <http://url> ]
  	 * EXAMPLE: 'http://minishowcase.frwrd.net/path/to/gallery'
  	 * (need to set for proper gallery inclusion in a website)
 	 * NOTE: DON'T ADD A SLASH AT THE END!! */
 	$settings['minishowcase_url'] = ".";
 	
  
	
	/**** LANGUAGE ***********************************************/
	
	/* language to be used
	 * VALUES: [ <IANA language code> ]
	 * NOTE: make sure the language file is in the
	 * /languages/ folder */
	$settings['set_language'] = 'de';
	
	
	/* auto select user local language (locale)
	 * VALUES: [ true | false ]
	 * NOTE: if the file for the local language is not
	 * in the /languages/ folder, it'll default to your choice */
	$settings['auto_set_language'] = true;
	
	
	
	/**** SECURITY ****************************************************/
	
	/* password file name
	 * VALUES: [ <string> ]
	 * the name of the file that holds the gallery password
	 * if the file exists inside the gallery folder the gallery will
	 * prompt for the password.
	 * in this case, the gallery will look for a file named 'password.php'
	 * inside the selected gallery folder:
	 * /galleries/<selected_gallery>/password.php
	 * NOTE: BE SURE NOT TO LEAVE SPACES
	 *       AND TO PUT THE PASSWORD IN THE FIRST LINE
	 *       NOT CHANGING THIS NAME RENDERS THE GALLERY VULNERABLE
	 *       DON'T INCLUDE THE .php EXTENSION IN THE NAME */
	$settings['password_filename'] = 'password';
	
	
	
	/**** LOOK & FEEL *************************************************/
	
	/* selected theme
	 * VALUES: [ theme name ] */
	$settings['use_theme'] = 'dark';
	
	
	/* thumbnail style
	 * VALUES: [ true | false ]
	 * 'true' will give you centre-cropped square thumbnails and
	 * 'false' will keep the aspect ratio and won't crop the image */
	$settings['square_thumbnails'] = true;
	
	
	/* max thumbnails in a row
	 * VALUES: [ <number> ]
	 * the gallery automatically asigns a size to
	 * the thumbnails depending on this number */
	$settings['max_thumbnails'] = 6;
	
	
	/* max thumbnail rows per page
	 * VALUES: [ <number> ]
	 * set to 0 if you want to show all thumbanils
	 * NOTE: activates thumbnail compact block navigation
	 * if the total number of thumbnails is greater than
	 * the displayed number */
	$settings['max_thumbnail_rows'] = 4;
	
	
	/* SCALE BIG IMAGE PREVIEW
	 * VALUES: [ true | false ]
	 * outputs a php scaled image in the preview pane */
	$settings['scale_big_images'] = true;
	
	
	/* QUALITY OF GALLERY THUMBNAILS
	 * VALUES: [ <number 0-100> ]
	 * generated by the gallery
	 * quality values (quality/compression) go between 
	 * 0 (worst quality / maximum compression) and
	 * 100 (best quality / minimum compression)
	 * therefore the lower the number, the more compressed the image
	 * and thus the lesser the quality and the smaller the file */
	$settings['thumbnail_quality'] = 70;
	
	
	/* QUALITY OF NAVIGATION THUMBNAILS
	 * VALUES: [ <number 0-100> ]
	 * quality values are as in $settings['thumbnail_quality'] (above) */
	$settings['preview_thumbnail_quality'] = 40;
	
	
	/* QUALITY OF SCALED PREVIEW IMAGE
	 * VALUES: [ <number 0-100> ]
	 * quality values are as in $settings['thumbnail_quality'] (above)
	 * NOTE: used only if $settings['scale_big_images'] is set to true */
	$settings['large_image_quality'] = 80;
	
	
	/* MAKE THE MAIN GALLERY MENU SCROLLABLE
	 * VALUES: [ true | false ]
	 * use if you have many galleries and
	 * your menu gets too long */
	$settings['scroll_menu'] = false; /* DOES NOT CURRENTLY WORK */
	
	
	
	/**** GALLERY SETTINGS ***************************************/
	
	
	/* title of the gallery
	 * VALUES: [ <text> ]
	 */
	$settings['gallery_title'] = 'minishowcase | gallery';
	
	
	/* width of gallery container
	 * VALUES: [ <number (pixels)> ] */
	$settings['gallery_width'] = 1200;
	
	
	/* open gallery on load
	 * VALUES: [ true | false ]
	 * (defaults to the first one if none selected in the next setting
	 * or if the selected one does not exist) */
	$settings['gallery_default'] = false;
	
	
	/* gallery name to default to
	 * NOTE: IT DOES NOT WORK WITH GALLERY NAMES THAT CONTAIN SPACES
	 * ALWAYS USE UNDERSCORES INSTEAD OF SPACES IN YOUR GALLERY NAMES */
	$settings['gallery_default_name'] = 'venezuela';
	
	
	/* show permanent URL to gallery and image
	 * VALUES: [ true | false ]
	 * NOTE: DOES NOT WORK WITH NON-ASCII CHARACTERS
	 * NOTE: IT DOES NOT WORK WITH GALLERY NAMES THAT CONTAIN SPACES */
	$settings['show_permalink'] = false; /* MIGHT NOT BE VERY STABLE */
	
	
	/* footer content
	 * VALUES: [ <html text> ] 
	 * NOTE: you may use HTML in it, please put a backslash (\) before
	 * any single quote */
	$settings['gallery_footer'] = '';
	
	
	/* gallery information file
	 * VALUES: [ <filename> ] */
	$settings['info_file'] = '_info.txt';
	
        /**
         * Define your gallery type here:
         * VALUES: ['tree','default','expanded']
         * tree = tree view like an file system explorer
         * default = view of the normal minishowcase
         * expanded = default view with indent subdirectories
         */
        $settings['gallery_type'] = 'expanded'; 
	
	/*show/hide images from subdirectories (will be treated as individual galleries in the sorting)
	 * VALUES: [ true | false ]
	 * if you want to be able to show galleries like "Traveling/Europe 2008/Rome" set this to 'true' */
	$settings['show_sub_galleries'] = true;
	
	/*show/hide galleries that have no images in them (quite probable if you have the above setting enabled)
	 * VALUES: [ true | false ]
	 * useful if you have "Traveling/Europe 2008/Rome" gallery, but the "Traveling" directory has no photos
         * you should enable this if you are using gallery_type tree or expanded !!!!! */
	$settings['show_empty_galleries'] = true;	
	
	
	
	
	/**** IMAGE & THUMBNAIL HANDLING *************************************/
	
	
	/* CREATE REDUCED VERSION OF IMAGES ON-THE-FLY
	 * VALUES: [ true | false ]
	 * if true, gallery will create new images out of pics
	 * if false, gallery will present the original picture
	 * NOTE: IF YOUR PHP INSTALL DOESN'T HAVE THE GD LIBRARY
	 * INSTALLED THEN SET IT TO FALSE */
	$settings['cache_images'] = false;
	
	
	/* CACHED IMAGE SIZE
	 * set the max size of cached images
	 * VALUES: [ <number> ] */
	$settings['cache_image_size'] = 800;
	
	
	/* CREATE THUMBNAILS ON-THE-FLY
	 * VALUES: [ true | false ]
	 * if true, gallery will create new thumbnails out of pics
	 * if false, gallery will present a scaled version of the main picture
	 * NOTE: IF YOUR PHP INSTALL DOESN'T HAVE THE GD LIBRARY
	 * INSTALLED THEN SET IT TO FALSE */
	$settings['create_thumbnails'] = true;
	
	
	/* CACHED THUMBNAIL SIZE
	 * set the size of cached thumbnails
	 * VALUES: [ <number> ] */
	$settings['cache_thumb_size'] = 128;
	
	
	/* TRASLUCID VISITED THUMBS
	 * VALUES: [ true | false ]
	 * mark visited thumbs as semi transparent if
	 * they have been seen already 
	 * NOTE: it has only been tested in Safari and Firefox */
	$settings['mark_visited_thumbs'] = false;
	
	
	/* FLV VIDEO SIZE
	 * set the size of the video displayed in the browser
	 * VALUES: [ <number> ] */
	$settings['video_size_width'] = 480;
	$settings['video_size_height'] = 360;
	
	
	
	
	/**** IMAGE LOADING AND DISPLAYING SETTINGS ******************/
	
	
	/* Gallery menu and Thumbnail sorting (ordering)
	 * VALUES:
	 * 0 : default platform sorting (check it on your platform)
	 * 1 : natural sorting (0833.jpg comes before 2018.jpg)
	 * 2 : natural sorting, case-insensitive (recommended)
	 * 3 : reverse default platform sorting
	 * 4 : reverse natural sorting
	 * 5 : reverse natural sorting, case-insensitive
	 * 6 : EXIF date (not tested thoroughly)
	 * 7 : EXIF date (reverse order, not tested thoroughly) 
	 * NOTE: if PHP was compiled without EXIF support it'll fall back to '0' */
	$settings['gallery_sorting'] = 2;
	$settings['thumbnail_sorting'] = 0;
	
	
	/* set which preview mode you want to use
	 * VALUES (if selected extension is installed):
	 * 0 : Preview (with thumb navigation, default)
	 *     by victor zambrano
	 *     ( http://minishowcase.frwrd.net )
	 *
	 * 1 : Slimbox 1.22 made by by Christophe Beyls
	 *     ( http://www.digitalia.be/software/slimbox )
	 *     some modifications by victor zambrano
	 *
	 * 2 : ThickBox 2.1 made by Cody Lindley
	 *     ( http://jquery.com/demo/thickbox )
	 *     some modifications by victor zambrano
	 *
	 *     ## PLEASE CONTACT THE RESPECTIVE CODER IF YOU
	 *     ## RUN INTO TROUBLE WITH THESE EXTENSIONS
	 */
	$settings['preview_mode'] = 0;
	
	
	/* set alternate (double) encoding for some data transfers
	 * VALUES: [ true | false ]
	 * change if you run into trouble with filename encoding problems */
	$settings['set_double_encoding'] = false;
	
	
	
	
	/**** CAPTIONS AND DESCRIPTIONS ******************************/
	
	
	/* prepend to the gallery name
	 * VALUES: [ <text> ] */
	$settings['gallery_name_prepend'] = 'my';
	
	
	/* append to the gallery name
	 * VALUES: [ <text> ] */
	$settings['gallery_name_append'] = ' Photos and Videos';
	
	
	/* place numbers before the gallery name
	 * VALUES: [ true | false ] */
	$settings['number_galleries'] = false;
	
	
	/* show/hide the gallery's filename prepended number
	 * VALUES: [ true | false ] */
	$settings['show_gallery_number'] = false;
	
	
	/* show the name of the pictures on the thumbnails
	 * VALUES: [ true | false ] */
	$settings['show_thumb_name'] = true;
	
	
	/* show/hide the picture's filename prepended number
	 * VALUES: [ true | false ] */
	$settings['show_thumb_number'] = false;
	
	
	/* use numbers in thumbnail navigation rows
	 * VALUES: [ true | false ]
	 * if you prefer to show the image numbers, set this to 'false' */
	$settings['numbered_blocks'] = true;
	
	/*use the caption stored in the IPTC field of the image (used by Picasa, Photoshop, etc for image captions)
	 * VALUES: [ true | false ]
	 * if you want to show the image captions from Picasa, set this to 'true' */
	$settings['show_iptc_caption'] = true;	
	
	
	
	
	/**** FILE CONFIG ***********************************************/
	// Nothing yet //
	
	
	
	/**** TOOLS SETTINGS ****************************************/
	
	
	/* slide changing time for the slideshow menu
	 * VALUES: [ <number> ] */
	$settings['slideshow_seconds'] = 10;
	
	
	
	
	/**** AJAX FRAMEWORK SETTINGS ****************************************/
	
	/* none yet */
	/* @ToDo add jQuery settings here! */
	
	
	
	/**** PRIVATE SETTINGS ****************************************/
	
	
	/* HIDDEN FILES
	 * list of filenames not to be listed by the gallery
	 * NOTE: this list is case-sensitive */
	$settings['hidden_files'] = array();
	$settings['hidden_files'][] = 'Thumbs.db';
	$settings['hidden_files'][] = '.DS_Store';
	
	
	/* ALLOWED EXTENSIONS
	 * VALUES: [ <extension> ]
	 * list of extensions (formats) allowed by the gallery
	 * just comment out (put two backslashes (//) in front
	 * of the option you want to take out of the list
	 * NOTE: this list is NOT case-sensitive */
	$settings['allowed_extensions'] = array();
	$settings['allowed_extensions'][] = 'jpg';
	$settings['allowed_extensions'][] = 'jpeg';
	$settings['allowed_extensions'][] = 'png';
	$settings['allowed_extensions'][] = 'gif';
	$settings['allowed_extensions'][] = 'flv'; // For movies
	
	
	/* if folder /cache/ is writable and create_thumbnails is TRUE
	 * then cache thumbnails */
	if ($settings['create_thumbnails']
		&& is_writable(dirname(dirname(__FILE__)).'/cache/')
		) {
		$settings['cache_thumbnails'] = true;
	} else {
		$settings['cache_thumbnails'] = false;
	}
	
	/* uncomment if you REALLY don't want to cache thumbnails */
	//$settings['cache_thumbnails'] = false;
	
	
	/*** END OF SETTINGS ****/
?>