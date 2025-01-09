$(document).ready(function() {
    // Tab switching
    $('.tab-btn').click(function() {
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');
        $(this).addClass('active');
        $(`#${$(this).data('tab')}`).addClass('active');
    });

    // Single stock form submission
    $('#singleStockForm').submit(function(e) {
        e.preventDefault();
        $('#resultCard').addClass('active');
        $.ajax({
            url: '/api/stock-prices',
            type: 'get',
            data: $(this).serialize(),
            success: function(data) {
                $('#jsonResult').text(JSON.stringify(data, null, 2));
            },
            error: function(err) {
                $('#jsonResult').text('Error: ' + JSON.stringify(err, null, 2));
            }
        });
    });

    // Stock chip click handler
    $('.stock-chip').click(function() {
        const stockSymbol = $(this).data('symbol');
        $(this).closest('form').find('input[name="stock"]').val(stockSymbol);
    });

    // Compare stocks form submission
    $('#compareStockForm').submit(function(e) {
        e.preventDefault();
        $('#resultCard').addClass('active');
        $.ajax({
            url: '/api/stock-prices',
            type: 'get',
            data: $(this).serialize(),
            success: function(data) {
                $('#jsonResult').text(JSON.stringify(data, null, 2));
            },
            error: function(err) {
                $('#jsonResult').text('Error: ' + JSON.stringify(err, null, 2));
            }
        });
    });
});
