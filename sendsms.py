from pymongo import Connection
from datetime import datetime
import urllib2

def sendsms():
    connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
    db = connection.app5293195
    battles = db.battles
    time = datetime.time(datetime.now())
    hour = time.hour
    minute = time.minute
    jobs = battles.find({"$and":[{"wake1hour": hour}, {"wake1minute": minute}]})
    for job in jobs:
        uid = job['user1']
        print 'sending sms to'+uid
        url = 'http://freezing-day-7773.herokuapp.com/sms/'+uid
        urllib2.urlopen(url)
    jobs = battles.find({"$and":[{"wake2hour": hour}, {"wake2minute": minute}]})
    for job in jobs:
        uid = job['user2']
        print 'sending sms to'+uid
        url = 'http://freezing-day-7773.herokuapp.com/sms/'+uid
        urllib2.urlopen(url)
    
    
if __name__ == '__main__':
    sendsms()
