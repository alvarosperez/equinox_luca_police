from kafka import KafkaConsumer
import sqlite3 as lite
import json
import logging

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s %(levelname)-6s| %(message)s')

logging.info("Starting")

try:
    con = lite.connect('/Users/asp/Develop/equinox_kafka/luca_police.db')
    cur = con.cursor()
except:
    logging.error("Couldnt find database")

# To consume latest messages and auto-commit offsets
logging.info("Instancing Kafka Consumer")

consumer = KafkaConsumer('positionupdates',
                         bootstrap_servers=['localhost:9092'])


for message in consumer:
    logging.info("Message received: " + str(message.value))
    logging.info("Received: " + str(message.value))
    v = json.loads(message.value)
    #print v['longitude']

    # Primero insertamos siempre, despues hacemos esto si no esta alertado (state==0)

    alerted_query = "select state from cars where code='{}'".format(v['iddevice'])
    result = cur.execute(alerted_query)
    update = True
    for r in result:
        if r[0] != 0:
            update = False

    if not update:
        logging("Car was alarmed, do not update")
        continue




    insert_string = "INSERT or REPLACE INTO cars (code, lat, lon, day, speed, state)  \
                     VALUES ('{}', {}, {}, '{}', {}, {})".format(v['iddevice'],
                                                            v['latitude'],
                                                            v['longitude'],
                                                            v['datetime'],
                                                            v['speed'],
                                                            0)

    logging.info(insert_string)
    cur.execute(insert_string)
    con.commit()
