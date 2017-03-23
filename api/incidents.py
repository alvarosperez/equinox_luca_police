import json
import random
import logging
import sqlite3 as lite
import googlemaps
from datetime import datetime
from shapely.geometry import box, Point
import ConfigParser


radius = 100

class Planner:
    query = 'select code, lat, long, day, state from cars'

    def __init__(self):
        try:
            Config = ConfigParser.ConfigParser()
            Config.read('api.cfg')

            dbpath = Config.get('database', 'path')
            logging.info("Connecting to database: " + dbpath)

            #self.con = lite.connect('/data/hertz/luca_police.db')
            self.con = lite.connect(dbpath)

            self.cur = self.con.cursor()
            self.gmaps = googlemaps.Client(key='AIzaSyAxs5vmybTJsCKFgpSlkNk7ud9WojXZbpk')

        except:
            logging.error("Couldnt find database")


    def get_positions_list(self):
        # Returns [[code, lat, long, day, state]]
        result = self.cur.execute(self.query)

        a = []
        for r in result:
            a.append(r)

        return a



    def calculate_distance(self, positions, lat, lon):
        car_latlons = []
        #print type(positions)
        #print positions

        for (code, lat, lon, dt, state) in positions:
            logging.info("Incluying latlong: " + str((lat,lon)))
            car_latlons.append((lat,lon))

        distances = self.gmaps.distance_matrix(car_latlons, (lat,lon),
                                          mode='driving',
                                          departure_time=datetime.now())

        return_distances = []


        for (i, (code, lat, lon, dt, state)) in enumerate(positions):
            return_distances.append( (i, code, lat, lon, dt, state
                   , distances['rows'][i]['elements'][0]['duration']['value']
                   , distances['rows'][i]['elements'][0]['duration']['text']
                   , distances['rows'][i]['elements'][0]['distance']['value']
                   , distances['rows'][i]['elements'][0]['distance']['text'] ) )


        return sorted(return_distances, key=lambda x: x[5])


    def calculate_coverage(self, distances):
        # distances format: code, lat, lon, dt, state, time_value, time_text, dist_value, dist_text
        # Para cada vehiculo calculo la cobertura sobre el bounding box del DF
        bbox = box(-99.3573, -98.9433, 19.5927, 19.1322)

        circles = []
        for c in distances:
            # print c
            circles.append(Point(float(c[3]), float(c[2])).buffer(radius))

        coverages = []
        # Need to improve this
        for i in range(len(circles)):
            circle_union = None
            for j in range(len(circles)):
                if i == j:
                    continue
                if not circle_union:
                    circle_union = circles[j]
                else:
                    circle_union = circle_union.union(circles[j])
            coverages.append(round((bbox.area - bbox.difference(circle_union).area)/bbox.area,5))

        new_distances = []
        for (i, c) in enumerate(distances):
            new_distances.append(c + (coverages[i],))

        return new_distances









    def simulate_incident(self, lat, lon):

        car_positions = self.get_positions_list()
        #print lat
        #print lon
        car_distances = self.calculate_distance(car_positions, float(lat), float(lon))
        car_distances = self.calculate_coverage(car_distances)

        return json.dumps(car_distances)

