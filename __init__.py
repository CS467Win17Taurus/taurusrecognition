from flask import Flask, render_template, flash, request, url_for, redirect, json, jsonify, Response
from dbConnect import connection
from readImage import read_image
import datetime
import time
import re
import os
from flask_mail import Mail, Message

app = Flask(__name__)
app.config.update(
	DEBUG=True,
	#EMAIL SETTINGS
	MAIL_SERVER='smtp.gmail.com',
	MAIL_PORT=465,
	MAIL_USE_SSL=True,
	MAIL_USERNAME = 'taurusrecognition',
	MAIL_PASSWORD = 'TaurusRecognition1'
	)
mail = Mail(app)

DICT = {
  "status": 200,
  "statusText": "OK",
  "httpVersion": "HTTP/1.1",
  "headers": [
    {
      "name": "Access-Control-Allow-Origin",
      "value": "*"
    }
  ],
  "cookies": [],
  "content": {
    "mimeType": "application/jsonp",
    "text": "",
    "size": 0
  },
  "redirectURL": "",
  "bodySize": 0,
  "headersSize": 0
}

HEAD = {"Access-Control-Allow-Origin" : "*"}
text = ""

@app.route("/", methods = ['GET', 'POST'])
def hello():
    return render_template("main.html")

# @app.route("/sendmail/", methods = ['GET', 'POST'])
# def send_mail():
    # try:
        # msg = Message("This is a test", sender="taurusrecognition@gmail.com", 
        # recipients=["mjbonney78@gmail.com"])
        # msg.body = "This is the body"
        # mail.send(msg)
        # return "ok"
    # except Exception as e:  
        # flash(e)        
        # return render_template("500.html", error=e)
    
@app.errorhandler(404)
def page_not_found(e):
    return("404 error!")
    

@app.route("/api/users/", methods = ["GET", "POST", "DELETE", "PUT"])
def getUsers():
    try:
        c, conn = connection()
    except Exception as e:
        flash(str(e))
        return render_template("500.html", error=e)     
    
    app.config['UPLOAD_FOLDER'] = '/tmp/' 

    if request.method == "GET":
        email , action = request.args.getlist('email'), request.args.getlist('action')
        if action[0] == 'retrieve':
            with conn:
                c.execute("SELECT password FROM users WHERE email=%s", (email[0],))
                if c.rowcount == 0:
                    text = "That email is not in the system, please try again"
                    resp = Response(text)
                    resp.headers = HEAD
                    return resp
                row = c.fetchone()
                password = row["password"]                
                msg = Message("Account Information", sender="taurusrecognition@gmail.com", 
                              recipients=[email[0]])
                msg.body = "Your password is " + password
                mail.send(msg)
                text = "Password has been sent to your email"            
   
    elif request.method == "POST":                
        data = request.form
        last = data["lName"]
        email = data["email"] 
        with conn:            
            c.execute("SELECT * FROM users WHERE lName=%s AND email=%s", (last, email))          
            rows = c.rowcount                    
            if rows != 0:
                text = "User already exists" 
                resp = Response(text)
                resp.headers = HEAD
                return resp  
                
        user = re.sub('["@.]', '', email)
        first = data['fName']
        password = data['password']
        did = data['dept']        
        file = request.files['sig']        
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], user))        
        ts = time.time()        
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')  
        with conn:
            c.execute("INSERT INTO users (fName, lName, email, password, timeCreated, signature, dept) VALUES \
            (%s, %s, %s, %s, %s, %s, %s)", (first, last, email, password, timestamp, user, did)) 
            c.execute("SELECT * FROM users WHERE email=%s", (email,))
            text = json.dumps(c.fetchone())           
        
    elif request.method == "DELETE":
        id = request.args.get("id")
        with conn:
            c.execute("SELECT * FROM users WHERE id=%s", (id,))
            if c.rowcount != 1:
                text = "no such user"
                resp = Response(text)
                resp.headers = HEAD
                return resp
            row = c.fetchone()                                  #delete signature file
            user = row["email"]
            user = re.sub('["@.]', '', user)
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], user))
            c.execute("DELETE FROM users WHERE id=%s", (id,))
            text = "User successfully deleted"             
            
    resp = Response(text)
    resp.headers = HEAD
    return resp    
    
            
@app.route("/api/admins/", methods = ["GET", "POST", "DELETE", "PUT"])    
def getAdmins():
    try:
        c, conn = connection()
    except Exception as e:
        flash(str(e))
        return render_template("500.html", error=e)
    
    if request.method == "GET":        
        ids = request.args.getlist('id')
        if len(ids) > 0:
            with conn:
                c.execute("SELECT * FROM admins WHERE id=%s", (ids[0],))
                text = json.dumps(c.fetchone())            
        else:
            with conn:
                c.execute("SELECT * FROM admins")
                text = json.dumps(c.fetchall())
        
    elif request.method == "POST":
        query = request.get_json(force=True)
        name = query["adminName"]
        pwd = query["password"]
        with conn:
            c.execute("INSERT INTO admins (adminName, password) VALUES (%s, %s)", (name, pwd))
            if c.rowcount == 1:
                c.execute("SELECT * FROM admins WHERE adminName=%s", (name,))
                text = json.dumps(c.fetchone())
            else:
                text = "There was an error inserting into table"                
    
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM admins WHERE id=%s", (id,))
            if c.rowcount == 1:
                text = "Admin successfully deleted"                
            else:
                text = "problem deleting"
    
    elif request.method == "PUT":
        query = request.get_json(force=True)
        id = query["id"]
        name = query["adminName"]
        pwd = query["password"]
        with conn:
            c.execute("UPDATE admins SET adminName=%s, password=%s WHERE id=%s", (name, pwd, id))
            if c.rowcount == 1:
                c.execute("SELECT * FROM admins WHERE id=%s", (id,))
                text = json.dumps(c.fetchone())
            else:
                text = "There was an error with PUT"                
                
    resp = Response(text)
    resp.headers = HEAD
    return resp
                
@app.route("/api/bonuses/", methods = ["GET", "POST", "DELETE", "PUT"])    
def getBonus():
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)
        
    if request.method == "GET":
        ids = request.args.getlist('id')
        if len(ids) > 0:
            with conn:
                c.execute("SELECT * FROM bonus WHERE bid=%s", (ids[0],))
                text = json.dumps(c.fetchone())            
        else:
            with conn:
                c.execute("SELECT * FROM bonus")
                text = json.dumps(c.fetchall())
                
    elif request.method == "POST":
        query = request.get_json(force=True)
        amt = query["amount"]        
        with conn:
            c.execute("INSERT INTO bonus (amount) VALUES (%s)", (amt,))
            if c.rowcount == 1:
                c.execute("SELECT * FROM bonus WHERE amount=%s", (amt,))                
                text = json.dumps(c.fetchone())
            else:
                text = "Error inserting bonus"                                
          
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM bonus WHERE bid=%s", (id,))
            if c.rowcount == 1:
                text = "Bonus successfully deleted"                
            else:
                text = "Error deleting bonus"                
                
    resp = Response(text)
    resp.headers = HEAD
    return resp

@app.route("/api/divisions/", methods = ["GET", "POST", "DELETE", "PUT"])    
def getDivision():                
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)
        
    if request.method == "GET":
        ids = request.args.getlist('id')
        if len(ids) > 0:
            with conn:
                c.execute("SELECT * FROM division WHERE did=%s", (ids[0],))
                text = json.dumps(c.fetchone())            
        else:
            with conn:
                c.execute("SELECT * FROM division")
                text = json.dumps(c.fetchall())
                
    elif request.method == "POST":
        query = request.get_json(force=True)
        name = query["name"]        
        with conn:
            c.execute("INSERT INTO division (name) VALUES (%s)", (name,))
            if c.rowcount == 1:
                c.execute("SELECT * FROM division WHERE name=%s", (name,))
                text = json.dumps(c.fetchone()) 
            else:
                text = "there was an error inserting into table"                
          
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM division WHERE did=%s", (id,))
            if c.rowcount == 1:
                text = "Division successfully deleted"                
            else:
                text = "problem deleting"                
                
    resp = Response(text)
    resp.headers = HEAD
    return resp
 
@app.route("/api/awards/", methods = ["GET", "POST", "DELETE", "PUT"])  
def getAwards():                
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)
        
    if request.method == "GET":
        ids = request.args.getlist('id')
        if len(ids) > 0:
            with conn:
                c.execute("SELECT * FROM awards WHERE aid=%s", (ids[0],))
                text = json.dumps(c.fetchone())                
            
        else:
            with conn:
                c.execute("SELECT * FROM awards")                
                text = json.dumps(c.fetchall())                                
                
    elif request.method == "POST":
        query = request.get_json(force=True)
        title = query["title"]        
        with conn:
            c.execute("INSERT INTO awards (title) VALUES (%s)", (title,))
            if c.rowcount == 1:
                c.execute("SELECT * FROM awards WHERE title=%s", (title,))
                text = json.dumps(c.fetchone())                
            else:
                text = "there was an error inserting into table"               
          
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM awards WHERE aid=%s", (id,))
            if c.rowcount == 1:
                text = "Award successfully deleted"                
            else:
                text = "problem deleting"
               
    resp = Response(text)
    resp.headers = HEAD
    return resp    
                
if __name__ == "__main__":
    app.run()

