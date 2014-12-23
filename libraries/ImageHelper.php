<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Handles all the thumbnails functionality
 * (sooner or later)
 *
 * @author maik
 */
require_once 'general.functions.php';
require_once '../config/settings.php';

class ImageHelper {
    
    /**
     * The path to the original image
     * @var type 
     */
    protected $path;
    
    /**
     * Settings holder
     */
    protected $settings;
    
    /**
     * Stores some information about the image
     * @var type
     */
    protected $img_info;
    
    /**
     * 
     */
    protected $img_types = array(
		"",
		"GIF",
		"JPG",
		"PNG",
		"SWF",
		"PSD",
		"BMP",
		"TIFF",
		"TIFF",
		"JPC",
		"JP2",
		"JPX",
		"JB2",
		"SWC",
		"IFF",
		"WBMP",
		"XBM",
		"FLV"
	);
    
    /**
     * We need to know the path to our image!
     * @param type $path
     */
    function __construct($path, $settings) {
        $this->path = $path;
        $this->settings = $settings;
        
        //// get image size ////
        if ($this->imageFileExists()){
            $this->img_info = getimagesize($path);
        }
    }

    /**
     * Returns the given image path
     * @return type
     */
    function getPath() {
        return $this->path;
    }
    
    /**
     * Returns true if we can use the image and everything were loaded correctly
     * @return type
     */
    function isImageUsable(){
        return $this->imageFileExists() && is_array($this->img_info);
    }
    
    /**
     * Returns true, if the image exists
     */
    function imageFileExists(){
        
        if ($this->path){
            // check if zip
            if(isZIPActivated() && isZIPFile(substr($this->path, 0, stripos($this->path, '.zip/')+4))){
                return true;
            }
            
            // check if normal file
            if (file_exists($this->path)){
                return true;
            }
        }
        return false;
    }
    
    function rotateImage($image){
        
        //// rotate thumbnail after exif data ////
        if ($this->settings['rotate_thumbnails'] == true && $image && function_exists('exif_read_data')){

            // get exif information
            $exif = exif_read_data($this->path);

            // switch after orientation
            if (!empty($exif['Orientation'])){
                switch ($exif['Orientation']){
                    case 3:
                        $image = imagerotate($image, 180, 0);
                        break;

                    case 6:
                        $image = imagerotate($image, -90, 0);
                        break;

                    case 8:
                        $image = imagerotate($image, 90, 0);
                        break;
                }
            }
        }
        
        return $image;
    }
    
    /**
     * Returns the image loaded from disk
     * 
     * @param type $img_type == JPG, GIF, PNG
     * @return type
     */
    function getImage(){
        $image = '';
        
        if(true){
            // load image from disk
            $image = $this->getImageFromDisk();
        }else{
            // load image from ZIP-File
            $image = $this->getImageFromZIP();
        }
        
        return $this->rotateImage($image);
    }
    
    /**
     * Returns the type of the image
     * @return type
     */
    function getImageType(){
        return $this->img_types[$this->img_info[2]];
    }
    
    function getThumbnailWidth(){
        return $this->img_info[0];
    }
    
    function getThumbnailHeight(){
        return $this->img_info[1];
    }
    
    function isLandscape(){
        return $this->getThumbnailWidth() >= $this->getThumbnailHeight();
    }
    
    function isPortrait(){
        return $this->getThumbnailWidth() < $this->getThumbnailHeight();
    }
    
    function isSquare(){
        return $this->getThumbnailWidth() == $this->getThumbnailHeight();
    }
    
    /**
     * Loads a native image from disk
     */
    protected function getImageFromDisk(){
        $image = '';
        $img_type = $this->getImageType();
        if (($img_type == "JPG") && (imagetypes() & IMG_JPG)) {
                $image = imagecreatefromjpeg($this->path);
        } else if (($img_type == "GIF") && (imagetypes() & IMG_GIF)) {
                $image = imagecreatefromgif($this->path);
        } else if (($img_type == "PNG") && (imagetypes() & IMG_PNG)) {
                $image = imagecreatefrompng($this->path);
        }
        
        return $image;
    }
    
    /**
     * Not Implemented
     * @return string
     */
    protected function getImageFromZIP(){
        return '';
    }
}
