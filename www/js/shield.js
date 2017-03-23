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

        var markers = [], // an array containing all the markers added to the map
            markersCount = 0; // the number of the added markers
        var addMarkers = () => {
            let map = self.map_object.mapChart.map;
            // The position of the marker icon
            var posTop = $('.drag').css('top'),
                posLeft = $('.drag').css('left');

            $('.drag').draggable({
                start: function(e, ui) {
                    $(this).css("z-index", 1000);
                },
                stop: function (e, ui) {
                    // returning the icon to the menu
                    $('.drag').css('top', posTop);
                    $('.drag').css('left', posLeft);

                    var coordsX = event.clientX,
                        coordsY = event.clientY,
                        point = L.point(coordsX, coordsY), // createing a Point object with the given x and y coordinates
                        markerCoords = map.containerPointToLatLng(point), // getting the geographical coordinates of the point

                        // Creating a custom icon
                        myIcon = L.icon({
                            iconUrl: 'css/img/siren.png', // the url of the img
                            iconSize: [60, 60],
                            iconAnchor: [30, 30], // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
                            className: "siren"
                        });

                    // Creating a new marker and adding it to the map
                    markers[markersCount] = L.marker([markerCoords.lat, markerCoords.lng], {
                        draggable: true,
                        icon: myIcon
                    }).addTo(map);

                    alert(markerCoords.lng, markerCoords.lat);

                    console.log(markerCoords);
                    markersCount++;
                }
            });
        };

        addMarkers();
    };
