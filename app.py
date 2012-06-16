import os

from flask import Flask
from flask import render_template
from pymongo import Connection
from twilio.rest import TwilioRestClient
app = Flask(__name__)

@app.route('/')
def hello():
	return render_template("index.html")

@app.route('/register/', methods=['GET', 'POST'])
def register():
	try:
	       	username = request.form['currentUserName']
       		uid = request.form['currentUser']
		email = request.form['currentUserEmail']
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

		message = client.sms.messages.create(to="+19145884793", from_="+14155992671", body="Good morning!")
		return "success"
	#except:
		#return "failure"

if __name__ == '__main__':
	port = int(os.environ.get('PORT', 55641))
	app.run(debug=True, host='0.0.0.0', port=port)
