import logging
from flask import Flask
from flask import request
from car_positions import Fleet
from incidents import Planner
from flask_cors import CORS
from assign_car import update_assigned_car
import ConfigParser
import sys




app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(levelname)-6s| %(message)s')


f = Fleet()
p = Planner()

@app.route("/get_positions")
def get_positions():
    return f.get_car_positions()


@app.route("/push_incident")
def push_incident():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    logging.info("Received push_incident invoke: " + str((lat,lon)))
    return p.simulate_incident(lat, lon)

@app.route("/assign_car")
def assign_car():
    idcar = request.args.get('idcar')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    logging.info("Received assign_car invoke: " + str((idcar, lat, lon)))
    return update_assigned_car(idcar, lat, lon)



if __name__ == "__main__":


    logging.info("Starting API")
    Config = ConfigParser.ConfigParser()
    Config.read('api.cfg')

    port = Config.getint('app', 'port')
    hostname = Config.get('app', 'host')

    logging.info("Starting port: " + str(port))
    app.run(host=hostname, port=port, threaded=False)