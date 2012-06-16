import os

from flask import Flask
from flask import render_template
from flask import request
from pymongo import Connection
from twilio.rest import TwilioRestClient
from datetime import datetime
app = Flask(__name__)

@app.route('/')
def hello():
	return render_template("index.html")

@app.route('/register/', methods=['GET', 'POST'])
def register():
	
	try:
	       	username = request.form.get('currentUserName')
       		uid = request.form.get('currentUser')
		email = request.form.get('currentUserEmail')
		#username = "test"
		#uid = 123456789
		#email = "testemail"
		post = {"name": username, "uid": uid, "email": email}
		connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
		db = connection.app5293195
		users = db.users
		duplicate = users.find_one({"uid": uid})
		if not duplicate:
			users.insert(post)
			return "success"
		else:
			return "duplicate"
	except:
		return "failure"
		
@app.route('/sms/<uid>', methods=['GET', 'POST'])
def sms(uid):
	#try:
		account = "AC720f0500e36bbb4afa8e2d52e360e3ba"
		token = "bb5de69f671b98f875277f69c0d0b497"
		client = TwilioRestClient(account, token)

		connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
		db = connection.app5293195
		battles = db.battles
		users = db.users
		battle = battles.find_one({"$or" : [ {"user1" : uid}, {"user2": uid} ]})
		battleid = battle['battleid']
		if battle['user1'] == uid:
			opponentid = battle['user2']
		if battle['user2'] == uid:
			opponentid = battle['user1']

		opponentdoc = users.find_one({'uid' : opponentid})
		opponent = opponentdoc['name']

		userdoc = users.find_one({'uid': uid})
		phone = "+1"+userdoc['phone']
		challengeURL = 'http://freezing-day-7773.herokuapp.com/battle/'+battleid+'/'+uid
		message = client.sms.messages.create(to=phone, from_="+14155992671", body="Good morning! Start BedBattle with "+opponent+": "+challengeURL)
		return "success"
	#except:
		#return "failure"

@app.route('/battle/<battleid>/<uid>', methods=['GET', 'POST'])
def battle(battleid, uid):
	if request.method == 'POST':
		win = request.form.get("win")
		if win=="true":
			#add to db
			connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
			db = connection.app5293195
			wakeups = db.wakeups
			time = datetime.now()
			month = time.month
			day = time.day
			wakeups.update({"battleid": battleid, "uid": uid, "month": month, "day": day}, {"$set": {"win": "true"}}, False, False)
	else:
	#try:
		connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
		db = connection.app5293195
		wakeups = db.wakeups
		time = datetime.now()
		hour = time.hour
		minute = time.minute
		month = time.month
		day = time.day
		post = {"battleid": battleid, "uid": uid, "month": month, "day": day, "hour": hour, "minute": minute, "win": "false"}
		wakeups.insert(post)
		#return "success"
		return render_template("game.html")
	#except:
		#return "failure"

@app.route('/battleview/<battleid>')
def visualize(battleid):
	connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
	db = connection.app5293195
	battles = db.battles
	battle = battles.find_one({"battleid": battleid})
	user1 = battle["user1"]
	user2 = battle["user2"]
	users = db.users
	username1 = users.find_one({"uid": user1})["name"]
	username2 = users.find_one({"uid": user2})["name"]
	output = ""
	output += username1+" vs "+username2+"<br />"
	wakeups = db.wakeups
	#docs1 = wakeups.find({"$and": [{"uid": user1}, {"win": "true"}]})
	docs1 = wakeups.find({"uid": user1})
	output += "<p>"+username1+"'s wakeups:<br />"
	for wakeup in docs1:
		if wakeup["win"]=="true":
			output += "WOKE UP! "
		else:
			output += "Fell back asleep: "
		output += str(wakeup["month"])+"/"+str(wakeup["day"])+" at "+str(wakeup["hour"])+":"+str(wakeup["minute"])+"<br />"
	output += "</p>"	
	#docs2 = wakeups.find({"$and": [{"uid": user2}, {"win": "true"}]})
	docs2 = wakeups.find({"uid": user2})
	output += "<p>"+username2+"'s wakeups:<br />"
	for wakeup in docs2:
		output += str(wakeup["month"])+"/"+str(wakeup["day"])+" at "+str(wakeup["hour"])+":"+str(wakeup["minute"])+"<br />"
	output += "</p>"
	return output

@app.route('/createbattle/', methods=['GET', 'POST'])
def createbattle():
	try:
		user1 = request.form.get('user1')
		user2 = request.form.get('user2')
		wake1hour = int(request.form.get('wake1hour'))
		wake1minute = int(request.form.get('wake1minute'))
		wake2hour = int(request.form.get('wake2hour'))
		wake2minute = int(request.form.get('wake2minute'))
		connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
		db = connection.app5293195
		battles = db.battles
		battleid = os.urandom(16).encode('hex')
		post = {"user1": user1, "user2": user2, "wake1hour": wake1hour, "wake1minute": wake1minute, "wake2hour": wake2hour, "wake2minute": wake2minute, "battleid": battleid}
		battles.insert(post)
		return "success"
	except:
		return "failure"


@app.route('/addphone/<uid>/<phone>', methods=['POST'])
def addphone():
	try:
		connection = Connection("mongodb://heroku:54cce0fe06c2ec87c6c0ede29923b6e0@flame.mongohq.com:27028/app5293195")
		db = connection.app5293195
		users = db.users
		uid = request.form.get('currentUser')
		phone = request.form.get('phoneNumber')
		users.update({"uid": uid}, {"phone": phone}, False, False)
		return "success"
	except:
		return "failure"

if __name__ == '__main__':
	port = int(os.environ.get('PORT', 55641))
	app.run(debug=True, host='0.0.0.0', port=port)
