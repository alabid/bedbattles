import os

from flask import Flask
from flask import render_template
from pymongo import Connection
app = Flask(__name__)

@app.route('/')
def hello():
	return render_template("index.html")

@app.route('/register/', methods=['GET', 'POST'])
def register():
	try:
	       	# username = request.form['username']
       		# uid = request.form['uid']
		# email = request.form['email']
		post = {"name": "Python", "uid": 987654321, "email": "py@py.org"}
		connection = Connection('localhost', 27028)
		db = connection.app5293195
		collection = db.users
		users.insert(post)
	except:
		return "failure"
	finally:
		return "success"
		

if __name__ == '__main__':
	port = int(os.environ.get('PORT', 55641))
	app.run(debug=True, host='0.0.0.0', port=port)
