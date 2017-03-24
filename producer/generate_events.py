from kafka import KafkaProducer
from kafka.errors import KafkaError
import csv
from datetime import datetime
import time
import json


# Each second, we simulate are this number of seconds
time_step = 600

import logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(levelname)-6s| %(message)s')


logging.info("Starting producer")
producer = KafkaProducer(bootstrap_servers='localhost:9092',
                         value_serializer=lambda m: json.dumps(m).encode('ascii'))


with open('/Users/asp/Develop/equinox_kafka/Mexico_ordenado.csv', 'r') as f:
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
        ev = producer.send('positionupdates', line)
        current_dt = event_dt
