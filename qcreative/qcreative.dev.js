"use strict";


/*
 * Author: ant_farm
 * Website: http://antfarmthemes.com
 * Portfolio: http://themeforest.net/user/ant_farm/portfolio?ref=ant_farm
 * This is not free software.
 * QCreative
 * Version: 1.02
 */

function getBrowserScrollSize(){

    var css = {
        "border":  "none",
        "height":  "200px",
        "margin":  "0",
        "padding": "0",
        "width":   "200px"
    };

    var inner = jQuery("<div>").css(jQuery.extend({}, css));
    var outer = jQuery("<div>").css(jQuery.extend({
        "left":       "-1000px",
        "overflow":   "scroll",
        "position":   "absolute",
        "top":        "-1000px"
    }, css)).append(inner).appendTo("body")
        .scrollLeft(1000)
        .scrollTop(1000);

    var scrollSize = {
        "height": (outer.offset().top - inner.offset().top) || 0,
        "width": (outer.offset().left - inner.offset().left) || 0
    };

    outer.remove();
    return scrollSize;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


Math.easeIn = function(t, b, c, d) {

    return -c *(t/=d)*(t-2) + b;

};
(function($) {
    $.fn.descendantOf = function(parentId) {
        return this.closest(parentId).length != 0;
    }
})(jQuery)

window.qcreative_document_ready_ed = false;
window.google_maps_loaded = false;
window.gooogle_maps_must_init = false;


window.preseter_options= {
    'delay_time_to_autohide': 1000000
    ,init_on_document_ready : false
}

function goclone(source) {
    if (Object.prototype.toString.call(source) === '[object Array]') {
        var clone = [];
        for (var i=0; i<source.length; i++) {
            clone[i] = goclone(source[i]);
        }
        return clone;
    } else if (typeof(source)=="object") {
        var clone = {};
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                clone[prop] = goclone(source[prop]);
            }
        }
        return clone;
    } else {
        return source;
    }
}


function copy(source, deep) {
    var o, prop, type;

    if (typeof source != 'object' || source === null) {
        // What do to with functions, throw an error?
        o = source;
        return o;
    }

    o = new source.constructor();

    for (prop in source) {

        if (source.hasOwnProperty(prop)) {
            type = typeof source[prop];

            if (deep && type == 'object' && source[prop] !== null) {
                o[prop] = copy(source[prop]);

            } else {
                o[prop] = source[prop];
            }
        }
    }
    return o;
}

jQuery(document).ready(function($){
    //console.info('DOCUMENT READY');


    if(window.qcreative_document_ready_ed){
        return false;
    }else{
        window.qcreative_document_ready_ed = true;
    }

    $.fn.outerHTML = function() {
        return $(this).clone().wrap('<div></div>').parent().html();
    };

    var BlurStack = function() {
        return {
            r : 0,
            g : 0,
            b : 0,
            a : 0,
            next : null
        }
    };

    var
        _mainBg = null
        ,_body = $('body')
        ,_mainBgConCon = null

        ,_navCon = null
        ,_mainBgTransitioning = null
        ,_mainGalleryDescs = null
        ,_preloaderCon = null
        ,_theContent = null
        ,_mainContainer = null
        ,_navCon_520 = null
        ,_theActualNav = null
        ,___response = null
        ,_gallery_thumbs_con = null
        ,_sidebarMain = null

        ,_qcre_aux_css = null
        ;

    var mainBgImgCSS = '';
    var mainBgImgUrl = '';

    var newclass_body = ''
        ,newclass_body_nopadding=false
        ,newclass_body_with_fullbg=false
        ,qcre_init_zoombox = false
        ,main_content_loaded=false
        ;

    var ww = 0
        ,wh = 0
        ,st = 0 // -- scrolltop
        ,mainbgoffset = 15
        ,currBgNr = 0
        ,bigimagewidth = 0
        ,bigimageheight = 0
        ,lastcontent_w = 0
        ,gallery_thumbs_img_container_nw = 0 // -- natural width for gallery thumbs image container
        ,gallery_thumbs_img_container_nh = 0
        ,gallery_thumbs_img_container_cw = 0
        ,gallery_thumbs_img_container_ch = 0
        ,gallery_thumbs_img_container_padding_space=20
        ,menu_width = 250
        ,thumbs_padding_left_and_right = 40
        ,thumbs_list_padding_right = 0
        ,menu_height = 0
        ,menu_width_on_right = 0
        ,content_width = 930
        ,default_content_width = 930
        ,menu_content_space = 20
        ,native_scrollbar_width = 0

        ,initial_sidebar_offset = 0

        ,currNr_gallery_w_thumbs = 0


        ,bg_slideshow_time = 0
        ,initial_offset = 0
        ,responsive_breakpoint = 1000
        ;

    var bg_transition = "slidedown";

    var bg_transition_delay = 500;

    var
        busy_main_transition = false
        ,is_ready_load = false
        ,is_ready_transition = false
        ,parallax_reverse = true
        ,is_content_page = false // -- check if it is a content page ( page normal )
        ,allow_resizing_on_blur = true
        ,_cache = null
        ,_cache2 = null
        ,_content_translucent_canvas = null
        ,social_scripts_loaded = false
        ,social_scripts_reinit = false
        ,transitioned_via_ajax_first = false // -- set to true when the first ajax transition has been made
        ,first_page_not_transitioned = true// -- only on the first page load, only once
        ,first_bg_not_transitioned = true
        ;

    var global_image_data = null;


    var scripts_loaded_arr = [];
    var scripts_tobeloaded = [];
    var stylesheets_tobeloaded = [];
    var elements_tobe_added_arr = []
        ,videoplayers_tobe_resized = []
        ;


    var inter_resizing = 0
        ,inter_calculate_dims_light = 0
        ,inter_enlarge_preseter = 0
        ,inter_preseter_scroll = 0
        ,inter_check_if_main_content_loaded = 0
        ,inter_bg_slideshow = 0
        ;


    var old_qcre_options = null;
    var old_zoombox_options = null;
    var zoombox_options = null;


    var _c_for_parallax_items = null;

    var ind_blur = 0

        ;

    var parallaxer_multiplier = 1.3;


    var page_is_fullwidth = false;



    var duration_vix = 20
        ;

    var target_vix = 0
        ;

    var begin_vix = 0
        ;

    var finish_vix = 0
        ;

    var change_vix = 0
        ;

    var state_curr_menu_items_links = [];



    var page =''
        ,page_change_ind = 0
        ;

    var windowhref = ''
        ,ajax_site_url = ''
        ,curr_html = ''
        ,curr_html_with_clear_cache = false
        ;


    var is_menu_horizontal_and_full_bg = false
        ,full_bg_init_y = 0
        ,_full_bg = null
        ;

    var debug_var = false;




    if($('.main-bg-con-con').length>0){
        _mainBgConCon = $('.main-bg-con-con').eq(0);
    }
    _mainContainer = $('.main-container').eq(0);
    _mainBg = $('.main-bg-con').eq(0);
    //console.info(_mainBg);
    _preloaderCon = $('.main-container > .preloader-con');
    _navCon = $('.qcreative--nav-con').eq(0);
    _navCon_520 = $('.qcreative--520-nav-con').eq(0);
    _theActualNav = $('ul.the-actual-nav').eq(0);

    if($('.the-content').length>0){
        _theContent = $('.the-content').eq(0);
    }


    if($('#qcre-aux-css').length>0){
        _qcre_aux_css=$('#qcre-aux-css').eq(0);
    }else{


        _body.append('<style id="qcre-aux-css"></style>');
        _qcre_aux_css=$('#qcre-aux-css').eq(0);

    }

    if(isiPad){
        _body.addClass('is-ipad');
    }


    var auxa = getBrowserScrollSize();

    native_scrollbar_width = auxa.width;


    //console.log(getBrowserScrollSize());


    var qcreative_options_defaults = {
        images_arr: ['img/bg1.jpg']
        ,bg_slideshow_time: "0" // -- slideshow time in seconds. If it 0 then there the background images will not have a slideshow
        ,site_url: 'detect'
        ,enable_ajax: 'on'
        ,page: 'index'
        ,bg_isparallax: 'off'
        ,gallery_w_thumbs_autoplay_videos: 'on'
        ,enable_native_scrollbar: 'off'
        ,blur_ammount: 25
        ,substract_parallaxer_pixels: 10
        ,video_player_settings: {
            init_each:true
            ,settings_youtube_usecustomskin: "off"
            ,design_skin: "skin_reborn"
            ,settings_video_overlay: "on"
        }
    };

    var qcreative_options_defaults_string = JSON.stringify(qcreative_options_defaults);
    //console.log(qcreative_options_defaults_string);
    if(window.qcreative_options){



        //console.log('this..');
        //var auxer =copy(qcreative_options_defaults);
        window.qcreative_options = $.extend(qcreative_options_defaults, window.qcreative_options);


    }else{
        window.qcreative_options = $.extend({}, qcreative_options_defaults);
    }

    //console.info(window.qcreative_options);


    $(window).scrollTop(0);

    setInterval(function(){
        debug_var=true;
    },1000)




    var regex_bodyclass = /(page-.*?)[ |"]/g;

    //console.log(String($('body').attr('class')))

    var aux23 = regex_bodyclass.exec(String($('body').attr('class')));

    newclass_body = '';
    if(aux23){
        if(aux23[1]){
            newclass_body = aux23[1];
        }
    }

    //console.info(newclass_body);

    if(window.preseter_init){

        window.onload = function() {
            //console.info('ceva');


        };


        //$( window ).unload(function() {
        //
        //    localStorage.setItem("menu-type", '');
        //    localStorage.setItem("page-title-style", '');
        //    localStorage.setItem("page-title-align", '');
        //    localStorage.setItem("heading-style", '');
        //    localStorage.setItem("heading-aligment", '');
        //    localStorage.setItem("content-align", '');
        //    localStorage.setItem("parallax_bg", '');
        //    localStorage.setItem("blur_ammount", '');
        //    localStorage.setItem("saturation_ammount", '');
        //    localStorage.setItem("color_primary", '');
        //
        //
        //});

        if(typeof(Storage) !== "undefined") {



            if(get_query_arg(window.location.href, 'clearcache')=='on'){

                localStorage.setItem("menu-type", '');
                localStorage.setItem("page-title-style", '');
                localStorage.setItem("page-title-align", '');
                localStorage.setItem("heading-style", '');
                localStorage.setItem("heading-aligment", '');
                localStorage.setItem("content-align", '');
                localStorage.setItem("parallax_bg", '');
                localStorage.setItem("blur_ammount", '');
                localStorage.setItem("saturation_ammount", '');
                localStorage.setItem("color_primary", '');
            }



            // -- <h6>SECTION TITLE STYLE</h6> <select name="heading-style"> <option value="heading-style-1">Section Title 1</option> <option value="heading-style-2">Section Title 2</option> <option selected value="heading-style-3">Section Title 3</option> <option value="heading-style-4">Section Title 4</option> <option value="heading-style-5">Section Title 5</option> </select> </div> <div class="setting"> <h6>SECTION TITLE ALIGMENT</h6> <select name="heading-aligment"> <option value="heading-is-left">Left</option> <option value="heading-is-center">Center</option> <option value="heading-is-right">Right</option> </select> </div>
            //
            //
            //

            // <option value="menu-type-13">Menu 13 (overlay)</option> <option value="menu-type-14">Menu 14 (overlay)</option> <option value="menu-type-15">Menu 15 (overlay)</option> <option value="menu-type-16">Menu 16 (overlay)</option> <option value="menu-type-17">Menu 17 (overlay)</option> <option value="menu-type-18">Menu 18 (overlay)</option>


            if($('.preseter.align-right').length==0){
                _body.append('<div class="preseter align-right wait-for-activate preseter-opened-by-user" style=""> <div class="the-icon-con"> <i class="fa fa-chevron-left btn-show-customizer"></i> <i class="fa fa-times btn-close-customizer"></i>  </div> <div class="preseter-content-con auto-height overflow-x-visible" style="width: 260px; height: auto;"> <div class=" the-content-inner-con"> <div class="the-content inner" style=" " data-targetw="-260"> <div class="the-content-inner-inner"> <div class="the-bg"></div> <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_menu_style.jpg"/> <span class="content-inner">Change the menu style to completely change the look and feel of your website. Please note that the menu styles are not tied to the content skin style, so with the Q Creative it\'s possible to have a LIGHT menu style with the DARK content skin (however in the demo we are sticking to the same style for both menu and content skins)</span> </span> </div> <h6>Menu Style</h6> <select name="menu-type" autocomplete="off"> <option selected="selected" value="menu-type-1">Menu 1-Dark (vertical)</option> <option value="menu-type-2">Menu 2-Light (vertical)</option> <option value="menu-type-3">Menu 3-Dark (vertical)</option> <option value="menu-type-4">Menu 4-Light (vertical)</option> <option value="menu-type-5">Menu 5-Dark (vertical)</option> <option value="menu-type-6">Menu 6-Light (vertical)</option> <option value="menu-type-7">Menu 7-Dark (vertical)</option> <option value="menu-type-8">Menu 8-Light (vertical)</option> <option value="menu-type-9">Menu 9-Dark (horizontal)</option> <option value="menu-type-10">Menu 10-Light (horizontal)</option> <option value="menu-type-11">Menu 11 (overlay)</option> <option value="menu-type-12">Menu 12 (overlay)</option> <option value="menu-type-13">Menu 13-Dark (horizontal)</option> <option value="menu-type-14">Menu 14-Light (horizontal)</option> <option value="menu-type-15">Menu 15-Dark (horizontal)</option> <option value="menu-type-16">Menu 16-Light (horizontal)</option> <option value="menu-type-17">Menu 17-Dark (horizontal)</option> <option value="menu-type-18">Menu 18-Light (horizontal)</option> </select> </div> <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_page_title_style.jpg"/> <span class="content-inner">Play between page title styles to fit your own personal style. There are several page title styles available, that support one row or two rows, and creating other styles is a piece of cake.</span> </span> </div> <h6>Page Title Style</h6> <select name="page-title-style"> <option value="page-title-style-1">Page Title 1</option> <option selected="selected" value="page-title-style-2">Page Title 2</option> <option value="page-title-style-3">Page Title 3</option> <option value="page-title-style-3b">Page Title 3b</option> </select> </div> <div class="setting"> <h6>Page Title Position</h6> <select name="page-title-align"> <option value="page-title-align-right">Right</option> <option value="page-title-align-center">Center</option> <option value="page-title-align-left">Left</option> </select> </div> <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_section_title_style.jpg"/> <span class="content-inner">This option will affect the Section Title (or Section Heading) in normal pages such as ABOUT US or SERVICES. To see all Section Title Styles please go to Extras / Section Titles.</span> </span> </div>  <div class="setting"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_content_position.jpg"/> <span class="content-inner">With so many menu styles available, we figured that it would be a great thing to have multiple ways to position the content in the browser.</span> </span> </div> <h6>Content Position</h6> <select name="content-align"> <option value="content-align-center">Center</option> <option value="content-align-left">Left</option> <option value="content-align-right">Right</option> </select> </div>   <div class="setting"> <h6>Parallax Background</h6> &nbsp;<input type="radio" name="parallax_bg" value="on" checked>&nbsp;&nbsp;On&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="radio" name="parallax_bg" value="off">&nbsp;&nbsp;Off </div> <div class="setting slider-ui-con"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_blur_amount.jpg"/> <span class="content-inner">The blur effect is probably the biggest star of the show, and the Q Creative 2015 Edition is the first template to use this effect as part of the layout design.</span> </span> </div> <h6>Blur Amount</h6> <input type="hidden" class="slider-ui-target-field" name="blur_ammount" value="25"/> <div class="slider-ui slider-ui-for-blur"></div> </div> <div class="setting slider-ui-con"> <div class="dzstooltip-con js for-hover" > <i class="fa fa-info-circle"></i> <div class="clear"></div> <span class="dzstooltip arrow-right align-top skin-white transition-slidein no-arrow" style="right:100%; max-width: 300px; margin-right: 5px; "> <img class="fullwidth" src="img/tooltip_saturation_amount.jpg"/> <span class="content-inner">Besides the blur effect, you can use saturation as part of your design. It\'s classy, beautiful and impressive.</span> </span> </div> <h6>Saturation Amount</h6> <input type="hidden" class="slider-ui-target-field" name="saturation_ammount" value="100"/> <div class="slider-ui "></div> </div> <div class="setting setting-for-colorpicker"> <h6 style="float:left; ">Primary Color</h6> <input type="hidden" class="with-colorpicker" name="color_primary" value="#e74c3c"/> <div class="picker-con align-right"><div class="the-icon"></div><div class="picker"></div></div> </div> <div class="clear"></div> <div style="white-space: nowrap; position: relative;"> <span class="preseter-button preseter-button--save">Save changes</span> <span class="preseter-button preseter-button--default">To default</span> </div> <div class="clear"></div> </div><!--end the-content--> </div> </div> <div class="clear"></div> </div> </div>');
            }


            var datenow = new Date().getTime();
            if(localStorage.getItem('menu-type')){
                try{
                    var obj = JSON.parse(localStorage.getItem('menu-type'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('menu-type-1 menu-type-2 menu-type-3 menu-type-4 menu-type-5 menu-type-6 menu-type-7 menu-type-8 menu-type-9 menu-type-10 menu-type-11 menu-type-12 menu-type-13 menu-type-14 menu-type-15 menu-type-16 menu-type-17 menu-type-18 menu-is-sticky ');

                        _body.addClass(obj.value);


                        if(obj.value=='menu-type-13'||obj.value=='menu-type-14'||obj.value=='menu-type-15'||obj.value=='menu-type-16'||obj.value=='menu-type-17'||obj.value=='menu-type-18'){

                            _body.addClass('menu-is-sticky');
                        }

                        $('.preseter select[name=menu-type]').val(obj.value);

                    }
                }catch(err){
                    console.log(err);
                }


            }else{
                if(is_firefox()){

                    $('.preseter select[name=menu-type]').val('menu-type-1');
                }
            }

            //console.info(localStorage.getItem('page-title-style'))
            if(localStorage.getItem('page-title-style')){

                try{
                    var obj = JSON.parse(localStorage.getItem('page-title-style'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('page-title-style-1 page-title-style-2 page-title-style-3 page-title-style-3b ');

                        _body.addClass(obj.value);


                        $('.preseter select[name=page-title-style]').val(obj.value);


                        if(obj.value=='page-title-style-3b'){

                            var aux23 = 'body.page-title-style-3b .the-content-con > h1:first-of-type{ text-transform: lowercase; }';
                            //console.info('ceva',aux23);
                            //_qcre_aux_css.html(_qcre_aux_css.html()+aux23);
                        }
                    }
                }catch(err){
                    console.log(err);
                }


            }else{
                if(is_firefox()){

                    //console.info('FF COMMON, set default values', $('.preseter select[name=page-title-style]'),$('.preseter select[name=page-title-style] option:selected'))
                    $('.preseter select[name=page-title-style]').val('page-title-style-2');
                }
            }


            if(localStorage.getItem('page-title-align')){

                try{
                    var obj = JSON.parse(localStorage.getItem('page-title-align'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    //console.log(obj.value);
                    if(obj.value && datenow - obj.timestamp < 1800000){
                        //console.log(obj.value);
                        _body.removeClass('page-title-align-left page-title-align-center page-title-align-right');

                        _body.addClass(obj.value);


                        $('.preseter select[name=page-title-align]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }
            if(localStorage.getItem('content-align')){

                try{
                    var obj = JSON.parse(localStorage.getItem('content-align'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('content-align-left content-align-center content-align-right');

                        _body.addClass(obj.value);


                        $('.preseter select[name=content-align]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('heading-style')){

                try{
                    var obj = JSON.parse(localStorage.getItem('heading-style'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.the-content-sheet-text').removeClass('heading-style-1 heading-style-2 heading-style-3 heading-style-4 heading-style-5')

                        $('.the-content-sheet-text').addClass(obj.value);

                        if((obj.value=='heading-style-1'||obj.value=='heading-style-2')&&$('.the-content-sheet-text').eq(0).length>0){

                            $('.the-content-sheet-text').each(function(){
                                var _t232=$(this);

                                _t232.html(_t232.html().split('<br>').join(' '))
                            })

                        }
                        if((obj.value=='heading-style-4')&&$('.the-content-sheet-text').eq(0).length>0){

                            $('.the-content-sheet-text').each(function(){
                                var _t232=$(this);


                                var auxa = _t232.html().split('<br>');

                                var aux_str = String(_t232.html()).replace(/<h2>(.*)<br>(.*)<\/h2>/g, '<h2><span class="light">$1</span>$2<\/h2>');

                                //console.log(aux_str);
                                _t232.html(aux_str)
                            })

                        }

                        //console.info(obj, obj.value);
                        $('.preseter select[name=heading-style]').val(obj.value);

                    }
                }catch(err){
                    console.log(err);
                }


            }
            if(localStorage.getItem('heading-aligment')){

                try{
                    var obj = JSON.parse(localStorage.getItem('heading-aligment'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.the-content-sheet-text').removeClass('heading-is-left heading-is-center heading-is-right')

                        $('.the-content-sheet-text').addClass(obj.value);


                        $('.preseter select[name=heading-aligment]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('menu-type')){

                try{
                    var obj = JSON.parse(localStorage.getItem('menu-type'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('menu-type-1 menu-type-2 menu-type-3 menu-type-4 menu-type-5 menu-type-6 menu-type-7 menu-type-8 menu-type-9 menu-type-10 menu-type-11 menu-type-12 ')

                        _body.addClass(obj.value);


                        $('.preseter select[name=menu-type]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('parallax_bg')){

                try{
                    var obj = JSON.parse(localStorage.getItem('parallax_bg'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.preseter *[name=parallax_bg]').prop('checked',false);

                        window.qcreative_options.bg_isparallax = obj.value;


                        $('.preseter *[name=parallax_bg][value='+window.qcreative_options.bg_isparallax+']').prop('checked',true);
                    }
                }catch(err){
                    console.log(err);
                }


            }



            if(localStorage.getItem('menu-type')){

                try{
                    var obj = JSON.parse(localStorage.getItem('menu-type'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        _body.removeClass('menu-type-1 menu-type-2 menu-type-3 menu-type-4 menu-type-5 menu-type-6 menu-type-7 menu-type-8 menu-type-9 menu-type-10 menu-type-11 menu-type-12 ')

                        _body.addClass(obj.value);

                        if(obj.value=='menu-type-1'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_1-7.png');
                        }
                        if(obj.value=='menu-type-2'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_2-8.png');
                        }
                        if(obj.value=='menu-type-3'||obj.value=='menu-type-13'||obj.value=='menu-type-15'||obj.value=='menu-type-17'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_3-9.png');
                        }
                        if(obj.value=='menu-type-4'||obj.value=='menu-type-14'||obj.value=='menu-type-16'||obj.value=='menu-type-18'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_4-10.png');
                        }
                        if(obj.value=='menu-type-5'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_5.png');
                        }
                        if(obj.value=='menu-type-6'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_6.png');
                        }
                        if(obj.value=='menu-type-7'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_1-7.png');
                        }
                        if(obj.value=='menu-type-8'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_2-8.png');
                        }
                        if(obj.value=='menu-type-9'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_3-9.png');
                        }
                        if(obj.value=='menu-type-10'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_4-10.png');
                        }
                        if(obj.value=='menu-type-11'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_11-12.png');
                        }
                        if(obj.value=='menu-type-12'){
                            $('img.the-logo').attr('src', 'img/logos/logo_m_11-12.png');
                        }


                        $('.preseter select[name=menu-type]').val(obj.value);
                    }
                }catch(err){
                    console.log(err);
                }


            }
            if(localStorage.getItem('blur_ammount')){

                try{
                    var obj = JSON.parse(localStorage.getItem('blur_ammount'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        window.qcreative_options.blur_ammount = Number(obj.value);
                        $('.preseter *[name=blur_ammount]').val(obj.value);


                        //$('.slider-ui-for-blur').slider("value", Number(localStorage.getItem('blur_ammount')));
                    }
                }catch(err){
                    console.log(err);
                }


            }

            if(localStorage.getItem('saturation_ammount')){

                try{
                    var obj = JSON.parse(localStorage.getItem('saturation_ammount'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.preseter *[name=saturation_ammount]').val(obj.value);

                        var aux24 = 100-Number(obj.value);

                        var aux23 = '.translucent-con .translucent-canvas{ -webkit-filter: grayscale('+aux24+'%); -ms-filter: grayscale('+aux24+'%); -moz-filter: grayscale('+aux24+'%);  filter: grayscale('+aux24+'%); }';
                        //console.info('ceva',aux23);
                        _qcre_aux_css.html(_qcre_aux_css.html()+aux23);
                        //$('.slider-ui-for-blur').slider("value", Number(localStorage.getItem('blur_ammount')));
                    }
                }catch(err){
                    console.log(err);
                }


            }


            if(localStorage.getItem('color_primary')){

                try{
                    var obj = JSON.parse(localStorage.getItem('color_primary'));

                    //console.info(obj.timestamp, datenow, (datenow - obj.timestamp)/1000);

                    if(obj.value && datenow - obj.timestamp < 1800000){
                        $('.preseter *[name=color_primary]').val(obj.value);


                        var aux23 = 'ul.the-actual-nav li.current-menu-item > a, ul.the-actual-nav > li:hover > a, ul.redcircle li:before, .dzs-tabs.skin-qcre .tabs-menu .tab-menu-con.active .tab-menu, .btn-read-more.color-highlight, .ul.the-actual-nav li ul li > a, .dzs-tabs.skin-qcre.is-toggle .tabs-menu .tab-menu-con.active .tab-menu, .btn-read-more:hover, .btn-read-more:focus:hover, .bullet-feature-form .icon-con, .bullet-feature-form.form-hexagon .icon-con, ul.the-actual-nav li ul li > a,.sidebar-block h4, .dzstooltip.skin-red, .qc-pagination > li.active > a, .qc-pagination > li:hover > a,.btn-full-white:hover,body.page-blogsingle .blog-link-con .portfolio-link--title:hover,body.page-blogsingle .blog-link-con .portfolio-link--toback.center-td:hover > a,.btn-full-red,body.page-blogsingle .blog-comments .btn-load-more-comments:hover,.selector-con-for-skin-melbourne .a-category.active, .selector-con-for-skin-melbourne .a-category:hover,.zfolio.skin-melbourne .zfolio-item:hover .item-meta,.ajax-preloader .loader:after,.zfolio.skin-silver .selector-con .a-category.active, .zfolio.skin-silver .selector-con .a-category:hover, .zfolio.skin-melbourne .selector-con .a-category.active, .zfolio.skin-melbourne .selector-con .a-category:hover, .zfolio.skin-gazelia .selector-con .a-category.active, .zfolio.skin-gazelia .selector-con .a-category:hover, .zfolio.skin-qcre .selector-con .a-category.active, .zfolio.skin-qcre .selector-con .a-category:hover,ul.sidebar-count-list > li:hover > a .the-count,.sidebar-search-con .search-submit-con:hover, .team-member-element .meta-con .social-profiles .circle-con:hover,body.body-style-light .qc-pagination > li.active > a, body.body-style-light .qc-pagination > li:hover > a,.map-canvas-con .contact-info .services-lightbox--close:hover,.advancedscroller.skin-qcre > .arrowsCon > .arrow-left:hover, .advancedscroller.skin-qcre .arrowsCon > .arrow-right:hover,.qcreative-pricing-table a.signup-button:hover,.advancedscroller .item .description-wrapper:hover .description-wrapper--icon-con,.advancedscroller.skin-karma-inset .arrowsCon > .arrow-left:hover, .advancedscroller.skin-karma-inset .arrowsCon > .arrow-right:hover,body.page-portfolio-single .the-content-con.fullit .portfolio-single-liquid-title > h2,body.page-portfolio-single .the-content-con.fullit .portfolio-single-liquid-title .portfolio-single-liquid-info:hover,.main-container .the-content-con.fullit .portfolio-single-subtitle,.portfolio-link-con .portfolio-link--title:hover,.portfolio-link-con .portfolio-link--toback.center-td:hover,body.page-portfolio-single .the-content-con.fullit .arrow-left-for-skin-qcre:hover, body.page-portfolio-single .the-content-con.fullit .arrow-right-for-skin-qcre:hover,.zoombox-maincon.skin-whitefull .main-con > .slider-con .arrow-left-for-skin-qcre:hover, .zoombox-maincon.skin-whitefull .main-con > .slider-con .arrow-right-for-skin-qcre:hover,.services-lightbox-content .services-lightbox--close:hover,.advancedscroller .item .description-wrapper.active .description-wrapper--icon-con, ul.nostyle li > .icon-con{ background-color: '+obj.value+'; } ul.the-actual-nav li ul li.current-menu-item > a, ul.the-actual-nav li ul > li:hover > a, .btn-read-more.style-hallowred, .btn-read-more.style-hallowred:focus, .bullet-feature-red .icon-con .fa,a.post-main-link:hover,body.page-blogsingle .post-meta-below a:hover,body.page-blogsingle .blog-comments ul.itemCommentsList .comment-right-meta a:hover,ul.sidebar-count-list > li:hover > a .cat-name,.post-meta a:hover,.main-gallery--descs .main-gallery--desc .big-number,.contact-info a:hover,.sidebar-block-archive > a:last-child:hover,body.page-portfolio-single .portfolio-single-meta-con a,body.page-portfolio-single blockquote a:hover,body.menu-type-2 ul.the-actual-nav li ul li.current-menu-item > a, body.menu-type-2 ul.the-actual-nav li ul > li:hover > a,.zoombox-maincon.skin-whitefull .main-con > .info-con blockquote a:hover,.excerpt-content blockquote a:hover,.arrow-left-for-skin-qcre-2:hover > i, .arrow-right-for-skin-qcre-2:hover > i, .close-btn-for-skin-qcre:hover > i, .post-meta a{ color:  '+obj.value+';} .dzs-tabs.skin-qcre.is-toggle .tabs-menu .tab-menu-con.active .plus-sign rect{ fill: '+obj.value+';} .btn-read-more.style-hallowred, .btn-read-more.style-hallowred:focus, .bullet-feature-red .icon-con,.arrow-left-for-skin-qcre-2:hover, .arrow-right-for-skin-qcre-2:hover, .close-btn-for-skin-qcre:hover,.dzs-tabs.skin-qcre:not(.is-toggle) .tabs-menu .tab-menu-con.active{ border-color: '+obj.value+';} .bullet-feature-form.form-hexagon .icon-con:after,.selector-con.selector-con-for-skin-melbourne .categories .a-category:before,.main-container .the-content-con.fullit .zfolio.skin-silver .selector-con .categories .a-category:before, .main-container .the-content-con.fullit .zfolio.skin-melbourne .selector-con .categories .a-category:before{ border-top-color: '+obj.value+';} .bullet-feature-form.form-hexagon .icon-con:before, .ajax-preloader:before,.zfolio.skin-melbourne .zfolio-item:hover .item-meta:before,body.page-portfolio-single .portfolio-single-meta-con a:hover, .post-meta a:hover{ border-bottom-color: '+obj.value+';} .dzstooltip.skin-red.arrow-right:before{ border-left-color: '+obj.value+';} ::selection{ background-color: '+obj.value+'; } ::-moz-selection{ background-color: '+obj.value+'; } .btn-read-more.style-hallowred:hover, .btn-read-more.style-hallowred:focus, .bullet-feature-red .icon-con{  border-color: '+obj.value+';color: #fff;}';
                        _qcre_aux_css.html(_qcre_aux_css.html()+aux23);
                    }
                }catch(err){
                    console.log(err);
                }


            }




            if($.fn.slider){
                $( ".slider-ui" ).each(function(){
                    var _t = $(this);
                    //console.info(_t);

                    var min = 0;
                    var max = 100;
                    var val = 1;

                    if(_t.parent().hasClass('slider-ui-con')){

                        val = _t.parent().find('.slider-ui-target-field').eq(0).val();
                        if(_t.hasClass('slider-ui-for-blur')){
                            max = 30;
                        }
                    }

                    _t.slider({
                        min: min,
                        max: max,
                        value: val,
                        slide: function( event, ui ) {

                            if($(this).parent().hasClass('slider-ui-con')){
                                $(this).parent().find('.slider-ui-target-field').eq(0).val(ui.value);
                            }
                        }
                    })
                })
            }

        } else {
            // Sorry! No Web Storage support..
        }



        var _c = $('.preseter .the-content');
        //console.info(_c, _c[0]);
        if (_c[0] && _c[0].addEventListener){
            _c[0].addEventListener('DOMMouseScroll', handle_the_wheel, false);
        }else{
        }
        _c[0].onmousewheel = handle_the_wheel;


    }

    if(_body.hasClass('menu-type-5')||_body.hasClass('menu-type-6')){

        _body.addClass('menu-is-sticky');
    }

    if(_body.hasClass('menu-type-9')||_body.hasClass('menu-type-10') ||_body.hasClass('menu-type-13') ||_body.hasClass('menu-type-14') ||_body.hasClass('menu-type-15') ||_body.hasClass('menu-type-16') ||_body.hasClass('menu-type-17') ||_body.hasClass('menu-type-18') ){

        // -- social icons rearrangement

        var _c23 = _navCon.children('.nav-social-con');
        if(_c23.length>0){
            _c23.width(_c23.children('.social-icons').eq(0).width() + 3);
        }

        _theActualNav.css('margin-right', String(_c23.outerWidth()+30) + 'px')
    }


    windowhref = window.location.href;
    if(window.qcreative_options.enable_ajax == 'on' && window) {


        if(window.qcreative_options.site_url=='detect'){


            var auxa = windowhref.split('/');

            var i = 0;
            for(i in auxa){

                if(i>0){
                    ajax_site_url+='/';
                }
                if(i<auxa.length-1){
                    ajax_site_url+=auxa[i];
                }


            }
        }else{
            ajax_site_url = window.qcreative_options.site_url;
        }
        //console.log(ajax_site_url);


    }



    if(ieVersion()==11){
        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        //script.src= 'js/StackBlur.js';
        script.src= 'js/FastBlur.js';
        head.appendChild(script);
    }



    $('script').each(function(){
        var _t = $(this);


        if(_t.attr('src')){
            scripts_loaded_arr.push(_t.attr('src'));
        }
        //console.info(_t.attr('src'));

        if(String(_t.attr('src')).indexOf('https://maps.googleapis.com/maps/api')==0){
            window.google_maps_loaded = true;
        }
    });


    $('link').each(function(){
        var _t = $(this);

        //console.info(_t);

        if(_t.attr('rel')=='stylesheet' && _t.attr('href')){
            var aux_href = _t.attr('href');
            if(aux_href.indexOf('./')==0){
                aux_href = aux_href.replace('./','');
            }
            scripts_loaded_arr.push(aux_href);
        }
    });


    //console.info(_navCon_520,_navCon.children('.logo-con'))




    $(this).scrollTop(0);

    setTimeout(function(){

    },4000);



    if(page!='page-homepage' && page!='page-gallery-w-thumbs' && window.qcreative_options.bg_isparallax=='on'){
        $('.translucent-canvas').addClass('for-parallaxer');
    }
    //console.info(scripts_loaded_arr)


    if(window.qcreative_options.enable_ajax=='on'){
        if(_body.children('.ajax-preloader').length==0){
            _body.append('<div class="ajax-preloader"><div class="loader"></div></div>')


            // <div class="preloader-wandering-cubes"><div class="preloader-cube preloader-cube1"></div><div class="preloader-cube preloader-cube2"></div></div>
        }
    }



    determine_page();

    //console.info('reinit from document ready');
    reinit();


    var stateObj = {href: curr_html};

    history.pushState(stateObj,  curr_html);


    $(document).delegate('.main-gallery-buttons-con > *','click', handle_mouse);

    $(document).delegate('.map-toggler', 'click',handle_mouse)
    $(document).delegate('.menu-toggler', 'click',handle_mouse)
    $(document).delegate('.menu-closer', 'click',handle_mouse)
    $(document).delegate('.services-lightbox', 'click',handle_mouse)
    $(document).delegate('.services-lightbox--close', 'click',handle_mouse)
    $(document).delegate('.contact-form .contact-form-button', 'click',handle_mouse)
    $(document).delegate('.submit-comment', 'click',handle_mouse)
    $(document).delegate('.portfolio-single-liquid-info', 'click',handle_mouse)
    $(document).delegate('.arrow-left-for-skin-qcre', 'click',handle_mouse)
    $(document).delegate('.arrow-right-for-skin-qcre', 'click',handle_mouse)
    $(document).delegate('.description-wrapper--icon-con', 'click',handle_mouse)
    $(document).delegate('.preseter-button--save', 'click',handle_mouse)
    $(document).delegate('.preseter-button--default', 'click',handle_mouse)
    //console.info($('.qcreative--520-nav-con'));
    $(document).delegate('.gallery-thumbs--image-container .advancedscroller .arrow-right,.gallery-thumbs--image-container .advancedscroller .arrow-left', 'click',handle_mouse_for_gallery_w_thumbs)



    $(window).bind('beforeunload',handle_beforeunload);
    $(window).bind('resize',handle_resize);
    handle_resize(null,{
        'redraw_canvas' : false
    });

    $(window).bind('scroll', handle_scroll);

    if(window.addEventListener){

        window.addEventListener('popstate', handle_popstate);
    }

    //console.log(_navCon_520.find('option'));

    _navCon.find('a').bind('click', click_menu_anchor);
    $('.menu-toggler-target, .logo-con').find('a').bind('click', click_menu_anchor);

    if(_body.hasClass('menu-type-3')||_body.hasClass('menu-type-4')||_body.hasClass('menu-type-5')||_body.hasClass('menu-type-6')||_body.hasClass('menu-type-7')||_body.hasClass('menu-type-8')){

        _theActualNav.children().each(function(){
            var _t = $(this);

            //console.info(_t);
            if(_t.find('ul').length>0){
                _t.append('<i class="sub-menu-indicator fa fa-chevron-circle-right"></i>');
            }
        })
    }

    goto_bg(0);


    handle_frame();


    function handle_the_wheel(e){

        //console.info('ceva');

        clearTimeout(inter_preseter_scroll);

        inter_preseter_scroll = setTimeout(function(){

            //console.info('ceva');

            var _c = $('.preseter .the-content');

            _c.find('.dzstooltip-con').each(function(){
                var _t233 = $(this);

                if(_t233.get(0) && _t233.get(0).api_handle_resize){
                    _t233.get(0).api_handle_resize();
                }
            })


        },300);

        e.stopPropagation()
    }


    function handle_beforeunload(){
        if(window.preseter_init){

            //localStorage.setItem("menu-type", '');
            //localStorage.setItem("page-title-style", '');
            //localStorage.setItem("page-title-align", '');
            //localStorage.setItem("heading-style", '');
            //localStorage.setItem("content-align", '');
            //localStorage.setItem("parallax_bg", '');
            //localStorage.setItem("blur_ammount", '');
            //localStorage.setItem("saturation_ammount", '');
            //localStorage.setItem("color_primary", '');
        }
    }

    function misc_regulate_nav(){

        //console.info(_navCon);

        regulate_nav();

        return false;

        //if( _body.hasClass('menu-type-5')||_body.hasClass('menu-type-6') ){
        //    _navCon.css({
        //        'top' : $(window).scrollTop() + 'px'
        //    })
        //
        //    if(ww<responsive_breakpoint){
        //
        //    }
        //}

        if(_body.hasClass('page-blogsingle') && _sidebarMain){

            //console.info(_sidebarMain.offset().top);


            //console.info(_theContent.offset().top, _theContent.height(), _sidebarMain.offset().top, _sidebarMain.height())
            //console.info(_sidebarMain.offset().top, _sidebarMain.height(), $(window).scrollTop(),wh, _sidebarMain.offset().top + _sidebarMain.height() + 30 , $(window).scrollTop()+wh)
            if(initial_sidebar_offset + _sidebarMain.height() + 30 < $(window).scrollTop()+wh){
                //console.info('ceva');

                var aux = ($(window).scrollTop()+wh) - (initial_sidebar_offset + _sidebarMain.height() + 30);



                //console.info(aux + initial_sidebar_offset+_sidebarMain.height(), _theContent.offset().top + _theContent.height() );

                if(aux + initial_sidebar_offset + _sidebarMain.height()> _theContent.offset().top + _theContent.height() + 40){
                    aux = _theContent.offset().top + _theContent.height() - _sidebarMain.height() + 40 - initial_sidebar_offset;
                }

                _sidebarMain.css({
                    'top' : aux
                })
            }else{

                _sidebarMain.css({
                    'top' : 0
                })
            }
            if(ww<responsive_breakpoint){

                _sidebarMain.css({
                    'top' : ''
                })
            }
        }
        //();


    }


    function reinit(){

        console.info('reinit()');


        var auxa = String(window.location.href).split('/');


        var aux2 = auxa[auxa.length-1];

        if(aux2.indexOf('?')>-1){
            //console.info(aux2);

            if(aux2.indexOf('clearcache=on')>-1){

                curr_html_with_clear_cache = true;
            }
            curr_html = aux2.split('?')[0];
        }else{
            curr_html=aux2;
        }
        if(curr_html==''){
            curr_html = 'index.html';
        }

        //console.info(auxa,aux2,curr_html);

        //console.info(page_is_fullwidth, _mainContainer.hasClass('fullit'));


        //$(document).scrollTop(0);


        setTimeout(function(){

            _body.removeClass('q-ajax-transitioning');
        },100)
        _body.removeClass('qtransitioning');
        _body.removeClass('page-is-fullwidth');







        //console.info(window.qcreative_options);
        if(window.qcreative_options.enable_native_scrollbar!='on' && get_query_arg(window.location.href, 'disable_scrollbar')!=='on' && window.dzsscr_init){
            window.dzsscr_init($('.main-container'),{
                'type':'scrollTop'
                ,'settings_skin':'skin_apple'
                ,enable_easing: 'on'
                ,settings_autoresizescrollbar: 'on'
                ,settings_chrome_multiplier : 0.12
                ,settings_firefox_multiplier : -3
                ,settings_safari_multiplier: 0.25
                , settings_ie_multiplier: 0.8 //scrollmultiplier for ie
                ,settings_refresh: 700
            })



            if(_mainContainer.get(0) && _mainContainer.get(0).api_set_action_handle_frame){

                _mainContainer.get(0).api_set_action_handle_frame(misc_regulate_nav);
            }




        }else{
            $('html').addClass('has-native-scrollbar');
        }

        if(is_touch_device()){

            $('html').addClass('has-native-scrollbar');
        }


        //console.info('social_scripts_reinit', social_scripts_reinit)
        if(social_scripts_reinit){
            //console.info('REINIT SOCIAL SCRIPS');
            if(window.FB && FB.XFBML && FB.XFBML.parse){
                //console.info('REINIT SOCIAL SCRIPS - FB');
                FB.XFBML.parse();
            }


            if(window.twttr && window.twttr.widgets && window.twttr.widgets.load){
                //console.info('twitter - load');
                twttr.widgets.load()
            }
        }



        if(_mainContainer.find('.the-content-con').eq(0).hasClass('fullit')){
            page_is_fullwidth=true;
        }

        if(page=='page-gallery-w-thumbs'||page=='page-homepage'){

            page_is_fullwidth=true;
        }

        is_menu_horizontal_and_full_bg = false;
        if(page_is_fullwidth){

            $("body").addClass('page-is-fullwidth');


            if (_body.hasClass('menu-type-9') || _body.hasClass('menu-type-10') || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')) {
                is_menu_horizontal_and_full_bg = true;


                //console.log($('.fullbg').eq(0).css('top'));
                _full_bg = $('.fullbg').eq(0);

                full_bg_init_y = parseInt(_full_bg.css('top'),10);


            }
        }


        if(_theContent){
            if(_theContent.parent().children('.qcreative--520-nav-con').length==0){


                _theContent.parent().prepend('<div class="qcreative--520-nav-con "> <div class="dzs-select-wrapper skin-justvisible "> <div class="dzs-select-wrapper-head"> <div class="nav-wrapper-head"><i class="fa fa-bars"></i></div> </div> <select class="dzs-style-me-from-q skin-justvisible " name="the_layout"> <option value="default">default</option> <option value="random">random</option> </select> </div> </div>');


                _navCon_520 = _theContent.parent().children('.qcreative--520-nav-con').eq(0);
            }


            var _c = _theContent.find('.responsive-featured-media-con').eq(0);
            if(_c.length>0){
                //console.info('ceva');

                if(_c.children().length==0){
                    if(_theContent.find('.responsive-featured-media-con--target').length>0){
                        //console.info(_theContent.find('.responsive-featured-media-con--target'),_theContent.find('.responsive-featured-media-con--target').html());


                        _c.append(_theContent.find('.responsive-featured-media-con--target').html());

                        if(_theContent.find('.responsive-featured-media-con--target').eq(0).hasClass('advancedscroller-con')){

                            _c.children('.advancedscroller').removeClass('skin-nonav').addClass('skin-qcre').height(400);
                            _c.children('.advancedscroller').attr('data-options','{ settings_mode: "onlyoneitem",design_arrowsize: "0" ,settings_swipe: "on" ,settings_autoHeight: "on",settings_autoHeight_proportional: "on",settings_swipeOnDesktopsToo: "on" ,settings_slideshow: "on" ,settings_slideshowTime: "150" }');

                        }

                    }
                }


                if(_c.children().length==0){
                    if(_theContent.find('.responsive-featured-media-con--target').length==0){

                        var aux = $('.main-bg-div').eq(0).css('background-image');
                        var aux2 = '<img src="'+window.qcreative_options.images_arr[0]+'" class="fullwidth"/>';

                        //console.log(window.qcreative_options);

                        _c.append(aux2);
                        //_c.append();
                        //_c.children('.main-bg-div').height(400);
                    }
                }


            }
        }else{
            if(page=='page-homepage'){

                if($('.the-content-con').eq(0).children('.qcreative--520-nav-con').length==0){

                    $('.the-content-con').eq(0).prepend('<div class="qcreative--520-nav-con "> <div class="dzs-select-wrapper skin-justvisible "> <div class="dzs-select-wrapper-head"> <div class="nav-wrapper-head"><i class="fa fa-bars"></i></div> </div> <select class="dzs-style-me-from-q skin-justvisible " name="the_layout"> <option value="default">default</option> <option value="random">random</option> </select> </div> </div>');


                    _navCon_520 = $('.the-content-con').eq(0).children('.qcreative--520-nav-con').eq(0);
                }

            }
        }




        if(_navCon_520.children('.logo-con').length==0){

            _navCon_520.prepend(_navCon.children('.logo-con').clone());
        }

        var _cac = _navCon_520.find('.dzs-select-wrapper select').eq(0);

        _cac.html('');
        _theActualNav.children('li').each(function(){
            var _t = $(this);
            //console.info(_t);



            var aux_str = '<option';

            if(_t.hasClass('current-menu-item')){
                aux_str+=' selected';
            }

            aux_str +=' value="'+_t.children('a').attr('href')+'">'+_t.children('a').eq(0).html()+'</option>';

            _cac.append(aux_str);

            //console.info(_t,_t.hasClass('current-menu-item'));
            if(_t.children('ul').length>0){

                _t.children('ul').eq(0).children('li').each(function(){

                    var _t2 = $(this);
                    _cac.append('<option value="'+_t2.children('a').attr('href')+'"> - '+_t2.children('a').eq(0).html()+'</option>');


                    //console.info(_t2, _t2.children('ul'));

                    _t2.children('ul').eq(0).children('li').each(function(){

                        var _t3 = $(this);
                        //console.info(_t2);
                        _cac.append('<option value="'+_t3.children('a').attr('href')+'"> - - '+_t3.children('a').eq(0).html()+'</option>');


                    });
                });
            }
        });
        _navCon_520.find('select').eq(0).unbind('change', change_nav_con_520);
        _navCon_520.find('select').eq(0).bind('change', change_nav_con_520);


        content_width = 930;

        if (_body.hasClass('menu-type-3') || _body.hasClass('menu-type-4')) {

            menu_width = 230;
        }
        if (_body.hasClass('menu-type-5') || _body.hasClass('menu-type-6') || _body.hasClass('menu-type-7') || _body.hasClass('menu-type-8') || _body.hasClass('menu-type-11')) {

            menu_width = 260;
        }
        if (_body.hasClass('menu-type-12')) {

            menu_width = 170;
            menu_width_on_right = 200;
        }
        if (_body.hasClass('page-portfolio') || _body.hasClass('page-blogsingle') ) {

            content_width -= 60;
        }



        if (_body.hasClass('menu-type-5') || _body.hasClass('menu-type-6') || _body.hasClass('menu-type-7') || _body.hasClass('menu-type-8') || _body.hasClass('menu-type-11')) {
            menu_content_space = 30;
        }
        if (_body.hasClass('menu-type-9') || _body.hasClass('menu-type-10') || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') ) {
            //console.info('ceva',_theContent, _theContent.parent().prev(), _theContent.parent().prev().length==0, _theContent.parent().prev().hasClass('q-creative--nav-con'));
            menu_width=0;
            menu_width_on_right = 0;
            menu_content_space = 0;
            menu_height = 135;
            thumbs_padding_left_and_right = 40;
            thumbs_list_padding_right = 20;

            if( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){
                menu_height = 100;
            }


            if( _theContent&& ( _theContent.parent().prev().length==0 || _theContent.parent().prev().hasClass('q-creative--nav-con')==false) && _mainContainer.children().eq(0).hasClass('qcreative--nav-con')==false ){

                //console.info('... hmm ', _mainContainer, $('.qcreative--nav-con').eq(0))
                _mainContainer.prepend($('.qcreative--nav-con').eq(0));
            }
        }



        if (_body.hasClass('menu-type-11') || _body.hasClass('menu-type-12')) {
            //console.info('ceva',_theContent, _theContent.parent().prev(), _theContent.parent().prev().length==0, _theContent.parent().prev().hasClass('q-creative--nav-con'));
            _navCon.append('<i class="fa fa-bars menu-toggler"></i>');

            _mainContainer.append('<div class="menu-toggler-target "><div class="q-close-btn menu-closer"><svg version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.42px" height="58.96px" viewBox="0 0 58.42 58.96" xml:space="preserve"> <polygon fill-rule="evenodd" fill="#FFFFFF" points="57,0 29.21,27.78 1.42,0 0,1.42 27.78,29.21 0,57 1.42,58.42 29.21,30.64 57,58.42 58.42,57 30.63,29.21 58.42,1.42 "></polygon> </svg></div></div>');

            _mainContainer.find('.menu-toggler-target').eq(0).append(_navCon.find('.the-actual-nav').eq(0));
        }

        _body.removeClass('page-title-no-antetitle');

        if(_body.hasClass('page-title-style-1')){
            if(String(_body.find('h1').eq(0).html()).indexOf('<br>')>-1){

            }else{
                _body.addClass('page-title-no-antetitle');
            }
        }






        _gallery_thumbs_con = null;

        $('.social-icon').each(function(){

            var aux = window.location.href;
            var _t = $(this);
            _t.attr('onclick', String(_t.attr('onclick')).replace('{{replaceurl}}',aux));
        })






        if($('.sidebar-main').length>0){
            _sidebarMain = $('.sidebar-main').eq(0);

            initial_sidebar_offset = _sidebarMain.offset().top
        }else{
            _sidebarMain = null;

            initial_sidebar_offset =0;
        }




        var i23 = 0;
        $('.translucent-bg').each(function() {
            var _t = $(this);




            //console.info(_t, _t.parent(),_t.parent().parent(),mainBgImgCSS);

            calculate_translucent(_t);


            i23++;
        });


        $('.qcre-progress-circle').each(function() {
            var _t = $(this);



            _t.html(' <div class="dzs-progress-bar skin-prev9copy" style="width:100%; max-width: 150px; height:auto;margin-top:0px;margin-left:auto;margin-right:auto;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><canvas class="progress-bars-item progress-bars-item--circ" data-type="circ" data-animprops=\'{"height":"{{width}}","circle_outside_fill":"#eeeeee","circle_inside_fill":"transparent","circle_outer_width":"1","circle_line_width":"10"}\' style="position: absolute; width: calc(100% + 8px); top: -4px; left: -4px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: transparent;" width="302" height="302"></canvas><canvas class="progress-bars-item progress-bars-item--circ" data-type="circ" data-animprops=\'{"height":"{{width}}","circle_outside_fill":"#303030","circle_inside_fill":"transparent","circle_outer_width":"{{perc-decimal}}","circle_line_width":"2"}\' style="position: relative; width: 100%; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: transparent;" width="298" height="298"></canvas><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{"left":"{{center}}"}\' style="position: absolute; top: 54px; width: 100%; height: auto; right: auto; bottom: auto; margin: 0px; color: rgb(33, 33, 33); border-radius: 0px; border: 0px; opacity: 1; font-size: 40px; background-color: transparent;"><div style="text-align: center; font-family: Lato, arial, serif; font-weight: 300;" data-mce-style="text-align: center;">{{perc}}</div></div></div>');

        });



        $('.qcre-progress-line').each(function() {
            var _t = $(this);

            //var auxhtml = _t.html();


            // --'+_t.html()+'
            _t.html(' <div class="dzs-progress-bar auto-init skin-prev2copy" style="width:100%;height:auto;margin-top:0px;margin-left:0px;margin-right:0px;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(33, 33, 33); border-radius: 0px; border: 0px; opacity: 1; font-size: 14px; background-color: transparent;">'+_t.attr('data-title')+'</div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{"width":"{{perc}}%"}\' style="position: relative; height: 2px; top: 0px; left: 0px; right: auto; bottom: auto; margin: 11px 0px 0px; color: rgb(60, 1, 1); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: rgb(34, 34, 34);"></div><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{"left":"{{perc}}"}\' style="position: absolute; width: 0px; height: auto; top: 0px; right: auto; bottom: auto; margin: 0px 0px 0px 0px; color: #999999; border-radius: 0px; border: 0px; font-size: 14px; background-color: transparent;"><div style="text-align: right; position:absolute; right:0; white-space:nowrap; " data-mce-style="text-align: left;">{{perc}}</div></div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{}\' style="position: absolute; width: 100%; height: 10px; top: 23px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: rgb(238, 238, 238);"></div><div class="progress-bars-item progress-bars-item--rect" data-type="rect" data-animprops=\'{"width":"{{perc}}"}\' style="position: relative; height: 2px; top: auto; left: 0px; right: auto; bottom: 0px; margin: -5px 0px 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 12px; background-color: rgb(34, 34, 34);"></div></div>');

        });

        $('.qcre-progress-text').each(function() {
            var _t = $(this);



            _t.html('<div class="dzs-progress-bar auto-init skin-bignumber" style="width:100%;height:auto;margin-top:0px;margin-left:0px;margin-right:0px;margin-bottom:0px;" data-animprops=\'{"animation_time":"'+_t.attr('data-animation_time')+'","maxperc":"'+_t.attr('data-maxperc')+'","maxnr":"'+_t.attr('data-maxnr')+'","initon":"scroll"}\'><div class="progress-bars-item progress-bars-item--text" data-type="text" data-animprops=\'{}\' style="position: relative; width: 100%; height: auto; top: 0px; left: 0px; right: auto; bottom: auto; margin: 0px; color: rgb(255, 255, 255); border-radius: 0px; border: 0px; opacity: 1; font-size: 50px; background-color: transparent;"><div style="text-align: center;" data-mce-style="text-align: center;"><span style="color: rgb(255, 255, 255); font-family: \'Open Sans\', Helvetica, Arial, sans-serif; font-size: 50px; line-height: 20px; background-color: transparent;" data-mce-style="color: #ffffff; font-family: \'Open Sans\', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 20px; background-color: #313131;">{{percmaxnr}}</span></div></div></div>');

        });


        if(window.dzsprb_init){

            window.dzsprb_init('.dzs-progress-bar',{init_each:true});
        }


        //console.info(".translucent-canvas");

        $('.translucent-canvas').each(function() {
            var _t = $(this);


            //calculate_translucent_canvas(_t);




            //
            //
            //function drawStackBlur() {
            //
            //
            //    var aux2 = $('.main-bg').eq(0).css('background-image');
            //    //console.log(_t,_t.css('background-image'));
            //    aux2 = aux2.replace('url(', '');
            //    aux2 = aux2.replace(')', '');
            //    aux2 = aux2.replace("'", '');
            //    aux2 = aux2.replace('"', '');
            //
            //
            //
            //
            //}
            //
            //setTimeout(drawStackBlur, 1000);
            ////console.info(_t, mainBgImgCSS);



        });




        _c_for_parallax_items = [];
        if($('.translucent-canvas.for-parallaxer').length>0){
            $('.translucent-canvas.for-parallaxer').each(function(){
                var _t = $(this);
                _c_for_parallax_items.push(_t);
            })
            //= ;
        }



        //console.log(page, newclass_body);
        if(newclass_body=='page-gallery-w-thumbs') {


            //console.info($("#as-gallery-w-thumbs"));


            $("#as-gallery-w-thumbs").each(function(){
                var _t = $(this);


                var _t2_i = 0;
                _t.find('.items').eq(0).children().each(function(){
                    var _t2 = $(this);
                    //console.log(_t2);

                    if(_t2.attr('data-gallery-thumbnail')){

                        var aux = '<li class="thumb';

                        if(_t2_i==0){
                            aux+=' curr-thumb';
                        }

                        aux+='"  style=";"><div class="bgimage"  style="background-image: url('+_t2.attr('data-gallery-thumbnail')+')"></div></li>';

                        $('.gallery-thumbs-con .thumbs-list').eq(0).append(aux);

                        _t2_i++;
                    }

                    if(_t2.attr('data-type')=='image'){
                        _t2.addClass('needs-loading')
                    }
                    if(_t2.attr('data-type')=='video'){
                        var aux = '<div class="wipeout-wrapper"><div class="wipeout-wrapper-inner"><div class="vplayer-tobe " ';

                        if(_t2.attr('data-width-for-gallery')){
                            aux+=' data-width-for-gallery="'+_t2.attr('data-width-for-gallery')+'"';
                        }
                        if(_t2.attr('data-height-for-gallery')){
                            aux+=' data-height-for-gallery="'+_t2.attr('data-height-for-gallery')+'"';
                        }

                        aux+=' data-src="'+_t2.attr('data-source')+'" >';


                        if(_t2.children('.cover-image').length>0){
                            //console.info(_t2.children('.cover-image'), _t2.children('.cover-image').eq(0).outerHTML())

                            aux+=_t2.children('.cover-image').eq(0).outerHTML();
                            _t2.children('.cover-image').remove();
                        }

                        aux+='</div></div></div>';

                        _t2.addClass('needs-loading')
                        _t2.attr('data-source','');

                        _t2.append(aux);




                        dzsvp_init(_t2.find('.vplayer-tobe'),qcreative_options.video_player_settings)
                    }
                });

                dzsas_init(_t,{
                    settings_mode: "onlyoneitem"
                    ,design_arrowsize: "0"
                    ,settings_swipe: "off"
                    ,settings_swipeOnDesktopsToo: "off"
                    ,settings_slideshow: "on"
                    ,settings_slideshowTime: "300000"
                    ,settings_transition:"wipeoutandfade"
                    ,settings_lazyLoading:'on'
                    ,settings_autoHeight:'on'
                    ,settings_centeritems:false
                    ,design_bulletspos: "none"
                    ,settings_wait_for_do_transition_call: "on"
                    ,settings_transition_only_when_loaded: "on"
                    ,mode_onlyone_autoplay_videos : window.qcreative_options.gallery_w_thumbs_autoplay_videos
                    ,mode_onlyone_reset_videos_to_0:'on'
                });
            });




            if (document.getElementById("as-gallery-w-thumbs") && document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem) {

                document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem(page_gallery_w_thumbs_calculate);
            }
        }

        if(_mainContainer.get(0) && _mainContainer.get(0).api_toggle_resize){
            _mainContainer.get(0).api_toggle_resize();
            //console.info('ceva');

            setTimeout(function(){

                _mainContainer.get(0).api_toggle_resize();
            },900);
        }
        //console.info(page);

        $('.zfolio-portfolio-classic a.zfolio-item--inner, .portfolio-link--toback a, a.portfolio-link--title').unbind('click', click_menu_anchor);
        $('.zfolio-portfolio-classic a.zfolio-item--inner, .portfolio-link--toback a, a.portfolio-link--title').bind('click', click_menu_anchor);
        $('a.ajax-link').unbind('click', click_menu_anchor);
        $('a.ajax-link').bind('click', click_menu_anchor);

        if(window.dzsvp_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));



            $('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")').each(function(){
                var _t = $(this);

                if(_t.get(0) && _t.get(0).style && _t.get(0).style.height){
                    //console.log(content_width);

                    _t.data('original-width', _t.width());
                    _t.data('original-height', _t.height());
                    _t.data('reference-width', content_width-60);

                    //console.log(content_width, _theContent.find('.sidebar-main'), ((content_width-30)/3*2) - 30);

                    if(_theContent.find('.sidebar-main').length==1){

                        _t.data('reference-width', ((content_width-30)/3*2) - 30);
                    }

                    videoplayers_tobe_resized.push(_t);
                }

                dzsvp_init(_t,{
                    settings_youtube_usecustomskin:"off"
                    ,init_each:true
                    ,controls_out_opacity: "1"
                    ,controls_normal_opacity: "1"
                    ,settings_video_overlay: "on"
                    ,design_skin: "skin_reborn"
                    ,cueVideo: "off"
                    ,autoplay: "off"
                });
            })


        }



        if(window.dzstaa_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));

            dzstaa_init('.dzs-tabs.auto-init-from-q-for-tabs',{ 'design_tabsposition' : 'top'
                ,design_transition: 'fade'
                ,design_tabswidth: 'default'
                ,toggle_breakpoint : '300'
                ,settings_appendWholeContent: false
                ,toggle_type: 'accordion'});

            dzstaa_init('.dzs-tabs.auto-init-from-q-for-accordions',{ 'design_tabsposition' : 'top'
                ,design_transition: 'fade'
                ,design_tabswidth: 'default'
                ,toggle_breakpoint : '4000'
                ,settings_appendWholeContent: false
                ,toggle_type: 'accordion'});
        }

        if(window.dzsas_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));

            dzsas_init('.advancedscroller.auto-init-from-q.clients-slider',{
                init_each: true
            });

            dzsas_init('.advancedscroller.skin-qcre.auto-init-from-q',{
                init_each: true
            });
            dzsas_init('.advancedscroller.skin-whitefish.auto-init-from-q',{
                init_each: true
            });
            dzsas_init('.advancedscroller.skin-nonav.auto-init-from-q',{
                init_each: true
            });


            setTimeout(function(){
                $('.testimonial-ascroller').each(function(){
                    var _t = $(this);

                    if(_t.get(0) && _t.get(0).api_force_resize){
                        _t.get(0).api_force_resize();
                    }
                })
            },100)
        }
        if(window.dzszfl_init){

            //console.info($('.zfolio.auto-init-from-q'));
            dzszfl_init('.zfolio.auto-init-from-q',{
                init_each: true
            });

        }
        if(window.dzssel_init){


            //zfolio-portfolio-expandable
            //console.info($('.vplayer-tobe.auto-init-from-q:not(".zfolio-portfolio-expandable .vplayer-tobe.auto-init-from-q")'));


            dzssel_init('select.dzs-style-me-from-q', {init_each: true});

        }

        clearInterval(inter_bg_slideshow);
        bg_slideshow_time = Number(window.qcreative_options.bg_slideshow_time);


        if(bg_slideshow_time){
            inter_bg_slideshow = setInterval(function(){
                goto_next_bg();
            }, bg_slideshow_time*1000);
        }



        //console.info(window.qcreative_options);
        //_theContent.find('.zfolio-portfolio-expandable').find('.item-tobe').addClass('loaded');



        //if(window.qcreative_options.bg_isparallax=='on'){
        //    $('.main-bg-con').addClass('dzsparallaxer');
        //    $('.main-bg').addClass('dzsparallaxer--target');
        //
        //    dzsprx_init('.dzsparallaxer', {mode_scroll: 'fromtop', direction: 'reverse'});
        //}
    }
    function page_gallery_w_thumbs_calculate(argcthis, arg,pargs){

        //console.info('page_gallery_w_thumbs_calculate()')

        var margs = {
            arg: 0
        };

        if(pargs){
            margs = $.extend(margs,pargs);
        }
        //console.info('ceva',arg, arg.data('naturalWidth'));

        //console.info(argcthis, argcthis.hasClass('transition-wipeoutandfade'));
        if(argcthis.hasClass('transition-wipeoutandfade')){

            _body.addClass('page-gallery-w-thumbs-transitioning-content');
            setTimeout(function(){

                //console.info(_theContent);

                gallery_thumbs_img_container_nw = arg.data('naturalWidth');
                gallery_thumbs_img_container_nh = arg.data('naturalHeight');




                var args = {
                    'this_is_new_item' : true
                }
                //console.info('CALL calculate_dims_gallery_thumbs_img_container', 'from page_gallery_w_thumbs_calculate')
                calculate_dims_gallery_thumbs_img_container(args);

                setTimeout(function(){

                    _body.addClass('page-gallery-w-thumbs-transition-on-content');

                    //console.info('api_do_transition()');

                    argcthis.get(0).api_do_transition({force_width: (gallery_thumbs_img_container_cw-gallery_thumbs_img_container_padding_space*2),force_height: (gallery_thumbs_img_container_ch-gallery_thumbs_img_container_padding_space*2),arg: margs.arg });
                    setTimeout(function(){

                        //argcthis.get(0).api_force_resize();
                    },20000)
                    _body.removeClass('page-gallery-w-thumbs-transitioning-content');
                },900);



            },700)
        }else{

            argcthis.get(0).api_do_transition();
        }
    }

    function handle_popstate(e){
        console.log(e, e.state);

        if(e.state && e.state.href){
            click_menu_anchor(null, {
                'force_href': e.state.href
                ,force_no_ajax:'on'
            })

            //console.info(e.state.curr_menu_items,Object(e.state.curr_menu_items).size,Object.size(e.state.curr_menu_items));

            //console.log(e.state.curr_menu_items, e.state, history);

            if(Object.size(e.state.curr_menu_items)>0){


                //console.info('my docs', _theActualNav.find('.current-menu-item'))
                _theActualNav.find('.current-menu-item').removeClass('current-menu-item');

                for(var i2 = 0; i2< Object.size(e.state.curr_menu_items); i2++){
                    _theActualNav.find('li').eq(e.state.curr_menu_items[i2]).addClass('current-menu-item');
                }
            }
            return false;
        }
    }


    function imgLoaded_for_thumbs(e){

        //console.log('ceva', this.ref_t);

        if(this){
            if(this.ref_t){
                this.ref_t.addClass('img-loaded');
            }
            if(this.removeEventListener){
                this.removeEventListener('load',imgLoaded_for_thumbs);
            }
        }

    }

    function calculate_dims_gallery_thumbs_img_container(pargs){

        //console.log('calculate_dims_gallery_thumbs_img_container()', pargs);

        var margs = {
            'this_is_new_item' : false
        }

        // -- nw - natural width
        //console.info(gallery_thumbs_img_container_nw);

        //gallery_thumbs_img_container_cw = Number(gallery_thumbs_img_container_nw)+40;
        //gallery_thumbs_img_container_ch = Number(gallery_thumbs_img_container_nh)+40;








        //var ratio_w_h = gallery_thumbs_img_container_nw/gallery_thumbs_img_container_nh;

        //console.info(ratio_w_h);

        //console.info(gallery_thumbs_img_container_nw, gallery_thumbs_img_container_nh);


        var thumb_space = 140;

        var aux_menu_width = menu_width;
        var aux_menu_width_on_right = menu_width_on_right;
        var aux_menu_height = menu_height;

        if(_navCon.css('display')=='none'){
            aux_menu_width = 0;
            aux_menu_height = 0;
            aux_menu_width_on_right=0;

            // --d but on 0 account lets just leave normal scroller
        }



        var responsive_nav_and_thumbs_h = 0;


        var new_iw = 0;
        var new_ih = 0;

        var aux_sep_w = 80;
        var aux_sep_h = 110;


        var aux_iw = Number(gallery_thumbs_img_container_nw)+gallery_thumbs_img_container_padding_space*2;
        var aux_ih =  Number(gallery_thumbs_img_container_nh)+gallery_thumbs_img_container_padding_space*2;

        var aux_sw = ww-aux_menu_width-gallery_thumbs_img_container_padding_space*2;
        var aux_sh = wh-thumb_space-gallery_thumbs_img_container_padding_space*2 - aux_menu_height;

        //console.info(aux_sh);


        $('.the-content-bg-placeholder').eq(0).outerHeight(0);
        if(ww<=responsive_breakpoint){

            responsive_nav_and_thumbs_h = _theContent.parent().height();

            aux_sw = ww - 40;
            aux_sh = wh - responsive_nav_and_thumbs_h;
            if(aux_sh< 400){
                aux_sh = 400;
                _body.addClass('remove_overflow');
            }else{

                _body.removeClass('remove_overflow');
            }


            if(_theContent.prev().hasClass('the-content-bg')==false){
                _theContent.before('<div class="the-content-bg"></div>');
            }



            //console.info(responsive_nav_and_thumbs_h, _theContent.parent().height(), aux_sh);
            //aux_sh = wh - _theContent.parent().height();
        }


        var aux_ir = aux_iw/aux_ih;
        var aux_sr = aux_sw/aux_sh;

        //console.info(aux_iw, aux_ih, aux_sw, aux_sh);

        //console.log(aux_ir, aux_sr);

        if(aux_sr > aux_ir){

            gallery_thumbs_img_container_cw = aux_iw*(aux_sh/aux_ih);
            gallery_thumbs_img_container_ch = aux_sh;

        }else{
            gallery_thumbs_img_container_cw = aux_sw;

            gallery_thumbs_img_container_ch = aux_ih * (aux_sw/aux_iw);
        }


        if(gallery_thumbs_img_container_cw>aux_iw){
            gallery_thumbs_img_container_cw = aux_iw;
            gallery_thumbs_img_container_ch = gallery_thumbs_img_container_cw * (aux_ih /aux_iw);
        }



        //console.info(gallery_thumbs_img_container_cw, gallery_thumbs_img_container_ch)




        var _c = $('.the-content-con > .the-content').eq(0);


        var aux_left = ( aux_menu_width+gallery_thumbs_img_container_padding_space + (ww-aux_menu_width_on_right-aux_menu_width-gallery_thumbs_img_container_padding_space*2)/2 - gallery_thumbs_img_container_cw/2 );
        var aux_top = ( gallery_thumbs_img_container_padding_space + (wh-thumb_space-aux_menu_height-gallery_thumbs_img_container_padding_space*2)/2 - gallery_thumbs_img_container_ch/2 );

        //console.info(aux_top);

        if(ww<=responsive_breakpoint){
            //aux_top+=

            aux_top = responsive_nav_and_thumbs_h;


            $('.the-content-bg').css({
                'width': ww+'px'
                ,'height': gallery_thumbs_img_container_ch+'px'
                ,'top':responsive_nav_and_thumbs_h+'px'
            })

            if($('.the-content-bg').eq(0).offset().top + $('.the-content-bg').eq(0).outerHeight()<wh){
                $('.the-content-bg').eq(0).outerHeight(wh-$('.the-content-bg').eq(0).offset().top);
            }

            $('.the-content-bg-placeholder').eq(0).outerHeight($('.the-content-bg').eq(0).outerHeight());


        }


        setTimeout(function(){

            //console.info(_c, ratio_w_h, gallery_thumbs_img_container_cw, gallery_thumbs_img_container_ch);
            //console.info(cw);
            _c.outerWidth(gallery_thumbs_img_container_cw);
            _c.eq(0).css({
                'left': aux_left+'px'
            });

            //console.info(cw, _c.width(), _c);

            _c.outerHeight(gallery_thumbs_img_container_ch);
            _c.eq(0).css({
                'top': aux_top+'px'
            });
        },50);




        //console.info('1865', page, newclass_body)

        if(newclass_body=='page-gallery-w-thumbs'){

            if(document.getElementById("as-gallery-w-thumbs") && document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem){

                document.getElementById("as-gallery-w-thumbs").api_set_action_call_on_gotoItem(page_gallery_w_thumbs_calculate);
            }



            var delaytime = 0;

            if(margs.this_is_new_item){
                delaytime = 1000;
            }
            setTimeout(function(){

                _theContent.find('.advancedscroller').eq(0).find('.thumbsCon').eq(0).height(gallery_thumbs_img_container_ch-40);
                _theContent.find('.advancedscroller').eq(0).find('.thumbsCon').eq(0).width(gallery_thumbs_img_container_cw-40);
                _theContent.find('.advancedscroller').eq(0).find('.currItem').eq(0).height(gallery_thumbs_img_container_ch-40);
                _theContent.find('.advancedscroller').eq(0).find('.currItem').eq(0).width(gallery_thumbs_img_container_cw-40);
                //_theContent.find('.advancedscroller').eq(0).find('.currItem > img').eq(0).width(gallery_thumbs_img_container_cw-40);


                if(margs.this_is_new_item==false){

                    _theContent.find('.advancedscroller').eq(0).find('.currItem > img').eq(0).css({
                            'width' : (gallery_thumbs_img_container_cw-40)
                            ,'height' : (gallery_thumbs_img_container_ch-40)
                        }, {queue:false, duration: 400}
                    );
                }

                _theContent.addClass('active');
            },1000)

            //console.info($('.gallery-thumbs-con'));
            if($('.gallery-thumbs-con').length>0){
                _gallery_thumbs_con = $('.gallery-thumbs-con').eq(0);


                var gallery_width = 0;

                var gallery_max_width = ww - (menu_width + menu_content_space);

                _gallery_thumbs_con.find('li.thumb:not(.inited)').each(
                    function(){
                        var _t = $(this);

                        //console.info(_t);

                        _t.addClass('inited');

                        if(_t.children().eq(0).hasClass('bgimage')){
                            var aux32 = _t.children().eq(0).css('background-image');
                            aux32 = aux32.replace('url(','');
                            aux32 = aux32.replace(')','');
                            aux32 = aux32.replace(/"/g,'');
                            //console.log(aux32);


                            var auximg = new Image();
                            auximg.ref_t = _t;

                            //var auxfunc =


                            if(auximg.addEventListener){
                                auximg.addEventListener('load', imgLoaded_for_thumbs )
                            }


                            auximg.src = aux32;

                        }else{
                            _t.addClass('img-loaded');
                        }


                        //gallery_width+=100;

                        _t.bind('click',handle_mouse);

                    }
                )


                gallery_width = _gallery_thumbs_con.find('li.thumb').length * 100 + 40;


                _gallery_thumbs_con.find('.thumbs-list').width(gallery_width-40);

                //console.info(gallery_width);

                var aux_add_20 = 0;

                if(gallery_width>gallery_max_width){
                    gallery_width = gallery_max_width;

                    aux_add_20+=20;
                }

                // -- 40 padding
                var auxer23 = 0;
                if(aux_menu_width_on_right){
                    auxer23 = 20;
                }

                var aux_thumbs_list_padding_right = thumbs_list_padding_right;
                //console.info(ww/2, gallery_width/2);

                var aux =  ((menu_width + menu_content_space) + ( (ww - (menu_width + menu_content_space*2) )/2 - gallery_width/2));

                if(aux<menu_width+menu_content_space){
                    aux = menu_width + menu_content_space;
                }

                if(aux>0){
                    //aux = menu_width + menu_content_space;
                    aux_thumbs_list_padding_right = 0;
                }



                //console.log(aux , aux_thumbs_list_padding_right,(gallery_width+aux_add_20-thumbs_padding_left_and_right-aux_menu_width_on_right-auxer23-aux_thumbs_list_padding_right));
                _gallery_thumbs_con.find('.thumbs-list-con').eq(0).width(gallery_width+aux_add_20-thumbs_padding_left_and_right-aux_menu_width_on_right-auxer23-aux_thumbs_list_padding_right);

                _gallery_thumbs_con.css({
                    'left': aux + 'px'
                })

                if(aux_menu_width_on_right){

                    _gallery_thumbs_con.css({
                        'width': 'calc(100% - '+ (aux_menu_width_on_right+20+menu_width) + 'px)'
                    })
                }else{

                    _gallery_thumbs_con.css({
                        'width': ''
                    })
                }



                if(ww<=responsive_breakpoint){
                    _gallery_thumbs_con.css({
                        'left': 0
                        ,'width': '100%'
                    })
                    _gallery_thumbs_con.find('.thumbs-list-con').css('width', '100%');
                    //_gallery_thumbs_con.find('.thumbs-list').width(ww-40);
                    //console.info(ww);
                }


                if(is_touch_device()==false){

                    _gallery_thumbs_con.find('.thumbs-list-con').eq(0).unbind('mousemove');
                    _gallery_thumbs_con.find('.thumbs-list-con').eq(0).bind('mousemove',handle_mouse);
                }else{
                    _gallery_thumbs_con.find('.thumbs-list-con').css('overflow', 'auto');

                }
            }

            if(_theContent){
                //console.info(_theContent);

                if(_theContent.parent().css('opacity')==0){
                    //console.info('this is for gallery-w-thumbs')
                    if(_gallery_thumbs_con){

                        calculate_translucent_canvas(_gallery_thumbs_con.find('.translucent-canvas').eq(0));
                    }
                    //fade_the_content_con(_theContent.parent())
                }
            }

        }


    }



    function click_menu_anchor(e,pargs) {

        //console.info('click_menu_anchor()', pargs);

        var _t = $(this);
        var thehref = _t.attr('href');
        var isselectoption = false;

        var margs = {
            _t: null
            ,force_href: ''
            ,force_no_ajax: 'off'
        }


        if(pargs){
            margs = $.extend(margs,pargs);
        }


        if(margs._t){
            _t = margs._t;
        }


        if(_t && _t.get(0) && _t.get(0).nodeName=='SELECT'){

            isselectoption = true;
            thehref = _t.val();
            //thehref = _t.find(':selected').attr('value');

        }

        if(_t && _t.get(0) && _t.get(0).nodeName=='OPTION'){

            isselectoption = true;
            thehref = _t.val();
            //thehref = _t.find(':selected').attr('value');

        }

        //console.info(_t.hasClass('current-menu-item'), _t, _t.attr('class'));
        //if(_t&&_t.parent().hasClass('current-menu-item') && margs.force_no_ajax!='on'){
        //
        //    return false;
        //}

        //console.log(thehref, curr_html);

        if(thehref==curr_html){
            return false;
        }


        if(is_touch_device()){
            margs.force_no_ajax = 'on';
            window.location.href = thehref;
        }

        //console.info(margs.force_href, margs.force_no_ajax);
        if(margs.force_href){
            thehref = margs.force_href;

            //console.info(margs.force_no_ajax, thehref);

            if(margs.force_no_ajax=='on'){
                window.location.href = thehref;
            }
        }

        //console.info(_t,_t.val(), isselectoption,thehref);
        if(isselectoption){
            //return false;
        }
//        console.info(_t);

        //==== well test if it's an outer link, if its an outside link we dont need any ajax.

        if(window.qcreative_options.enable_ajax == 'on' && window && margs.force_no_ajax!='on') {


            if (thehref == '#') {


                if(window.qcreative_options.enable_native_scrollbar!='on'){
                    return false;
                }
            } else {
                //console.info('ceva', thehref.indexOf('file://'), window.location.href);
                //console.info('ceva', thehref.indexOf('http://') > -1, thehref.indexOf(ajax_site_url));

                //console.log(( window.location.href.indexOf('file://') ==0 || ( thehref.indexOf('http://') > -1 || ( thehref.indexOf('http://') > -1  && thehref.indexOf(ajax_site_url)!= 0) )),window.location.href.indexOf('file://') ==0);

                //return false;

                if ( window.location.href.indexOf('file://') ==0  || ( thehref.indexOf('http://') > -1  && thehref.indexOf(ajax_site_url)!= 0) ) {



                } else {
                    //if indeed we are going to history api it

                    //console.info(scripts_loaded_arr);
                    $('body').removeClass('loaded');
                    $('.q-toexecute').remove();
                    if (can_history_api()) {
                        scripts_tobeloaded=[];
                        stylesheets_tobeloaded=[];
                        var nr_scripts_tobeloaded = 0;


                        $('.portfolio-fulscreen--items').remove();
                        _body.addClass('q-ajax-transitioning');
                        $.ajax({
                            url: thehref,
                            context: document.body
                        }).done(function (response) {

                            if(_t){
                                //console.info(_t.parent().parent().parent());
                                if(_t.parent().parent().parent().hasClass('menu-toggler-target')){
                                    _t.parent().parent().parent().removeClass('active');
                                }
                                if(_t.parent().parent().parent().parent().parent().hasClass('menu-toggler-target')){
                                    _t.parent().parent().parent().parent().parent().removeClass('active');
                                }
                            }

                            ___response = $(response);



                            var regex_bodyclass = /<body.*?class=".*?(page-.*?)[ |"]/g;


                            var aux23 = regex_bodyclass.exec(response);

                            newclass_body = '';
                            if(aux23){
                                if(aux23[1]){
                                    newclass_body = aux23[1];
                                }
                            }

                            //console.log(newclass_body);

                            newclass_body_nopadding = false;
                            newclass_body_with_fullbg = false;

                            regex_bodyclass = /<body.*?class=".*?(no-padding)[ |"]/g;


                            aux23 = regex_bodyclass.exec(response);
                            if(aux23){
                                if(aux23[1]){
                                    newclass_body_nopadding=true;
                                }
                            }


                            regex_bodyclass = /<body.*?class=".*?(with-fullbg)[ |"]/g;


                            aux23 = regex_bodyclass.exec(response);
                            if(aux23){
                                if(aux23[1]){
                                    newclass_body_with_fullbg=true;
                                }
                            }


                            //console.log(response, ___response);


                            //console.log(scripts_loaded_arr);
                            social_scripts_reinit = false;
                            for (i = 0; i < ___response.length; i++) {
                                var _t3 = ___response[i];

                                if(_t3.attr && _t3.attr('class')=='mainoptions'){
                                    //continue;
                                }



                                var aux_href = '';
                                if(_t3.href){
                                    aux_href = _t3.href;

                                    if(aux_href.indexOf('./')==0){
                                        aux_href = aux_href.replace('./','');
                                    }
                                }




                                if(_t3.className=='social-scripts'){
                                    //console.info(_t3);



                                    if(social_scripts_loaded==false){

                                        _body.append(_t3);
                                        social_scripts_loaded=true;
                                    }
                                    social_scripts_reinit = true;

                                    //console.info('social_scripts_reinit INIT', social_scripts_reinit)
                                }

                                if(_t3.className=='portfolio-fulscreen--items'){
                                    //console.info(_t3);


                                    _body.append(_t3);

                                    //console.info('social_scripts_reinit INIT', social_scripts_reinit)
                                }

                                if (_t3 != undefined && _t3.nodeName != undefined && _t3.nodeName == 'SCRIPT') {

                                    //if(_t3.className=='toexecute'){
                                    //
                                    //    continue;
                                    //}

                                    //console.info(_t3,_t3.src, scripts_loaded_arr);




                                    if(_t3.className=='mainoptions'){
                                        //console.info(_t3);

                                        old_qcre_options = $.extend([],qcreative_options);
                                        var aux = eval(_t3.innerHTML);

                                        //console.log(qcreative_options_defaults);

                                        var auxer5 = JSON.parse(qcreative_options_defaults_string);
                                        //console.log(auxer5);

                                        qcreative_options = $.extend(auxer5, qcreative_options)
                                        window.qcreative_options = qcreative_options;

                                        //--- not a good solution
//                                        console.info(aux,move_options, old_move_options);

                                        //console.info(qcreative_options);



                                    }

                                    if(_t3.className=='zoombox-settings'){
                                        //console.info(_t3);

                                        if(zoombox_options){

                                            old_zoombox_options = $.extend([],zoombox_options);
                                        }
                                        var aux = eval(_t3.innerHTML);


                                        if(window.zoombox_default_opts_string){
                                            var def_opts_parse  = $.extend(true, {},$.parseJSON(window.zoombox_default_opts_string));
                                            zoombox_options = $.extend(def_opts_parse, window.init_zoombox_settings);

                                            //console.info('new zoombox settings', zoombox_options,window.zoombox_default_opts,window.init_zoombox_settings);
                                            window.init_zoombox_settings = zoombox_options;
                                        }


                                        //console.info(init_zoombox_settings, _t3.innerHTML);

                                        //console.info('MAKE YOU MOVE', window.api_zoombox_setoptions, zoombox_options, $('.zoombox-maincon'))

                                        //console.log(window.api_zoombox_setoptions);

                                        if(window.api_zoombox_setoptions){
                                            //window.api_zoombox_setoptions(zoombox_options);
                                        }

                                        qcre_init_zoombox = true;

                                        //--- not a good solution
//                                        console.info(aux,move_options, old_move_options);

                                        //console.info(qcreative_options);



                                    }

                                    var sw = false;

                                    for(j=0;j<scripts_loaded_arr.length;j++){

                                        //console.info(_t3.src, scripts_loaded_arr[j], (qcreative_options.site_url + scripts_loaded_arr[j]));

                                        //console.info(_t3.src, scripts_loaded_arr[j], ajax_site_url);
                                        if(_t3.src=='' || scripts_loaded_arr[j] == _t3.src || ajax_site_url + scripts_loaded_arr[j] == _t3.src){
                                            sw=true;
                                        }
                                    }

                                    if(sw==false){

                                        scripts_tobeloaded.push(_t3.src);
                                    }
                                }


                                if (_t3 != undefined && _t3.nodeName != undefined && _t3.nodeName == 'LINK') {


                                    // -- stylesheets check

                                    if(_t3.rel!='stylesheet'){
                                        continue;
                                    }


                                    var sw = false;


                                    for(var j=0;j<scripts_loaded_arr.length;j++){


                                        //console.info(aux_href, scripts_loaded_arr[j],ajax_site_url, scripts_loaded_arr[j], (ajax_site_url + scripts_loaded_arr[j]));
                                        if(aux_href=='' || scripts_loaded_arr[j] == aux_href || ajax_site_url + scripts_loaded_arr[j] == aux_href){
                                            sw=true;
                                        }
                                    }

                                    if(sw==false){

                                        stylesheets_tobeloaded.push(_t3.href);
                                    }
                                }



                            }

                            //console.info(scripts_loaded_arr);
                            //console.info(scripts_tobeloaded, stylesheets_tobeloaded);


                            //console.info($.zfolio);
                            setTimeout(function() {
                                var i = 0;
                                nr_scripts_tobeloaded = scripts_tobeloaded.length;


                                function loadFunc(e){
                                    //console.info(e);
                                }

                                if(nr_scripts_tobeloaded<=0){



                                    load_new_page();
                                    return false;
                                }

                                //console.info(scripts_tobeloaded);


                                var i4 = 0;
                                for(i4=0;i4<scripts_tobeloaded.length;i4++){

                                    $.getScript( scripts_tobeloaded[i4], function( data, textStatus, jqxhr ) {
                                        //console.log( data ); // Data returned
                                        //console.log( textStatus ); // Success
                                        //console.log( jqxhr.status ); // 200
                                        //console.log( "Load was performed." );


                                        //eval(data);

                                        if(!(data)){
                                            //console.info('load was not performed', i4, scripts_tobeloaded[i4], jqxhr);


                                            //console.info(window.google_maps_loaded)
                                            if(window.google_maps_loaded==false){

                                                var scriptElement = document.createElement('script');
                                                scriptElement.src = "https://maps.googleapis.com/maps/api/js?v=3&callback=qcreative_gm_init";
                                                document.getElementsByTagName('head')[0].appendChild(scriptElement);

                                                window.google_maps_loaded = true;
                                            }else{
                                                window.gooogle_maps_must_init = true;
                                            }
                                        }


                                        nr_scripts_tobeloaded--;

                                        if(nr_scripts_tobeloaded<=0){
                                            //console.info('loadnewpage');

                                            //console.info($.zfolio);



                                            load_new_page();
                                        }

                                        //console.info(this,i4);

                                        var aux = this.url;

                                        if(aux.indexOf('?')>-1){
                                            aux = aux.split('?')[0];
                                        }

                                        //console.info(aux);
                                        scripts_loaded_arr.push(aux);

                                    });
                                }
                                for(i4=0;i4<stylesheets_tobeloaded.length;i4++){

                                    $('<link/>', {
                                        rel: 'stylesheet',
                                        type: 'text/css',
                                        href: stylesheets_tobeloaded[i4]
                                    }).appendTo('head');

                                    scripts_loaded_arr.push(stylesheets_tobeloaded[i4]);


                                }


                                setTimeout(function(){
                                    //console.info(window.dzsprx_init);
                                    //console.info($.zfolio,jQuery.zfolio);
                                },1000)


//                            console.info(___response, ___response_scriptmo);
                            }, 100);


                            //console.info(thehref)

                            if(bg_transition=='fade'){
                                _mainBg.addClass('for-remove');

                                var aux9000 = _mainBg;

                                setTimeout(function(){

                                    if(aux9000.get(0) && aux9000.get(0).api_destroy){

                                        aux9000.get(0).api_destroy();
                                    }
                                },300);
                            }else{

                                if(_mainBg.get(0) && _mainBg.get(0).api_destroy){

                                    _mainBg.get(0).api_destroy();
                                }
                            }




                            //console.info('destroy zoombox');


                            if(window.api_destroy_zoombox){
                                window.api_destroy_zoombox();
                            }

                            //console.info()

                            //console.info('STATE CURR MENU ITEMS LINKS2',state_curr_menu_items_links);



                            if(_t.get(0)!=window) {
                                var aux_arr = state_curr_menu_items_links.slice(0);

                                var stateObj = {foo: page_change_ind, href: thehref, 'curr_menu_items': aux_arr};

                                page_change_ind++;
                                //console.info('PUSH STATE', stateObj, thehref)
                                history.pushState(stateObj, null, thehref);
                            }
                        });


                        //console.info(_t.parent());




                        //console.info(state_curr_menu_items_links);

                        //state_curr_menu_items_links = _theActualNav.find('.current-menu-item');

                        if(_t.get(0)!=window){



                            state_curr_menu_items_links = [];

                            _theActualNav.find('.current-menu-item').each(function(){
                                var _t = $(this);

                                //console.log(_t,_theActualNav.find('*').index(_t));


                                state_curr_menu_items_links.push(_theActualNav.find('li').index(_t));
                            })

                            //console.info('STATE CURR MENU ITEMS LINKS', state_curr_menu_items_links);

                            if(_t.parent().parent().hasClass('the-actual-nav')){
                                _t.parent().parent().find('.current-menu-item').removeClass('current-menu-item');
                                _t.parent().addClass('current-menu-item');
                            }
                            if(_t.parent().parent().parent().parent().hasClass('the-actual-nav')){
                                _t.parent().parent().parent().parent().find('.current-menu-item').removeClass('current-menu-item');
                                _t.parent().parent().parent().addClass('current-menu-item');
                                _t.parent().addClass('current-menu-item');
                            }
                        }

                        if(_t && _t.hasClass('ajax-link')){
                            _theActualNav.find('li > a').each(function(){
                                var _t3 = $(this);

                                //console.log(_t3, _t3.attr('href'), thehref);

                                if(_t3.attr('href')==thehref||_t3.attr('href')==ajax_site_url+thehref){
                                    _theActualNav.find('li').removeClass('current-menu-item');
                                    _t3.parent().addClass('current-menu-item');
                                }
                            })
                        }


                        return false;
                    }


                }

            }
        }

    }


    function load_new_page(){
        //console.info('load_new_page()');


        videoplayers_tobe_resized = [];

        goto_bg(0,{newpage_transition: true});

        //console.info(___response);
    }

    function determine_page(){
        is_content_page = false;
        if(_body.hasClass('page-gallery-w-thumbs')){
            page='page-gallery-w-thumbs';
        }

        if(_body.hasClass('page-portfolio')){
            page='page-portfolio';
            is_content_page = true;
        }
        if(_body.hasClass('page-portfolio-single')){
            page='page-portfolio-single';
            is_content_page = true;
        }
        if(_body.hasClass('page-normal')){
            page='page-normal';
            is_content_page = true;
        }
        if(_body.hasClass('page-blog')){
            page='page-blog';
            is_content_page = true;
        }
        if(_body.hasClass('page-blogsingle')){
            page='page-blogsingle';
            is_content_page = true;
        }
        if(_body.hasClass('page-about')){
            page='page-about';
            is_content_page = true;
        }
        if(_body.hasClass('page-contact')){
            page='page-contact';
            is_content_page = true;
        }
        if(_body.hasClass('page-homepage')){
            page='page-homepage';
        }

        //console.info('CHECK AJAX', newclass_body,transitioned_via_ajax_first);
        if(transitioned_via_ajax_first && newclass_body){
            _body.removeClass('page-blogsingle page-homepage page-gallery-w-thumbs page-normal page-contact page-about page-contact page-portfolio page-portfolio-single');

            _body.addClass(newclass_body);
            page=newclass_body;


            _body.removeClass('no-padding');
            _body.removeClass('with-fullbg');
            if(newclass_body_nopadding){

                _body.addClass('no-padding');
            }
        }


    }


    function handle_resize(e,pargs){


        var margs = {
            ignore_menu: false
            ,placew: true
            ,place_page: true
            ,redraw_canvas: true
        }

        if(pargs){
            margs = $.extend(margs,pargs);
        }

        //console.info('handle_resize', e, margs);

        ww = $(window).width();
        wh = $(window).height();


        $('.main-bg-div').height(wh);



        //console.info(page, _theContent.parent().hasClass('fullit'))
        if(page=='page-portfolio-single' && _theContent.parent().hasClass('fullit')) {

            $('.advancedscroller').eq(0).css('height','100%');
            $('.advancedscroller-con').eq(0).height(wh);
            $('.advancedscroller-con-placeholder').eq(0).height(wh);

        }


        if(margs.placew){

            $('.placewh').each(function(){
                var _t = $(this);

                _t.attr('data-placeholderh',wh);

                if(_t.hasClass('for-parallaxer')){

                    _t.attr('data-placeholderh', (bigimageheight*parallaxer_multiplier) );
                }
            });
        }



        if(videoplayers_tobe_resized.length>0){
            for(var i4=0;i4<videoplayers_tobe_resized.length;i4++){
                var _c = videoplayers_tobe_resized[i4];

                var aux_oh = _c.data('original-height');
                var aux_cw = _c.width()
                var aux_rw = _c.data('reference-width');


                var aux_total = aux_cw/aux_rw * aux_oh;


                //console.log(aux_cw, aux_rw, aux_oh, aux_total);

                _c.height(aux_total);


            }
        }

        //console.info(page);

        if(margs.place_page) {
            //console.info(page);
            if (page == 'page-portfolio' || page == 'page-portfolio-single' || page == 'page-normal' || page == 'page-blog' || page == 'page-blogsingle' || page == 'page-about' || page == 'page-contact') {
                //console.info(_theContent);


                //console.info(_body.hasClass('menu-type-9'));


                // -- setting the content left position, menu types excluded here
                if ((_theContent.parent().hasClass('fullit') == false && _body.hasClass('content-align-right')== false && _body.hasClass('content-align-left')== false && ( _body.hasClass('menu-type-5')==false && _body.hasClass('menu-type-6')==false && _body.hasClass('menu-type-9')==false && _body.hasClass('menu-type-10')==false  && _body.hasClass('menu-type-11')==false && _body.hasClass('menu-type-12')==false && _body.hasClass('menu-type-13')==false && _body.hasClass('menu-type-14')==false && _body.hasClass('menu-type-15')==false && _body.hasClass('menu-type-16')==false && _body.hasClass('menu-type-17')==false && _body.hasClass('menu-type-18')==false   ))) {

                    //console.info('Y DO U DO THIS');
                    var aux = menu_width + ((ww - menu_width) / 2 - _theContent.parent().width() / 2);

                    if(_body.hasClass('menu-type-7')||_body.hasClass('menu-type-8')){
                        aux = (menu_width-40) + ((ww - (menu_width-40) ) / 2 - _theContent.parent().width() / 2);
                    }
                    //console.log(menu_width, aux);
                    _theContent.parent().css({
                        'left': aux
                    })
                }



                if (_body.hasClass('menu-is-sticky') && (_body.hasClass('content-align-right')== false && _body.hasClass('content-align-left')== false) && (  _theContent.parent().hasClass('fullit') == false)  &&  ( _body.hasClass('menu-type-5') || _body.hasClass('menu-type-6'))  ) {


                    //console.info('Y DO U DO THIS TOO / THIS IS ONLY FOR MENU-TYPE-5 and 6');
                    if(ww>(menu_width + content_width + menu_content_space)){
                        _navCon.css({
                            'left': ww/2 - (menu_width + content_width + menu_content_space)/2
                        })


                        //console.log(menu_content_space, menu_width);


                        _theContent.parent().css({
                            'left': (ww/2 - (menu_width + content_width + menu_content_space)/2)  + menu_width
                        })
                    }else{
                        // -- tbc
                        _navCon.css({
                            'left': ''
                        })
                        _theContent.parent().css({
                            'left': ''
                        })

                    }

                }

                if(_body.hasClass('page-is-fullwidth')==false && ( _body.hasClass('menu-type-5') || _body.hasClass('menu-type-6') ) ){

                    console.log(ww, content_width)
                    _navCon.css({
                        'left' : ww - (content_width + 60) - _navCon.width()
                    })
                }


                if(_body.hasClass('page-is-fullwidth')==false && ( _body.hasClass('menu-type-5') || _body.hasClass('menu-type-6') || _body.hasClass('menu-type-7') || _body.hasClass('menu-type-8') ) ) {
                    //console.info(menu_width, menu_content_space, content_width);


                    if(ww<menu_width+menu_content_space+content_width){

                        //console.info('whatsonot', menu_width, /menu_content_space, content_width);
                        _body.addClass('semi-responsive-mode');
                        _body.addClass('semi-responsive-mode-enforce');
                    }else{

                        _body.removeClass('semi-responsive-mode');
                        _body.removeClass('semi-responsive-mode-enforce');
                    }
                }
            }
        }

        if(ww<responsive_breakpoint){


            $('.testimonial-ascroller').each(function(){
                var _t3 = $(this);

                if(_t3.get(0) && _t3.get(0).style.height!='auto' && !( _t3.data('original-height')) ){

                    _t3.data('original-height', _t3.height());
                }
                _t3.css('height', 'auto');
                if(_t3.get(0) && _t3.get(0).api_force_resize){

                    _t3.get(0).api_force_resize();
                }

            });
            _body.removeClass('semi-responsive-mode');
            _body.removeClass('semi-responsive-mode-enforce');

        }else{

            $('.testimonial-ascroller').each(function(){
                var _t3 = $(this);
                if(_t3.data('original-height')){
                    _t3.css('height', _t3.data('original-height')+'px');
                    _t3.find('.thumbsCon').css('height', _t3.data('original-height')+'px');


                    if(_t3.get(0) && _t3.get(0).api_force_resize){

                        _t3.get(0).api_force_resize();
                    }
                }
            })

        }



        if(margs.place_page) {

            $('.translucent-bg').each(function(){
                var _t = $(this);

                if(margs.ignore_menu){
                    if(_t.parent().parent().hasClass('qcreative--nav-con')){
                        return;
                    }
                }

                //console.info(_t);


                calculate_translucent(_t);


            })



            calculate_mainbg();

            if(allow_resizing_on_blur){

                //console.info('resizing');

                clearTimeout(inter_resizing);
                inter_resizing = setTimeout(function(){
                    calculate_dims(margs);
                },500);
                $('body').addClass('resizing');
            }

        }


        //console.info('added resizing');
    }

    function calculate_dims(margs){
        global_image_data = null;
        $('body').removeClass('resizing');

        //console.info(margs);

        if(margs.redraw_canvas){

            $('.translucent-canvas').each(function(){
                var _t = $(this);
                //console.info(_t);

                if(margs.ignore_menu){
                    if(_t.parent().parent().hasClass('qcreative--nav-con')){
                        return;
                    }
                }

                if(is_chrome() && String(window.location.href).indexOf('file://')==0){

                }else{

                    calculate_translucent_canvas(_t);
                }


            })
        }


        if(page=='page-gallery-w-thumbs'){
            calculate_dims_gallery_thumbs_img_container();
        }

        //console.info(_body.hasClass('page-is-fullwidth'));

        if(_body.hasClass('page-is-fullwidth')){
            if(_body.hasClass('menu-type-9') || _body.hasClass('menu-type-10')){
                _body.find('.fullbg').eq(0).height(_mainContainer.height());


                setTimeout(function(){
                    if(_mainContainer.get(0) && _mainContainer.get(0).api_handle_wheel) {
                        _mainContainer.get(0).api_handle_wheel();
                    }
                },100);

            }
        }

        //console.log(videoplayers_tobe_resized);


        if(window.qcreative_options.bg_isparallax=='on'){


            setTimeout(function(){
                if(_mainBg.get(0) && _mainBg.get(0).api_handle_scroll){

                    //console.info(bigimageheight, wh);
                    _mainBg.get(0).api_handle_scroll(null,{
                        'from':'qcre'
                        ,'force_th':bigimageheight
                        ,'force_ch':wh
                    });
                }
            },100)

        }



        if(window.preseter_init){
            var _cach = $('.preseter-content-con').eq(0);
            //console.log(_cach);
            //if(_cach.hasClass('scroller-con')){

            var _cach_cont = _cach.find('.the-content').eq(0);
            //_cach_cont.css('top', '0');

            _cach_cont.scrollTop(0);
            //console.info(110, _cach_cont.height(), wh, _cach_cont);

            if(110 + _cach_cont.find('.the-content-inner-inner').height() + 56>wh){

                _cach.outerHeight(wh - 110);
                _cach.removeClass('auto-height');
                _cach.addClass('needs-scrolling');

                _cach_cont.find('.the-content-inner-inner').css({
                    'padding-right' : (39-native_scrollbar_width)+'px'
                    ,'width' : (260-native_scrollbar_width)+'px'
                });
                _cach_cont.find('.the-bg').eq(0).css({
                    //'right' : -(39-native_scrollbar_width)+'px'
                    //,'width' : (260-native_scrollbar_width)+'px'
                });
            }else{

                _cach.css('height', 'auto');
                _cach.addClass('auto-height');
                _cach.removeClass('needs-scrolling');
                //console.info(_cach, _cach.css('height'));


                _cach_cont.find('.the-content-inner-inner').css({
                    'padding-right' : ''
                    ,'width' : ''
                });
                _cach_cont.find('.the-bg').eq(0).css({
                    'right' : ''
                    ,'width' : ''
                });
            }


            //}
        }

    }

    function calculate_dims_light(){

    }

    function calculate_translucent_canvas(arg,pargs){

        //console.info('calculate_translucent_canvas()', arg,pargs);


        var _t = arg;
        var margs = {

            'overwrite_bg_index' : ""
            ,'callback_func' : null
        }


        //console.info(_t,_t.css('display'));

        if(_t.length==0){
            return false;
        }


        //if(_t.css('display')=='none'){
        //
        //    if(margs.callback_func){
        //        var delaytime = 50;
        //        if(is_firefox()){
        //            delaytime=1500;
        //        }
        //        setTimeout(function(){
        //
        //            margs.callback_func();
        //        },delaytime)
        //    }
        //
        //    return false;
        //}

        if(pargs){
            margs = $.extend(margs,pargs);
        }



        if(ww<responsive_breakpoint){
            if (margs.callback_func) {
                var delaytime = 50;
                if (is_firefox()) {
                    delaytime = 50;
                }
                setTimeout(function () {

                    margs.callback_func();
                }, delaytime)
            }

            return false;
        }



        //console.info('calculate_translucent_canvas()', arg,margs);
        var tempNr = currBgNr;

        if( (margs.overwrite_bg_index!=null && margs.overwrite_bg_index!='') || margs.overwrite_bg_index===0){
            tempNr = margs.overwrite_bg_index;
        }


        //console.info('calculate_translucent_canvas', margs,tempNr,window.qcreative_options.images_arr[tempNr]);




        var width = _t.width();
        var height = _t.height();

        if(_t.parent().parent().hasClass('qcreative--nav-con')==false){

            if(_t.parent().parent().parent().hasClass('main-gallery--desc')){
                var tempNr2 = _t.parent().parent().parent().parent().children().index(_t.parent().parent().parent());
                if(tempNr2!=tempNr){
                    return false;
                }
                _t.parent().parent().parent().show();
            }

            width = _t.parent().width();
            height = _t.parent().height();




            //console.log(_t.parent().width(),width);
        }else{
            // -- if this is the navigation

            width = _t.parent().width();

            if(_t.attr('data-placeholderh')){
                height = Number(_t.attr('data-placeholderh'));
            }

            if( ( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') )  &&_body.hasClass('menu-is-sticky')==false){
                height = bigimageheight-wh+20;
            }

            //console.log(_t.hasClass('for-parallaxer'));

            if(_t.hasClass('for-parallaxer')==false && ( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') )){
                height = 100;
            }



        }

        //console.log(_t, width, height, bigimageheight-wh)

        if(_t.hasClass('for-parallaxer')){
            height=height*parallaxer_multiplier;
        }


        if(_t.parent().parent().hasClass('the-content')){

            width = bigimagewidth;
            height = bigimageheight;
        }


        //console.info(_t);





        //console.info(_t.get(0));
        var auximg = new Image();

        //auximg.reference_t = _t;

        _t.attr('width', width);
        _t.attr('height', height);

        _t.css({
            'width':width
            ,'height':height
        });


        //console.info(_t,$('.main-bg-image').width(),$('.main-bg-image').height())

        //console.log(bigimagewidth,bigimageheight);

        auximg.width = bigimagewidth;
        auximg.height = bigimageheight;





        //console.info('calculating for', _t,_t.hasClass('for-parallaxer'),auximg);
        auximg.onload = function(e){
            //console.info('onLoad',this,this.width,this.height, this.naturalHeight);


            var radius = window.qcreative_options.blur_ammount;

            var width = _t.width();
            var height = _t.height();

            if(_t.attr('data-placeholderh')){
                height = Number(_t.attr('data-placeholderh'));
            }


            var tot = (_t.offset().top);
            var tol = (_t.offset().left);


            //console.info('calculating for ..really ?', _t,_t.hasClass('for-parallaxer'), this.reference_t);


            if(_t.parent().parent().parent().hasClass('main-gallery--desc')){
                _t.parent().parent().parent().css('display','');
            }







            // -- when transitioning
            //console.log(_t.parent().parent())
            if(_t.parent().parent().hasClass('qcreative--nav-con')){

                tot=0;
            }
            //console.info(_t,tol,tot,width,height,$('.main-bg-image').width(),$('.main-bg-image').height());

            //console.log("DA",_t.data('lastwidth'), width, _t.data('lastheight'), height, _t.data('last_mainbg_width'), $('.main-bg-image').width(), _t.data('last_mainbg_height'), $('.main-bg-image').height(),_t.data('lastimgsrc'),this.src);

            if(_t.data('lastwidth')==width && _t.data('lastheight')==height && _t.data('lastww')==ww && _t.data('lastwh')==wh && _t.data('lastimgsrc')==this.src){

                //if(margs.callback_func){
                //    margs.callback_func();
                //}
                //return false;
            }


            var ctx;
            if(_t.get(0) && _t.get(0).getContext){
                ctx = _t.get(0).getContext('2d');
            }
            //var

            //console.info(tol,tot, bigimagewidth,bigimageheight);


            if(_t.parent().parent().hasClass('the-content')){
                //console.log(width,height);
                tol=0;
                tot=0;
            }


            var sw_is_dummy=false;



            if(_t.hasClass('dummy')){
                sw_is_dummy=true;
            }




            //console.log(_t.css('display')!='none' && sw_is_dummy==false && (is_ie()==false || (is_ie() && ieVersion>10)));


            // - -  &&isiPad==false
            if(_t.css('display')!='none' && sw_is_dummy==false  &&isiPad==false && (is_ie()==false || (is_ie() && ieVersion>10)) ) {

                ctx.drawImage(this, -tol, -tot, bigimagewidth, bigimageheight);

                //ctx.rect(20,20,150,100);
                //ctx.stroke();


                //console.info(tot,tol);

                //console.info(width,height);
                //console.log(width,height);

                var pol = 0;
                var pot = 0;


                _t.data('lastwidth', width);
                _t.data('lastheight', height);
                _t.data('lastww', ww);
                _t.data('lastwh', wh);
                _t.data('lastimgsrc', auximg.src);
                _t.data('last_mainbg_width', $('.main-bg-image').width());
                _t.data('last_mainbg_height', $('.main-bg-image').height());

                //console.info(_t,_t.parent(),_t.parent().parent(),_t.parent().parent().hasClass('the-content'), _theContent);


                if (_t.parent().parent().hasClass('the-content')) {
                    //console.info(pol,width);
                    pol = _t.parent().offset().left;

                    //console.info('POL IS', pol)
                    var sw = false;
                    if (pol > 30) {
                        pol -= 15;
                        sw = true;
                    }
                    width = _t.parent().width();
                    if (sw) {
                        width += 30;
                        if (width > bigimagewidth) {
                            width = bigimagewidth;
                        }
                    }
                }
                //console.log(height);


                var sw_trace_to_global = false;
                if (_t.parent().parent().hasClass('gallery-thumbs--image-container')) {

                    pot = gallery_thumbs_img_container_padding_space;
                    pol = 250 + gallery_thumbs_img_container_padding_space;
                    width = ww - 250 + gallery_thumbs_img_container_padding_space * 2;
                    height = wh - gallery_thumbs_img_container_padding_space;

                    sw_trace_to_global = true;

                    //console.info(pol,pot, width, height);
                }
                //console.info('dims are - ',pol,width,_t.parent().parent().hasClass('the-content'));

                //console.info(_t);
                if (_t.parent().parent().hasClass('qcreative--nav-con') || 1 == 1 || !global_image_data) {
                    //console.info(ctx, _body.has($(ctx)), $(ctx).descendantOf(_body));
                    var imageData;

                    try{
                        //console.info(pol,pot,width,height);

                        if(width && height){

                            imageData = ctx.getImageData(pol, pot, width, height);


                            if (sw_trace_to_global) {
                                global_image_data = imageData;
                            }
                            //console.info(imageData);
                            var pixels = imageData.data;


                            //console.info(_t.parent().parent());


                            var mul_table = [
                                512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
                                454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
                                482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
                                437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
                                497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
                                320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
                                446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
                                329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
                                505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
                                399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
                                324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
                                268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
                                451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
                                385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
                                332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
                                289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259
                            ];
                            var shg_table = [
                                9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
                                17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
                                19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
                                20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
                                21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
                                21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
                                22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
                                22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
                                23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                                23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                                23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
                                23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
                                24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
                            ]

                            var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
                                r_out_sum, g_out_sum, b_out_sum,
                                r_in_sum, g_in_sum, b_in_sum,
                                pr, pg, pb, rbs;

                            var div = radius + radius + 1,
                                w4 = width << 2,
                                widthMinus1 = width - 1,
                                heightMinus1 = height - 1,
                                radiusPlus1 = radius + 1,
                                sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2,
                                stackStart = BlurStack(),
                                stack = stackStart;

                            for (i = 1; i < div; i++) {
                                stack = stack.next = BlurStack();
                                if (i == radiusPlus1) var stackEnd = stack;
                            }

                            stack.next = stackStart;

                            var stackIn = null,
                                stackOut = null;

                            yw = yi = 0;

                            var mul_sum = mul_table[radius],
                                shg_sum = shg_table[radius];

                            for (y = 0; y < height; y++) {
                                r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;

                                r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                                g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                                b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

                                r_sum += sumFactor * pr;
                                g_sum += sumFactor * pg;
                                b_sum += sumFactor * pb;

                                stack = stackStart;

                                for (i = 0; i < radiusPlus1; i++) {
                                    stack.r = pr;
                                    stack.g = pg;
                                    stack.b = pb;
                                    stack = stack.next;
                                }

                                for (i = 1; i < radiusPlus1; i++) {
                                    p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                                    r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
                                    g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
                                    b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;

                                    r_in_sum += pr;
                                    g_in_sum += pg;
                                    b_in_sum += pb;

                                    stack = stack.next;
                                }

                                stackIn = stackStart;
                                stackOut = stackEnd;
                                for (x = 0; x < width; x++) {
                                    pixels[yi] = (r_sum * mul_sum) >> shg_sum;
                                    pixels[yi + 1] = (g_sum * mul_sum) >> shg_sum;
                                    pixels[yi + 2] = (b_sum * mul_sum) >> shg_sum;

                                    r_sum -= r_out_sum;
                                    g_sum -= g_out_sum;
                                    b_sum -= b_out_sum;

                                    r_out_sum -= stackIn.r;
                                    g_out_sum -= stackIn.g;
                                    b_out_sum -= stackIn.b;

                                    p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

                                    r_in_sum += (stackIn.r = pixels[p]);
                                    g_in_sum += (stackIn.g = pixels[p + 1]);
                                    b_in_sum += (stackIn.b = pixels[p + 2]);

                                    r_sum += r_in_sum;
                                    g_sum += g_in_sum;
                                    b_sum += b_in_sum;

                                    stackIn = stackIn.next;

                                    r_out_sum += (pr = stackOut.r);
                                    g_out_sum += (pg = stackOut.g);
                                    b_out_sum += (pb = stackOut.b);

                                    r_in_sum -= pr;
                                    g_in_sum -= pg;
                                    b_in_sum -= pb;

                                    stackOut = stackOut.next;

                                    yi += 4;
                                }
                                yw += width;
                            }


                            for (x = 0; x < width; x++) {
                                g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;

                                yi = x << 2;
                                r_out_sum = radiusPlus1 * (pr = pixels[yi]);
                                g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
                                b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);

                                r_sum += sumFactor * pr;
                                g_sum += sumFactor * pg;
                                b_sum += sumFactor * pb;

                                stack = stackStart;

                                for (i = 0; i < radiusPlus1; i++) {
                                    stack.r = pr;
                                    stack.g = pg;
                                    stack.b = pb;
                                    stack = stack.next;
                                }

                                yp = width;

                                for (i = 1; i <= radius; i++) {
                                    yi = (yp + x) << 2;

                                    r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
                                    g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
                                    b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;

                                    r_in_sum += pr;
                                    g_in_sum += pg;
                                    b_in_sum += pb;

                                    stack = stack.next;

                                    if (i < heightMinus1) yp += width;
                                }

                                yi = x;
                                stackIn = stackStart;
                                stackOut = stackEnd;
                                for (y = 0; y < height; y++) {
                                    p = yi << 2;
                                    pixels[p] = (r_sum * mul_sum) >> shg_sum;
                                    pixels[p + 1] = (g_sum * mul_sum) >> shg_sum;
                                    pixels[p + 2] = (b_sum * mul_sum) >> shg_sum;

                                    r_sum -= r_out_sum;
                                    g_sum -= g_out_sum;
                                    b_sum -= b_out_sum;

                                    r_out_sum -= stackIn.r;
                                    g_out_sum -= stackIn.g;
                                    b_out_sum -= stackIn.b;

                                    p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

                                    r_sum += (r_in_sum += (stackIn.r = pixels[p]));
                                    g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
                                    b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));

                                    stackIn = stackIn.next;

                                    r_out_sum += (pr = stackOut.r);
                                    g_out_sum += (pg = stackOut.g);
                                    b_out_sum += (pb = stackOut.b);

                                    r_in_sum -= pr;
                                    g_in_sum -= pg;
                                    b_in_sum -= pb;

                                    stackOut = stackOut.next;

                                    yi += width;
                                }
                            }



                            ctx.clearRect( 0, 0, widthMinus1, heightMinus1 );
                            ctx.putImageData(imageData, pol, pot);

                        }
                    }catch(e){
                        console.info('putimage error error: ',e);
                    }


                } else {

                    ctx.putImageData(global_image_data, pol, pot);
                }


                //console.info('ceva', _t);
            }



            //console.info('callback func: ',margs.callback_func);
            if (margs.callback_func) {
                var delaytime = 50;
                if (is_firefox()) {
                    delaytime = 50;
                }
                setTimeout(function () {

                    margs.callback_func();
                }, delaytime)
            }



        };



        //console.info(tempNr);

        auximg.src = window.qcreative_options.images_arr[tempNr];
    }
    function calculate_translucent(arg,pargs){
        var _t = arg;

        return false;
        var margs = {

            'overwrite_bg_index' : ""
            ,'callback_func' : null
        }

        if(pargs){
            margs = $.extend(margs,pargs);
        }



        if(_t.data('appliedblur')!='on'){

            _t.css('background-image', mainBgImgCSS);
        }



        //setTimeout(drawBlur,0);


        _t.css({
            'margin-left': 0
            ,'margin-top': 0
            //,'transform': 'translate3d(0,0,0)'
        });
        if(_t.hasClass('for-parallaxer')){
            _t.css({
                //'transform': 'translate3d(0,0,0)'
            });
        }


        var tot = (_t.offset().top);
        var tol = (_t.offset().left);


        var auxw = ww;
        var auxh = wh;

        //console.info(_t);

        if(_t.hasClass('dzsparallaxer--target') || _t.hasClass('for-parallaxer')){
            auxh=auxh*parallaxer_multiplier;
        }

        if(_t.offset().left<15){

            mainbgoffset = 0;
        }else{

            mainbgoffset = 0;
        }

        if(_t.data('substract-translate')=='on'){


            //console.info(_t.data('substract-translate'),tot);
            //tot+= (wh*0.3);
            _t.data('substract-translate','off');


        }

        _t.width(auxw + mainbgoffset*2);
        _t.height(auxh + mainbgoffset*2);


        //if(_t.parent().parent().hasClass('the-content')){
        tot-=st;
        //}

        _t.css({
            'margin-left': -tol - mainbgoffset
            ,'margin-top': -tot -mainbgoffset
        })

        //console.log(ieVersion());
        if(ieVersion()==11){


            //var _t_img = null;
            //var _t_img_cnv = null;
            //if(_t.next().hasClass('translucent-img')){
            //    _t_img = _t.next();
            //}
            //if(_t.next().next().hasClass('translucent-img-canvas')){
            //    _t_img_cnv = _t.next().next();
            //}
            //
            //
            //if(_t_img){
            //
            //    _t_img.css({
            //        'width' : (ww + mainbgoffset*2)
            //        ,'height': (wh + mainbgoffset*2)
            //        ,'left': -tol - mainbgoffset
            //        ,'top': -tot -mainbgoffset
            //    })
            //}
            //if(_t_img_cnv){
            //
            //    _t_img_cnv.css({
            //        'width' : (ww + mainbgoffset*2)
            //        ,'height': (wh + mainbgoffset*2)
            //        ,'left': -tol - mainbgoffset
            //        ,'top': -tot -mainbgoffset
            //    })
            //}

        }



        if(margs.callback_func){
            margs.callback_func();
        }

    }

    function goto_prev_bg(){
        var tempNr = currBgNr;

        tempNr--;

        if(tempNr<0){

            tempNr = qcreative_options.images_arr.length - 1;
        }

        goto_bg(tempNr);

    }

    function goto_next_bg(){
        var tempNr = currBgNr;

        tempNr++;

        if(tempNr>qcreative_options.images_arr.length - 1){

            tempNr = 0;
        }

        goto_bg(tempNr);

    }

    function update_parallaxer(arg){
        //console.log(arg);


        if(debug_var){
            //console.info(_c_for_parallax_items);
            debug_var = false;
        }


        if(_c_for_parallax_items){



            for(var i24 = 0;i24<_c_for_parallax_items.length;i24++){
                var _t = _c_for_parallax_items[i24];

                var arg2 = arg;

                if( ( _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18') ) && _body.hasClass('menu-is-sticky')==false){
                    //console.log(arg, $(window).scrollTop())

                    //console.log(_t.parent().parent());

                    if(_t.parent().parent().hasClass('qcreative--nav-con')){
                        arg2+=Number($(window).scrollTop());
                    }

                }

                _t.css({
                    'transform' : 'translate3d(0,'+(arg2)+'px,0)'
                })

            }



        }

    }



    function goto_bg(arg,pargs){
        //console.info('goto_bg('+arg+')');

        if(busy_main_transition){
            return false;
        }


        var margs = {
            newpage_transition: false
        }
        if(pargs){
            margs = $.extend(margs,pargs);
        }

        var cek = qcreative_options.images_arr[arg];

        //console.info(margs);


        var img = new Image();



        if($('.main-gallery--descs').length>0){
            _mainGalleryDescs = $('.main-gallery--descs').eq(0);
        }


        if(_mainGalleryDescs){
            if(_mainGalleryDescs.children('.active').length>0){

                _mainGalleryDescs.css({
                    'width' : '0'
                })
                setTimeout(function(){
                    is_ready_transition=true;
                    if(is_ready_load==true){
                        goto_bg_doit(arg,margs);
                        //console.info('ceva from desc');
                    }

                    if(_mainGalleryDescs){

                        _mainGalleryDescs.css({
                            'height' : '0'
                        })
                    }

                },500);

            }else{
                is_ready_transition=true;
            }
        }else{
            is_ready_transition=true;
        }


        img.onload = function(e){
            // image  has been loaded

            is_ready_load = true;
            if(is_ready_transition==true){
                goto_bg_doit(arg, margs);
                //console.info('ceva from onload');
            }

        };
        img.onerror = function(e){
            // image  has been loaded

            //console.info(e);

        };



        img.src = cek;




        busy_main_transition = true;
    }

    function goto_bg_doit(arg,margs){

        // -- image has loaded


        wh = $(window).height();
        //console.info('goto_bg_do_it('+arg+')');

        var extra_class = '';
        var extra_class_main_bg = '';
        var isparallax = false;
        var targeth = '100%';
        var extra_translate = '';


        if(window.qcreative_options.bg_isparallax!='on'){

            //_mainBg.removeClass('dzsparallaxer');
            //_mainBg.children('.main-bg').removeClass('dzsparallaxer--target');
        }



        //console.info(page);
        if(window.qcreative_options.bg_isparallax=='on' && newclass_body!='page-homepage' && newclass_body!='page-gallery-w-thumbs'){
            extra_class+=' dzsparallaxer';
            extra_class_main_bg+=' dzsparallaxer--target';

            //targeth = '140%';
            isparallax=true;



            var auxpix = (wh*(parallaxer_multiplier-1) - qcreative_options.substract_parallaxer_pixels);
            //console.info('turn down the wha', auxpix);
            extra_translate='transform: translate3d(0,-'+auxpix+'px,0);';
            //wh*=1.3;
        }

        //console.info(margs);



        //<figure class="main-bg'+extra_class_main_bg+'" style="width: '+ww+'px; height: '+wh+'px; '+extra_translate+' background-image: url('+qcreative_options.images_arr[arg]+');">



        var aux_top = '-50';

        is_content_page = false;
        if(newclass_body.indexOf('page-normal')>-1||newclass_body.indexOf('page-blogsingle')>-1||newclass_body.indexOf('page-blog')>-1||newclass_body.indexOf('page-portfolio')>-1){

            is_content_page=true;

        }

        bg_transition='slidedown';
        if(first_bg_not_transitioned==false&&margs.newpage_transition==false && is_content_page){

            bg_transition = 'fade';
        }

        first_bg_not_transitioned = false;
        if(bg_transition=='fade'){

            aux_top = 0;
        }

        //console.log(aux_top);



        if(bg_transition=='fade') {
            _mainBg.addClass('for-remove');

            var aux9000 = _mainBg;

            //console.info('aux9000 is ',aux9000);

            setTimeout(function () {

                if (aux9000.get(0) && aux9000.get(0).api_destroy) {

                    aux9000.get(0).api_destroy();
                }
            }, 1000);
        }

        var aux23 = '<div class="main-bg-con transitioning'+extra_class+'" style="height:0%; top: '+aux_top+'px;"><img class="main-bg-image'+extra_class_main_bg+'" style=" '+extra_translate+'" src="'+qcreative_options.images_arr[arg]+'"/><div class="main-bg-div"  style="height: '+wh+'px; background-image:url('+qcreative_options.images_arr[arg]+');"></div></div>';

        //console.log(aux23);

        //aux23 = '';
        //console.info(window.qcreative_options.bg_isparallax,aux23);


        //console.info(aux23);


        if(margs.newpage_transition==true){


            //console.info('PAGE IS '+page);

            if(page=='page-homepage'){
                if($('.main-gallery--descs').length>0){

                    $('.main-gallery--descs').addClass('removed');
                    _mainGalleryDescs = null;
                }

                currBgNr=0;
            }


            //console.info(_navCon, aux23);



            if(_body.hasClass('menu-type-9')||_body.hasClass('menu-type-10') || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){

                //_mainContainer.append(_t24);
                _mainContainer.append(aux23);
            }else{

                _navCon.before(aux23);
            }


            calculate_mainbg();

            //console.info($('.main-bg-con'));

            if($('.main-bg-con.transitioning').eq(0).hasClass('dzsparallaxer')){

                $('.main-bg-con.transitioning').eq(0).find('.dzsparallaxer--target').css({
                    'transform': 'translate3d(0,-'+(bigimageheight-wh-qcreative_options.substract_parallaxer_pixels)+'px,0)'
                })

                //console.info($(window).height(),bigimageheight-$(window).height(), 'translate3d(0,-'+(bigimageheight-$(window).height())+'px,0)');
            }

            if(_theContent){

                _theContent.find('.selector-con,.call-to-action-con').css({
                    'z-index':'auto'
                });
                _theContent.find('.advancedscroller.skin-whitefish.is-thicker .bulletsCon').animate({
                    'opacity':'0'
                },{
                    queue:false
                    ,duration: 300
                });




            }
            if(___response) {




                //$('.the-content-con').remove();

                ___response.find('.the-content-con').each(function () {
                    var _t24 = $(this);

                    //console.log(_t24);

                    _t24.addClass('transitioning');



                    initial_offset = _t24.offset().left;
                    if(_t24.hasClass('fullit')==false){

                        _t24.css({
                            'opacity': 0
                        })
                        page_is_fullwidth = false;


                        //console.info('page is', page,newclass_body);

                        //console.info(_t24, _t24.width(), _t24.outerWidth(), _t24.css('max-width'));
                        setTimeout(function(){



                            lastcontent_w = _t24.width();
                            //console.info(_t24 , _t24.outerWidth(), _t24.css('max-width'));

                            _t24.css({
                            })

                            _t24.css({
                                //'width': '0'
                                //,'left': -lastcontent_w/2
                                //,'overflow': 'hidden'
                                //,opacity: 1
                            })


                            //console.log(_t24.width());


                            _t24.children('').css({
                                //'width': lastcontent_w + 'px'
                            })

                            _t24.children('h1,.the-content,footer').css({
                                //'width': lastcontent_w + 'px'
                                //,'margin-left' : -lastcontent_w/2
                            })

                        },100)
                    }else{

                        _t24.css({
                            'opacity': 0
                        });

                        _t24.find('.zfolio.fullwidth').css({
                            'width' : $(window).width()-menu_width
                        })

                        page_is_fullwidth = true;


                    }
                    ;

                    //console.info(_t24);

                    //$('#map-canvas').eq(0).remove();
                    if(_body.hasClass('menu-type-9')||_body.hasClass('menu-type-10')  || _body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-15') || _body.hasClass('menu-type-16') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){

                        _mainContainer.append(_t24);
                    }else{

                        //console.info(_t24);
                        _navCon.before(_t24);

                    }


                    if(_gallery_thumbs_con){

                        _gallery_thumbs_con.find('.thumbs-list-con').eq(0).unbind('mousemove');
                    }





                    $('.vplayer,.zfolio').each(function(){
                        var _t = $(this);

                        //console.log(_t);
                        if(_t.get(0) && _t.get(0).api_destroy_listeners){
                            _t.get(0).api_destroy_listeners();
                        }

                        setTimeout(function(){
                            _t[0] = null;
                        },300);


                    });


                    //console.info("CEVA2", _t24.hasClass('fullit'));

                    if(window.dzsas_init){

                        if(ww>responsive_breakpoint){
                            if(_body.hasClass('page-portfolio') && newclass_body == 'page-portfolio-single' && _t24.hasClass('fullit')==false){
                                _t24.css('width', (default_content_width)+'px');
                                _t24.css('max-width', (default_content_width)+'px');
                                //$('.the-content-con.transitioning').outerWidth(default_content_width);
                                //_t24.width(default_content_width);

                                //console.log(_body.hasClass('page-portfolio'), ('.advancedscroller.skin-qcre.auto-init-from-q'), _t24.css('width'), String((default_content_width)+'px'));
                            }
                        }

                        //console.log(_t24.find('.advancedscroller.skin-qcre.auto-init-from-q'), _body.hasClass('page-portfolio'), ('.advancedscroller.skin-qcre.auto-init-from-q'), $('.the-content-con.transitioning').css('width'));

                        dzsas_init(_t24.find('.advancedscroller.skin-qcre.auto-init-from-q'),{
                            init_each: true
                        });
                    }

                    if(window.dzszfl_init){

                        //console.info($('.zfolio.auto-init-from-q'), ___response.find('.zfolio.auto-init-from-q'));

                        //console.log(newclass_body, $('.the-content-con').width(), $('.the-content-con.transitioning').width());
                        //_t24.find('.zfolio-portfolio-classic').width()

                        if(ww>responsive_breakpoint){
                            if(newclass_body == 'page-portfolio' && _t24.hasClass('fullit')==false){
                                $('.the-content-con.transitioning').css('width', (default_content_width-60)+'px');
                            }
                        }

                        dzszfl_init(_t24.find('.zfolio.auto-init-from-q'),{
                            init_each: true
                        });


                        //dzszfl_init('.zfolio.zfolio-portfolio-fullscreen', { design_item_thumb_height:"1",item_extra_class:""});



                        setTimeout(function(){


                            $('.the-content-con .zfolio').each(function(){
                                var _t100 = $(this);

                                if(_t100.get(0) && _t100.get(0).api_handle_resize){
                                    _t100.get(0).api_handle_resize();
                                    //console.info(_t100.width());
                                }
                            })
                        },1000)

                    }
                    //console.info(_t24);




                });
                //return false;


                for (var ij = 0; ij < ___response.length; ij++) {
                    var _t3 = ___response[ij];
                    var $t3 = $(_t3);


                    if(_t3.nodeName=='SCRIPT'){
                        if(_t3.className=='q-toexecute'){
                            if(_t3.className.indexOf('executed')==-1){


                                //console.info(_t3, _t3.textContent);

                                eval(_t3.textContent);
                                //$.ready();
                                $t3.addClass('executed');
                            }
                        }

                    }


                }
            }
        }else{

            //console.info('ceva');
            _mainBg.after(aux23);

            calculate_mainbg();



            if($('.main-bg-con.transitioning').eq(0).hasClass('dzsparallaxer')){

                $('.main-bg-con.transitioning').eq(0).find('.dzsparallaxer--target').css({
                    'transform': 'translate3d(0,-'+(bigimageheight-wh-qcreative_options.substract_parallaxer_pixels)+'px,0)'
                })
                //console.info($(window).height(),bigimageheight-$(window).height(), 'translate3d(0,-'+(bigimageheight-$(window).height())+'px,0)');
            }


        }


        _mainBgTransitioning = $('body').find('.main-bg-con.transitioning');
        //console.info(aux23, _mainBgTransitioning.children('.main-bg-div').css('background-image'));


        var animation_time = 400; // -- set later

        function do_transition(){

            //console.log('do_transition()');


            function do_transition_really_do_it(){

                //console.log('do_transition_really_do_it()')

                $("body").removeClass('qtransitioned');
                $("body").addClass('qtransitioning');

                allow_resizing_on_blur=false;

                setTimeout(function(){
                    allow_resizing_on_blur=true;
                },2000);
                //console.log(_c2);


                $('body').addClass('q-inited-bg');

                setTimeout(function(){



                    //if(_cache2.find('.translucent-bg').data('appliedblur')!='on'){
                    //
                    //    //console.info('dadadadada', _c2);
                    //    _cache2.find('.translucent-bg').css({
                    //        'background-image': 'url(' + qcreative_options.images_arr[arg] + ')'
                    //    })
                    //}





                    //console.info(_c2);


                    var aux = animation_time;


                    //console.info(_cache2);
                    if(_cache2){



                        if(_cache2.find('.translucent-canvas').eq(0).hasClass('for-parallaxer')){
                            aux-=67;
                        }

                        //console.log(aux);

                        if(bg_transition!='fade' && (_body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')) ) {
                            aux = 200;
                        }


                        if(bg_transition=='fade'){

                            //console.log($('.translucent-con.transitioning .for-parallaxer'));



                            if($('.translucent-con.transitioning .for-parallaxer').length>0){
                                //console.info(_c_for_parallax_items);
                                var auxlen = _c_for_parallax_items.length;

                                $(' .translucent-con.transitioning .for-parallaxer').each(function(){
                                    var _t = $(this);
                                    _c_for_parallax_items.push(_t);
                                })
                                //console.info(_c_for_parallax_items);

                                //console.log(auxlen);
                                for(var i23 = 0;i23<auxlen;i23++){
                                    _c_for_parallax_items.shift();
                                }
                                //console.info(_c_for_parallax_items);

                            }


                            var args = {
                                mode_scroll: "fromtop",
                                animation_duration: '20',
                                is_fullscreen: "on",
                                init_functional_delay: "0",
                                init_functional_remove_delay_on_scroll: "off"
                                ,settings_substract_from_th: qcreative_options.substract_parallaxer_pixels
                            };
                            if (parallax_reverse) {
                                args.direction = "reverse";
                            }

                            //console.info($('.main-bg-con.transitioning'))
                            //console.info(_mainBg);
                            //window.dzsprx_init($('.main-bg-con.transitioning'), args);


                            var _c234 = ($('.qcreative--nav-con .translucent-con:not(.transitioning)'));

                            //console.info(_c234);

                            _c234.animate({


                                'opacity':0
                            },{
                                queue:false
                                ,duration: 300
                            })



                            setTimeout(function(){

                                if(_content_translucent_canvas){

                                    _content_translucent_canvas.next().animate({


                                        'opacity':1
                                    },{
                                        queue:false
                                        ,duration: 150
                                    })
                                    setTimeout(function(){
                                        _content_translucent_canvas.remove();
                                        _content_translucent_canvas.parent().children().removeClass('transitioning');
                                    },600);
                                }


                                _cache2.css({
                                    'opacity':0
                                    ,'height':'100%'
                                    ,'top':'0'
                                })
                                //_cache2.children('.translucent-con').css({
                                //    'height':0
                                //})
                                _cache2.animate({
                                    'opacity' : '1'
                                },{
                                    queue:false
                                    , duration: 250
                                    ,complete:function(){

                                        _cache2.removeClass('transitioning');
                                    }

                                });
                            },bg_transition_delay)
                        }else{

                            // -- qcreative nav con .translcent-con
                            _cache2.animate({
                                'height' : '100%'
                                ,'top' : '0'
                            },{
                                queue:false
                                , duration: aux
                                ,complete:function(){

                                    _cache2.removeClass('transitioning');
                                }

                            });
                        }


                        if(_cache2.hasClass('dzsparallaxer')){

                        }
                    }

                    //console.log(_mainBgTransitioning, animation_time);


                    var delay_for_main_bg = 0;

                    if(_body.hasClass('menu-type-13') || _body.hasClass('menu-type-14') || _body.hasClass('menu-type-17') || _body.hasClass('menu-type-18')){
                        delay_for_main_bg = 100;
                    }

                    function main_bg_transition_complete(){

                        /// -- when main background has transitioned
                        //console.info('ceva');


                        _mainBg = _mainBgTransitioning;
                        _mainBgTransitioning = null;


                        if(bg_transition=='fade'){
                            $('.main-bg-con:not(".transitioning")').addClass('for-remove');
                            setTimeout(function(){

                                $('.main-bg-con.for-remove').remove();
                                //$('.main-bg-con:not(".transitioning")').remove();
                            },bg_transition_delay+100)
                        }else{

                            $('.main-bg-con:not(".transitioning")').remove();
                            //$('.main-bg-con:not(".transitioning")').remove();
                        }

                        _mainBg = $('.main-bg-con:not(".for-remove")').eq(0);

                        //console.info(_navCon,_navCon.find('.translucent-con').length);


                        if(_navCon.find('.translucent-con').length>1){
                            var aux2314=_navCon.find('.translucent-con').eq(0);

                            if(bg_transition=='fade'){
                                setTimeout(function(){
                                    aux2314.remove();
                                },500);
                            }else{
                                aux2314.remove();
                            }


                        }





                        //console.log(_navCon.find('.translucent-con'));


                        _mainBg.removeClass('transitioning');

                        //console.log(_mainBg, _mainBg.find('figure'))
                        _mainBg.find('figure').eq(0).css({
                            'width' : ''
                            ,'height' : ''
                        })

                        //console.info(newclass_body);
                        if( window.qcreative_options.bg_isparallax=='on' && newclass_body!='page-homepage' && newclass_body!='page-gallery-w-thumbs'){

                            //var args = {  mode_scroll: "fromtop", animation_duration : '20', is_fullscreen: "on", init_functional_delay: "10000",init_functional_remove_delay_on_scroll: "off" };
                            //if(parallax_reverse){
                            //    args.direction = "reverse";
                            //}
                            setTimeout(function(){

                            },30000);

                            _mainBg.addClass('dzsparallaxer');
                            _mainBg.children('.main-bg').addClass('dzsparallaxer--target');

                            //console.log(args);


                            _mainBg.addClass('stickto100');

                            //console.info(_mainBg);

                            setTimeout(function(){

                            },4000);

                            if($('.qcreative--nav-con .translucent-con').hasClass('dzsparallaxer')){
                                $('.qcreative--nav-con .translucent-con').addClass('stickto100');
                            }
                            if($('.the-content .translucent-con').hasClass('dzsparallaxer')){
                                $('.the-content .translucent-con').addClass('stickto100');
                            }
                        }else{

                            _mainBg.removeClass('dzsparallaxer');
                            _mainBg.children('.main-bg').removeClass('dzsparallaxer--target');
                            //_mainBg.children('.main-bg').removeClass('for-parallaxer');
                        }


                        if($('.main-gallery--descs').length>0){
                            if($('.main-gallery--descs').eq(0).hasClass('removed')==false){

                                _mainGalleryDescs = $('.main-gallery--descs').eq(0);
                            }
                        }

                        //reinit();
                        if(_mainGalleryDescs){

                            //console.info('curr desc', _mainGalleryDescs, _mainGalleryDescs.children().eq(arg));

                            _mainGalleryDescs.children().removeClass('active');
                            _mainGalleryDescs.children().eq(arg).addClass('active');


                            if(_mainGalleryDescs.children().eq(arg).hasClass('style2')){
                                _mainGalleryDescs.removeClass('style1').addClass('style2');
                                _mainGalleryDescs.css({
                                    //'right' : (ww-280-_mainGalleryDescs.children().eq(arg).width())+'px'
                                })
                            }else{

                                _mainGalleryDescs.removeClass('style2').addClass('style1');
                                _mainGalleryDescs.css({
                                    'right' : ''
                                })
                            }

                            //console.info(_mainGalleryDescs.children().eq(arg).find('.translucent-canvas').eq(0));



                            if(is_chrome() && String(window.location.href).indexOf('file://')==0){

                            }else{

                                //console.info('calculate translucent for desc')

                                calculate_translucent_canvas(_mainGalleryDescs.children().eq(arg).find('.translucent-canvas').eq(0), {overwrite_bg_index: arg});
                            }

                            _mainGalleryDescs.css({
                                'width' : _mainGalleryDescs.children().eq(arg).width() + 'px'
                                ,'height' : _mainGalleryDescs.children().eq(arg).height() + 'px'
                            })

                        }



                        setup_newBgImage(margs);
                        currBgNr = arg;

                        is_ready_load=false;
                        is_ready_transition=false;
                        busy_main_transition=false;

                        if($('body').hasClass('q-inited')==false) {
                            //console.log(is_ie(), ieVersion())
                            if (ieVersion() == 11) {
                                setTimeout(function () {
                                    $('body').addClass('q-inited');

                                    if (_theContent && _theContent.parent().css('opacity') == 0) {


                                        _theContent.parent().animate({
                                            'opacity': 1
                                            //,width : lastcontent_w
                                            //,left : 0
                                        }, {
                                            duration: 600
                                            , queue: false
                                        });
                                    }

                                    if (page == 'page-homepage') {
                                        $('.the-content-con').animate({
                                            'opacity': 1
                                            //,width : lastcontent_w
                                            //,left : 0
                                        }, {
                                            duration: 600
                                            , queue: false
                                        });
                                    }
                                }, 500)
                            } else {

                                setTimeout(function () {
                                    $('body').addClass('q-inited');
                                    if (_theContent && _theContent.find('.translucent-canvas').length > 0) {
                                        _theContent.find('.translucent-canvas').each(function () {
                                            var _t255 = $(this);

                                            //console.log('first translucent canvas on the content', _t255);


                                            if (is_chrome() && String(window.location.href).indexOf('file://') == 0) {

                                            } else {

                                                calculate_translucent_canvas(_t255);
                                            }

                                        })
                                    }


                                    var _c = null;

                                    //console.info(_theContent);
                                    if (_theContent) {


                                        _c = _theContent.parent();

                                    } else {
                                        if ($('.the-content-con').length > 0) {
                                            _c = ($('.the-content-con').eq(0));

                                        }
                                    }

                                    if (_c && _c.css('opacity') == 0) {


                                        fade_the_content_con(_c);
                                    }
                                }, 300)
                            }
                        }
                    }


                    if(bg_transition=='fade'){


                        _mainBg.animate({
                            'opacity' : '0'
                        },{
                            queue:false
                            , duration: animation_time
                        })

                        setTimeout(function(){



                            //console.info(_mainBgTransitioning, targeth);

                            _mainBgTransitioning.css({
                                'height' : targeth
                                ,'top' : '0'
                                ,'opacity' : '0'
                            })

                            _mainBgTransitioning.animate({
                                'opacity' : '1'
                            },{
                                queue:false
                                , duration: animation_time
                            })


                            main_bg_transition_complete();
                            setTimeout(function(){
                            }, animation_time-100)
                        },delay_for_main_bg+bg_transition_delay);

                    }else{

                        setTimeout(function(){
                            //console.info(_mainBgTransitioning, targeth);
                            _mainBgTransitioning.animate({
                                'height' : targeth
                                ,'top' : '0'
                            },{
                                queue:false
                                , duration: animation_time
                                ,complete: main_bg_transition_complete
                            })
                        },delay_for_main_bg);
                    }


                },300);

                main_content_loaded = true;
            }

            if(_body.hasClass('wait-for-main-content-to-load')){

                main_content_loaded = false;
                inter_check_if_main_content_loaded = setInterval(function(){

                    if(_theContent.find('.translucent-layer').eq(0).children().eq(0).hasClass('zfolio')){
                        var _c23 = _theContent.find('.translucent-layer').eq(0).children().eq(0);
                        if(_c23.hasClass('all-images-loaded')){

                            clearInterval(inter_check_if_main_content_loaded);
                            if(main_content_loaded==false){
                                do_transition_really_do_it()
                            }
                        }
                    }
                },100);

                setTimeout(function(){





                    clearInterval(inter_check_if_main_content_loaded);
                    if(main_content_loaded==false){
                        do_transition_really_do_it()
                    }
                },2000);
            }else{

                do_transition_really_do_it();
            }



            //return false;

        }



        //console.info('ceva23232');
        if($('.qcreative--nav-con .translucent-canvas').length>0){


            // --- menubg

            if(_body.hasClass('menu-type-5')==false && _body.hasClass('menu-type-5')==false && _body.hasClass('menu-type-7')==false && _body.hasClass('menu-type-8')==false && _body.hasClass('menu-type-9')==false && _body.hasClass('menu-type-10')==false && _body.hasClass('menu-type-15')==false && _body.hasClass('menu-type-16')==false){
                var _c = $('.qcreative--nav-con .translucent-con').eq(0);
                var targeth = '100%';

                //console.info('hony');
                _c.after(_c.clone());

                _c.next().find('.translucent-canvas').removeClass('dummy');

                _cache2 = $('.qcreative--nav-con .translucent-con').eq(1);

                _cache2.addClass('transitioning');


                _cache2.css({
                    'height': '0%'
                    ,'top': '-50px'
                });



                //console.log(window.qcreative_options.bg_isparallax);
                if(window.qcreative_options.bg_isparallax=='on' && newclass_body!='page-homepage' && newclass_body!='page-gallery-w-thumbs'){
                    //console.info(wh*0.3);
                    //_cache2.find('.translucent-bg').css({
                    //    'transform' : 'translate3d(0,-'+wh*0.3+'px,0)'
                    //    ,'height' : ((wh*parallaxer_multiplier) + 30)+'px'
                    //})

                    //console.info(bigimageheight,wh);
                    _cache2.find('.translucent-canvas').css({
                        'transform' : 'translate3d(0,-'+(bigimageheight-wh-qcreative_options.substract_parallaxer_pixels)+'px,0)'
                        ,'height' : ((bigimageheight) )+'px'
                    })

                    if(_cache2.find('.translucent-canvas').data('substract-translate')!='off'){
                        _cache2.find('.translucent-canvas').data('substract-translate','on');
                    }
                }else{

                    _cache2.find('.translucent-canvas').css({
                        'transform' : 'translate3d(0,0,0)'
                        ,'height' : ((wh) )+'px'
                    })

                    //console.info(wh, _c2.find('.translucent-bg').height());
                }




                //handle_resize();

                //console.log($('.main-bg-image'));


                //determine_page();
                //console.info(" -- page is really ", page, newclass_body);

                if(newclass_body!='page-homepage' && newclass_body!='page-gallery-w-thumbs' && qcreative_options.bg_isparallax=='on'){
                    //console.info(page);

                    _cache2.find('.translucent-canvas').addClass('for-parallaxer');
                    animation_time=400;
                    //animation_time=12000;
                    targeth=String(parallaxer_multiplier*10) + '0%';
                }else{

                    //console.info(_c2);
                    _cache2.find('.translucent-canvas').removeClass('for-parallaxer');
                    animation_time=400;
                }

                //console.info('ceva23232');
                handle_resize(null,{
                    placew: true
                    ,place_page:false
                    ,redraw_canvas:false
                });

            }

            //console.info(_cache2.find('.translucent-canvas'));

            if(is_chrome() && String(window.location.href).indexOf('file://')==0){

                do_transition();

            }else{

                //console.info(is_content_page);
                if(_cache2){

                    _content_translucent_canvas = null;
                    if(bg_transition=='fade' && is_content_page){

                        var _c23 = $('.the-content .translucent-canvas').eq(0);

                        setTimeout(function(){

                            _c23.animate({
                                'opacity':'0'
                            },{
                                queue:false
                                ,duration : animation_time
                            })
                        },500);


                        _c23.after(_c23.clone());
                        _c23.next().css('opacity','0').addClass('transitioning');
                        _content_translucent_canvas = _c23;



                        calculate_translucent_canvas(_c23.next(), {overwrite_bg_index: arg });
                    }
                    // -- cache2 is qcreative nav con
                    //console.info(_cache2, _cache2.find('.translucent-canvas'))
                    calculate_translucent_canvas(_cache2.find('.translucent-canvas'), {overwrite_bg_index: arg, callback_func: do_transition  });
                }else{
                    do_transition();
                }
            }







        }

    }

    function setup_newBgImage(margs){
        //console.info('setup_newBgImage() / this where the new page comes into play / both for new page and for init');

        //return false;

        if(_mainContainer.get(0) && _mainContainer.get(0).api_scrolly_to) {
            _body.addClass('has-custom-scroller');
        }


        setTimeout(function(){
            if(window.preseter_init){

                $('.preseter.align-right').addClass('activated');
                window.preseter_init()




                if(window.dzsscr_init){
                    //console.log('apply BURNED WATER');

                    if($('.preseter .preseter-content-con').hasClass('scroller-con')){
                        window.dzsscr_init('.preseter .preseter-content-con',{
                            'settings_skin':'skin_apple'
                            ,enable_easing: 'on'
                            ,settings_autoresizescrollbar: 'on'
                            ,settings_chrome_multiplier : 0.12
                            ,settings_firefox_multiplier : -3
                            ,settings_refresh: 700
                            ,settings_autoheight: "off"
                            ,touch_leave_native_scrollbar: "on"
                        });


                    }



                }



                $('.preseter .preseter-content-con .the-content-inner-inner').bind('mouseenter',function(){

                    clearTimeout(inter_enlarge_preseter);
                    //console.info('mouseenter', $('.preseter .preseter-content-con .the-content'));
                    //$('.preseter .preseter-content-con .the-content-inner-con').css('width', '700px');
                    //$('.preseter .preseter-content-con .the-content-inner-con').css('left', 'auto');
                    //$('.preseter .preseter-content-con .the-content-inner-con').css('right', '0');
                    $('.preseter .preseter-content-con .the-content').css('width', '700px');
                    $('.preseter .preseter-content-con .the-content').css('left', 'auto');
                    $('.preseter .preseter-content-con .the-content').css('right', '0');

                    //$(this).css('width', '260px');
                    //$(this).css('left', 'auto');
                    //$(this).css('right', '0');
                })
                $('.preseter .preseter-content-con .the-content-inner-inner').bind('mouseleave',function(){


                    clearTimeout(inter_enlarge_preseter);
                    inter_enlarge_preseter = setTimeout(function(){

                        //$('.preseter .preseter-content-con .the-content-inner-con').css('width', '');
                        //$('.preseter .preseter-content-con .the-content-inner-con').css('left', '');
                        //$('.preseter .preseter-content-con .the-content-inner-con').css('right', '');
                        $('.preseter .preseter-content-con .the-content').css('width', '');
                        $('.preseter .preseter-content-con .the-content').css('left', '');
                        $('.preseter .preseter-content-con .the-content').css('right', '');
                        //$(this).css('width', '');
                        //$(this).css('left', '');
                        //$(this).css('right', '');
                    },300)
                    //console.info('mouseleave');
                })

            }
        },1500);


        //console.info(_mainBg);
        //console.info(margs);
        var aux = _mainBg.find('figure').eq(0).css('background-image');
        mainBgImgCSS = aux;

        if(aux){

            aux = aux.replace('url(','');
            aux = aux.replace('url("','');
            aux = aux.replace(')','');
            aux = aux.replace('")','');
        }else{
            //return false;
        }

        mainBgImgUrl = aux;



        //console.info('init zoombox is ',qcre_init_zoombox);
        if(qcre_init_zoombox){



            if(window.init_zoombox){

                window.init_zoombox(zoombox_options);
            }else{
                console.log('zoombox not defined .. why ? ')
            }
            qcre_init_zoombox = false;
        }


        _c_for_parallax_items = [];

        if( (page!='page-homepage' && page!='page-gallery-w-thumbs' && window.qcreative_options.bg_isparallax=='on' && (margs.newpage_transition || bg_transition=='fade') ) ){
            //_navCon.find('.translucent-con .translucent-bg').addClass('for-parallaxer');
            _navCon.find('.translucent-con .translucent-canvas').addClass('for-parallaxer');




            _c_for_parallax_items = [];
            if($('.for-parallaxer').length>0){
                $('.for-parallaxer').each(function(){
                    var _t = $(this);
                    _c_for_parallax_items.push(_t);
                })
                //= ;
            }
        }

        //console.info('DONE',margs);




        if(margs.newpage_transition && ___response) {

            transitioned_via_ajax_first = true;
            // -- this is the new page transition from setup_newBgImage() . destroy any listeners here
            determine_page();

            document.body.style.zoom = 1.0;


            $('.map-canvas-con').remove();
            $('.fullbg').remove();
            $('.dzs-progress-bar').each(function(){
                var _t = $(this);

                //console.log(_t);
                if(_t.get(0) && _t.get(0).api_destroy_listeners){
                    _t.get(0).api_destroy_listeners();
                }

                setTimeout(function(){
                    _t[0] = null;
                },300);
                //_t = $();


            });



            if(newclass_body_with_fullbg){

                //console.info(_mainBg);

                // -- we do this here so we can access full DOM
                _body.addClass('with-fullbg');
                _mainBg.after('<div class="fullbg" style="opacity:0;"></div>');


                setTimeout(function(){
                    if(_mainBg.next().hasClass('fullbg')){
                        _mainBg.next().animate({
                            'opacity':1
                        },{
                            queue:false
                            ,duration: 300
                        })
                    }
                },50)
            }


            //console.info(___response.find('.map-canvas-con'));

            if (___response.find('.map-canvas-con').length > 0) {
                _mainContainer.append(___response.find('.map-canvas-con').eq(0))
            }



            if(_mainContainer.get(0) && _mainContainer.get(0).api_scrolly_to){
                _mainContainer.get(0).api_scrolly_to(0, {
                    'force_no_easing':'on'
                    ,show_scrollbar : false
                })
            }else{

                $(window).scrollTop(0);
            }

        }

        //console.info($('#map-canvas'));

        if($('#map-canvas').length>0){
            gm_initialize();
        }




        //console.info(newclass_body,window.qcreative_options.bg_isparallax);


        if( window.qcreative_options.bg_isparallax=='on' && newclass_body!='page-homepage' && newclass_body!='page-gallery-w-thumbs') {

            var args = {
                mode_scroll: "fromtop",
                animation_duration: '20',
                is_fullscreen: "on",
                init_functional_delay: "0",
                init_functional_remove_delay_on_scroll: "off"
                ,settings_substract_from_th: qcreative_options.substract_parallaxer_pixels
            };
            if (parallax_reverse) {
                args.direction = "reverse";
            }

            window.dzsprx_init(_mainBg, args);


            //console.info(_mainBg);


            if(_mainBg.get(0) && _mainBg.get(0).api_set_update_func){

                _mainBg.get(0).api_set_update_func(update_parallaxer);
            }



        }

        if(margs.newpage_transition && ___response){



            // -- part of setup_newBgImage



            //console.info($('.the-content-con:not(".transitioning")'));

            $('.the-content-con:not(".transitioning") .translucent-canvas').addClass('removed');
            $('.the-content-con:not(".transitioning")').remove();
            $('.the-content-con:not(".transitioning")').find('.zfolio').remove();


            //console.info('PAGE IS ',page,newclass_body, $('.the-content-con.transitioning'));
            $('.the-content-con.transitioning').each(function(){
                var _t24 = $(this);

                //console.log(_t24);



                _t24.css('width', '');
                _t24.css('max-width', '');
                _t24.removeClass('transitioning');

                //_navCon.before(_t24);

                if(_theContent){
                    _theContent.find('.zfolio').each(function(){
                        var _t242 = $(this);
                        //console.info(_t242);
                        if(_t242.get(0) && _t242.get(0).api_destroy){
                            _t242.get(0).api_destroy();
                        }

                    })
                }


                // -- the new content-con is the real content-con NOW
                _theContent = $('.the-content').eq(0);



                handle_resize(null,{
                    placew: false
                    ,place_page:true
                    ,redraw_canvas:false
                });


                if(_t24.hasClass('fullit')){
                    _t24.find('.zfolio.fullwidth').css({
                        'width' : ''
                    })

                    page_is_fullwidth=true;
                }

                //_theContent.parent().removeClass("transitioning");



                if(_theContent && _theContent.find('.translucent-canvas').length>0){
                    _theContent.find('.translucent-canvas').each(function(){
                        var _t255 = $(this);


                        //console.info('PAGE IS', page);

                        if(page!='page-homepage' && page!='page-gallery-w-thumbs' && window.qcreative_options.bg_isparallax=='on'){
                            _t255.addClass('for-parallaxer');
                        }



                        _c_for_parallax_items = [];
                        if($('.for-parallaxer').length>0){
                            $('.for-parallaxer').each(function(){
                                var _t = $(this);
                                _c_for_parallax_items.push(_t);
                            })
                            //= ;
                        }else{
                            _c_for_parallax_items = [];
                        }

                        //console.log('content translucent cons', _t255, _theContent);
                        calculate_translucent_canvas(_t255);
                    })
                }

                setTimeout(function(){




                    //console.info('this is transition')



                    if(_t24.hasClass('fullit')==false){

                        //console.info();



                        //console.info(page);

                        if(page!='nuttin'){



                            _t24.css({
                                'opacity': 0
                                //,width : lastcontent_w
                                //,left : 0
                            });

                            //console.info('check page here ',newclass_body);

                            if(newclass_body=='page-gallery-w-thumbs'){

                                calculate_dims_gallery_thumbs_img_container();
                            }

                            //console.info('y no animation');
                            _t24.animate({
                                'opacity': 1
                                //,width : lastcontent_w
                                //,left : 0
                            },{
                                duration: 600
                                ,queue:false
                                ,complete:function(arg){


                                    //$(this).children('.the-content').css({
                                    //    'width':''
                                    //})
                                }
                                //,step: function(now,tween){
                                //    //console.info(now,tween);
                                //
                                //
                                //
                                //    handle_resize(null, {ignore_menu:true});
                                //}
                            });
                        }

                        _t24.children('.the-content').animate({
                            //'margin-left': 0
                        },{
                            queue:false
                            ,duration: 600
                        })


                        //_t24.find('.translucent-bg').css({
                        //    'margin-left': -ww
                        //})
                        //_t24.find('.translucent-bg').animate({
                        //    'margin-left': -initial_offset
                        //},{
                        //    duration: 600
                        //    ,queue:false
                        //})

                        setTimeout(function(){

                        },0);



                    }else{

                        //console.info('is fullit');

                        _t24.animate({
                            'opacity': 1
                        },{
                            duration: 600
                            ,queue:false
                        })


                    }


                },400);




            });



            setTimeout(function(){
                reinit();
                //console.info("REINIT");
                //handle_resize(null, {ignore_menu:true});
            },100)
        }else{


            if(first_page_not_transitioned){

                reinit();
                first_page_not_transitioned=false;
            }



            //$("body").removeClass('qtransitioned');
            //$("body").addClass('qtransitioning');


            //console.info("REINIT FROM non");
            //handle_resize();
        }

        //handle_resize();
    }


    function fade_the_content_con(arg){

        //console.info('fade_the_content_con');
        arg.animate({
            'opacity': 1
        }, {
            duration: 1000
            , queue: false
        });

        if(_body.children('.fullbg').length>0){

            _body.children('.fullbg').animate({
                'opacity': 1
            }, {
                duration: 1000
                , queue: false
            });

        }
        if(is_ie11()){

            $('.fullbg').animate({
                'opacity': 1
            }, {
                duration: 1000
                , queue: false
            });
        }
    }

    function calculate_mainbg(){



        //var _c = $('.main-bg-con');
        //
        //_c.each(function(){
        //
        //    var _t =$(this);
        //
        //    if(_t.hasClass('')){
        //
        //    }
        //
        //});

        var _c = $('.main-bg-image');

        _c.each(function(){

            var _t =$(this);
            //console.info(_t);
            var wi = _t.get(0).naturalWidth;
            var he = _t.get(0).naturalHeight;
            //console.info(wi,he,ww,wh);

            var auxww = ww;
            var auxwh = wh;

            if(_t.parent().hasClass('dzsparallaxer')){

                auxwh*=parallaxer_multiplier;
            }

            //console.info(auxww, wh, auxwh);

            if(wi/he >auxww/auxwh){

                bigimagewidth=auxwh * (wi/he);
                bigimageheight=auxwh;

            }else{


                bigimagewidth=auxww;
                bigimageheight=auxww*(he/wi);
            }
            //console.info(bigimagewidth, bigimageheight);
            _t.width(bigimagewidth);
            _t.height(bigimageheight);
        })

    }

    function handle_frame(){

        //console.log('handle_frame()');

        if(page=='page-gallery-w-thumbs'){
            //console.info(_gallery_thumbs_con, finish_vix);
            if(finish_vix){



                begin_vix = target_vix;
                change_vix = finish_vix - begin_vix;


                //console.info('handle_frame', finish_viy, duration_viy, target_viy);

                //console.log(duration_viy);
                target_vix = Number(Math.easeIn(1, begin_vix, change_vix, duration_vix).toFixed(4));;


                //console.info(target_vix, _gallery_thumbs_con);

                if(!(_gallery_thumbs_con)){

                    if($('.gallery-thumbs-con').length>0) {
                        _gallery_thumbs_con = $('.gallery-thumbs-con').eq(0);
                    }
                }


                if(is_ios()==false && is_android()==false && _gallery_thumbs_con){
                    _gallery_thumbs_con.find('.thumbs-list').eq(0).css({
                        'transform': 'translate3d('+target_vix+'px,0,0)'
                    });
                }
            }
        }

        requestAnimFrame(handle_frame);

    }


    function change_nav_con_520(e){
        var _t = $(this);
        //console.info(e,_t, _t.val(), _t.find(':selected'));


        var _tc = _t.find(':selected').eq(0);



        click_menu_anchor(e, {_t:_tc});
    }

    function handle_mouse(e){

        var _t = $(this);

        if(e){
            if(e.type=='mousemove'){
                if(_t.hasClass('thumbs-list-con')){

                    var this_w = _t.width();

                    //console.info(this_w, _t.find('.thumbs-list').eq(0).width());

                    if(_t.find('.thumbs-list').eq(0).width() > this_w){

                        var mx = e.pageX - _t.offset().left;

                        var aux_tw = _t.find('.thumbs-list').eq(0).width();




                        //console.info(mx/this_w);


                        finish_vix = mx/this_w * (this_w-aux_tw-(thumbs_padding_left_and_right/2) + thumbs_list_padding_right);

                        //console.log(finish_vix);


                    }else{
                        finish_vix=0;
                    }

                }
            }
            if(e.type=='click'){
                if(_t.hasClass('prev-btn-con')){

                    goto_prev_bg()
                }
                if(_t.hasClass('next-btn-con')){

                    goto_next_bg()
                }
                if(_t.hasClass('map-show')){

                    contact_show_map();
                }
                if(_t.hasClass('map-hide')){

                    contact_hide_map();
                }

                if(_t.hasClass('menu-toggler') || _t.hasClass('menu-closer')){

                    $('.menu-toggler-target').eq(0).toggleClass('active');
                }

                if(_t.hasClass('thumb')){
                    var ind = _t.parent().children().index(_t);

                    currNr_gallery_w_thumbs = ind;

                    //console.info(ind);

                    _t.parent().children().removeClass('curr-thumb');
                    _t.addClass('curr-thumb');


                    //console.info(page);
                    if(page=='page-gallery-w-thumbs'){
                        if (document.getElementById("as-gallery-w-thumbs") && document.getElementById("as-gallery-w-thumbs").api_goto_page) {

                            document.getElementById("as-gallery-w-thumbs").api_goto_page(ind);
                        }

                    }
                }
                if(_t.hasClass('services-lightbox')){
                    //console.info('ceva');


                    _mainContainer.append('<div class="services-lightbox-overlay"></div>');
                    _mainContainer.append('<div class="services-lightbox-content"><div class="services-lightbox-content--content">'+_t.children('.lightbox-content').eq(0).html()+'</div><div class="services-lightbox--close"><i class="fa fa-times"></i></div></div>');

                    _mainContainer.children('.services-lightbox-content').width((_theContent.width()-60));
                    _mainContainer.children('.services-lightbox-content').css({
                        'left' : _theContent.offset().left + 30
                    });

                    if(ww<responsive_breakpoint){
                        _mainContainer.children('.services-lightbox-content').css({
                            'left' : ''
                            ,'width' : ''
                        });
                    }


                    setTimeout(function(){
                        _mainContainer.children('.services-lightbox-overlay,.services-lightbox-content').addClass('active');

                        setTimeout(function(){
                            _mainContainer.children('.services-lightbox-content').addClass('active-content');

                        },300)
                    },100);

                    if(_mainContainer.get(0) && _mainContainer.get(0).api_block_scroll){
                        _mainContainer.get(0).api_block_scroll();
                    }

                    return false;
                }
                if(_t.hasClass('services-lightbox--close')){
                    //console.info('ceva');


                    _mainContainer.children('.services-lightbox-overlay').removeClass('active');
                    _mainContainer.children('.services-lightbox-content').removeClass('active active-content');

                    setTimeout(function(){
                        _mainContainer.children('.services-lightbox-overlay,.services-lightbox-content').remove();
                    },600);


                    if(_mainContainer.get(0) && _mainContainer.get(0).api_unblock_scroll){
                        _mainContainer.get(0).api_unblock_scroll();
                    }

                    return false;
                }
                if(_t.hasClass('contact-form-button')){
                    //console.info('ceva');

                    var sw_error = false;

                    if($('input[name=the_name]').eq(0).val()==''){

                        $('input[name=the_name]').eq(0).addClass('needs-attention');
                        $('input[name=the_name]').eq(0).val('Please complete this field');

                        setTimeout(function(){

                            $('input[name=the_name]').eq(0).removeClass('needs-attention');
                            $('input[name=the_name]').eq(0).val('');
                        },2000);


                        sw_error=true;
                    }


                    if($('textarea[name=the_feedback]').eq(0).val()==''){

                        $('textarea[name=the_feedback]').eq(0).addClass('needs-attention');
                        $('textarea[name=the_feedback]').eq(0).val('Please complete this field');

                        setTimeout(function(){

                            $('textarea[name=the_feedback]').eq(0).removeClass('needs-attention');
                            $('textarea[name=the_feedback]').eq(0).val('');
                        },2000);


                        sw_error=true;
                    }


                    if(validateEmail($('input[name=the_email]').eq(0).val())==false){
                        $('input[name=the_email]').eq(0).addClass('needs-attention');
                        $('input[name=the_email]').eq(0).val('Invalid email address');

                        setTimeout(function(){

                            $('input[name=the_email]').eq(0).removeClass('needs-attention');
                            $('input[name=the_email]').eq(0).val('');
                        },2000)

                        sw_error=true;
                    }

                    if(sw_error){

                        return false;
                    }


                    var data = {
                        the_email: $('input[name=the_email]').eq(0).val()
                        ,the_name: $('input[name=the_name]').eq(0).val()
                        ,the_feedback: $('textarea[name=the_feedback]').eq(0).val()
                    };
                    var ajaxurl = 'mail.php';
                    jQuery.post(ajaxurl, data, function(response) {
                        if(window.console !=undefined ){
                            console.log('Got this from the server: ' + response);
                        }
                        $('.form-feedback').eq(0).addClass('active');
                        $('input[name=the_email]').eq(0).val('');
                        $('input[name=the_name]').eq(0).val('');
                        $('textarea[name=the_feedback]').eq(0).val('');
                        setTimeout(function(){

                            $('.form-feedback').eq(0).removeClass('active');
                        },2000);
                    });


                    return false;


                }


                if(_t.hasClass('submit-comment')){



                    return false;


                }

                if(_t.hasClass('portfolio-single-liquid-info')){


                    if(_mainContainer.get(0) && _mainContainer.get(0).api_scrolly_to){

                        _mainContainer.find('.scrollbary').eq(0).addClass('animatetoptoo');
                        setTimeout(function(){

                            var aux = _theContent.find('.desc-content-wrapper h3').eq(0).offset().top;
                            _mainContainer.get(0).api_scrolly_to(aux, {
                                'force_no_easing':'off'
                            });
                        },50);
                    }


                }


                if(_t.hasClass('arrow-left-for-skin-qcre')){


                    if(_theContent.find('.advancedscroller').get(0) && _theContent.find('.advancedscroller').get(0).api_gotoPrevPage) {
                        _theContent.find('.advancedscroller').get(0).api_gotoPrevPage();
                    }


                }
                if(_t.hasClass('arrow-right-for-skin-qcre')){


                    if(_theContent.find('.advancedscroller').get(0) && _theContent.find('.advancedscroller').get(0).api_gotoNextPage){

                        _theContent.find('.advancedscroller').get(0).api_gotoNextPage();
                    }


                }
                if(_t.hasClass('description-wrapper--icon-con')){


                    _t.parent().toggleClass('active');


                }
                if(_t.hasClass('preseter-button--save')){


                    //console.log('ceva');


                    if(typeof(Storage) !== "undefined") {
                        //console.info($('input[name=parallax_bg]:checked').val());

                        var datenow = new Date().getTime();
                        var object = {value: $('select[name=menu-type]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("menu-type", JSON.stringify(object));

                        object = {value: $('select[name=page-title-style]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("page-title-style", JSON.stringify(object));


                        object = {value: $('select[name=page-title-align]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("page-title-align", JSON.stringify(object));

                        object = {value: $('select[name=heading-style]').eq(0).val(), timestamp: datenow};
                        //console.info(object);
                        localStorage.setItem("heading-style", JSON.stringify(object));

                        object = {value: $('select[name=heading-aligment]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("heading-aligment", JSON.stringify(object));

                        object = {value: $('select[name=content-align]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("content-align", JSON.stringify(object));

                        object = {value: $('input[name=parallax_bg]:checked').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("parallax_bg", JSON.stringify(object));

                        object = {value: $('input[name=blur_ammount]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("blur_ammount", JSON.stringify(object));

                        object = {value: $('input[name=saturation_ammount]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("saturation_ammount", JSON.stringify(object));

                        object = {value: $('input[name=color_primary]').eq(0).val(), timestamp: datenow};
                        localStorage.setItem("color_primary", JSON.stringify(object));

                        //console.info(localStorage.getItem('heading-style'));


                        var menu_type_aux = $('select[name=menu-type]').eq(0).val();
                        //console.info(menu_type_aux);
                        if(menu_type_aux=='menu-type-2'||menu_type_aux=='menu-type-4'||menu_type_aux=='menu-type-6'||menu_type_aux=='menu-type-8'||menu_type_aux=='menu-type-10'||menu_type_aux=='menu-type-14'||menu_type_aux=='menu-type-16'||menu_type_aux=='menu-type-18'){

                            //console.info()
                            if(String(curr_html).indexOf('light-')==0){




                                location.reload();
                            }else{

                                window.location.href = 'light-'+curr_html;
                            }
                        }else{

                            //console.info(String(window.location.href).indexOf('light-'), String(curr_html).substr(6))
                            if(String(curr_html).indexOf('light-')!=0){

                                //console.info(curr_html);

                                if(curr_html_with_clear_cache){
                                    window.location.href = curr_html;
                                }else{
                                    location.reload();
                                }
                                //location.reload();
                            }else{

                                window.location.href = String(curr_html).substr(6);
                            }
                        }

                    } else {
                        // Sorry! No Web Storage support..
                    }


                }
                if(_t.hasClass('preseter-button--default')){


                    //console.log('ceva');


                    if(typeof(Storage) !== "undefined") {
                        localStorage.setItem("menu-type", '');
                        localStorage.setItem("page-title-style", '');
                        localStorage.setItem("page-title-align", '');
                        localStorage.setItem("heading-style", '');
                        localStorage.setItem("heading-aligment", '');
                        localStorage.setItem("content-align", '');
                        localStorage.setItem("parallax_bg", '');
                        localStorage.setItem("blur_ammount", '');
                        localStorage.setItem("saturation_ammount", '');
                        localStorage.setItem("color_primary", '');

                        //location.reload();


                        if(String(curr_html).indexOf('light-')!=0){

                            //console.info(curr_html);

                            if(curr_html_with_clear_cache){
                                window.location.href = curr_html;
                            }else{
                                location.reload();
                            }
                            //location.reload();
                        }else{

                            window.location.href = String(curr_html).substr(6);
                        }
                    } else {
                        // Sorry! No Web Storage support..
                    }


                }
            }
        }
    }

    function handle_mouse_for_gallery_w_thumbs(e){
        var _t = $(this);


        if(_t.hasClass('arrow-left')){
            //console.info(currNr_gallery_w_thumbs);

            currNr_gallery_w_thumbs--;

            if(currNr_gallery_w_thumbs < 0){
                currNr_gallery_w_thumbs = _theContent.find('.advancedscroller').find('.thumbsClip').children().length-1;
            }

            //console.log(currNr_gallery_w_thumbs);
            //console.info(currNr_gallery_w_thumbs, _theContent.find('.advancedscroller').find('.thumbsClip'));


        }

        if(_t.hasClass('arrow-right')){
            //console.info(currNr_gallery_w_thumbs);

            currNr_gallery_w_thumbs++;

            if(currNr_gallery_w_thumbs >= _theContent.find('.advancedscroller').find('.thumbsClip').children().length){
                currNr_gallery_w_thumbs = 0;
            }

            //console.info(currNr_gallery_w_thumbs, _theContent.find('.advancedscroller').find('.thumbsClip'));


        }
        _gallery_thumbs_con.find('.thumbs-list .thumb').removeClass('curr-thumb');
        _gallery_thumbs_con.find('.thumbs-list .thumb').eq(currNr_gallery_w_thumbs).addClass('curr-thumb');
    }

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function contact_show_map(){

        //console.info('contact_show_map()');

        $('.map-canvas-con').addClass('active');
    }

    function contact_hide_map(){

        //console.info('contact_show_map()');

        $('.map-canvas-con').removeClass('active');
    }


    function gm_initialize() {
        //console.info('gm_initialize()',window.google);



        var _c_ = $('#map-canvas')[0];


        var lat = -33.890542;
        var long2 = 151.274856;


        if(_c_ && _c_.getAttribute && _c_.getAttribute('data-lat')){
            lat = _c_.getAttribute('data-lat');
        }
        if(_c_ && _c_.getAttribute && _c_.getAttribute('data-long')){
            long2 = _c_.getAttribute('data-long');
        }


        if(!(window.google) || !(google.maps) || !(google.maps.LatLng)){
            setTimeout(gm_initialize,1000);
            //return false;
        }

        var gm_position = new google.maps.LatLng(lat, long2);
        var styleOptions = [{"stylers":[{"hue":"#ff1a00"},{"invert_lightness":true},{"saturation":-100},{"lightness":33},{"gamma":0.5}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2D333C"}]}];


        styleOptions=[];

        var mapOptions = {
            zoom: 17,
            center: gm_position,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            styles: styleOptions
        };





        var map = new google.maps.Map(_c_,
            mapOptions);


        var image = 'img/gmaps_marker_1.png';

        if(_body.hasClass('page-normal')){
            image = 'img/gmaps_marker_2.png';
        }

        var beachMarker = new google.maps.Marker({
            position: gm_position,
            map: map,
            icon: image
        });

        //var marker = new google.maps.Marker({
        //    position: gm_position,
        //    map: map,
        //    title: 'Hello World!'
        //});


    }

    window.qcreative_gm_init = gm_initialize;

    function loadScript() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
            'callback=gm_initialize';
        document.body.appendChild(script);
    }

    function handle_scroll(e){

        st = $(window).scrollTop();


        if(is_menu_horizontal_and_full_bg){
            var aux = full_bg_init_y - st;

            if(aux<0){
                aux = 0;
            }

            _full_bg.css('top', aux+'px');
        }
        //console.log(is_menu_horizontal_and_full_bg);

        //console.log(st);

        //if(_theContent){
        //
        //    if(_theContent.children('.translucent-con').length>0){
        //        var _c = _theContent.children('.translucent-con').eq(0);
        //
        //        //_c.
        //
        //        _c.children('.translucent-bg').css({
        //            //'top' : ot+'px'
        //        })
        //    }
        //}


    }


    function regulate_nav(){

        if(page=='page-blogsingle' && _sidebarMain){

            //console.info(_sidebarMain.offset().top);


            //console.info(_theContent.offset().top, _theContent.height(), _sidebarMain.offset().top, _sidebarMain.height())
            //console.info(_sidebarMain.offset().top, _sidebarMain.height(), $(window).scrollTop(),wh, _sidebarMain.offset().top + _sidebarMain.height() + 30 , $(window).scrollTop()+wh)
            if(initial_sidebar_offset + _sidebarMain.height() + 20 < $(window).scrollTop()+wh){
                //console.info('ceva');

                var aux = ($(window).scrollTop()+wh) - (initial_sidebar_offset + _sidebarMain.height() + 20);



                //console.info(aux + initial_sidebar_offset+_sidebarMain.height(), _theContent.offset().top + _theContent.height() );

                if(aux + initial_sidebar_offset + _sidebarMain.height()> _theContent.offset().top + _theContent.height() + 35){
                    aux = _theContent.offset().top + _theContent.height() - _sidebarMain.height() + 35 - initial_sidebar_offset;
                }

                _sidebarMain.css({
                    'top' : aux
                })
            }else{

                _sidebarMain.css({
                    'top' : 0
                })
            }
            if(ww<responsive_breakpoint){

                _sidebarMain.css({
                    'top' : ''
                })
            }
        }
    }


})


function qcre_callback_for_zoombox(arg){
    //console.info('qcre_callback_for_zoombox()', arg);
    //return false;

    //arg.prepend($('.qcreative--520-nav-con').eq(0).clone());


    arg.prepend('<div class="qcreative--520-nav-con--placeholder" style="height: '+jQuery('.qcreative--520-nav-con').eq(0).height()+'px;"></div>');

    if(window.dzsscr_init){
        //console.log('apply BURNED WATER');
        window.dzsscr_init('.zoombox-maincon .scroller-con',{
            'settings_skin':'skin_apple'
            ,enable_easing: 'on'
            ,settings_autoresizescrollbar: 'on'
            ,settings_chrome_multiplier : 0.12
            ,settings_firefox_multiplier : -3
            ,settings_refresh: 700
            ,settings_autoheight: "off"
            ,touch_leave_native_scrollbar: "on"
        });
    }

    if(jQuery('.main-container')){

    }
}


window.qcre_open_social_link = function(arg){
    var leftPosition, topPosition;
    var w = 500, h= 500;
    //Allow for borders.
    leftPosition = (window.screen.width / 2) - ((w / 2) + 10);
    //Allow for title and status bars.
    topPosition = (window.screen.height / 2) - ((h / 2) + 50);
    var windowFeatures = "status=no,height=" + h + ",width=" + w + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
    window.open(arg,"sharer", windowFeatures);
}

window.qcre_callback_for_zoombox = qcre_callback_for_zoombox;

function ieVersion() {
    //return 11;
    var ua = window.navigator.userAgent;
    if (ua.indexOf("Trident/7.0") > 0)
        return 11;
    else if (ua.indexOf("Trident/6.0") > 0)
        return 10;
    else if (ua.indexOf("Trident/5.0") > 0)
        return 9;
    else
        return 0;  // not IE9, 10 or 11
}

var isiPad = navigator.userAgent.match(/iPad/i) != null;

function is_ie11(){
    return !(window.ActiveXObject) && "ActiveXObject" in window;
}


function get_query_arg(purl, key){
//        console.log(purl, key)
    if(purl.indexOf(key+'=')>-1){
        //faconsole.log('testtt');
        var regexS = "[?&]"+key + "=.+";
        var regex = new RegExp(regexS);
        var regtest = regex.exec(purl);


        if(regtest != null){
            var splitterS = regtest[0];
            if(splitterS.indexOf('&')>-1){
                var aux = splitterS.split('&');
                splitterS = aux[1];
            }
            var splitter = splitterS.split('=');

            return splitter[1];

        }
        //$('.zoombox').eq
    }
}

function is_touch_device() {
    return !!('ontouchstart' in window);
}

function can_history_api() {
    return !!(window.history && history.pushState);
}

window.requestAnimFrame = (function() {
    //console.log(callback);
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */callback, /* DOMElement */element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
