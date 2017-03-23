import logging
from flask import Flask
from flask import request
from car_positions import get_car_positions
from incidents import simulate_incident
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/get_positions")
def get_positions():
    return get_car_positions()


@app.route("/push_incident")
def push_incident():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    return simulate_incident(lat, lon)


if __name__ == "__main__":

    logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(levelname)-6s| %(message)s')
    logging.info("Starting API")

    app.run()