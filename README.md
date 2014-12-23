Fork of MiniShowCase from http://minishowcase.net/ v09b142

minishowcase is a small and simple php/javascript online photo gallery, 
powered by AJAX that allows you to easily show your images online,
without complex databases or coding, allowing to have an up-and-running
gallery in a few minutes.

#Features
 * TreeView for the gallery directories
 * IPTC Captions from http://www.briancbecker.com/blog/projects/minishowcase-mod/
 * FLV Support from http://www.briancbecker.com/blog/projects/minishowcase-mod/
 * Rotates thumbnails after exif data

#BasedOn
* Original based on http://minishowcase.net/ v09b142
* Further based on http://www.briancbecker.com/blog/projects/minishowcase-mod/ v09b142

#Icons
* Plus/Minus Icon from http://www.famfamfam.com/

#ToDos & upcomming features:
* BuildIn Zip-Support
  * Zip-File should be treated as a normal directory
  * FLV Support
* Implement download functionality 
* Checkout http://people.via.ecp.fr/~jm/minishowcase-jm.html
* Correct subdirectory image count
* HTML5 Video support

#ChangeLog
* v2014-12-22-2:
  * [unread] ZIP support (untouched)
  * rotate thumbnails automatically from exif data
* v2014-12-22:
  * [unread] ZIP support
   This comit is for backup purpose
   If you activate ZIP support in the settings.php you will currently see
    * ZIP-Files as directory
    * ZIP-File image count
    * Preview/thumbnails won't work
* v2014-11-05:
  * not for use!!!
  * Bugfixes
  * add in #galleries_menu a class to set the style for tree or the default view and change the styles!
  * TreeView optimizations
  * click on +/- will open/close the folder

* v2014-11-02:
  * Reenable $settings['show_empty_galleries'] = true;
  * More Galleryviews:
    * TreeView
    * DefaultView
    * PseudoTreeView
 
* v2014-10-31:
  * Updates for PHP 5.3
  * JQuery integration
  * Gallery treeview