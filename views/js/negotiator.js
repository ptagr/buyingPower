(function($) {
    // On page load
    $(document).ready(function() {
        var itemArr = [],
            itemGridHTML = '';

        $.ajax({
            url: 'https://protected-oasis-8857.herokuapp.com/items',
            // url: 'http://localhost:3000/items',
            type: 'GET',
            // dataType: 'json',
            // contentType: 'application/json',
            crossDomain: true,
            // origin: 'https://protected-oasis-8857.herokuapp.com',
            // processData: false
        })
        .done(function(res, status) {
            itemArr = res;

            afterSuccess();
        })
        .error(function(res, status) {
            // test = 'error';
        });

        function afterSuccess() {
            // Clear out loader
            $('#CenterPanel').html('');

            for (var i=0; i < 9; i++) {
                var itemBoxHTML = '<div class="item-box">' + 
                        '<img class="checkmark" src="./img/checkmark.png">' + 
                        '<div class="img-box">' +
                        '<img src="' + 

                        itemArr[i].iteminfo.image + 

                        '" height="150px"/></div>' + 
                        '<div class="item-info">' + 
                        '<div class="item-name">' + 

                        itemArr[i].iteminfo.title + 

                        '</div>' + 
                        '<div class="item-price">$' + 

                        itemArr[i].iteminfo.price + 

                        '</div></div>' + 

                        // Hidden input that holds entire item data
                        '<input type="hidden" value=\'' +
                        JSON.stringify(itemArr[i]) + 
                        '\'>' + 

                        '</div>';

                $('#CenterPanel').append(itemBoxHTML);

                if (i === 2 || i === 5 || i === 8) {
                    $('#CenterPanel').append('<div class="clearfix"></div>');
                }
            }

            // Events
            $('.item-grid .item-box').on('mouseover', function() {
                // Hide default mouseover text and item details
                $('.mouseover-text').hide();
                $('.item-details').show();

                // Grab item info from hidden input field per item box
                var itemInfo = $(this).find('input').val();

                // Now it's an object!
                itemInfo = JSON.parse(itemInfo);

                $('.item-description .item-img').attr('src', itemInfo.iteminfo.image);;
                $('.item-description .item-name').html(itemInfo.iteminfo.title);
                $('.item-description .item-price').html('$' + itemInfo.iteminfo.price);

                $('.item-description .item-condition').html('Condition: ' + itemInfo.iteminfo.condition);
                $('.item-description .quantity-available').html('Quantity Available: ' + itemInfo.quantityInfo.sold);

                $('.seller-details .seller-name').html(itemInfo.sellerinfo.name);
                $('.seller-details .feedback-count').html('');
            });
            $('.item-grid .item-box').on('click', function() {
                // Hide all other checkmarks
                $('.checkmark').hide();

                // Show just this item's checkmark
                $(this).find('.checkmark').show();

                // Show proposal box
                $('.proposal').show();

                // Grab item info from hidden input field per item box
                var itemInfo = $(this).find('input').val();

                // Now it's an object!
                itemInfo = JSON.parse(itemInfo);

                $('.proposal .item-img').attr('src', itemInfo.galleryURL);;
                $('.proposal .item-name').html(itemInfo.title);
                $('.proposal .item-price').html('$' + itemInfo.sellingStatus[0].currentPrice[0].__value__);
            });
        }
    });


})(window.jQuery);
