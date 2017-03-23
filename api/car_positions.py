import json
import sqlite3 as lite
import logging
import ConfigParser


class Fleet:
    query = 'select code, lat, long, day, speed from cars'

    def __init__(self):
        try:
            Config = ConfigParser.ConfigParser()
            Config.read('api.cfg')

            dbpath = Config.get('database', 'path')
            #self.con = lite.connect('/data/hertz/luca_police.db')
            self.con = lite.connect(dbpath)
            self.cur = self.con.cursor()
        except:
            logging.error("Couldnt find database")



    def get_car_positions(self):
        f = {}
        f['type'] = "FeatureCollection"
        f['features'] = []

        result = self.cur.execute(self.query)
        for row in result:
            geometry = {}
            geometry['geometry'] = {}
            geometry['geometry']['type'] = 'Point'
            geometry['geometry']['coordinates'] = (row[2],row[1])
            geometry['type'] = 'Feature'
            geometry['id'] = row[0]
            geometry['properties'] = {}
            geometry['properties']['coverage'] = 10000
            geometry['properties']['id'] = row[0]
            geometry['properties']['speed'] = row[4]
            geometry['properties']['type'] = 'basic'
            f['features'].append(geometry)
        return json.dumps(f)





