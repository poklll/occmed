function sortable(container) {
    $(container).children().each((index, value) => {
        $(value).attr("draggable", "true");
        $(value).on("drag", function (event) {
            let id = index;
            $(value).attr('id',id);
            event.stopPropagation();
            $.event.addProp('dataTransfer');
            event.dataTransfer.setData("text", event.target.id);
        });
        $(value).on("dragover", function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(value).css('background-color','cornflowerblue');
        });

        $(value).on("dragleave", function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(value).css('background-color', 'rgba(238, 235, 235, 0.973)');
        });

        $(value).on("drop", function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(value).css('background-color', 'rgba(238, 235, 235, 0.973)');
            let data = event.dataTransfer.getData("text");
            alert(data);
          // $(`#${id}`).insertBefore($(value));
            event.dataTransfer.clearData();
        });
    }
    )
}