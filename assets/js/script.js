$(function() {
    // Инициализация selectize
    if ($(".selectbox").length > 0) {
        $(".selectbox").selectize({
            hideSelected: false,
            render: {
                item: function (data) {
                    return "<div  data-value='" + data.value + "' data-sku='" + data.sku+ "' data-type='" + data.type +  "' data-price='" + data.price +  "' data-partner_price='" + data.partner_price + "' class='item selected_offer'>" + data.value + " </div>";
                }
            }
        });
    }
    // Поиск
    $(".search__toggle, .search__close").on("click", function() {
        $(".search").toggleClass("show");
    });

    $(".header-toggle").on("click", function() {
        $(".menu").toggleClass("open");
        $("body").toggleClass("open-overflow");
    });

    // Подменю
    $(".submenu__link").on("click", function(e) {
        if ($(window).width() <= 1040) {
            e.preventDefault();
            $(this).parents(".submenu__item.has-child").addClass("open-submenu");
        }
    });

    $(".childmenu__title").on("click", function() {
        $(this).parents(".submenu__item.has-child").removeClass("open-submenu");
    });

    // Инициализация меню
    $(".menu").addClass("open-catalog").removeClass("open-menu");
    $(".menu-tab").removeClass("active");
    $("[data-menu='catalog']").addClass("active");

    $(".menu-tab").on("click", function() {
        let menuType = $(this).data("menu");
        $(".menu-tab").removeClass("active");
        $(this).addClass("active");
        $(".menu")
                .removeClass("open-catalog open-menu")
                .addClass("open-" + menuType);
    });

    // Виды каталога
    $(".catalog-views__item").on("click", function() {
        $(".catalog-views__item").removeClass("active");
        $(this).addClass("active");
        let viewType = $(this).data("views");
        $(".catalog-list")
                .removeClass("view-cards view-list")
                .addClass("view-" + viewType);
    });

    // Фильтры
    $(".accordion").on("click", ".filter__title", function() {
        $(this).parents(".filter__item").toggleClass("show");
    });

    $(".filter__close").on("click", function() {
        $(".filter").removeClass("open");
    });

    $(".catalog-filter").on("click", function() {
        $(".filter").addClass("open");
    });

    // Табы товара
    $(".item__tab").on("click", function() {
        let selectedTab = $(this).data("tab");
        $(".item__tab, .item__description-content").removeClass("active");
        $(this).addClass("active");
        $(".item__description-content[data-tab='" + selectedTab + "']").addClass("active");
    });

    $(".item__characteristics-more").on("click", function(e) {
        e.preventDefault();
        $(".item__tab, .item__description-content").removeClass("active");
        $('.item__tab[data-tab="characteristics"], .item__description-content[data-tab="characteristics"]').addClass("active");
        $("html, body").animate({
            scrollTop: $(".item__description").offset().top
        }, 1000);
    });

    // Функция для получения ширины скроллбара
    let scrollWidth = getScrollbarWidth();

    function getScrollbarWidth() {
        if (document.body.offsetHeight - window.innerHeight > 0) {
            let outer = document.createElement("div");
            outer.style.visibility = "hidden";
            outer.style.overflow = "scroll";
            outer.style.msOverflowStyle = "scrollbar";
            document.body.appendChild(outer);

            let inner = document.createElement("div");
            outer.appendChild(inner);
            let width = outer.offsetWidth - inner.offsetWidth;
            outer.parentNode.removeChild(outer);
            return width;
        }
        return 0;
    }

    $(window).on("resize", function() {
        scrollWidth = getScrollbarWidth();
    });

    // Модалки
    $("[data-modal]").on("click", function() {
        let modalId = $(this).data("modal");
        $(".modal").removeClass("open");
        $(modalId).addClass("open");
        $("body").addClass("overflow").css("padding-right", scrollWidth);

        if (modalId === "#compare") {
            $(".item__compare").hide();
        }
    });

    $(".modal__close, .modal").on("click", function(e) {
        if (e.target === this || $(e.target).hasClass("modal__close")) {
            let modalId = "#" + $(this).closest(".modal").attr("id");
            console.log(modalId);
            $(this).closest(".modal").removeClass("open");
            $("body").removeClass("overflow").css("padding-right", 0);
            if (modalId === "#compare") {
                $(".item__compare").show();
            }
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

    // Слайдер товара
    if ($(".item__pictures").length > 0) {
        let $mainSlider = $(".item__pictures").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true
        });

        let $thumbnails = $(".item__thumbnails").on("init", function(event, slick) {
            $(slick.$slides[0]).addClass("active");
        }).slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: false,
            dots: false,
            centerMode: false,
            focusOnSelect: false,
            vertical: true,
            infinite: false,
            responsive: [{
                    breakpoint: 1301,
                    settings: {
                        vertical: false
                    }
                }]
        });

        $thumbnails.on("click", ".slick-slide", function(e) {
            e.preventDefault();
            let $slide = $(this);
            let slideIndex = $slide.data("slick-index");
            let currentPosition = $thumbnails.slick("slickCurrentSlide");
            let totalSlides = $thumbnails.find(".slick-slide").not(".slick-cloned").length;
            $thumbnails.find(".active").removeClass("active");
            $slide.addClass("active");
            $mainSlider.slick("slickGoTo", slideIndex);

            let positionInViewport = slideIndex - currentPosition;

            if (positionInViewport === 1) {
                return;
            } else if (positionInViewport === 0 && currentPosition > 0) {
                $thumbnails.slick("slickGoTo", currentPosition - 1);
            } else if (positionInViewport === 2 && currentPosition < totalSlides - 3) {
                $thumbnails.slick("slickGoTo", currentPosition + 1);
            } else {
                $thumbnails.slick("slickGoTo", slideIndex);
            }
        });
    }

    // Функция для инициализации переключателей
    function initToggle(key, invert = false) {
        let keys = Array.isArray(key) ? key : [key];
        keys.forEach(k => {
            let $checkbox = $(`.toggle__checkbox[name="${k}"]`);
            let $target = $(`[data-toggle="${k}"]`);
            if ($checkbox.length) {
                function updateState() {
                    let isChecked = $checkbox.is(":checked");

                    // Синхронизация с радиокнопками person_type_id
                    if (k === 'ur') {
                        const personTypeValue = isChecked ? '2' : '1';
                        const $radio = $(`input[name="person_type_id"][value="${personTypeValue}"]`);

                        // Изменяем состояние и триггерим событие click
                        $radio.prop('checked', true)
                            .trigger('click') // Имитируем клик
                            .trigger('change'); // На всякий случай триггерим и change
                    }

                    if ($target.length) {
                        $target.toggle(invert ? !isChecked : isChecked);
                    }
                }

                $checkbox.on("change", updateState);
                updateState();
            }
        });
    }

    initToggle("ur");
    initToggle("another-person");
    initToggle("delivery-lift", true);

    // Доставка
    $("input[name='delivery']").change(function() {
        let value = $(this).val();
        if (value === "delivery-address") {
            $("[data-toggle='delivery-address']").show();
            $("[data-toggle='delivery-point']").hide();
        } else if (value === "delivery-point") {
            $("[data-toggle='delivery-address']").hide();
            $("[data-toggle='delivery-point']").show();
        }
    });

    $("input[name='delivery']:checked").trigger("change");

    // Логин/регистрация
    $(".login-toggle__item").on("click", function() {
        $(".login-toggle__item").removeClass("active");
        $(this).addClass("active");
        let toggleValue = $(this).data("toggle");
        $(".block").removeClass("active");
        $("." + toggleValue).addClass("active");
    });

    // Для бизнеса
    $(".btn[data-toggle='login']").on("click", function() {
        $(".block.login").show();
    });

    // Открытие профиля в мобилке
    $(".section-profile--main").on("click", ".profile__menu-item.menu-profile", function(e) {
        if ($(window).width() <= 1040) {
            e.preventDefault();
            $(".section-profile--main").addClass("open");
        }
    });

    // Возврат в профиль с заголовка лк
    $(".profile__title").on("click", function() {
        if ($(window).width() <= 1040) {
            window.location.href = "profile-user.html"; //сюда вставить ссылку на настоящую страницу
        }
    });
});