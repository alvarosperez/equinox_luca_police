
// Module that treat map callbacks (both native and aux)

CARTO.Map = function(parent){
        this.parent = parent;

        // Prepare void auxiliar callbacks

        this.parent.map_callbacks_aux = {
            "point":{},
            "symbol": {},
            "polygon":{},
            "path":{},
            "filter": {},
            "value": {},
            "timeline": null
        };

};

CARTO.Map.prototype = {
    draw_map_center_button : function(){

        var self = this.parent;

        d3.select(".leaflet-top.leaflet-left").append("div")
            .classed("center_button", true)
            .classed("leaflet-control", true)
            .html(CARTO.format.first_up(CARTO.translation[self.lang].RECENTER_MAP));

        d3.select(".center_button").on("click", function () {
            self.mapChart.map.setView(self.config.vizOptions.initLatLng, self.config.vizOptions.mapOptions.zoom);
        });

    },
    get_map_callbacks : function() {

        var self = this.parent;

        return {

            "point": {
                'zoom': function (selection, layer) {
                    // if a real 'point', not a symbol

                    if(self.layer_info[layer].type === "point") {

                        selection
                            .attr("cx", function (d) {
                                return self.mapChart.project(d.geometry.coordinates)[0];
                            })
                            .attr("cy", function (d) {
                                return self.mapChart.project(d.geometry.coordinates)[1];
                            })
                            .attr("r", function (d) {
                                var radius = self.data_access_module.get_radius_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1])
                            })
                            .style("stroke-width", function (d) {
                                if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                    var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                    return self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]);
                                }
                                else {
                                    var radius = self.data_access_module.get_stroke_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                    return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1]) / 2;
                                }

                            });

                    }

                    if(self.layer_info[layer].type === "symbol"){

                        selection
                            .attr("transform", function(d){
                                var x = self.mapChart.project(d.geometry.coordinates)[0];
                                var y = self.mapChart.project(d.geometry.coordinates)[1];

                                return "translate(" + x + " " + y + ")";
                            })
                            .attr("d", function(d){

                                var symbol = "symbol_select" in self.layer_info[layer] && self.layer_info[layer].symbol_select in CARTO.callbacks ? CARTO.callbacks[self.layer_info[layer].symbol_select](d): "circle";

                                return d3.svg.symbol().type(symbol).size(Math.pow(self.mapChart.getRealPixels(self.data_access_module.get_radius_from_layer(d, d3.select(this.parentNode).attr("layerName")) ,d.geometry.coordinates[1]),2))();

                            })
                            .style("stroke-width", function (d) {
                                if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                    var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                    return self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]);
                                }
                                else {
                                    var radius = self.data_access_module.get_stroke_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                    return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1]) / 2;
                                }
                            });

                    }

                    // Type could be "point" or "symbol", since symbols are attached to points layer with 'path' element

                    self.data_access_module.check_aux(self.layer_info[layer].type, "zoom", arguments);


                },

                'enter': function (selection, layer) {

                    // if a real 'point', not a symbol

                    if(self.layer_info[layer].type === "point") {
                        selection
                            .attr("cx", function (d) {
                                return self.mapChart.project(d.geometry.coordinates)[0];
                            })
                            .attr("cy", function (d) {
                                return self.mapChart.project(d.geometry.coordinates)[1];
                            })
                            .attr("r", function (d) {
                                var radius = self.data_access_module.get_radius_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1])
                            })
                            .style("stroke-width", function (d) {
                                if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                    var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                    return self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]);
                                }
                                else {
                                    var radius = self.data_access_module.get_stroke_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                    return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1]) / 2;
                                }

                            })
                            .style("stroke", function (d) {
                                return self.data_access_module.get_stroke_color_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                            })
                            .style("fill", function (d) {
                                return self.data_access_module.get_fill_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                            })
                            .style("visibility", function (d, i) {
                                return self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName")) ? "visible" : "hidden";
                            });

                    }

                    if(self.layer_info[layer].type === "symbol"){
                        selection
                            .attr("transform", function(d){
                                var x = self.mapChart.project(d.geometry.coordinates)[0];
                                var y = self.mapChart.project(d.geometry.coordinates)[1];

                                return "translate(" + x + " " + y + ")";
                            })
                            .attr("d", function(d){

                                var symbol = "symbol_select" in self.layer_info[layer] && self.layer_info[layer].symbol_select in CARTO.callbacks ? CARTO.callbacks[self.layer_info[layer].symbol_select](d): "circle";

                                return d3.svg.symbol().type(symbol).size(Math.pow(self.mapChart.getRealPixels(self.data_access_module.get_radius_from_layer(d, d3.select(this.parentNode).attr("layerName")) ,d.geometry.coordinates[1]),2))();

                            })
                            .style("stroke-width", function (d) {
                                if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                    var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                    return self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]);
                                }
                                else {
                                    var radius = self.data_access_module.get_stroke_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                    return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1]) / 2;
                                }

                            })
                            .style("stroke", function (d) {
                                return self.data_access_module.get_stroke_color_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                            })
                            .style("fill", function (d) {
                                return self.data_access_module.get_fill_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                            })
                            .style("visibility", function (d, i) {
                                var visibility = self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName"));
                                d.map_visibility = visibility;
                                return visibility ? "visible" : "hidden";
                            })
                            .classed("filtered", function(d,i){
                                return !(d.map_visibility);
                            });

                    }

                    // Type could be "point" or "symbol", since symbols are attached to points layer with 'path' element

                    self.data_access_module.check_aux(self.layer_info[layer].type, "enter", arguments);


                },
                'exit': function (selection, layer) {
                    selection.remove();

                    // Type could be "point" or "symbol", since symbols are attached to points layer with 'path' element

                    self.data_access_module.check_aux(self.layer_info[layer].type, "exit", arguments);

                },
                'update': function (selection, layer) {


                    // if a real 'point', not a symbol

                    if(self.layer_info[layer].type === "point") {

                        console.log("UPDATING SELECTION");

                        console.log(selection);


                        selection
                            .attr("cx", function (d) {
                                return self.mapChart.project(d.geometry.coordinates)[0];
                            })
                            .attr("cy", function (d) {
                                return self.mapChart.project(d.geometry.coordinates)[1];
                            })
                            .attr("r", function (d) {
                                var radius = self.data_access_module.get_radius_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1])
                            }).style("fill", function (d) {
                                return self.data_access_module.get_fill_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                            })
                            .style("stroke-width", function (d) {
                                if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                    var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                    return self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]);
                                }
                                else {
                                    var radius = self.data_access_module.get_stroke_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                    return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1]) / 2;
                                }

                            })
                            .style("visibility", function (d, i) {
                                return self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName")) ? "visible" : "hidden";
                            });

                    }

                    if(self.layer_info[layer].type === "symbol"){
                        selection
                            .attr("d", function(d){

                                var symbol = "symbol_select" in self.layer_info[layer] && self.layer_info[layer].symbol_select in CARTO.callbacks ? CARTO.callbacks[self.layer_info[layer].symbol_select](d): "circle";

                                return d3.svg.symbol().type(symbol).size(Math.pow(self.mapChart.getRealPixels(self.data_access_module.get_radius_from_layer(d, d3.select(this.parentNode).attr("layerName")) ,d.geometry.coordinates[1]),2))();

                            })
                            .style("fill", function (d) {
                                return self.data_access_module.get_fill_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                            })
                            .style("stroke-width", function (d) {
                                if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                    var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                    return self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]);
                                }
                                else {
                                    var radius = self.data_access_module.get_stroke_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                                    return self.mapChart.getRealPixels(radius, d.geometry.coordinates[1]) / 2;
                                }

                            })
                            .style("visibility", function (d, i) {
                                var visibility = self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName"));
                                d.map_visibility = visibility;
                                return visibility ? "visible" : "hidden";
                            })
                            .classed("filtered", function(d,i){
                                return !(d.map_visibility);
                            });

                    }

                    // Type could be "point" or "symbol", since symbols are attached to points layer with 'path' element

                    self.data_access_module.check_aux(self.layer_info[layer].type, "update", arguments);

                },
                'over': function (d, i, domElement, layer) {

                    // set_tooltip_data_from_layer returns true on successful data retrieval

                    if(self.data_access_module.set_tooltip_data_from_layer(d, d3.select(domElement.parentNode).attr("layerName"), self.mapChart.tooltip)) {
                        self.mapChart.tooltip.style("opacity", 1.0);
                    }

                    // Type could be "point" or "symbol", since symbols are attached to points layer with 'path' element
                    self.data_access_module.check_aux(self.layer_info[layer].type, "over", arguments);

                },
                'out': function (d, i, layer) {

                    self.mapChart.tooltip.style("opacity", 0.0);

                    // Type could be "point" or "symbol", since symbols are attached to points layer with 'path' element

                    self.data_access_module.check_aux(self.layer_info[layer].type, "out", arguments);
                },
                'click': function (d, i, domElement, layer) {

                    // Type could be "point" or "symbol", since symbols are attached to points layer with 'path' element

                    self.data_access_module.check_aux(self.layer_info[layer].type, "click", arguments);
                }

            },
            "polygon": {
                'enter': function (selection) {
                    // TODO: CHANGE METER STROKE to a call to .style

                    selection.attr("d", self.mapChart.path).style("fill", function (d, i) {
                        return self.data_access_module.get_fill_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                    }).style("visibility", function (d, i) {
                        return self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName")) ? "visible" : "hidden";
                    })
                        .each(function (d, i) {
                            if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                d3.select(this).style("stroke-width", self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]));
                            }
                        });
                    self.data_access_module.check_aux("polygon", "enter", arguments);
                },
                'click': function (d, i, domElement) {
                    self.data_access_module.check_aux("polygon", "click", arguments);
                },
                'zoom': function (selection) {
                    // TODO: CHANGE METER STROKE to a call to .style
                    selection.attr("d", self.mapChart.path).each(function (d, i) {
                        if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                            var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                            d3.select(this).style("stroke-width", self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]));
                        }
                    });

                    self.data_access_module.check_aux("polygon", "zoom", arguments);
                },
                'update': function (selection) {
                    // TODO: CHANGE METER STROKE to a call to .style
                    selection.attr("d", self.mapChart.path)
                        .style("visibility", function (d, i) {
                            return self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName")) ? "visible" : "hidden";
                        })
                        .style("fill", function (d, i) {
                            return self.data_access_module.get_fill_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                        })
                        .each(function (d, i) {
                            if ('meters_stroke' in self.layer_info[d3.select(this.parentNode).attr("layerName")]) {
                                var meters = self.layer_info[d3.select(this.parentNode).attr("layerName")].meters_stroke;
                                d3.select(this).style("stroke-width", self.mapChart.getRealPixels(meters, self.config.vizOptions.initLatLng[0]));
                            }
                        });


                    self.data_access_module.check_aux("polygon", "update", arguments);

                },
                'over': function (d, i, domElement) {

                    // set_tooltip_data_from_layer returns true on successful data retrieval

                    if(self.data_access_module.set_tooltip_data_from_layer(d, d3.select(domElement.parentNode).attr("layerName"), self.mapChart.tooltip)) {
                        self.mapChart.tooltip.style("opacity", 1.0);
                    }

                    self.data_access_module.check_aux("polygon", "over", arguments);
                },
                'out': function (d, i) {
                    self.mapChart.tooltip.style("opacity", 0.0);
                    self.data_access_module.check_aux("polygon", "out", arguments);
                },
                'exit': function (selection) {
                    selection.remove();

                    self.data_access_module.check_aux("polygon", "exit", arguments);

                }
            },
            "path": {
                // Project path on enter + stroke-width + opacity

                'enter': function (selection) {

                    selection.attr("d", self.mapChart.path).style("stroke-width", function (d) {
                        var width = self.data_access_module.get_width_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                        return self.mapChart.getRealPixels(width, d.geometry.coordinates[0][1]) + "px";
                    })
                        .style("visibility", function (d, i) {
                            return self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName")) ? "visible" : "hidden";
                        });

                    self.data_access_module.check_aux("path", "enter", arguments);
                },

                // Remove path on exit

                'exit': function (selection) {
                    selection.remove();
                    self.data_access_module.check_aux("path", "exit", arguments);
                },

                // On path update: reproject, and change stroke-width

                'update': function (selection) {

                    selection
                        .attr("d", function (d, i) {
                            return self.mapChart.path(d);
                        })
                        .style("stroke-width", function (d) {
                            var width = self.data_access_module.get_width_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                            return self.mapChart.getRealPixels(width, d.geometry.coordinates[0][1]) + "px";
                        })
                        .style("visibility", function (d, i) {
                            return self.filters_module.check_node_filters(d, d3.select(this.parentNode).attr("layerName")) ? "visible" : "hidden";
                        });

                    self.data_access_module.check_aux("path", "update", arguments);

                },

                // Reproject path on zoom change and change stroke-width

                'zoom': function (selection) {

                    selection.attr("d", self.mapChart.path).style("stroke-width", function (d) {
                        var width = self.data_access_module.get_width_from_layer(d, d3.select(this.parentNode).attr("layerName"));
                        return self.mapChart.getRealPixels(width, d.geometry.coordinates[0][1]) + "px";
                    });

                    self.data_access_module.check_aux("path", "zoom", arguments);
                }
            }
        }

    }
};