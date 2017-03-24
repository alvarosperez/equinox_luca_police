import logging
import json
import sqlite3 as lite
import ConfigParser


def reset_assigned_car():
    Config = ConfigParser.ConfigParser()
    Config.read('api.cfg')

    dbpath = Config.get('database', 'path')

    con = lite.connect(dbpath, check_same_thread=False)
    cur = con.cursor()

    query_updateCar = 'UPDATE cars SET state = 0'

    cur.execute(query_updateCar)
    con.commit()

    con.close()

    return "{\"ok\": \"OK\"}"


def update_assigned_car(idcar, lat_new, lon_new):
    Config = ConfigParser.ConfigParser()
    Config.read('api.cfg')

    dbpath = Config.get('database', 'path')

    con = lite.connect(dbpath ,check_same_thread=False)
    cur = con.cursor()

    print idcar
    
    query_updateCar = 'UPDATE cars SET state = 1, lat="' + str(lat_new) + '", lon = "' + str(lon_new) + '" WHERE code="' + str(idcar) + '"'

    print query_updateCar

    cur.execute(query_updateCar)   
    con.commit()

    con.close()

    return "{\"ok\": \"OK\"}"