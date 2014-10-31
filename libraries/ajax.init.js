
/**
 * AJAX INIT VARIABLES
 */
	// error reporting (leave as ZERO or you might run into trouble)
	<?php error_reporting(0); ?>
	
	
	/* JAVASCRIPT EXTRA SETTINGS */
	
	// jump from last block image to next block first image
	var continuous_nav = true;
	
	// load thumbnails one by one
	var use_load_interval = true;
	
	// show ajax loader
	var show_loading_bar = true;
	
	// animate preview panle show/hide
	var animate_preview = false;
	
	// clicking on permalink loads it directly
	var active_permalink = false;
	
	// resize the thumbnail container
	var set_thumbnail_container_height = false;
	
	// set visited galleries to 'visited' color
	var show_visited_galleries = false;
	
	// show image description, if available [[DOES NOT WORK YET]]
	var show_image_description = false;
	
	
	/************************************************************
	 * PRIVATE VARIABLES
	 * DON'T CHANGE ANYTHING BELOW HERE
	 * UNLESS YOU KNOW WHAT YOU'RE DOING, OF COURSE
	 ************************************************************/
	
	/* DEBUG VARIABLES */
	
	var gallery_debug_flag = <?php echo printValue($settings['gallery_debug'])?>;
 	var javascript_debug_flag = <?php echo printValue($settings['javascript_debug'])?>;
 	var thumbnail_debug_flag = <?php echo printValue($settings['thumbnail_debug'])?>;
	//var cache_images = <?php echo printValue($settings['cache_images'])?>;
	var cache_image_size = <?php echo printValue($settings['cache_image_size'])?>;
	var cache_thumb_size = <?php echo printValue($settings['cache_thumb_size'])?>;
	var set_double_encoding = <?php echo printValue($settings['set_double_encoding'])?>;
	var use_select_menu = <?php echo printValue($settings['use_select_menu'])?>;
	var use_double_nav_menu = <?php echo printValue($settings['use_double_nav_menu'])?>;
	var gallery_width = <?php echo printValue($settings['gallery_width'])?>;
	var preview_mode = <?php echo printValue($settings['preview_mode'])?>;
	var slideshow_time = <?php echo printValue($settings['slideshow_seconds'])?>;
	var scale_big_images = <?php echo printValue($settings['scale_big_images'])?>;
	var show_permalink = <?php echo printValue($settings['show_permalink'])?>;
	var number_galleries = <?php echo printValue($settings['number_galleries'])?>;
	var gallery_prefix = <?php echo printValue($settings['gallery_prefix'])?>;
	var image_prefix = <?php echo printValue($settings['image_prefix'])?>;
	var thumbnail_prefix = <?php echo printValue($settings['thumbnail_prefix'])?>;
	var create_thumbnails = <?php echo printValue($settings['create_thumbnails'])?>;
	var cache_thumbnails = <?php echo printValue($settings['cache_thumbnails'])?>;
	var square_thumbnails = <?php echo printValue($settings['square_thumbnails'])?>;
	var large_image_quality = <?php echo printValue($settings['large_image_quality'])?>;
	var max_thumbs = <?php echo printValue($settings['max_thumbnails'])?>;
	var show_gallery_number = <?php echo printValue($settings['show_gallery_number'])?>;
	var show_thumb_name = <?php echo printValue($settings['show_thumb_name'])?>;
	var show_thumb_number = <?php echo printValue($settings['show_thumb_number'])?>;
	var max_thumbnail_rows = <?php echo printValue($settings['max_thumbnail_rows'])?>;
	var numbered_blocks = <?php echo printValue($settings['numbered_blocks'])?>;
	var info_file = <?php echo printValue($settings['info_file'])?>;
	var g_default = <?php echo printValue($settings['gallery_default'])?>;
	var g_default_name = <?php echo printValue($settings['gallery_default_name'])?>;
	
	//// set location
	var base_url = '';
	var base_path = '';
	
	// check browser /////
	agent = navigator.userAgent.toLowerCase();
	mac = (agent.indexOf("mac")!=-1);
	win = (!this.mac) ? true : false;
	msie = (agent.indexOf("msie")!=-1);
	w3c = (document.getElementById) ? true : false;
	iex = (document.all) ? true : false;
	ns4 = (document.layers) ? true : false;
	
	//// spinner image & preloader
	var spinner = new Image();
	var indicator_src = base_url+'images/spinner.gif';
	spinner.src = indicator_src;
	
	//// global active items
	var active_id = '';
	var active_id_files = 0;
	var active_img = '';
	var active_num = 0;
	
	var reloading = false;
	
	var image_list = new Array();
	var images_total = 0;
	var inited = false;
	var last_num = '';
	var showLoader = false;
	var slideshow_flag = false;
	var timeout = undefined;
	
	var delay = undefined;
	var thNum = 1;
	var currentThumb = new Image();
	var currentThumbData = new Object();
	var checkThumb = undefined;
	var loadThumbsInterval = undefined;
	var open_image = false;
	var th_array = new Array();
	var gallery_title_cont = '';
	
	var descriptionOffset = 100;
	
	var elapsed = 0;
	var timerID = undefined;
	var tStart  = null;
	
	var trans = false;
	var transDiv = false;
	var transCallback = undefined;
	
	var currentImage = new Image();
	var currentImageData = new Object();
	
	//// images array
	var id_files = new Array();
	
	//// passwords array
	var id_password = new Array();
	
	var open_first_image = false;
	var query_init = true;
	var preview_open = false;
	var nav_direction_flag = 'next';
	var first_image_in_slideshow_viewed = 0;
	
	//// key navigation ////
	var key_navigation = true;
	var go_to_prev = false;
	var go_to_next = false;
	var pos_orig = new Object();
	pos_orig.l = 20;
	pos_orig.t = 20;
	pos_orig.w = 750;
	pos_orig.h = 550;
	var size_fullscreen = false;
	
	//// query parameters passed back (permalinks)
	var query_parameters = new Array();
	
	var hash = (window.location.hash)
		? window.location.hash.substring(1)
		: false;
	
	if (hash) {
		if (hash.indexOf(":")!=-1) {
			hash_array = hash.split(":");
			query_parameters['g'] = hash_array[0];
			query_parameters['i'] = hash_array[1];
		} else {
			query_parameters['g'] = hash;
		}
	}
	
	// max size of thumbnail
	var square_thumbnail_max_size = 30;
	
	//// pass existent alerts to javascript
	var alert_message = new Array();
	<?php push_elements('alert_message', $alert_message); ?>
	
	//// private variables
	var content_width = <?php echo printValue($content_width)?>;
	var thumbnail_max_size = <?php echo printValue($thumbnail_max_size)?>;
	var theme_menu_hover = <?php echo printValue($theme_menu_hover)?>;
	var max_image_width = <?php echo printValue($max_image_width)?>;
	var g_default_name_exists = <?php echo printValue($g_default_name_exists)?>;
	
	//// calculated variables
	var compact_navigation = (max_thumbnail_rows != 0) ? true : false;
	var th_diff = (max_thumbs*max_thumbnail_rows)-1;
	var th_min = 0;
	var th_max = th_diff;
	var max_image_height = max_image_width;
	
	
	/**** language strings ****/
	var lang = new Array();
	
	<?php
		echo "lang['gallery_name_prepend'] = ";
			echo "unescape('".$settings['gallery_name_prepend']."');\n\t";
		echo "lang['gallery_name_append'] = ";
			echo "unescape('".$settings['gallery_name_append']."');\n\n\t";
		foreach ($lang as $key=>$val) {
			echo "lang['".$key."'] = unescape('".enc($val)."');\n\t";
		}
	?>

	<?php error_reporting(E_ALL); ?>