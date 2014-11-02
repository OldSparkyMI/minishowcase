
/**
 * AJAX FUNCTIONS
 */

/****************************************************
 * DONT EDIT BELOW HERE
 * UNLESS YOU KNOW WHAT YOU'RE DOING, OF COURSE
 ****************************************************/

//// CPAINT OBJECT (TEXT OUTPUT)
var cp = new cpaint()
cp.set_transfer_mode('get')
cp.set_response_type('text')
if (javascript_debug_flag)
    cp.set_debug(2)


//// PRIVATE EVENT HANDLING ////
window.onload = init;
window.onkeydown = keyNavigation;
window.onresize = (preview_mode == 0)
        ? resizeImageBg
        : function () {
        };

// elect menu show/hide vars
var select_menu = false;
var select_menu_width = 300;


////// FUNCTIONS ////////////////////////////////////////////

//// init functions //////////////////////////////////////////////

function init()
{
    setCurrentPosition();
    resizeImageBg();
    setMaxSizes();
    setGalleries();
    display('gallery_description', 'block');
    innerhtml('gallery_title', lang['menu_guide']);

    if (use_select_menu)
        display('msc_menu', 'none');

    if (alert_message.length > 0)
        showAlert();

    inited = true;
}

function resizeImageBg() {
    setMaxSizes();
    var bg_div = getID('image_bg');
    var pageSize = getPageSize();
    bg_div.style.width = pageSize[2] + "px";
    bg_div.style.height = pageSize[3] + "px";
}


//// set gallery and image paths

function setCurrentPosition()
{
    if (show_permalink) {

        var current_path = '';
        var window_location = window.location.href;
        var window_hash = window.location.hash;

        // strip any permalinks if they exist
        var wl = window.location.href.length
        var whl = window.location.hash.length
        var location = window.location.href.substring(0, wl - whl);

        var current_link = (!active_permalink)
                ? location + '#'
                : '';

        display('image_url', 'block');

        if (active_id) {
            current_link += sendEncoded(active_id.sq(), 'url');
            if (active_img) {
                current_link += ':' + sendEncoded(active_img.sq(), 'url');
            }
        }

        var gallery_name = sendEncoded(active_id.sq(), 'url');

        current_path = '<a id="permalink_a" href="javascript:;" '
                + 'onclick="showPermalink(\'' + current_link + '\');">('
                + lang['permalink'] + ')</a>'

        innerhtml('tools_permalink', current_path);
        innerhtml('image_url', current_path);

        //window.location.hash = gallery_name;
    }
}

function showPermalink(link)
{
    if (!active_permalink) {
        var openWin = prompt(lang['permalink'] + ':#', link);
    } else {
        getID('hash').name = link;
        window.location.hash = link;
        return true;
    }
}

//// check galleries //////////////////////////////////////////////

function setGalleries()
{
    cp.call(base_url + 'libraries/ajax.gateway.php',
            'get_galleries',
            updateGalleries);

    var html = '<span><img src="'
            + indicator_src + '" /> '
            + lang['loading_menu']
            + '...</span>';

    if (use_select_menu) {
        innerhtml('galleries_select', html);
    } else {
        innerhtml('galleries_menu', html);
    }
}

function updateGalleries(request)
{
    if (use_select_menu) {
        updateGalleriesSelect(request);

    } else {
        updateGalleriesMenu(request);
    }
}

function generateTreeGalleryMenu(galleries){
    var ul = document.createElement('ul')

    for (var i = 0; i < galleries.length - 1; i++)
    {
        var galleries_data = galleries[i].split(":");
        var id = galleries_data[0];
        var g_id_files = galleries_data[1];
        var g_password = galleries_data[2];

        id_files[id] = g_id_files;
        id_password[id] = (g_password) ? g_password : '';

        var li = document.createElement('li')
        li.id = 'mitem_' + i;
        li.setAttribute('id', 'mitem_' + i);

        if (number_galleries) {
            var em = document.createElement('em')
            em.innerHTML = zero(i + 1) + '&nbsp;';
            li.appendChild(em);
        }

        // we only need the name of the subdirectory, not the whole path here
        // this is our name we like to display!
        // path/name
        var name = id.substring(id.lastIndexOf('/') + 1, id.length);
        // but we need the path too
        // path/name
        var path = id.substring(0, id.lastIndexOf('/'));

        var a = document.createElement('a')
        a.setAttribute('id', id)
        a.setAttribute('href', 'javascript:;')
        if (!number_galleries)
            a.setAttribute('class', 'nonum')
        a.onclick = function () {
            // show the gallery
            setGallery(this.id.sq(), this)
        }
        a.innerHTML = ''
                + ((g_password) ? '<img class="lock" src="images/lock.gif" alt="" />' : '')
                + galleryName(name)	/* changed id to name */
                + ' <small>(' + g_id_files + ')</small>'

        var div = document.createElement('div');
        var paddingLeft = 13*(id.split("/").length);    //@ToDo - 13 is currently static - change this
        div.style.paddingLeft=paddingLeft+"px";
        div.onclick = function () {
            // show / hide subfolders
            var uls = this.parentNode.getElementsByTagName("ul");
            if (uls.length > 0){
                $(uls[0]).toggle();
                $(this).toggleClass('folderOpened').toggleClass('folderClosed');
            }
        }
        div.appendChild(a);
        li.appendChild(div);

        if (path.length <= 0){
            //in this case we have a top level directory (no parent)
            ul.appendChild(li);
            var m = getID('galleries_menu');
            m.appendChild(ul);
        }else{
            //we have some subdirectory
            //so we have to add the li to another ul from an other li
            //so first try to get the id
            var idx;
            var _id;
            for (idx = i; idx >= 0; idx--){
                if (galleries[idx].split(":")[0] === path){
                    _id = 'mitem_'+idx;
                    break;
                }
            } 
            // we have to add our li to this li
            if (_id){
                var existingLiForNewLi = document.getElementById(_id);
                var divFromExistingLi = existingLiForNewLi.getElementsByTagName('DIV');
                if (typeof divFromExistingLi !== 'undefined' && divFromExistingLi.length > 0){
                   $(divFromExistingLi[0]).addClass('folderClosed');
                    // get x background position
                    var backgroundPosition = $(divFromExistingLi[0]).css("background-position").split(" ");
                    $(divFromExistingLi[0]).css("background-position", 13*(id.split("/").length-2)+"px "+backgroundPosition[1]);
                }
                
                if (existingLiForNewLi){
                    // if there is no ul element
                    // create one
                    if (existingLiForNewLi.getElementsByTagName("UL").length === 0){
                        var newUl = document.createElement('ul');
                        newUl.style.cssText = 'display: none';
                        existingLiForNewLi.appendChild(newUl);
                    }
                    // add the li element to the ul element
                    var uls = existingLiForNewLi.getElementsByTagName("UL");
                    if (typeof uls !== 'undefined' && uls.length > 0){
                        uls[0].appendChild(li);
                    }
                }
            }                
        }
    }
}

function generateDefaultGalleryMenu(galleries, expanded){
    var ul = document.createElement('ul')
			
    for (var i=0; i<galleries.length-1; i++)
    {
        var galleries_data = galleries[i].split(":");
        var id = galleries_data[0];
        var g_id_files = galleries_data[1];
        var g_password = galleries_data[2];

        id_files[id] = g_id_files;
        id_password[id] =  (g_password) ? g_password : '';

        var li = document.createElement('li')
        li.setAttribute('id', 'mitem_'+i)
        if (i>0) li.setAttribute('class', 'topline')

        if (number_galleries) {
                var em = document.createElement('em')
                em.innerHTML = zero(i+1)+'&nbsp;'
                li.appendChild(em)
        }

        var a = document.createElement('a')
        a.setAttribute('id', id)
        a.setAttribute('href', 'javascript:;')
        if (!number_galleries) a.setAttribute('class', 'nonum')
        a.onclick = function() { setGallery(this.id.sq(),this) }
        
        if (expanded === true){
            var nameArray = id.split('/');
            var length = nameArray.length;
            var name = '';
            if (length > 1){
              for(var idx=1; idx < length; idx++){
                name = name + '&nbsp;&nbsp;';
              }
            }
            id = name + '-' + nameArray[length-1];
        }
        a.innerHTML = ''
                +((g_password)?'<img class="lock" src="images/lock.gif" alt="" />':'')
                + galleryName(id)
                +' <small>('+g_id_files+')</small>'

        li.appendChild(a)

        ul.appendChild(li)
    }

    innerhtml('galleries_menu', '');

    var m = getID('galleries_menu')
    m.appendChild(ul)
}

function updateGalleriesMenu(request)
{
    var result = getEncoded(request, 'enc');

    if (result != "null") {

        var galleries = result.split("|");
        var selected = null;
        var menu = "";
        var gallery_list = new Array();

        //empty galleries_menu
        innerhtml('galleries_menu', '');
       
        if ('gallery_type' in settings){
            switch(settings['gallery_type']){
                case 'tree':
                    generateTreeGalleryMenu(galleries);
                    $(galleries_menu).addClass(settings['gallery_type']+"View");
                    break;
                case 'expanded':
                    generateDefaultGalleryMenu(galleries, true);
                    $(galleries_menu).addClass(settings['gallery_type']+"View");
                    break;       
                default:
                    generateDefaultGalleryMenu(galleries, false);
                    $(galleries_menu).addClass("defaultView");
                    break;
            }
        }else{
            $(galleries_menu).addClass("defaultView");
            generateDefaultGalleryMenu(galleries, false);
        }
        

        if (query_parameters['g']) {
            setGallery(query_parameters['g'], false);

        } else if (g_default) {
            if ((g_default_name != '') && (g_default_name_exists)) {
                setGallery(g_default_name, false);
            } else {
                for (i = 0; i < galleries.length; i++) {
                    var g_default_data = galleries[i].split(":");
                    if (g_default_data[1] != "p") {
                        setGallery(g_default_data[0], false);
                        break;
                    }
                }
            }
        }
        // no galleries available
    } else {
        var menu = "";

        menu += '<ul>';
        menu += '<li id="mitem_0">';
        menu += 'no galleries found';
        menu += '</li>';
        menu += '</ul>';

        innerhtml('galleries_menu', menu);
    }
}

function updateGalleriesSelect(request)
{
    var result = getEncoded(request, 'enc');

    if (result != "null") {
        var galleries = result.split("|");
        var selected = null;
        var menu = "";
        var gallery_list = new Array();

        menu += lang['menu_title'] + ': ';
        menu += '<span id="gallery_select_menu">';
        menu += '<select id="select_menu" onchange="setGallery(this.value,false)">';
        menu += '<option value="null">' + lang['menu_guide'] + '</option>';
        for (var i = 0; i < galleries.length - 1; i++)
        {
            var galleries_data = galleries[i].split(":");
            var id = galleries_data[0];
            var g_id_files = galleries_data[1];
            var g_password = galleries_data[2];

            id_files[id] = g_id_files;
            id_password[id] = (g_password) ? g_password : '';

            menu += '<option value="' + id + '">';
            menu += galleryName(id);
            if (g_password)
                menu += ' (password)';
            menu += '</option>';
        }
        menu += '</select>';
        menu += '</span>';

        innerhtml('galleries_select', menu);

        if (query_parameters['g']) {
            setGallery(query_parameters['g'], false);

        } else if (g_default) {
            if ((g_default_name != '') && (g_default_name_exists)) {
                setGallery(g_default_name, false);
            } else {
                for (i = 0; i < galleries.length; i++) {
                    var g_default_data = galleries[i].split(":");
                    if (g_default_data[1] != "p") {
                        setGallery(g_default_data[0], false);
                        break;
                    }
                }
            }
        }

        // no galleries available
    } else {
        var menu = "";

        menu += '<select>';
        menu += '<option value="null">no galleries found</option>';
        menu += '</select>';

        innerhtml('galleries_menu', menu);
    }
}


//// set selected gallery ///////////////////////////////////////

function setGallery(id, link)
{
    if (id_password[id] && id_password[id] != '') {
        gallery_password = prompt('Password:');
        if (gallery_password != id_password[id]) {
            alert('This gallery is password protected, sorry.');
            return false;
        }
    }
    if (!reloading) {
        th_min = 0;

        //// check if we're retrieving all thumbnails or just a block
        if (compact_navigation) {
            th_max = ((th_min + th_diff) < id_files[id])
                    ? (th_min + th_diff)
                    : id_files[id];

        } else {
            th_max = id_files[id];
        }
    } else {
        reloading = false;
    }

    if (active_id != id) {

        //// clean up the globals

        active_id = id;

        active_img = '';
        th_array = Array();
        image_list = Array();

        innerhtml('image_title', '');

        display('msc_image', 'none');

        //display('toolmenu','block');

        if (show_visited_galleries && !use_select_menu) {
            if (link)
                link.style.color = theme_menu_hover;
            else
                getID(id).style.color = theme_menu_hover;
        }

        innerhtml('gallery_title', '<img src="' + indicator_src
                + '" /> <span>' + lang['loading_title'] + '</span><strong>'
                + galleryName(id)
                + '</strong>...');

        getData(id);

        getThumbs(id, th_min, th_max);

        setCurrentPosition();
    }
}

//// get gallery data ///////////////////////////////////////

function getData(id)
{
    display('gallery_description', 'none');
    innerhtml('gallery_description', '');

    cp.call(base_url + 'libraries/ajax.gateway.php', 'get_data', updateData, Url.encode(id));

}

function updateData(request)
{
    var result = getEncoded(request, 'url');
    //Url.decode(request.responseText);

    if (result != 'null') {
        innerhtml('gallery_description', result);
        display('gallery_description', 'block');
    }
}


function getBlockNav(id)
{
    if (compact_navigation
            && (id_files[id] > th_diff)) {
        display('gallery_nav', 'block');
        display('gallery_nav2', 'block');

        var block = '';
        var l = Math.round(id_files[id]) - 1;
        var block_number = 0;

        //// arrow nav
        //block += '<a href="javascript:;">&larr;</a> ';

        var i = 0;
        while (i <= l) {
            var min = i;
            var max = (i + th_diff < l)
                    ? Math.round(i + th_diff)
                    : l;

            var show_min = Math.round(min + 1);
            var show_max = Math.round(max + 1);

            current_block = ((th_min <= i) && (th_max >= i)) ? true : false;

            if (!current_block) {
                block += '<a href="javascript:;" onclick="getThumbs(';
                block += "'" + id.sq() + "', " + min + "," + max;
                block += ')">';
            }

            block_number++;

            if (!numbered_blocks) {
                if (show_min == show_max) {
                    block += ' [' + zero(show_max) + ']';
                } else {
                    block += ' [' + zero(show_min) + ':' + zero(show_max) + ']';
                }
            } else {
                block += ' [' + zero(block_number) + ']';
            }

            if (!current_block)
                block += '</a>';

            i = max + 1;
        }

        //// arrow nav
        //block += ' <a href="javascript:;">&rarr;</a>';

        innerhtml('gallery_block', block);
        innerhtml('gallery_block2', block);

    } else {
        display('gallery_nav', 'none');
        display('gallery_nav2', 'none');
    }
}


//// update thumbs //////////////////////////////////////////////

function getThumbs(id, min, max)
{
    if (compact_navigation) {
        th_min = min;
        th_max = max;
    } else {
        th_min = 0;
        th_max = id_files[id];
    }

    innerhtml('thumbs_cont', '');

    showLoadingBar();

    active_id = id;

    cp.call(base_url + 'libraries/ajax.gateway.php', 'get_thumbs',
            updateThumbs, Url.encode(id), min, max);

    getBlockNav(active_id);
}


function updateThumbs(request)
{
    var result = getEncoded(request, 'url');

    var output = '';
    var total = 0;
    var overwidth = 12;
    var total_width = 0;
    images_total = 0;
    image_list = [];
    thNum = 0;

    gallery_title_cont = '<span class="xtra">'
            + lang['gallery_name_prepend']
            + '</span> <strong>'
            + galleryName(active_id)
            + '</strong> <span class="xtra">'
            + lang['gallery_name_append']

            // reload gallery
            + ' <a href="javascript:;" onclick="active_id=false;reloading=true;setGallery('
            + "'" + active_id.sq() + "', false"
            + ')">(' + lang['gallery_reload'] + ')</a>'

            + '</span>';

    // slideshow
    var slideshow_link = ' <a href ="javascript:;"'
            + ' onclick="startSlideshow();">'
            + '(' + lang['slideshow_name'] + ')</a>'

    display('tools_menu', 'block');
    innerhtml('tools_slideshow', slideshow_link);

    /* gateway internal error reporting: */
    // no images in gallery
    if (result == "null") {
        resetLoadingBar();
        innerhtml('thumbs_cont', '<p class="noimg">' + lang['alert_no_images'] + '...</p>');
        innerhtml('thumbs_load', '');
        innerhtml('gallery_title', gallery_title_cont);

        // show thumbnails
    } else {
        th_array = result.split('|');
        images_total = th_array.pop();

        innerhtml('thumbs_cont', '<ul id="thumbs_ul"></ul>');

        innerhtml('gallery_title', '<img src="' + indicator_src + '" /> ' + gallery_title_cont);

        var thul = getID('thumbs_ul')

        for (i = 1; i <= images_total; i++) {
            var li = document.createElement('li')
            li.setAttribute('id', 'list_' + i)

            var a = document.createElement('a')
            a.setAttribute('id', 'link_' + i)

            var d1 = document.createElement('div')
            d1.setAttribute('id', 'image_' + i)

            var d2 = document.createElement('div')
            d2.setAttribute('class', 'th_load_div')
            d2.innerHTML = 'loading...'

            d1.appendChild(d2)
            a.appendChild(d1)

            if (show_thumb_name) {
                var p = document.createElement('p')
                p.setAttribute('id', 'text_' + i)
                p.innerHTML = '&nbsp;'
                a.appendChild(p)
            }

            li.appendChild(a)
            thul.appendChild(li)

            /*
             var li = '<li id="list_'+i+'">';
             li += '<a id="link_'+i+'">';
             li += '<div id="image_'+i+'">';
             li += '<div class="th_load_div">';
             li += 'loading...'
             li += '</div>';
             li += '</div>';
             if (show_thumb_name) li += '<p id="text_'+i+'">&nbsp;</p>';
             li += '</a>';
             li += '</li>';
             getID('thumbs_ul').innerHTML += li;
             */
            //// loadbar
            updateLoadingBar((i - 1), images_total);
        }

        if (set_thumbnail_container_height) {
            var thContDiv = getID('thumbs_ul');
            thContDiv.style.height = (thContDiv.offsetHeight + 10) + "px";
        }

        if (use_load_interval) {
            thNum = 0;
            var intNum = (msie) ? 1 : 0;
            loadThumbsInterval = setInterval("buildAllThumbs()", intNum);

        } else {
            thNum = 0;
            buildAllThumbs();

        }
    }
}


function buildAllThumbs()
{
    knum = thNum;
    thNum++;
    inum = thNum;

    var output_image = '';
    var output_text = '';

    if (th_array[knum]) {

        //// loadbar
        updateLoadingBar(knum, images_total);

        var image = th_array[knum].split(';');
        var img = image[0];
        var name = imageName(image[1]);
        var w = image[2];
        var h = image[3];
        var thumb = image[4];

        image_list[inum] = new Array();
        image_list[inum]['num'] = inum;
        image_list[inum]['image'] = img;
        image_list[inum]['name'] = name;
        image_list[inum]['w'] = w;
        image_list[inum]['h'] = h;
        image_list[inum]['thumb'] = thumb;

        if (query_parameters['i']
                && query_parameters['i'] == image_list[inum]['image']) {
            open_image = image_list[inum];
        }

        var image_url = base_url + "galleries/" + active_id + "/" + img;

        //// attach onclick method to link
        var alink = getID('link_' + inum);
        alink.name = name;
        alink.title = name;

        if (preview_mode == 1) {
            // Slimbox 1.22 by Christophe Beyls
            alink.href = image_url;
            alink.rel = 'lightbox[' + active_id.sq() + ']';
            alink.style.display = 'none';

        } else if (preview_mode == 2) {
            // ThickBox 2.1 by Cody Lindley
            alink.href = image_url;
            alink.className = 'thickbox';
            alink.rel = active_id.sq();
            alink.style.display = 'none';

        } else {
            alink.href = 'javascript:;';
            alink.num = inum;
            alink.img = img;
            alink.name = name;

            alink.onclick = function () {
                getImage(this.num, this.img, this.filename);
            }
        }

        if (!square_thumbnails) {
            output_image += '<table id="thtable_' + inum + '" '
                    + 'border="0" cellpadding="0" '
                    + 'cellspacing="0" width="100%" height="' + (thumbnail_max_size + 6) + '" '
                    + 'valign="middle" align="center">'
                    + '<tr><td valign="middle" align="center">';
        }

        thumb_div_style = (square_thumbnails)
                ? "width:" + (thumbnail_max_size + 6) + "px;height:"
                + (thumbnail_max_size + 6) + "px;"
                : '';

        output_image += '<div style="' + thumb_div_style + '"'
                + ' id="thcont_' + inum + '">';

        // add image code //
        output_image += '<img id="thimg_' + inum + '"'
                + ' class="thumb_loader"'
                + ' title="' + name + '" alt="' + name + '"'
                + ' src="' + indicator_src + '" />'

        output_image += '</div>';

        if (!square_thumbnails) {
            output_image += '</td></tr></table>';
        }

        if (show_thumb_name) {
            output_text = thumbName(image_list[inum]['name']);
        }

        getID('image_' + inum).innerHTML = output_image;

        if (show_thumb_name)
            getID('text_' + inum).innerHTML = output_text;

        if (set_thumbnail_container_height) {
            var thContDiv = getID('thumbs_ul');
            thContDiv.style.height = (thContDiv.offsetHeight + 10) + "px";
        }

        if (!use_load_interval)
            buildAllThumbs();

    } else {

        clearInterval(loadThumbsInterval);

        thNum = 0;
        addThumbImage();

        if (open_image) {
            getImage(
                    open_image['num'],
                    open_image['image'],
                    open_image['name']
                    );
        }
    }
}

function addThumbImage()
{
    thNum++;
    var inum = thNum;

    updateLoadingBar(inum, images_total);

    if (image_list[inum]) {
        var thumbPath = '';
        if (image_list[inum]['thumb'] != '1') {
            if (create_thumbnails) {

                // cache_thumb_size = max thumb size when cached
                thumbPath = base_url
                        + 'libraries/thumb.display.php?'
                        + 'max=' + cache_thumb_size + '&img='
                        + base_url + 'galleries/' + setUrlEncoding(active_id) + '/'
                        + setUrlEncoding(image_list[inum]['image']);

                if (cache_thumbnails)
                    thumbPath += '&c=1';

                if (square_thumbnails)
                    thumbPath += '&sq=1';

            } else {
                thumbPath = base_url
                        + 'galleries/' + setUrlEncoding(active_id) + '/'
                        + setUrlEncoding(image_list[inum]['image']);
            }
        } else {
            thumbPath = base_url
                    + 'cache/' + gallery_prefix + setUrlEncoding(active_id)
                    + '/' + thumbnail_prefix
                    + setUrlEncoding(image_list[inum]['image']);
        }

        var image = thumbPath;
        var name = image_list[inum]['name'];
        var ow = image_list[inum]['w'];
        var oh = image_list[inum]['h'];

        var ww = 0;
        var hh = 0;

        if (!square_thumbnails) {
            if (Math.floor(ow) <= Math.floor(oh)) {
                hh = Math.floor(thumbnail_max_size);
                ww = Math.floor((ow * thumbnail_max_size) / oh);
            } else {
                ww = Math.floor(thumbnail_max_size);
                hh = Math.floor((oh * thumbnail_max_size) / ow);
            }
        } else {
            ww = thumbnail_max_size;
            hh = thumbnail_max_size;
        }

        output_image = '<img id="thimg_' + inum + '" '
                + 'class="thumb_img" '
                + ' title="' + name + '" alt="' + name + '"'
                + 'src="' + image + '" '
                + 'width="' + ww + '" '
                + 'height="' + hh + '" />';

        innerhtml('thcont_' + inum, output_image);

        /*if (show_thumb_name) {
         output_text = thumbName(image_list[inum]['name']);
         getID('text_'+inum).innerHTML = output_text;
         }*/

        addThumbImage();

    } else {

        resetLoadingBar();

        delete currentThumb;
        delete currentThumbData;
        thNum = 0;

        if (preview_mode == 1)
            SlimboxInit();
        else if (preview_mode == 2)
            ThickBoxInit();

        innerhtml('gallery_title', gallery_title_cont);

        if (set_thumbnail_container_height) {
            var thContDiv = getID('thumbs_ul');
            thContDiv.style.height = (thContDiv.offsetHeight + 10) + "px";
        }

        if (continuous_nav
                && open_first_image
                ) {
            last_num = false;
            num = (open_first_image == 'next')
                    ? 1
                    : image_list.length - 1;
            getImage(
                    num,
                    image_list[num]['image'],
                    image_list[num]['name']
                    );
            open_first_image = false;
        }
    }
}


/**** image extensions init scripts ****/

function LightboxInit() {
    initLightbox();
}
function ThickBoxInit() {
    TB_init();
}
function SlimboxInit() {
    Lightbox.init();
}


/**** loading bar scripts ****/

function showLoadingBar()
{
    if (show_loading_bar) {
        display('thumbs_load', 'block');
        innerhtml('thumbs_load', '<div id="loadbar"></div>');
    }
}

function updateLoadingBar(num, total)
{
    if (show_loading_bar) {
        var diff = Math.floor(((content_width - 160) / total) * (num + 1)) + 100;
        getID('loadbar').style.width = diff + 'px';
        getID('loadbar').innerHTML = '<p>' + lang['loading_title'] + ' ' + (total - num) + '</p>';
    }
}

function resetLoadingBar()
{
    if (show_loading_bar) {
        getID('loadbar').innerHTML = '';
        getID('loadbar').style.width = '0px';

        display('thumbs_load', 'none');
        innerhtml('thumbs_load', '');
    }
}



/**** IMAGE SCRIPTS **************************/

//// show selected image //////////////////////////////////////////

function getImage(num, img, uname)
{
    //display('img','block');

    innerhtml('mainimg_desc', '');

    display('gallery_select_menu', 'none');

    var name = imageName(getEncoded(uname, 'esc'));

    active_img = img.split("/").pop();

    var imgPath = base_url + "galleries/" + active_id + "/" + img;

    var imgload = '';
    var name = img.split("/").pop();
    imgload += '<div id="loaddiv"><img id="loadimg" src="' + indicator_src + '" /> ' + lang['loading_title'] + ' <strong>' + name + '</strong></div>';

    innerhtml('img', imgload);
    display('img', 'block');

    var loadobj = getID('loaddiv');
    loadobj.style.display = 'block';

    active_num = Math.floor(num);

    last_num = num;

    //// image title scripts
    var load_cont = '<small>' + lang['loading_title'] + ' '
            + lang['loading_image'] + ': <strong>'
            + imageName(name)
            + '</strong>...</small>';

    innerhtml('image_title', load_cont);

    //// relocate msc_image
    var msc_image = getID('msc_image');
    if (!msie)
        msc_image.style.position = 'fixed';

    //display('msc_image','block');

    checkNavigation(num);

    cp.call(base_url + 'libraries/ajax.gateway.php', 'get_image',
            updateImage, num, Url.encode(imgPath), Url.encode(name));


    var pageSize = getPageSize();
    var bg_div = getID('image_bg');
    bg_div.style.width = pageSize[2] + "px";
    bg_div.style.height = pageSize[3] + "px";

    if (animate_preview) {
        showDiv('msc_image', false);

    } else {
        display('msc_image', 'block');
    }

    //// create nav thumbs
    buildNavThumbs();
}


function updateImage(request)
{
    var result = getEncoded(request, 'url');

    currentImage = new Image();
    currentImageData = new Object();

    var output = result.split(';');
    var num = output[0];
    var img = output[1];
    var name = imageName(getEncoded(output[2], 'esc')); //// ######
    var w = Math.floor(output[3]);
    var h = Math.floor(output[4]);
    var desc = (output[5] != 'null') ? output[5] : 'null';

    var nw = w;
    var nh = h;
    var link = false;

    var iname = '<strong>' + name
            + '</strong> <small>' + w + 'x' + h + 'px ('
            + lang['loading_image'] + ' '
            + num + ' ' + lang['loading_of'] + ' '
            + images_total + ')</small>';

    var imgout = '';

    if (desc != 'null') {
        imgdesc = '<div class="image_description">' + desc + '</div>';
        innerhtml('mainimg_desc', imgdesc);
    } else {
        innerhtml('mainimg_desc', '');
    }

    //// size code

    //alert('num:'+num+'\nimg:'+img+'\nname:'+name+'\nw:'+w+'\nh:'+h);

    if (set_double_encoding) {
        escapedImg = escape(img);
    } else {
        escapedImg = Url.encode(img);
    }

    //// this code selects the image to be displayed
    //// whether cached, resized or original

    setMaxSizes();

    var resized_img = false;

    // set cached image size
    if (nh > max_image_height) {
        nh = max_image_height;
        nw = Math.round((w * max_image_height) / h);
        if (nw > max_image_width) {
            dw = nw;
            dh = nh;
            nw = max_image_width;
            nh = Math.round((dh * max_image_width) / dw);
        }
        resized_img = true;
    }

    var img_maxsize = (nh > nw) ? nh : nw;
    var fw = nw;
    var fh = nh;

    // Add support for displaying FLVs
    var flvIndex = img.toLowerCase().indexOf('flv');
    if (flvIndex >= 0) {
        // We have an FLV video, so load an iframe that will play the video
        var nfw = fw + 20;
        var nfh = fh + 20;
        imgout = '<iframe style="background-color: white;" src="libraries/flv.player.php?file=' + Url.encode(img) + '&width=' + fw + '&height=' + fh + '" width="' + nfw + '" height="' + nfh + '"><p>Your browser does not support iframes.</p></iframe>';
    } else {
        // We have a normal image, display it
        if (resized_img && create_thumbnails) {
            //// enlarge message on top
            //imgout += '<p><a href="'+escapedImg+'" target="_blank"><small>'+lang['alert_enlarge']+'</small></a></p>';

            var targetLink = escapedImg

            imgout += '<a href="' + targetLink + '" target="_blank">';
            imgout += '<img id="mainimg" class="imagen" src="';

            if (scale_big_images) {
                imgout += base_url + 'libraries/thumb.display.php?';
                imgout += 'max=' + img_maxsize
                        + '&q=' + large_image_quality
                        + '&img=' + escapedImg;
            } else {
                imgout += base_url + escapedImg;
            }

            imgout += '" width="' + fw + '" height="' + fh + '"';
            imgout += ' title="' + name + '" alt="' + name + '" />';
            imgout += '</a>';

            //// enlarge message at bottom
            imgout += '<p><a href="' + escapedImg + '" target="_blank"><small>' + lang['alert_enlarge'] + '</small></a></p>';

        } else {
            imgout = '<img id="mainimg" class="imagen" src="' + escapedImg + '"  width="' + fw + '" height="' + fh + '" title="' + name + '" alt="' + name + '" />';
        }
    }

    var imgdiv = getID('img');
    imgdiv.style.width = Math.round(nw + 18) + 'px';
    imgdiv.style.height = Math.round(nh + 18) + 'px';

    //// set image source
    innerhtml('img', imgout);

    //// set image title
    innerhtml('image_title', iname);

    //// add image description
    if (show_image_description) {
        var image_desc_content = 'Description of image'
        var image_desc = '<div class="description">' + image_desc_content + '</div>'

        display('mainimg_desc', 'block');
        innerhtml('mainimg_desc', image_desc);
    }

    setCurrentPosition();
}

function buildNavThumbs()
{
    innerhtml('nav_thumbs', '');

    var thumbsDiv = getID('nav_thumbs');

    var outimg = '';
    var num = 0;
    var activeNum = Number(active_num);

    var image = '';
    var name = '';
    var selectDiv = new Object();

    //// first thumbnail
    num = Number(activeNum - 2);
    if (num >= 1) {
        image = image_list[num]['image'];
        name = image_list[num]['name'];
    } else {
        image = false;
        name = false;
    }
    //selectDiv = addNavThumb(image, name, activeNum);
    thumbsDiv.appendChild(addNavThumb(image, name, num));

    //// second thumbnail
    num = Number(activeNum - 1);
    if (num >= 1) {
        image = image_list[num]['image'];
        name = image_list[num]['name'];
    } else {
        image = false;
        name = false;
    }
    //selectDiv = addNavThumb(image, name, activeNum);
    thumbsDiv.appendChild(addNavThumb(image, name, num));

    //// third thumbnail
    num = Number(activeNum);
    if (image_list[num]['image']) {
        image = image_list[num]['image'];
        name = image_list[num]['name'];
    } else {
        image = false;
        name = false;
    }
    //selectDiv = addNavThumb(image, name, activeNum);
    thumbsDiv.appendChild(addNavThumb(image, name, num));

    //// fourth thumbnail
    num = Number(activeNum + 1);
    if (num < image_list.length) {
        image = image_list[num]['image'];
        name = image_list[num]['name'];
    } else {
        image = false;
        name = false;
    }
    //selectDiv = addNavThumb(image, name, activeNum);
    thumbsDiv.appendChild(addNavThumb(image, name, num));

    //// fifth thumbnail
    num = Number(activeNum + 2);
    if (num < image_list.length) {
        image = image_list[num]['image'];
        name = image_list[num]['name'];
    } else {
        image = false;
        name = false;
    }
    //selectDiv = addNavThumb(image, name, activeNum)
    thumbsDiv.appendChild(addNavThumb(image, name, num));
}

function appendNavThumb()
{
    var thumbsDiv = getID('nav_thumbs');

    // delete firstChild
    thumbsDiv.removeChild(thumbsDiv.firstChild);

    // check if there's a next image
    var activeNum = Number(active_num);
    var image = false;
    var name = false;
    num = Number(activeNum + 2);
    if (num < image_list.length) {
        image = image_list[num]['image'];
        name = image_list[num]['name'];
    }

    // appendChild
    thumbsDiv.appendChild(addNavThumb(image, name, num));
}

function prependNavThumb()
{
    var thumbsDiv = getID('nav_thumbs');

    var activeNum = Number(active_num);
    var image = false;
    var name = false;

    num = Number(activeNum - 2);
    if (num >= 1) {
        image = image_list[num]['image'];
        name = image_list[num]['name'];
    }
    //alert('active_num:'+active_num+'\nimage:'+image+'\nname:'+name);
    thumbsDiv.removeChild(thumbsDiv.lastChild);
    thumbsDivChilds = thumbsDiv.childNodes;

    //thumbsDiv.innerHTML = '';

    for (i = thumbsDiv.childNodes.length; i >= 0; i--) {
        thumbsDivChilds.push(thumbsDiv.childNodes[i]);
        thumbsDiv.removeChild(thumbsDiv.childNodes[i]);
    }

    thumbsDiv.appendChild(addNavThumb(image, name, num));

    /*
     for (i=thumbsDiv.childNodes.length-1; i>=1; i--)
     {
     //alert(thumbsDiv.childNodes[i].id)
     var prevNode = thumbsDiv.childNodes[i-1].innerHTML;
     thumbsDiv.childNodes[i].innerHTML = prevNode;
     }
     
     var firstThumb = addNavThumb(image, name, num);
     thumbsDiv.childNodes[0].innerHTML = firstThumb.innerHTML;
     */
}


function addNavThumb(image, name, num)
{
    //var thumbsDiv = getID('nav_thumbs');
    var content = '';

    if (image) {

        var enc_image_path = (cache_thumbnails)
                ? base_url + 'cache/' + gallery_prefix
                + setUrlEncoding(active_id) + '/'
                + thumbnail_prefix + setUrlEncoding(image)
                : base_url + 'galleries/'
                + setUrlEncoding(active_id) + '/'
                + setUrlEncoding(image);

        var setLink = document.createElement('a');
        setLink.href = 'javascript:;';
        setLink.onclick = function ()
        {
            getImage(num, image.sq(), name.sq());
        }

        var setThumb = document.createElement('img');
        setThumb.src = 'libraries/thumb.display.php?max='
                + square_thumbnail_max_size
                + '&sq=1&pr=1&img=' + enc_image_path
        setThumb.alt = name;
        setThumb.className = (num == active_num) ? 'sel' : 'th';

        setLink.appendChild(setThumb);

        /*
         var setLink_pre = '<a href="javascript:;" onclick="getImage('
         +"'"+num+"','"+image.sq()+"','"+name.sq()+"'"
         +')">';
         var setLink_post = '</a>';
         
         var thumbClass = (num==active_num)
         ? 'sel'
         : 'th';
         
         thumbClass = 'sel';
         
         var setThumb = '<img src="libraries/thumb.display.php?max='
         +square_thumbnail_max_size
         +'&sq=1&pr=1&img='+enc_image_path
         +'" alt ="'+name+'" class="'+thumbClass+'" />';
         
         content = setLink_pre + setThumb + setLink_post;
         */

        content = setLink;

    } else {
        var setThumb = document.createElement('img');
        setThumb.src = 'images/spacer.gif';
        setThumb.alt = '';
        setThumb.className = 'th';

        /*var thumbClass = 'th'
         var setThumb = '<img src="images/spinner.gif" alt ="spinner" class="'+thumbClass+'" />';*/

        content = setThumb;
        num = 'null';
    }

    var selectDiv = document.createElement('div');
    selectDiv.id = 'navthumb_' + num;
    selectDiv.className = 'navthumb';
    selectDiv.appendChild(content);

    //selectDiv.innerHTML = content;
    //if (content != '') selectDiv.appendChild(content);

    return selectDiv;
}


function getImage_th(num, img, name)
{
    getImage(num, getEncoded(img, 'enc'), getEncoded(name, 'enc'));
}

//// image navigation scripts /////////////////////////////////////////

/*** NEW NEXT/PREV IMAGES SCRIPT *******************************/

function checkNavigation(num)
{
    var n = Math.floor(num);

    var i_prev = ((n - 1) > 0) ? 'inline' : 'none';
    if (continuous_nav)
        if (((n + th_min) - 1) > 0) {
            i_prev = 'inline'
            go_to_prev = true
        } else {
            i_prev = 'none'
            go_to_prev = false
        }

    var i_next = ((n + 1) < image_list.length) ? 'inline' : 'none';
    if (continuous_nav)
        if ((n + th_min) < id_files[active_id]) {
            i_next = 'inline'
            go_to_next = true
        } else {
            i_next = 'none'
            go_to_next = false
        }

    display('a_prev', i_prev);
    display('a_next', i_next);

    key_navigation = true;
}


function prevImage()
{
    nav_direction_flag = 'prev';

    var id = active_id;
    var num = Math.floor(active_num);
    var p = ((num - 1) > 0) ? num - 1 : false;

    if (p != false) {
        getImage(p, image_list[p]['image'], image_list[p]['name']);
    } else {
        if (continuous_nav) {
            var max = th_min - 1;
            var min = ((th_min - th_diff) > 0)
                    ? th_min - th_diff - 1
                    : 0;

            // if there are more thumbs
            if (compact_navigation
                    && id_files[id] > th_diff) {
                loadingNewBlock();
                getThumbs(id, min, max);
                open_first_image = 'prev';
            }
        }
    }
    if (slideshow_flag)
        startTimer();
}

function nextImage(flag)
{
    if (flag)
        first_image_in_slideshow_viewed = 1;

    nav_direction_flag = 'next';

    var id = active_id;
    var num = Math.floor(active_num);
    var n = ((num + 1) < image_list.length) ? num + 1 : false;

    if (n != false) {
        getImage(n, image_list[n]['image'], image_list[n]['name']);
    } else {
        if (continuous_nav) {
            var min = th_max + 1;
            var max = ((th_max + th_diff) > id_files[id])
                    ? id_files[id]
                    : th_max + th_diff + 1;

            // if there are more thumbs
            if (compact_navigation
                    && max <= id_files[id]) {
                loadingNewBlock();
                getThumbs(id, min, max);
                open_first_image = 'next';
            }
        }
    }
    if (slideshow_flag)
        startTimer();
}

function loadingNewBlock()
{
    display('img', 'none');

    var load_cont = '<img id="loadimg" src="' + indicator_src + '" /> '
            + '&nbsp;<strong>' + lang["loading_thumbs"] + '</strong>...';

    innerhtml('image_title', load_cont);
}


function nextImageSlideshow()
{
    nav_direction_flag = 'next';
    close_slideshow = false;

    var n = ((Math.floor(active_num) + 1) < image_list.length)
            ? Math.floor(active_num) + 1
            : 1;
    if (first_image_in_slideshow_viewed && n == 1) {
        first_image_in_slideshow_viewed = 0;
        if (go_to_next) {
            nextImage(1);
        } else {
            //alert("go_to_next:"+go_to_next)
            if (timerID)
                clearTimeout(timerID);
            if (timeout)
                clearInterval(timeout);
            active_num = 0;
            slideshow_flag = false;
            close_slideshow = true;
            closeImageWin();
        }
    } else {
        getImage(n, image_list[n]['image'], image_list[n]['name']);
    }

    if (!close_slideshow)
        startTimer();
}

function firstImageSlideshow()
{
    first_image_in_slideshow_viewed = 1;

    nav_direction_flag = 'next';

    var n = Math.floor(active_num);
    n = (n < 1) ? 1 : n;

    getImage(n, image_list[n]['image'], image_list[n]['name']);

    startTimer();
}


function showTooltip(obj, name)
{
    var ttip = getID('tooltip');
    var l = findPosX(obj) + 40;
    var t = findPosY(obj) - 20;

    ttip.style.left = findPosX(obj);
    ttip.style.top = findPosY(obj) + thumbnail_max_size + 14;

    innerhtml('tooltip', name);
    display('tooltip', 'block');
}

function hideTooltip()
{
    var ttip = getID('tooltip');

    display('tooltip', 'none');

    //ttip.left = 0;
    //ttip.top = 0;
    //ttip.innerhtml = '';

}


function startTimer()
{
    clearTimeout(timerID);
    clearTimeout(timeout);

    tStart = new Date();
    innerhtml('time', zero(slideshow_time) + ' ' + lang['slideshow_seconds']);

    updateTimer();

    timeout = setTimeout("nextImageSlideshow();", 1000 * slideshow_time);
}

function updateTimer()
{
    if (timerID) {
        clearTimeout(timerID);
        clockID = 0;
    }

    if (!tStart)
        tStart = new Date();

    var tDate = new Date();
    var tDiff = tDate.getTime() - tStart.getTime();

    tDate.setTime(tDiff);

    innerhtml('time', zero(slideshow_time - tDate.getSeconds()) + ' ' + lang['slideshow_seconds']);

    timerID = setTimeout("updateTimer()", 1000);
}


function startSlideshow()
{
    nav_direction_flag = 'next';

    if (!slideshow_flag) {
        clearTimeout(timerID);
        clearTimeout(timeout);
        timeout = null;
        innerhtml('toggle_show', lang['slideshow_pause'] + ' ' + lang['slideshow_name']);
        firstImageSlideshow();
        slideshow_flag = true;

    } else {
        if (timerID)
            clearTimeout(timerID);
        if (timeout)
            clearTimeout(timeout);
        timeout = null;
        innerhtml('toggle_show', lang['slideshow_resume'] + ' ' + lang['slideshow_name']);
        slideshow_flag = false;
    }
    display('msc_image', 'block');
    display('timer', 'block');
}


function closeImageWin()
{
    display('gallery_select_menu', 'inline');

    currentImage = new Image();
    currentImageData = new Object();

    active_img = '';

    if (slideshow_flag) {
        if (timerID)
            clearTimeout(timerID);
        if (timeout)
            clearInterval(timeout);
        active_num = 0;
        slideshow_flag = false;
    }
    getID('thumbs_ul').style.opacity = 1;
    display('timer', 'none');
    //display('msc_image','none');

    if (show_permalink)
        setCurrentPosition();

    innerhtml('img', '');
    innerhtml('image_title', '');
    innerhtml('nav_thumbs', '');

    if (animate_preview) {
        display('img', 'none');
        hideDiv('msc_image', false);

    } else {
        display('msc_image', 'none');
    }

    preview_open = false;
}

function toolToggle()
{
    var obj = getID('utilities')
    if (obj.style.display == 'block') {
        innerhtml('toolshowhide', lang['tools_show'] + ' ' + lang['tools_title']);
        display('utilities', 'none');
    } else {
        innerhtml('toolshowhide', lang['tools_hide'] + ' ' + lang['tools_title']);
        display('utilities', 'block');
    }
}

function setMaxSizes()
{
    var pageSize = getPageSize();
    var imageOff = (msie) ? 220 : 180;

    max_image_width = Math.floor(pageSize[2] - 100);
    max_image_height = Math.floor(pageSize[3] - imageOff);
}

function showAlert()
{
    var out = '';
    for (i = 0; i < alert_message.length; i++) {
        out += '<p><b>' + lang['alert_title'] + '!</b> ' + alert_message[i] + '</p>';
    }

    innerhtml('msg', out);
    display('alert', 'block');

    for (i = 0; i < alert_message.length; i++) {
        alert_message.pop();
    }
}

function checkForIE()
{
    if (msie) {
        alert_message.push(lang['alert_browser_error'] + ' <small>(' + agent + ')</small>');
    }
}


/**** TRANSITION EFFECTS *****************/

function hideDiv(id, callback)
{
    transDiv = getID(id);
    transCallback = callback;
    transDiv.style.opacity = 1.0;
    trans = setInterval("hideObj();", 1);
}

function hideObj()
{
    if (transDiv.style.opacity > .1) {
        var opacity = transDiv.style.opacity * 10 - 1;
        transDiv.style.opacity = opacity / 10;

    } else {
        transDiv.style.opacity = 0;
        transDiv.style.display = 'none';
        transDiv.style.opacity = 1.0;

        clearInterval(trans);

        transCallback = undefined;
    }
}


function showDiv(id, callback)
{
    transDiv = getID(id);
    transCallback = callback;

    if (transDiv.style.display == 'none')
        transDiv.style.display = 'block';

    if (transDiv.style.visibility == 'hidden')
        transDiv.style.display = 'visible';

    transDiv.style.opacity = 0.0;
    trans = setInterval("showObj();", 1);
}

function showObj(callback)
{
    //alert(transDiv.style.opacity)
    if (transDiv.style.opacity < .9) {
        var opacity = transDiv.style.opacity * 5 + 1;
        transDiv.style.opacity = opacity / 5;

    } else {
        transDiv.style.opacity = 1;
        //transDiv.style.display = 'none';
        //transDiv.style.opacity = 0;

        clearInterval(trans);

        transCallback = undefined;
    }
}


/****** HELPER FUNCTIONS *****************/

function innerhtml(id, cont)
{
    if (getID(id))
        getID(id).innerHTML = cont;
}

function display(id, flag)
{
    if (getID(id))
        getID(id).style.display = flag;
}

function imageName(img)
{
    var n = img.split('/');
    var name = n[n.length - 1];
    if (!show_thumb_number)
        name = name.replace(/^[0-9]*[_-]/g, "");
    name = name.replace(/\_/g, " ")
    name = name.replace(/\-/g, " - ");
    name = name.replace(/\.[A-Za-z0-9]*$/g, "");

    return name;
}

function galleryName(g)
{
    var name = g;
    if (!show_gallery_number)
        name = name.replace(/^[0-9]*-/g, "");
    name = name.replace(/\_/g, " ")
    name = name.replace(/\-/g, " - ");

    return name;
}

function thumbName(g)
{
    var c = 0;
    var ds = .19;
    var name = '';
    var dw = (ds * thumbnail_max_size);
    var rows = false;
    if (rows) {
        dw = dw - 1;
        for (k = 0; k < g.length; k++) {
            if (c > dw) {
                name += g.charAt(k) + '<br/>';
                c = 0;
            } else {
                name += g.charAt(k);
            }
            c++;
        }
    } else {
        if (g.length > dw)
            name = g.substring(0, dw - 4) + '&#133;' + g.substring(g.length - 3, g.length);
        else
            name = g;
    }
    return name;
}

//// toggle image visibility until loaded
function toggleImageContainer()
{
    var thContDiv = getID('thumbs_ul');

    if (preview_mode == 1 || preview_mode == 2) {
        //alert(thContDiv.style.visibility)
        if (thContDiv.style.visibility == 'hidden') {
            thContDiv.style.visibility = 'visible';
        } else {
            thContDiv.style.visibility = 'hidden';
        }
    }
}

//// return number to zero-leading string
function zero(num)
{
    if (num < 10)
        num = '0' + num;
    return num;
}

//// find x position
function findPosX(obj)
{
    var curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    }
    else if (obj.x)
        curleft += obj.x;
    return curleft;
}

//// find y position
function findPosY(obj)
{
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    }
    else if (obj.y)
        curtop += obj.y;
    return curtop;
}

//
// getPageSize()
// Returns array with page width, height and window width, height
// Core code from - quirksmode.org
// Edit for Firefox by pHaez
//
function getPageSize()
{

    var xScroll, yScroll;

    if (window.innerHeight && window.scrollMaxY) {
        xScroll = document.body.scrollWidth;
        yScroll = window.innerHeight + window.scrollMaxY;

        // all but Explorer Mac
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
        xScroll = document.body.scrollWidth;
        yScroll = document.body.scrollHeight;

        // Explorer Mac...would also work in Explorer 6 Strict,
        // Mozilla and Safari
    } else {
        xScroll = document.body.offsetWidth;
        yScroll = document.body.offsetHeight;
    }

    var windowWidth, windowHeight;

    // all except Explorer
    if (self.innerHeight) {
        windowWidth = self.innerWidth;
        windowHeight = self.innerHeight;

        // Explorer 6 Strict Mode
    } else if (document.documentElement && document.documentElement.clientHeight) {
        windowWidth = document.documentElement.clientWidth;
        windowHeight = document.documentElement.clientHeight;

        // other Explorers
    } else if (document.body) {
        windowWidth = document.body.clientWidth;
        windowHeight = document.body.clientHeight;
    }

    // for small pages with total height
    // less than height of the viewport
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }

    // for small pages with total width
    // less then width of the viewport
    if (xScroll < windowWidth) {
        pageWidth = windowWidth;
    } else {
        pageWidth = xScroll;
    }

    arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight)
    return arrayPageSize;
}

String.prototype.trim = function ()
{
    return this.replace(/^\s+|\s+$/, '');
};

String.prototype.sq = function ()
{
    return this.replace("'", "\\'");
};


/**** UTF-8 data encode / decode (http://www.webtoolkit.info) ****/

var Utf8 = {
    // public method for url encoding
    encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // public method for url decoding
    decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}


/**** set url encoding to single/double ****/

function setUrlEncoding(string)
{
    var output = '';
    if (set_double_encoding) {
        output = Url.double_encode(string);
    } else {
        output = Url.encode(string);
    }
    return output;
}

function getUrlEncoding(string)
{
    var output = '';
    if (set_double_encoding) {
        output = Url.decode(string);
    } else {
        output = unescape(string);
    }
    return output;
}

function sendEncoded(string, encoding)
{
    var output = '';

    switch (encoding) {
        case "url":
            output = Url.encode(string);
            break;
        case "esc":
            output = escape(string);
            break;
        case "utf8":
            output = Utf8.encode(string);
            break;
        default:
            output = string;
            break;
    }
    return output;
}

function getEncoded(string, encoding)
{
    var output = '';

    switch (encoding) {
        case "url":
            output = Url.decode(string);
            break;
        case "esc":
            output = unescape(string);
            break;
        case "utf8":
            output = Utf8.decode(string);
            break;
        default:
            output = string;
            break;
    }
    return output;
}


/**** URL encode / decode (http://www.webtoolkit.info) ****/

var Url = {
    // public method for double-encoding urls
    double_encode: function (string) {
        dbl = escape(this._utf8_encode(string));
        return escape(this._utf8_encode(dbl));
  },
    // public method for url encoding
    encode: function (string) {
        return escape(this._utf8_encode(string));
    },
    // public method for url decoding
    decode: function (string) {
        return this._utf8_decode(unescape(string));
    },
    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

/**** adding single quote escaping
 as a method to the String Object ****/

String.prototype.sq = function ()
{
    return this.replace("'", "\\'")
}


/* convert characters */

function encode_utf8(string)
{
    return unescape(encodeURIComponent(string))
}

function decode_utf8(string)
{
    return decodeURIComponent(escape(string))
}

/* private getID() method */
function getID(obj)
{
    return document.getElementById(obj)
}


//// Key Functions ////

function keyNavigation(e)
{
    //alert(e.which)

    // forward (right arrow | space | down arrow)
    if ((e.type == 'keydown' && e.which == 39)
            || (e.type == 'keydown' && e.which == 32)
            || (e.type == 'keydown' && e.which == 40)) {
        if (active_img == '' || !active_img || active_img == undefined) {
            getImage(1, image_list[1]['image'], image_list[1]['name']);
        } else {
            //if (active_num < image_list.length) 
            if (go_to_next && key_navigation) {
                key_navigation = false;
                nextImage();
            }
        }

        // backwards (left arrow | up arrow)
    } else if ((e.type == 'keydown' && e.which == 37)
            || (e.type == 'keydown' && e.which == 38)) {
        if (go_to_prev && key_navigation) {
            key_navigation = false;
            prevImage();
        }

        // fullscreen (F)
    } else if (e.type == 'keydown' && e.which == 70) {
        if (!fullscreen) {
            pos_orig.l = window.pageXOffset;
            pos_orig.t = window.pageYOffset;

            if (parseInt(navigator.appVersion) > 3) {
                if (navigator.appName.indexOf("Microsoft") != -1) {
                    pos_orig.w = document.body.offsetWidth;
                    pos_orig.h = document.body.offsetHeight;
                } else { //if (navigator.appName=="Netscape") {
                    pos_orig.w = window.outerWidth;
                    pos_orig.h = window.outerHeight;
                }
            }
            window.moveTo(0, 0);
            window.resizeTo(screen.availWidth, screen.availHeight);
            size_fullscreen = true;

        } else {
            pos_orig.l = (screen.availWidth - pos_orig.w) / 2;
            pos_orig.t = (screen.availHeight - pos_orig.h) / 2;
            window.resizeTo(pos_orig.w, pos_orig.h);
            window.moveTo(pos_orig.l, pos_orig.t);
            size_fullscreen = false;
        }

        // fullscreen
    } else if (e.type == 'keydown' && e.which == 27) {
        closeImageWin();
    }
}