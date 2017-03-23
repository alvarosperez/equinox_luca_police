import json

def get_car_positions():
    f = {}
    f['type'] = "FeatureCollection"
    f['features'] = []
    car_positions = {'a1': (19.5282688,-99.0771484), 'a2': (19.3140736,-99.2215042), 'a3': (19.4281464,-99.1791382)}

    for car in car_positions:
        geometry = {}
        geometry['geometry'] = {}
        geometry['geometry']['type'] = 'Point'
        geometry['geometry']['coordinates'] = list(car_positions[car])[::-1]
        geometry['type'] = 'Feature'
        geometry['id'] = car
        geometry['properties'] = {}
        geometry['properties']['coverage'] = 10000
        geometry['properties']['id'] = car
        geometry['properties']['type'] = 'basic'
        f['features'].append(geometry)

    return json.dumps(f)





