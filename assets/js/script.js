$(function() {
    if ($(".selectbox").length > 0) {
        $(".selectbox").selectize({
            hideSelected: false
        });
    }


    $(".search__toggle").on("click", function() {
        $(".search").toggleClass("show");
    });

    $(".search__close").on("click", function() {
        $(".search").toggleClass("show");
    });


    $(".header-toggle").on("click", function() {
        $(".menu").toggleClass("open");
        $("body").toggleClass("open-overflow");
    });


    $(".submenu__link").on("click", function(e) {
        e.preventDefault();
        $(this).parents(".submenu__item.has-child").addClass("open-submenu");
    });

    $(".childmenu__title").on("click", function() {
        $(this).parents(".submenu__item.has-child").removeClass("open-submenu");
    });

    $(".menu").addClass("open-catalog").removeClass("open-menu");
    $(".menu-tab").removeClass("active");
    $("[data-menu='catalog']").addClass("active");

    $(".menu-tab").on("click", function() {
        const menuType = $(this).data("menu");

        $(".menu-tab").removeClass("active");
        $(this).addClass("active");

        $(".menu")
                .removeClass("open-catalog open-menu")
                .addClass("open-" + menuType);
    });


    $(".catalog-views__item").on("click", function() {
        $(".catalog-views__item").removeClass("active");
        $(this).addClass("active");
        var viewType = $(this).data("views");

        $(".catalog-list")
                .removeClass("view-cards view-list")
                .addClass("view-" + viewType);
    });


    $(".accordion").on("click", ".filter__title", function() {
        $(this).parents(".filter__item").toggleClass("show");
    });


    $(".filter__close").on("click", function() {
        $(".filter").removeClass("open");
    });


    $(".catalog-filter").on("click", function() {
        $(".filter").addClass("open");
    });


    $(".item__tab").on("click", function() {
        var selectedTab = $(this).data("tab");

        $(".item__tab").removeClass("active");
        $(".item__description-content").removeClass("active");

        $(this).addClass("active");
        $(".item__description-content[data-tab='" + selectedTab + "']").addClass("active");
    });

    $(".item__characteristics-more").on("click", function(e) {
        e.preventDefault();

        $(".item__tab").removeClass("active");
        $(".item__description-content").removeClass("active");

        $('.item__tab[data-tab="characteristics"]').addClass("active");
        $('.item__description-content[data-tab="characteristics"]').addClass("active");

        $("html, body").animate({
            scrollTop: $(".item__description").offset().top
        }, 1000);
    });


    var scrollWidth = getScrollbarWidth();
    function getScrollbarWidth() {
        if (document.body.offsetHeight - window.innerHeight > 0) {
            var outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.overflow = 'scroll';
            outer.style.msOverflowStyle = 'scrollbar';
            document.body.appendChild(outer);

            var inner = document.createElement('div');
            outer.appendChild(inner);

            var scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

            outer.parentNode.removeChild(outer);
        } else {
            var scrollbarWidth = 0;
        }
        return scrollbarWidth;
    }
    $(window).on('resize', function() {
        scrollWidth = getScrollbarWidth();
    });


    $("[data-modal]").on("click", function() {
        var modalId = $(this).data("modal");
        $(".modal").removeClass("open");
        $(modalId).addClass("open");
        $("body").addClass("overflow").css("padding-right", scrollWidth);
    });
    $(".modal__close").on("click", function() {
        $(this).parents(".modal").removeClass("open");
        $("body").removeClass("overflow").css("padding-right", 0);
    });
    $(".modal").on("click", function(e) {
        var div = $(this).find(".modal__content");
        if (!div.is(e.target) && div.has(e.target).length === 0) {
            $(this).removeClass("open");
            $("body").removeClass("overflow").css("padding-right", 0);
        }
    });


    if ($(".showcase-slider").length > 0) {
        $(".showcase-slider").slick({
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 1
        });
    }


    if ($(".catalog-slider").length > 0) {
        $(".catalog-slider").slick({
            arrows: false,
            dots: false,
            infinite: false,
            slidesToShow: 4,
            responsive: [
                {
                    breakpoint: 1041,
                    settings: {
                        variableWidth: true,
                        slidesToShow: 1
                    }
                }
            ]
        });
    }


    if ($(".item__pictures").length > 0) {
        $('.item__pictures').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            asNavFor: '.item__thumbnails',
            fade: true
        });

        $('.item__thumbnails').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.item__pictures',
            dots: false,
            centerMode: false,
            focusOnSelect: true,
            vertical: true,
            infinite: false,
            responsive: [
                {
                    breakpoint: 1301,
                    settings: {
                        variableWidth: true,
                        slidesToShow: 1,
                        vertical: false
                    }
                }
            ]
        });
    }
});
