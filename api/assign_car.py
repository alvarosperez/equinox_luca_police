import logging
import json
import sqlite3 as lite




def update_assigned_car(idcar, lat_new, lon_new):
    con = lite.connect('/data/hertz/luca_police.db' ,check_same_thread=False)
    cur = con.cursor()
    
    query_updateCar = ' UPDATE cars SET state = 1, lat="' + str(lat_new) + '", lon = "' + str(lon_new) + '" WHERE code=" ' + str(idcar) + '  "  '

    cur.execute(query_updateCar)   
    con.commit()

    con.close()

    return 'OK'