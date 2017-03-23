CARTO.callbacks['pre_equinox'] =

    function (map_object) {

        let self = {};
        self.map_object = map_object;

        console.log("PRE-RENDER");

    };

CARTO.callbacks['init_equinox'] =

    function (map_object, args) {

        let self = {};

        self.map_object = map_object;

        console.log("INIT EQUINOX");

        console.log(map_object);

        // hide legend box
        d3.select("div#legendBox").style("display", "none");

        let new_data = {
            "type": "FeatureCollection",
            "features": [
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [2.3, 41.4]
                },
                "type": "Feature",
                "id": 1,
                "properties": {
                  "coverage": 10000,
                  "id": 1,
                  "type": "basic"
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [2.1, 41.3]
                },
                "type": "Feature",
                "id": 2,
                "properties": {
                  "coverage": 10000,
                  "id": 2,
                  "type": "basic"
                }
              },
              {
                "geometry": {
                  "type": "Point",
                  "coordinates": [2.15, 41.35]
                },
                "type": "Feature",
                "id": 3,
                "properties": {
                  "coverage": 10000,
                  "id": 3,
                  "type": "basic"
                }
              }
            ]
        };

        d3.select("#update").on("click", function(){

            let layer = "Police Cars";

            self.map_object.layer_info[layer]['content'] = new_data;

            self.map_object.mapChart.render(self.map_object.layer_info[layer]['content'], layer);

        });
    };
