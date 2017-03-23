function fillMenu(list) {
    count = 0;
    list.map((elem, idx) => {
        $("#menu #cars").append("<a href='#' data-element='" + elem + "'><i class=\"fa fa-car icon-white\"></i>Police Car #" + (idx + 1) + "</a>")
    });

    d3.selectAll("#menu #cars a").on("mouseover", function() {
        let id = d3.select(this).attr("data-element");

        d3.selectAll("circle.points").classed("deactivated", function(d){
            if (d.id == id) {
                d3.select(this).style("fill", "url(#radialGradientGreen)")
                    .style("stroke", "rgba(13,255,153, 0.4)")
                    .style("stroke-width", "1px");
            }
            return (d.id != id);
        });
    });

    d3.selectAll("#menu #cars a").on("mouseout", function() {
        d3.selectAll("circle.points").classed("deactivated", false);

        d3.selectAll("circle.points")
                .style("fill", "url(#exampleGradient)")
                .style("stroke", "rgba(0,153,212, 0.4)")
                .style("stroke-width", "1px");
    })
}

