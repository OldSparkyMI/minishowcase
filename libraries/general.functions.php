<?php

 /**
  * FUNCTIONS
  */

	//// finally let's look for subgalleries!
	//// DOES NOT WORK YET ////
	function check_subgalleries($filepath) {
		$subgalleries_array = scandir_directories($filepath);
		return $subgalleries_array;
	}
	
	/// let's see if there's a password file in the gallery
	function password_exists($base, $id, $file)
	{
		$password = (file_exists("$base/galleries/$id/".$file.".php"))
			? file_get_contents("$base/galleries/$id/".$file.".php")
			: "";
		return strip_tags($password);
	}
	
	//// encode source for proper javascript interpreting
	function enc($source)
	{
		return rawurlencode(htmlentities($source,ENT_NOQUOTES,"UTF-8"));
	}
	
	//// retrieve query parameters
	
	function printQueryParameters($flag)
	{
		if ($flag) {
			$query_string = isset($_SERVER["QUERY_STRING"])
				? $_SERVER["QUERY_STRING"]
				: false;
		
			//if ($query_string) {
			$query = defineQueryParameters($query_string);
			
			/*echo ("<script>
			//// query parameters passed back (permalinks)
			var query_parameters = new Array();\n");*/
			if ($query && count($query)>0) {
				foreach ($query as $key=>$val) {
					echo "\t\tquery_parameters['".$key."'] = '".$query[$key]."'\n";
				}
			}
			/*echo ("\t</script>\n");*/
		}
	}
	
	function defineQueryParameters($query)
	{
		if ($query) {
			$query_divider = "&";
			$query = split($query_divider,$query);
			foreach ($query as $val) {
				$val_split = split("=",$val);
				$query_parameters[$val_split[0]] = $val_split[1];
			}
			return $query_parameters;
		} else return false;
	}
	
	//// force a boolean value
	function printValue($value)
	{
		$return = "";
		if ($value === '') {
			$return = "undefined";
		
		} else if (($value === true)
		|| ($value === "true")
		|| ($value === "TRUE")
		|| ($value === "y")
		|| ($value === "Y")
		|| ($value === "yes")
		|| ($value === "YES")
		|| ($value === "OK")) {
			$return = "true";
			
		} else if (($value === false)
		|| ($value === "false")
		|| ($value === "FALSE")
		|| ($value === "n")
		|| ($value === "N")
		|| ($value === "no")
		|| ($value === "NO")
		|| ($value === "NO")) {
			$return = "false";
			
		} else if (is_int($value)
		|| is_float($value)
		|| is_numeric($value)
		|| ($value===0)) {
			$return = $value;
			
		} else {
			$return = "'$value'";
		}
		
		print($return);
	}
	
	//// sort files
	function sortGalleries($galleries, $sort)
	{
		$sort_flag = true;
		
		switch($sort)
		{
			case 1:
				$sort_flag = natsort($galleries);
				break;
				
			case 2:
				$sort_flag = natcasesort($galleries);
				break;
				
			case 3:
				$sort_flag = rsort($galleries);
				break;
				
			case 4:
				$sort_flag = natsort($galleries);
				if ($sort_flag) $sort_flag = rsort($galleries);
				break;
				
			case 5:
				$sort_flag = natcasesort($galleries);
				if ($sort_flag) $sort_flag = rsort($galleries);
				break;
				
			default:
				$sort_flag = sort($galleries);
		}
		
		if ($sort_flag) return $galleries;
		else return 'null';
	}
	
	//// sort files
	function sortFiles($files, $sort, $path)
	{
		$sort_flag = true;
		
		switch($sort)
		{
			case 1:
				$sort_flag = natsort($files);
				break;
				
			case 2:
				$sort_flag = natcasesort($files);
				break;
				
			case 3:
				$sort_flag = rsort($files);
				break;
				
			case 4:
				$sort_flag = natsort($files);
				if ($sort_flag) $sort_flag = rsort($files);
				break;
				
			case 5:
				$sort_flag = natcasesort($files);
				if ($sort_flag) $sort_flag = rsort($files);
				break;
				
			case 6:
			case 7:
				
				// if PHP was not compiled with EXIF support
				// or exif_read_data() is not defined
				if (!function_exists('exif_read_data')) {
					$files = sortFiles($files, '0', $path);
				
				// if PHP was compiled with EXIF support
				} else {
					$files = sortFilesEXIFData($files, $sort, $path);
				}
				
				$sort_flag = (!$files) ? false : true;
				break;
				
			default:
				sort($files);
		}
		
		if ($sort_flag) {
                    return $files;
                }
                return 'null';
	}
	
	
	function sortFilesEXIFData($files, $sort, $path)
	{
		$sort_flag = false;
		
		$exif_date = array();
		$exif_file = array();
		$files_sorted = array();
		
		foreach ($files as $key => $file) {
			$exif = exif_read_data($path.$file,0,true);
			
			if (!$exif) return false;
			
			$exif_file[$key] = $file;
			$exif_date[$key] = date("YmdHis",$exif['FILE']['FileDateTime']);
		}
		
		if ($sort == 6) {
			$sort_flag = array_multisort($exif_date, SORT_ASC, $exif_file, SORT_ASC, $files);
		} else {
			$sort_flag = array_multisort($exif_date, SORT_DESC, $exif_file, SORT_DESC, $files);
		}
		
		if ($sort_flag) return $files;
		else return false;
	}
	
	
	function scanDirImages($path)
	{
		global $settings;
		
		if (!is_dir($path)) return 0;
		$list=array();
		$directory = @opendir($path);
		while ($file = @readdir($directory))
		{
			if (($file <> ".") && ($file <> ".."))
			{
				$f = $path."/".$file;
				
				//replace double slashes
				$f = preg_replace('/(\/){2,}/','/',$f);
				$pinfo = pathinfo($f);
				if(is_file($f)
					&& (strpos($file,".") !== 0)
					&& (strpos($file,"_") !== 0)
					&& (!in_array($file, $settings['hidden_files']))
					&& (in_array(strToLower($pinfo["extension"]),$settings['allowed_extensions']))
					&& !isFLVThumbnail($f)
					) {
					$list[] = $f;
				}
			}
		}
		@closedir($directory);
		return $list;
	}
	
	function scanDirFirstImage($path)
	{
		global $settings;
		
		if (!is_dir($path)) return 0;
		$list="";
		$directory = @opendir($path);
		while ($file = @readdir($directory))
		{
			if (($file <> ".") && ($file <> ".."))
			{
				$f = $path."/".$file;
				
				//replace double slashes
				$f = preg_replace('/(\/){2,}/','/',$f);
				$pinfo = pathinfo($f);
				if(is_file($f)
					&& (strpos($file,".") !== 0)
					&& (strpos($file,"_") !== 0)
					&& (!in_array($file, $settings['hidden_files']))
					&& (in_array(strToLower($pinfo["extension"]),$settings['allowed_extensions']))
					) {
					$list = $pinfo['basename'];//$f;
					break;
				}
			}
		}
		@closedir($directory);
		return $list;
	}
	
	function scandir_recursive($path)
	{
		if (!is_dir($path)) return 0;
		$list = array();
		$directory = @opendir($path);
		while ($file = @readdir($directory))
		{
			if (($file <> ".") && ($file <> ".."))
			{
				$f = $path."/".$file;
				
				//replace double slashes
				$f = preg_replace('/(\/){2,}/','/',$f);
				if(is_file($f)) $list[] = $f;
				
				//RECURSIVE CALL
				if(is_dir($f))
					$list = array_merge($list ,scandir_recursive($f));
			}
		}
		@closedir($directory);
		return $list;
	}
	
	function build_select_menu($options)
	{
		$out = "";
		
		for ($i=0; $i<count($options); $i++) {
			$out .= '<option value="'
				.$options[$i].'">'.$options[$i]
				.'&nbsp;&nbsp;&nbsp;&nbsp;</option>\n\t';
		}
		
		print $out;
	}
	
	function push_elements($str,$alert_message)
	{
		$out = "";
		
		if (count($alert_message)>0) {
			for ($i=0; $i<count($alert_message); $i++) {
				$out .= "$str.push('".$alert_message[$i]."');\n\t";
			}
		}
		
		print $out;
	}
	
	function get_include_contents($file)
	{
		extract($GLOBALS);
		if (is_file($file)) {
			ob_start();
			include $file;
			$contents = ob_get_contents();
			ob_end_clean();
			return $contents;
		}
		return false;
	}
	
	///// URL ENCODE + UTF-8
	function Url_encode($content)
	{
		return rawurlencode( utf8_encode( $content ) );
	}
	
	///// URL DECODE + UTF-8
	function Url_decode($content)
	{
		return utf8_decode( rawurldecode( $content ) );
	}
	
	//// alternate mime_content_type() function
	if (!function_exists('mime_content_type')) {
		function mime_content_type ( $f )
		{
			return trim(exec('file -bi '.escapeshellarg($f)));
		}
	}
	
	//// debug print array
	function echo_r($var)
	{
		print("<pre>");
		print_r($var);
		print("</pre>");
	}
	
	/* NOT USED YET */
	function safeInput($value){
		$value = htmlspecialchars(trim($value));
		if (get_magic_quotes_gpc()) 
			$value = stripslashes($value);
		return $value;
	}
	
	// Check if a file is an FLV video
	function isFLV($filename){
		if (strpos(strtolower($filename), "flv") !== FALSE)
			return true;
		return false;
	}
	
	// Get the jpg thumbnail associated with an FLV video (if none, returns empty string)
	function getFLVThumbnail($filename)
	{
		$thumbnail = "";
		$img = $filename;
		if (isFLV($img)) {
			if (strpos($img, "flv") !== FALSE)
				$img = str_replace(".flv", ".jpg", $img);
			else
				$img = str_replace(".FLV", ".JPG", $img);
				
			if (file_exists($img))
				$thumbnail = $img;
		}
		return $thumbnail;
	}
	
	// Checks if an image is a thumbnail for an FLV video
	// This is useful because generally you want to display the thumbnail for the FLV video
	function isFLVThumbnail($filename)
	{
		$img = $filename;
		if (strpos(strtolower($img), "jpg") !== FALSE) {
			if (strpos($img, "jpg") !== FALSE)
				$img = str_replace(".jpg", ".flv", $img);
			else
				$img = str_replace(".JPG", ".FLV", $img);
			
			if (file_exists($img))
				return true;
		}
		return false;
	}
        
        // Checks if zip support can be enabled
        // and checks if zip support should be enabled
        function isZIPActivated(){
            global $settings;
            return extension_loaded("zip") && $settings['include_zip_files'];
        }
        
        // Returns true if the filename/file is a zip file
        function isZIPFile($filename){
            $file = new SplFileInfo($filename);
            if ($file->getExtension() === "zip"){
                return true;
            }
            return false;
        }
        
        // Counts the available images/video files in the zip file
        function countZIPFileContent($pathToZIPFile){
            return count(getZIPFileContent($pathToZIPFile));
        }
        
        // returns all video  and image files from the zip
        // directories remains!
        function getZIPFileContent($pathToZIPFile){
            global $settings;
            $availableFiles = array();
            $za = new ZipArchive(); 
            $za->open($pathToZIPFile);
            for( $i = 0; $i < $za->numFiles; $i++ ){
                $stat = $za->statIndex( $i );
                //only allow files supported by the allowed_extendsions settings
                if (in_array(strtolower((pathinfo($stat['name'])["extension"])), $settings['allowed_extensions'])){
                    $availableFiles[] = $stat['name'];
                }
            }
            $za->close();
            return $availableFiles;
        }
        
        function getDirectoryFileContent($pathToDirectory){
            global $settings;
            $files = array();
            $dh = opendir($pathToDirectory);
            if (!is_null($dh)) {
                // iterate over file list & output all filenames
                while (($filename = readdir($dh)) !== false) {
                    $pinfo = pathinfo($filename);
                    if ((strpos($filename,"_") !== 0)
                    && (strpos($filename,".") !== 0)
                    && (in_array(strToLower($pinfo["extension"]),$settings['allowed_extensions']))
                    ) {
                            $full_filename = "$base_path/galleries/$id/$filename";

                            // Check that this is not a thumbnail for an FLV file
                            if (isFLVThumbnail($full_filename))
                                    continue;

                            $files[] = $filename;
                    }
                }
                // close directory
                closedir($dh);
            }
            
            return $files;
        }
        
        // creates a directory, sets std minishowcase rights (not changed)
        // ToDo: dummy rights - change it!
        function createDirectory($pathToDirectory){
            $mthd = mkdir($pathToDirectory, 0777);
            if ($mthd) {
                    @chmod($pathToDirectory, 0777);
                    @chown($pathToDirectory, fileowner($_SERVER["PHP_SELF"]));
            }
        }
	
?>