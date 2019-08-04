$(() => {

    $('.nav-item').click(async function () {
        try {
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
        }
        catch (err) { console.log(err); }
    });

}
)
