CARTO.callbacks['coverage_tooltip'] = function(parent, d, layer_name, tooltip){

};

CARTO.callbacks['pre_equinox'] =

    function (map_object) {

        let self = {};
        self.map_object = map_object;

        console.log("PRE-RENDER-COVERAGE");

        // define gradients and put them to use
        let defs = self.map_object.mapChart.svg.append('defs');

        let gradient = defs.append("radialGradient").attr("id", "exampleGradient");
        gradient.append("stop").attr("offset", "10%").attr("stop-color", "rgba(0,153,212, 0.8)");
        gradient.append("stop").attr("offset", "90%").attr("stop-color", "rgba(0,153,212, 0.2)");

        gradient = defs.append("radialGradient").attr("id", "radialGradientGreen");
        gradient.append("stop").attr("offset", "10%").attr("stop-color", "rgba(13,255,153, 1)");
        gradient.append("stop").attr("offset", "90%").attr("stop-color", "rgba(13,255,153, 0.4)");

        map_object.map_callbacks_aux.point.enter = function (d, i, domElement) {

            d.style("fill", "url(#exampleGradient)")
                .style("stroke", "rgba(0,153,212, 0.4)")
                .style("stroke-width", "1px");

            d.attr("class", function(circle){
                return "points car_circle_" + circle.id;
            });
        };

        map_object.map_callbacks_aux.point.update = function(d, i, domElement) {

            d.style("fill", "url(#exampleGradient)")
                .style("stroke", "rgba(0,153,212, 0.4)")
                .style("stroke-width", "1px");
        };

        /*
        map_object.map_callbacks_aux.point.zoom = function(d, i, domElement) {

            console.log("ZOOOOOM")
            let zoom = self.map_object.mapChart.map._zoom;
            console.log(zoom)
            console.log(12 * zoom/11 + "px !important")

            d3.selectAll(".awesome-marker i").style("font-size", 12 * zoom/11 + "px !important");

        };
        */
    };


CARTO.callbacks['init_equinox'] =

    function (map_object, args) {

        const uri = args[0][0];

        let self = {};
        self.map_object = map_object;
        let map = self.map_object.mapChart.map;

        console.log("INIT EQUINOX");

        // hide legend box
        d3.select("div#legendBox").style("display", "none");

        /*
        Object.keys(self.map_object.mapChart.markerLayers["Police Cars"]._layers).map(function(d,i){
            let layer = self.map_object.mapChart.markerLayers["Police Cars"]._layers[d];
            //console.log(layer._popup._content.split(":")[1])
        });
        */

        function alert(lat, lon) {

            d3.json(uri + "/push_incident?lon=" + lon + "&lat=" + lat, function(data){
                console.log(data);
                let car_ids = [];
                let car_list = [];

                data.map(function(car, i){
                    if (i <= 1)
                        car_ids.push(car[1]);

                    let html = `<a href='#' data-element='${car[1]}'><i class="fa fa-car icon-white"></i>Police Car ${car[1].toUpperCase().replace("B", "#")} <span class="speed">${car[7]} / ${car[9]}</span></a>`
                    car_list.push(html)
                });

                fillMenu(car_list, self);

                console.log("showing best routes " + car_ids.length);

                car_list = self.map_object.mapChart.geoData["Police Coverage"].geoPoints.map(function(d){

                    if (car_ids.indexOf(d.id) >= 0) {
                        L.Routing.control({
                            waypoints: [
                                L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]),
                                L.latLng(lat, lon)
                            ],
                            fitSelectedRoutes: false
                        }).addTo(map);
                    }
                });
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
                helper: 'clone',
                start: function (e, ui) {
                    $(ui.helper).addClass("ui-draggable-helper")
                },
                stop: function (e, ui) {
                    // returning the icon to the menu
                    $('.drag').css('top', posTop);
                    $('.drag').css('left', posLeft);

                    var coords = $('#menu').position();
                    coords.bottom = coords.top + $('#menu').height();
                    coords.bottomRight = coords.left + $('#menu').width();
                    if (markersCount >= 0) {
                        d3.select("#sirenImg").classed("undraggable", "true")
                    }
                    if (!(ui.position.top >= coords.top && ui.position.top <= coords.bottom && ui.position.left >= coords.left && ui.position.left <= coords.bottomRight) && markersCount === 0) {
                        d3.select("#sirenImg").classed("undraggable", "false")
                        var coordsX = event.clientX,
                            coordsY = event.clientY,
                            point = L.point(coordsX, coordsY), // createing a Point object with the given x and y coordinates
                            markerCoords = map.containerPointToLatLng(point), // getting the geographical coordinates of the point

                            // Creating a custom icon
                            myIcon = L.icon({
                                iconUrl: 'css/img/siren.png', // the url of the img
                                iconSize: [60, 60],
                                iconAnchor: [30, 30], // the coordinates of the "tip" of the icon ( in this case must be ( icon width/ 2, icon height )
                                className: "alertMarker"
                            });

                        // Creating a new marker and adding it to the map
                        markers[markersCount] = L.marker([markerCoords.lat, markerCoords.lng], {
                            draggable: true,
                            icon: myIcon
                        }).addTo(map);

                        //console.log(markerCoords);
                        alert(markerCoords.lat, markerCoords.lng);

                        markersCount++;
                    }
                }
            });
        };


        car_list = [];
        self.map_object.mapChart.geoData["Police Coverage"].geoPoints.map(function(d, idx){
            let html = `<a href='#' data-element='${d.id}'><i class="fa fa-car icon-white"></i>Police Car ${d.id.toUpperCase().replace("B", "#")} <span class="speed">${d.properties.speed} Km/h</span></a>`
            car_list.push(html)
        });

        // console.log(self.map_object.layer_info["Police Coverage"]['content'])

        fillMenu(car_list, self);
        addMarkers();

        let marker_layer = "Police Cars";
        let layer = "Police Coverage";


        window.setInterval(function(){

            d3.json(uri + "/get_positions", function(new_data){

                console.log("Update!");

                // coverage
                self.map_object.layer_info[layer]['content'] = new_data;
                self.map_object.mapChart.render(self.map_object.layer_info[layer]['content'], layer);

                // cars
                self.map_object.mapChart.removeMarkerLayer(marker_layer);
                self.map_object.mapChart.initMarkerLayer(marker_layer, new_data,
                    function(d, i){
                        return "default";
                    },
                    function(d, i){
                        return self.map_object.data_access_module.get_tooltip_data_from_layer(d, marker_layer);
                    },
                    {});

                self.map_object.mapChart.showMarkerLayer(marker_layer);

                car_list = [];
                self.map_object.mapChart.geoData["Police Coverage"].geoPoints.map(function(d, idx){
                    let html = `<a href='#' data-element='${d.id}'><i class="fa fa-car icon-white"></i>Police Car ${d.id.toUpperCase().replace("B", "#")} <span class="speed">${d.properties.speed} Km/h</span></a>`
                    car_list.push(html)
                });

                fillMenu(car_list, self);
            })

        }, 5000);


        console.log(self.map_object)
    };
