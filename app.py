import os

from flask import Flask
from pymongo import Connection
app = Flask(__name__)

@app.route('/')
def hello():
	return 'Hello World!'

@app.route('/register/', methods=['POST'])
def register(request):
	if request.method == 'POST':
		username = request.form['username']
		uid = request.form['uid']
		email = request.form['email']

		connection = Connection('localhost', 27028)
		db = connection.app5293195
		users = db.users
		post = {"name": "Python", "uid": 987654321, "email": "py@py.org"}
		users.insert(post)
		return request.json

if __name__ == '__main__':
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)
