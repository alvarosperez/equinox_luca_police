CARTO.callbacks['pre_equinox'] =

    function (map_object) {

        let self = {};
        self.map_object = map_object;

        console.log("PRE-RENDER-COVERAGE");

        // define gradients and put them to use
        let gradient = self.map_object.mapChart.svg
            .append('defs')
                .append("radialGradient").attr("id", "exampleGradient");
        gradient.append("stop").attr("offset", "10%").attr("stop-color", "rgba(0, 0, 255, 0.8)");
        gradient.append("stop").attr("offset", "90%").attr("stop-color", "rgba(0, 0, 255, 0.2)");

        map_object.map_callbacks_aux.point.enter = function (d, i, domElement) {

            d.style("fill", "url(#exampleGradient)")
                .style("stroke", "rgba(0, 0, 255, 0.4)")
                .style("stroke-width", "1px");

            d.attr("class", function(circle){
                return "points car_circle_" + circle.id;
            });

        };

        map_object.map_callbacks_aux.point.update = function(d, i, domElement) {

            d.style("fill", "url(#exampleGradient)")
                .style("stroke", "rgba(0, 0, 255, 0.4)")
                .style("stroke-width", "1px");

        };
    };


CARTO.callbacks['init_equinox'] =

    function (map_object, args) {

        let self = {};
        self.map_object = map_object;

        console.log("INIT EQUINOX");

        let map = self.map_object.mapChart.map;
        console.log(map);

        // hide legend box
        d3.select("div#legendBox").style("display", "none");



        let car_list = self.map_object.mapChart.geoData["Police Coverage"].geoPoints.map(function(d){
            return d.id;
        });

        fillMenu(car_list);

        Object.keys(self.map_object.mapChart.markerLayers["Police Cars"]._layers).map(function(d,i){
            let layer = self.map_object.mapChart.markerLayers["Police Cars"]._layers[d];

            //console.log(layer._popup._content.split(":")[1])
        });

        //console.log(car_list)

        function alert(lat, lon){

            let car_list = self.map_object.mapChart.geoData["Police Coverage"].geoPoints.map(function(d){
                console.log(d.geometry.coordinates)

                L.Routing.control({
                    waypoints: [
                        L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]),
                        L.latLng(lon, lat)
                    ]
                }).addTo(map);
            });



        }

        alert(-98.0771484, 19.5282688);

    };
