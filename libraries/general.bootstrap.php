<?php

/**
 * BOOTSTRAP PROCESSES
 * 
 * this file calls everything that is needed for a page to load properly
 * (work in progress, bear with us)
 */
	
	
	/* LOAD CONFIGURATION */
	
	//// configuration file
	require_once(dirname(dirname(__FILE__))."/config/settings.php");
 	
 	
 	/* GLOBAL CONSTANTS */
	
	//// define absolute path
	define( "ROOT", dirname(dirname(__FILE__)) . "/");
	
	//// gallery absolute URL (defined by the user)
	define( "URL", $settings['minishowcase_url'] . "/" );
	
	//// define path to libraries
	define( "LIBROOT", dirname(__FILE__) . "/");
	
	
	/* LOAD LIBRARIES */
	
	//// general functions
	require_once( LIBROOT . "general.functions.php" );
	
	//// init parameters
	require_once( LIBROOT . "general.init.php" );
	
	/* END BOOTSTRAP */
?>