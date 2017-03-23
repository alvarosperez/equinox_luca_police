function fillMenu(list) {
    count = 0;
    list.map((elem, idx) => {
        $("#menu #cars").append("<a href='#' data-element='" + elem + "'><i class=\"fa fa-car icon-white\"></i>Police Car #" + idx + "</a>")
    });

    d3.selectAll("#menu #cars a").on("mouseover", function() {
        let id = d3.select(this).attr("data-element");

        d3.selectAll("circle.points").classed("deactivated", function(d){
            return(d.id != id)
        })
    });

    d3.selectAll("#menu #cars a").on("mouseout", function() {
        d3.selectAll("circle.points").classed("deactivated", false);
    })
}

