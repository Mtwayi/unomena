(function($) {
    $(document).ready(function() {

        // $('a[href*=#]').on('click', function(e) {
        //     e.preventDefault();
        //     $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
        // });

        var equalheight;
        equalheight = function(container){
          var currentTallest = 0,
            currentRowStart = 0,
            topPosition = 0,
            currentDiv = 0,
            rowDivs = [],
            $el;
          $(container).each(function() {

            $el = $(this);
            $($el).height('auto');
            topPosition = $el.position().top;

            if (currentRowStart !== topPosition) {
              for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
              }
              rowDivs.length = 0; // empty the array
              currentRowStart = topPosition;
              currentTallest = $el.height();
              rowDivs.push($el);
            } else {
              rowDivs.push($el);
              currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            }
            for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
              rowDivs[currentDiv].height(currentTallest);
            }
          });
        };

        $(window).load(function() {
          equalheight('section.third .col .equal');
          equalheight('.footer .cols');
        });

        $(window).resize(function(){
          waitForFinalEvent(function() {
            equalheight('section.third .col .equal');
            equalheight('.footer .cols');
          }, 300)  ;
        });

    });


}(jQuery));

var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();



(function(initAtStart) {
    initAtStart(window);
}(function(window) {
    /*!
     * IE10 viewport hack for Surface/desktop Windows 8 bug
     * Copyright 2014-2015 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     */

    // See the Getting Started docs for more information:
    // http://getbootstrap.com/getting-started/#support-ie10-width

    'use strict';

    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style');

        msViewportStyle.appendChild(
            document.createTextNode('@-ms-viewport{width:auto!important}')
        );
        document.querySelector('head').appendChild(msViewportStyle);
    }
}));
