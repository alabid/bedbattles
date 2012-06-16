import os

from flask import Flask
from pymongo import Connection
app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'app5293195'
mongo = PyMongo(app, config_prefix='MONGO')

@app.route('/')
def hello():
	return flask.render_template("index.html")

@app.route('/register/', methods=['POST'])
def register():
	try:
		if request.method == 'POST':
			username = request.form['username']
			uid = request.form['uid']
			email = request.form['email']
			post = {"name": "Python", "uid": 987654321, "email": "py@py.org"}
			mongo.db.users.insert(post)
	finally:
		return "success"
		

if __name__ == '__main__':
	port = int(os.environ.get('PORT', 5000))
	app.run(debug=True)
