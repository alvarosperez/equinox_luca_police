import json
import random

def simulate_incident(lat, lon):
    vehicles = []
    for car in ['a1', 'a2', 'a3']:
        c = {}
        c['id'] = car
        c['distance'] = round(random.random()*1000,2)
        c['time'] = round(random.random()*3600,2)
        c['estimated_coverage'] = round(random.random(),2)
        vehicles.append(c)

    return json.dumps(vehicles)

