import pymongo
import sys
import time
import datetime
import smtplib
import socket

# establish a connection to the database
connection = pymongo.Connection("mongodb://localhost", safe=True)

# get a handle to the school database
db=connection.harrison
returns =  db.returns

def send_email():
    
    try:
        currRentals = returns.find()
    except:
        print "Unexpected error:", sys.exc_info()[0]

    for rental in currRentals:
        name = rental['name']
        game = rental['rental']
        start = rental['startdate']
        email = rental['email']
        from datetime import datetime
        today = (time.strftime("%m/%d/%Y"))
        date_format = "%m/%d/%Y"
        a = datetime.strptime(start, date_format)
        b = datetime.strptime(today, date_format)
        delta = b - a
        if (delta.days == 3):
            emails=open('./emails', 'w+')
            emails.write(email + " " + name + " " + game + "\n")

send_email()



