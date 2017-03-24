from kafka import KafkaProducer
from kafka.errors import KafkaError
import csv
from datetime import datetime
import time
import json
import ConfigParser


# Each second, we simulate are this number of seconds

import logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(levelname)-6s| %(message)s')

Config = ConfigParser.ConfigParser()
Config.read('producer.cfg')

topic = Config.get('kafka', 'topic')
bootstrap_server = Config.get('kafka', 'server')
data_path = Config.get('data', 'path')
time_step = Config.getint('config', 'time_step')


logging.info("Starting producer")
producer = KafkaProducer(bootstrap_servers=bootstrap_server,
                         value_serializer=lambda m: json.dumps(m).encode('ascii'))


with open(data_path, 'r') as f:
    r = csv.DictReader(f)
    line = r.next()
    # longitude, datetime, iddevice, latitude, speed, id
    try:
        current_dt = datetime.strptime(line['datetime'], '%Y-%m-%d %H:%M:%S.%f')
    except:
        current_dt = datetime.strptime(line['datetime'], '%Y-%m-%d %H:%M:%S')


    for line in r:
        try:
            event_dt = datetime.strptime(line['datetime'], '%Y-%m-%d %H:%M:%S.%f')
        except:
            event_dt = datetime.strptime(line['datetime'], '%Y-%m-%d %H:%M:%S')

        logging.info("Next event time: " + str(event_dt))
        logging.info((event_dt - current_dt).seconds/time_step)
        time.sleep((event_dt - current_dt).seconds/time_step)

        logging.info("Generating event: " + str(line))
        ev = producer.send(topic, line)
        current_dt = event_dt
