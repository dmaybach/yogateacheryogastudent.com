(function ($) {

    $(window).resize(function () {
        setHeight();
    });

    var setHeight = function() {
        $('#video').css('height', $(window).height());
    }

    setHeight();

    $(window).on('load', function () {
        var $preloader = $('#preloader');

        $preloader.delay(350).fadeOut('slow', function(){
            $('#footer').toggle();
        });
    });
    $('#video').YTPlayer({
        fitToBackground: false,
        videoId: 'vzyXKT9OFxk',
        pauseOnScroll: false,
        playerVars: {
            modestbranding: 0,
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            wmode: 'transparent',
            branding: 0,
            rel: 0,
            autohide: 0,
            origin: window.location.origin
        }
    });

    $.fn.YTPlayer = function(options) {

        return this.each(function() {
            var el = this;

            $(el).data("yt-init", true);
            var player = Object.create(YTPlayer);
            player.init(el, options);
            $.data(el, "ytPlayer", player);
        });
    };

    var animating = false,
        firstLoad = false;

    $('.home_area').on('click', 'a[data-type="page-transition"]', function (event) {
        event.preventDefault();
        //detect which page has been selected
        var newPage = $(this).attr('href');
        //if the page is not already being animated - trigger animation
        if (!animating)
            changePage(newPage, true);
        firstLoad = true;
    });

    function changePage(url, bool) {
        animating = true;
        console.log('animating....');
        // trigger page animation
        $('.home_area').addClass('page-is-changing').removeClass('edit-loaded');
        $('.edit-loading-bar').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
            $('.edit-loading-bar').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            loadNewContent(url, bool);
            console.log('loading....');
        });
        //if browser doesn't support CSS transitions
        if (!transitionsSupported())
            loadNewContent(url, bool);
    }

    function loadNewContent(url, bool) {
        url = ('' == url) ? '#!/home' : url;
        var newSection = url.replace('#!/', '');
        var section = $('<div class="container edit-content ' + newSection + '"></div>');

        section.load(url + ' .edit-content.' + newSection + ' > *', function (event) {
            // load new content and replace <main> content with the new one
            $('.edit-main').html(section);
            // $('#home').css('height', $('.more')[0].offsetHeight);
            $('#home').YTPlayer({
                fitToBackground: false,
                videoId: 'vzyXKT9OFxk',
                pauseOnScroll: false,
                playerVars: {
                    modestbranding: 0,
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    wmode: 'transparent',
                    branding: 0,
                    rel: 0,
                    autohide: 0,
                    origin: window.location.origin
                }
            });


            //if browser doesn't support CSS transitions - dont wait for the end of transitions
            var delay = (transitionsSupported()) ? 1200 : 0;
            setTimeout(function () {
                //wait for the end of the transition on the loading bar before revealing the new content
                $('.edit-main').attr('class', 'edit-main ' + newSection);
                $('.home_area').addClass('edit-loaded').removeClass('page-is-changing');
                animating = false;
                $('.edit-cover-layer').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    $('.edit-cover-layer').off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                    console.log('animation stop');
                });
            }, delay);

            if (url != window.location && bool) {
                //add the new page to the window.history
                //if the new page was triggered by a 'popstate' event, don't add it
                window.history.pushState({
                    path: url
                }, '', url);
            }
        });
    }

    function transitionsSupported() {
        return $('html').hasClass('csstransitions');
    }

})(jQuery);