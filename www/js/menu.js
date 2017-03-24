function fillMenu(list, self) {

    d3.select("#menu #cars").html("");

    window.luca_alert_sent = window.luca_alert_sent || [];

    window.luca_alert_sent.map(function(elem) {
        $("#menu #cars").append("<a href='#' data-element='" + elem + "'><i class=\"fa fa-car icon-white carSelected\"></i>Police Car " + elem.toUpperCase().replace("B", "#") + " <span class=\"speed\">Dispatched</span></a>")
    });

    list.map((elem) => {
        let include = true;

        window.luca_alert_sent.map(function(car) {
            if(elem.indexOf(car) >= 0){
                include = false;
            }
        });

        if (include)
            $("#menu #cars").append(elem);
    });



    d3.selectAll("#menu #cars a").on("mouseover", function() {
        let id = d3.select(this).attr("data-element");
        // $(this).find("i").addClass("carSelected");

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
                console.log(d);
                self.map_object.mapChart.map.panTo(new L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
            }
            return (d.id == id);
        });

        //console.log(window.luca_alert);
        if(window.luca_alert){
            d3.select(this).select("i").classed("carSelected", true);
            window.luca_alert_sent.push(id);
            window.luca_alert = false;

            d3.json(window.luca_uri + "/assign_car?lon=" + window.luca_alert_lon + "&lat=" + window.luca_alert_lat + "&idcar=" + id, function(data){

                window.luca_interval = window.setInterval(window.luca_interval_function, 2000);
                setTimeout(function(){
                    d3.selectAll("path").remove();
                    d3.select(".alertMarker").remove();

                    window.luca_markersCount = 0;
                    d3.select("#siren").classed("undraggable", false);
                }, 2000);
            })
        }

    });

    d3.selectAll("#menu #cars a").on("mouseout", function() {
        d3.selectAll("circle.points").classed("deactivated", false);
        //$(this).find("i").removeClass("carSelected")

        d3.selectAll("circle.points")
                .style("fill", "url(#exampleGradient)")
                .style("stroke", "rgba(0,153,212, 0.4)")
                .style("stroke-width", "1px");
    })
}

