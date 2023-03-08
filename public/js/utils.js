   /***************************************************/
    /****************** GENERAL UTILS ******************/
    /***************************************************/
    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    function presentInfoMessage(header, message) {
        $("#infoMessage .header").html(header);
        $("#infoMessageContent").html(message);
        $('#infoMessage').show();
    }

    function presentError(header = 'General Error', error, debug = false) {
        $("#errorMessageHeader").html(header);
        $("#errorMessageContent").html(error.message);
        if (debug) {
            $("#errorStack").html(error.stack);
        }
        $("#errorMessage").show();
    }

    // update the menu bar selected item
    $('a.item').click(function (event) {
        console.log('item: ', event);
        $('a.item').removeClass('active');
        $(this).addClass('active');
    });

    $("#home, #cancel, #cancel2, #cancel3").click(function () {
        /* function goes in here */
        location.reload()
    });

    $('.ui.accordion')
        .accordion()
        ;

    $('.ui.dropdown')
        .dropdown(this)
        // console.log("Dropdown: ", JSON.stringify(this));
        ;

    $('.message .close')
        .on('click', function () {
            $("#errorMessage").hide();
            $('#infoMessage').hide();
        });