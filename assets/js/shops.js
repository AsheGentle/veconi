$(function() {
    let myMap;
    let objectManager;
    let shopIdToTab = {};

    // Создание карты.
    function init() {
        myMap = new ymaps.Map('shopsMap', {
            center: [55.7558, 37.6177],
            zoom: 8,
            controls: ['zoomControl', 'geolocationControl']
        }, {
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true
        });

        objectManager = new ymaps.ObjectManager();
        objectManager.objects.options.set('preset', 'islands#blackDotIcon');
        objectManager.clusters.options.set('preset', 'islands#blackClusterIcons');

        myMap.geoObjects.add(objectManager);

        objectManager.add({
            type: "FeatureCollection",
            features: pointsCollection
        });

        // Применить иконки к точкам на карте на основе типа магазина/точки
        let shopIdToType = {};
        $('.shop').each(function() {
            let id = String($(this).data('id'));
            let typeAttr = $(this).data('type');
            let inferredType = typeAttr ? String(typeAttr) : (
                $(this).hasClass('shop--green') ? 'green' : (
                    $(this).hasClass('shop--gold') ? 'gold' : 'grey'
                )
            );
            shopIdToType[id] = inferredType;
        });

        // Вернуть опции иконки по типу ('green'|'gold'|'grey')
        function getIconOptionsByType(type) {
            let href = 'assets/images/marker-grey.png';
            if (type === 'green') href = 'assets/images/marker-green.png';
            else if (type === 'gold') href = 'assets/images/marker-gold.png';
            return {
                iconLayout: 'default#image',
                iconImageHref: href,
                iconImageSize: [24, 32],
                iconImageOffset: [-12, -32]
            };
        }

        // Применить иконки к объектам ObjectManager
        pointsCollection.forEach(function(feature) {
            let id = String(feature.id);
            let pointType = feature.properties && feature.properties.type ? String(feature.properties.type) : null;
            let type = pointType || shopIdToType[id] || 'grey';
            objectManager.objects.setObjectOptions(id, getIconOptionsByType(type));
        });

        

        let initialTab = $('.shops-tab.active').data('tab');
        applyMapFilter(initialTab);

        objectManager.objects.events.add('click', function(e) {
            selectShop(e.get('objectId'));
        });
    }

    // Показ/скрытие выпадающего списка поиска магазинов
    $('.shops-search__select').on('click', function() {
        $(this).closest('.shops-search').find('.shops-search__dropdown').toggleClass('open');
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.shops-search').length) {
            $('.shops-search__dropdown').removeClass('open');
        }
    });

    // выбрать магазин на карте (игнорируем клики на блок выставки)
    $('.shop').on('click', function(e) {
        if ($(e.target).closest('.shop__exhibition, .shop__exhibition-toggle').length) {
            return; // не переключаем карту и активный магазин
        }
        if (!$(this).hasClass('active')) {
            $('.shop.active').removeClass('active');
            $(this).addClass('active');
        }

        let shopsId = $(this).data('id');
        let selectedPoints = pointsCollection.filter(element => element.id == shopsId);

        if (selectedPoints[0]) {
            myMap.setCenter(selectedPoints[0].geometry.coordinates);
            myMap.setZoom(14);
        }
    });

    // сбросить выбор карты
    function resetMap() {
        $('.shop.active').removeClass('active');
        myMap.setCenter([55.7558, 37.6177]);
        myMap.setZoom(8);
        myMap.balloon.close();
    }

    // показать подробности о магазине при клике на карте
    function selectShop($id) {
        let selectedShop = $('.shop[data-id="' + $id + '"]');
        $('.shop.active').removeClass('active');
        selectedShop.addClass('active');
    }

    // Показ/скрытие витрины внутри магазина без переключения карты
    $('.shop__exhibition, .shop__exhibition-toggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        let $shop = $(this).closest('.shop');
        let $cards = $shop.find('.shop__cards');
        let $toggle = $shop.find('.shop__exhibition-toggle');
        let isOpen = $cards.hasClass('open');

        function updateToggle(open) {
            let $use = $toggle.find('use');
            if ($use.length) {
                $use.attr('href', `assets/images/icons.svg#${open ? 'eye-hide' : 'eye'}`);
                $toggle.contents().filter(function() {
                    return this.nodeType === 3;
                }).remove();
                $toggle.append(open ? ' Скрыть' : ' Показать');
            } else {
                $toggle.text(open ? 'Скрыть' : 'Показать');
            }
        }

        if (isOpen) {
            if ($cards.hasClass('slick-initialized')) {
                $cards.slick('unslick');
            }
            $cards.removeClass('open');
            updateToggle(false);
        } else {
            $cards.addClass('open');
            if (!$cards.hasClass('slick-initialized')) {
                $cards.slick({
                    arrows: false,
                    dots: false,
                    infinite: false,
                    variableWidth: true,
                    slidesToShow: 1
                });
            }
            updateToggle(true);
        }
    });

    // Переключение вкладок магазинов и фильтрация карты/списка
    $(".shops-tab").on("click", function() {
        let selectedTab = $(this).data("tab");
        $(".shops-tab").removeClass("active");
        $(this).addClass("active");

        filterShopsListByTab(selectedTab);
        applyMapFilter(selectedTab);
        resetMap();
    });

    // Показать/скрыть магазины в списке по выбранной вкладке
    function filterShopsListByTab(selectedTab) {
        if (selectedTab === "all") {
            $(".shop").show();
        } else {
            $(".shop").hide();
            $(`.shop[data-tab="${selectedTab}"]`).show();
        }
        $(".shop.active").removeClass("active");
    }

    // Применить фильтр к ObjectManager по выбранной вкладке
    function applyMapFilter(selectedTab) {
        if (!objectManager || typeof objectManager.setFilter !== 'function') {
            return;
        }
        if ($.isEmptyObject(shopIdToTab)) {
            $(".shop").each(function() {
                let id = String($(this).data("id"));
                let tab = String($(this).data("tab"));
                shopIdToTab[id] = tab;
            });
        }
        if (selectedTab === "all") {
            objectManager.setFilter(function() {
                return true;
            });
        } else {
            objectManager.setFilter(function(obj) {
                return shopIdToTab[String(obj.id)] === String(selectedTab);
            });
        }
    }

    ymaps.ready(init);
    window.ymapsInitialized = true;

    // создание точек на карте
    var pointsCollection = [];

    let initialSelectedTab = $('.shops-tab.active').data('tab');
    filterShopsListByTab(initialSelectedTab);
    pointsCollection.push({
        type: "Feature",
        id: '1',
        geometry: {
            type: "Point",
            coordinates: [55.819408, 37.706515]
        },
        properties: { type: 'green' }
    })
    pointsCollection.push({
        type: "Feature",
        id: '2',
        geometry: {
            type: "Point",
            coordinates: [59.952078, 30.250390]
        },
        properties: { type: 'green' }
    })
    pointsCollection.push({
        type: "Feature",
        id: '3',
        geometry: {
            type: "Point",
            coordinates: [55.806843, 37.567707]
        },
        properties: { type: 'gold' }
    })
    pointsCollection.push({
        type: "Feature",
        id: '4',
        geometry: {
            type: "Point",
            coordinates: [55.850964, 37.679251]
        },
        properties: { type: 'grey' }
    })
});