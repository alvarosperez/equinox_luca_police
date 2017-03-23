function fillMenu(list, self) {
    list.map((elem) => {
        $("#menu #cars").append(elem)
    });

    d3.selectAll("#menu #cars a").on("mouseover", function() {
        let id = d3.select(this).attr("data-element");
        $(this).find("i").addClass("carSelected")

        d3.selectAll("circle.points").classed("deactivated", function(d){
            if (d.id == id) {
                d3.select(this).style("fill", "url(#radialGradientGreen)")
                    .style("stroke", "rgba(13,255,153, 0.4)")
                    .style("stroke-width", "1px")
            }
            return (d.id != id);
        });
    });

    d3.selectAll("#menu #cars a").on("click", function(){
        let id = d3.select(this).attr("data-element");

        d3.selectAll("circle.points").classed("activated", function(d){
            if (d.id == id) {
                console.log(d)
                self.map_object.mapChart.map.panTo(new L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
            }
            return (d.id == id);
        })
    });

    d3.selectAll("#menu #cars a").on("mouseout", function() {
        d3.selectAll("circle.points").classed("deactivated", false);
        $(this).find("i").removeClass("carSelected")

        d3.selectAll("circle.points")
                .style("fill", "url(#exampleGradient)")
                .style("stroke", "rgba(0,153,212, 0.4)")
                .style("stroke-width", "1px");
    })
}

