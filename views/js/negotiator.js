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

                // After each group of 3, add a clearfix to make sure floats don't go nuts
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

                if (itemInfo.shippingInfo.cost == '0.00') {
                    $('.item-description .item-shipping').html('Shipping: <b>Free</b>');
                } else {
                    $('.item-description .item-shipping').html('Shipping: $' + itemInfo.shippingInfo.cost);
                }
                

                $('.item-description .item-condition').html('Condition: <b>' + itemInfo.iteminfo.condition + '</b>');
                $('.item-description .quantity-available').html('<b>Quantity Available: ' + itemInfo.quantityInfo.available + '</b>');

                $('.seller-details .seller-name').html(itemInfo.sellerinfo.name);
                $('.seller-details .feedback-count').html(itemInfo.sellerinfo.feedbackScore);
                $('.seller-details .feedback-rating').html(itemInfo.sellerinfo.positiveFeedbackPercent + '% Positive feedback');
            });
            $('.item-grid .item-box').on('click', function() {
                // Hide all other checkmarks
                $('.checkmark').hide();

                // Show just this item's checkmark
                $(this).find('.checkmark').show();

                // Show proposal box and scroll to it
                $('.proposal').show();
                if ($(document).scrollTop() < 157) {
                    $("html, body").animate({ scrollTop: "157px" });
                }

                // Grab item info from hidden input field per item box
                var itemInfo = $(this).find('input').val();

                // Now it's an object!
                itemInfo = JSON.parse(itemInfo);

                $('.proposal .seller-name').html(itemInfo.sellerinfo.name);
                $('.proposal .item-img').attr('src', itemInfo.iteminfo.image);
                $('.proposal .item-name').html(itemInfo.iteminfo.title);
                $('.proposal .item-name').attr('data-id', itemInfo.iteminfo.id);
                $('.proposal .item-price').html('$' + itemInfo.iteminfo.price);
                $('.proposal .item-shipping').html('Shipping: $' + itemInfo.shippingInfo.cost);
            });

            $('.submit-btn').on('click', function() {
                var url = 'https://protected-oasis-8857.herokuapp.com/proposal/send?';
// /proposal/send?
// sellerName=abc&
// negotiatorName=def&
// itemid=111&
// quantity=1&
// duration=2&
// discount=3

                var proposalInfo = $(this).parent();

                var sellerName = $(proposalInfo).find('.seller-name').text();
                var itemName = $(proposalInfo).find('.item-name').text();
                var itemId = $(proposalInfo).find('.item-name').attr('data-id');
                var duration = $(proposalInfo).find('.duration select').val();
                var quantity = $(proposalInfo).find('.quantity').find('input').val();
                var discount = $(proposalInfo).find('.discount').find('input').val();

                switch(duration) {
                    case '1 Day':
                        duration = '1d';
                        break;
                    case '2 Days':
                        duration = '2d';
                        break;
                    case '3 Days':
                        duration = '3d';
                        break;
                    case '4 Days':
                        duration = '4d';
                        break;
                    case '5 Days':
                        duration = '5d';
                        break;
                    case '6 Days':
                        duration = '6d';
                        break;
                    case '1 Week':
                        duration = '1w';
                        break;
                    case '2 Weeks':
                        duration = '2w';
                        break;
                    case '3 Weeks':
                        duration = '3w';
                        break;
                    case '1 Month':
                        duration = '1m';
                        break;
                    default:
                        duration = '1w';
                }

                // Construct URL with all the data we need
                url += 'sellerName=' + sellerName + 
                        '&negotiatorName=' + 'Connie' + 
                        '&itemid=' + itemId + 
                        '&quantity=' + quantity + 
                        '&duration=' + duration + 
                        '&discount=' + discount;

                $.ajax({
                    url: url,
                    type: 'GET',
                    // dataType: 'json',
                    // contentType: 'application/json',
                    crossDomain: true,
                    // origin: 'https://protected-oasis-8857.herokuapp.com',
                    // processData: false
                })
                .done(function(res, status) {
                })
                .error(function(res, status) {
                });

                $( "#dialog-message" ).dialog({
                  // modal: true,
                  buttons: {
                    Ok: function() {
                      $( this ).dialog( "close" );
                    }
                  }
                });
                // Add X text since it's not there
                $('.ui-dialog-titlebar-close').text('X');

                // Update text in dialog
                $('.submit-seller').html(sellerName);
                $('.submit-item-name').html('<b>Item Name:</b> ' + itemName);
                $('.submit-duration').html('<b>Duration:</b> ' + duration);
                $('.submit-quantity').html('<b>Quantity:</b> ' + quantity);
                $('.submit-discount').html('<b>Discount:</b> $' + discount);
            });
        }
    });


})(window.jQuery);
