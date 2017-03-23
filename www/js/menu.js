function fillMenu(list) {
    let defList = ['id1', 'id2', 'id3']
    count = 0;
    defList.map((elem, idx) => {
        $("#menu #cars").append("<a href='#' data-element='" + elem + "'>Police Car #" + idx + "</a>")
    })
    $(document).on('click', "#menu #cars a", function(e) {
        console.log($(this).data("element"))
    });
}

