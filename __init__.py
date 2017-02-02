from flask import Flask, render_template, flash, request, url_for, redirect, json
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

@app.route("/", methods = ['GET', 'POST'])
def hello():
    return render_template("main.html")

@app.route("/sendmail/", methods = ['GET', 'POST'])
def send_mail():
    try:
        msg = Message("This is a test", sender="taurusrecognition@gmail.com", 
        recipients=["mjbonney78@gmail.com"])
        msg.body = "This is the body"
        mail.send(msg)
        return "ok"
    except Exception as e:  
        flash(e)        
        return render_template("500.html", error=e)

    
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
    
    if request.method == "POST":                
        data = request.form
        last = data["lName"]
        email = data["email"] 
        with conn:            
            c.execute("SELECT * FROM users WHERE lName=%s AND email=%s", (last, email))          
            rows = c.rowcount                    
            if rows != 0:
                return "User already exists"  
                
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
        return "user successfully added"
        
    elif request.method == "DELETE":
        id = request.args.get("id")
        with conn:
            c.execute("SELECT * FROM users WHERE id=%s", (id,))
            if c.rowcount != 1:
                return "no such user"
            row = c.fetchone()                                  #delete signature file
            user = row["email"]
            user = re.sub('["@.]', '', user)
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], user))
            c.execute("DELETE FROM users WHERE id=%s", (id,))
            return "User successfully deleted"
            
                
    
            
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
                json_string = json.dumps(c.fetchone())
                return json_string
            
        else:
            with conn:
                c.execute("SELECT * FROM admins")
                json_string = json.dumps(c.fetchall())
                return json_string
        
    elif request.method == "POST":
        dict = request.get_json(force=True)
        name = dict["adminName"]
        pwd = dict["password"]
        with conn:
            c.execute("INSERT INTO admins (adminName, password) VALUES (%s, %s)", (name, pwd))
            if c.rowcount == 1:
                c.execute("SELECT * FROM admins WHERE adminName=%s", (name,))
                return json.dumps(c.fetchone())
            else:
                return "there was an error inserting into table"
    
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM admins WHERE id=%s", (id,))
            if c.rowcount == 1:
                return json.dumps("Admin successfully deleted")
            else:
                return "problem deleting"
    
    elif request.method == "PUT":
        dict = request.get_json(force=True)
        id = dict["id"]
        name = dict["adminName"]
        pwd = dict["password"]
        with conn:
            c.execute("UPDATE admins SET adminName=%s, password=%s WHERE id=%s", (name, pwd, id))
            if c.rowcount == 1:
                return "Admin successfully updated"
            else:
                return "problem updating"
                
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
                json_string = json.dumps(c.fetchone())
                return json_string
            
        else:
            with conn:
                c.execute("SELECT * FROM bonus")
                json_string = json.dumps(c.fetchall())
                return json_string
                
    elif request.method == "POST":
        dict = request.get_json(force=True)
        amt = dict["amount"]        
        with conn:
            c.execute("INSERT INTO bonus (amount) VALUES (%s)", (amt,))
            if c.rowcount == 1:
                c.execute("SELECT * FROM bonus WHERE amount=%s", (amt,))
                return json.dumps(c.fetchone())
            else:
                return "there was an error inserting into table"
          
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM bonus WHERE bid=%s", (id,))
            if c.rowcount == 1:
                return json.dumps("Bonus successfully deleted")
            else:
                return "problem deleting"

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
                json_string = json.dumps(c.fetchone())
                return json_string
            
        else:
            with conn:
                c.execute("SELECT * FROM division")
                json_string = json.dumps(c.fetchall())
                return json_string
                
    elif request.method == "POST":
        dict = request.get_json(force=True)
        name = dict["name"]        
        with conn:
            c.execute("INSERT INTO division (name) VALUES (%s)", (name,))
            if c.rowcount == 1:
                c.execute("SELECT * FROM division WHERE name=%s", (name,))
                return json.dumps(c.fetchone())
            else:
                return "there was an error inserting into table"
          
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM division WHERE did=%s", (id,))
            if c.rowcount == 1:
                return json.dumps("Division successfully deleted")
            else:
                return "problem deleting"
 
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
                json_string = json.dumps(c.fetchone())
                return json_string
            
        else:
            with conn:
                c.execute("SELECT * FROM awards")
                json_string = json.dumps(c.fetchall())
                return json_string
                
    elif request.method == "POST":
        dict = request.get_json(force=True)
        title = dict["title"]        
        with conn:
            c.execute("INSERT INTO awards (title) VALUES (%s)", (title,))
            if c.rowcount == 1:
                c.execute("SELECT * FROM awards WHERE title=%s", (title,))
                return json.dumps(c.fetchone())
            else:
                return "there was an error inserting into table"
          
    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0]
        with conn:
            c.execute("DELETE FROM awards WHERE aid=%s", (id,))
            if c.rowcount == 1:
                return json.dumps("awards successfully deleted")
            else:
                return "problem deleting"

                
if __name__ == "__main__":
    app.run()
