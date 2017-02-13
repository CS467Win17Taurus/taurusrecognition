from flask import Flask, render_template, flash, request, url_for, redirect, json, jsonify, Response
from flask.ext.cors import CORS
from dbConnect import connection
from readImage import read_image
import datetime
import time
import re
import os
from flask_mail import Mail, Message

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

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

HEAD = {"Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS"}
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
    

@app.route("/api/users/", methods = ["GET", "POST", "DELETE", "PUT", "OPTIONS"])
def getUsers():
    try:
        c, conn = connection()
    except Exception as e:
        flash(str(e))
        return render_template("500.html", error=e)     
    
    app.config['UPLOAD_FOLDER'] = '/var/www/FlaskApp/FlaskApp/static/'     

    if request.method == "GET":
        email , action, password = request.args.getlist('email'), request.args.getlist('action'), request.args.getlist('password')
        ids = request.args.getlist('id')
        
        if len(action) > 0 and action[0] == 'retrieve':
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
                
        elif len(action) > 0 and action[0] == 'login':
            with conn:
                c.execute("SELECT id FROM users WHERE email=%s AND password=%s", (email[0], password[0]))                
                if c.rowcount == 1:                
                    row = c.fetchone()
                    id = row["id"]
                    text = json.dumps({"id":id, "status": "Success"})                  
                else:
                    text = json.dumps({"id":-1, "status": "Fail"})  

        elif len(ids) > 0:
            with conn:
                c.execute("SELECT * FROM users WHERE id=%s", (ids[0],))
                text = json.dumps(c.fetchone())
                
        else:
            with conn:
                c.execute("SELECT * FROM users INNER JOIN division ON dept=did")
                text = json.dumps(c.fetchall())
        
            
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
        file = request.files['signature']        
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], user))  
        sig = url_for('static', filename=user)
        ts = time.time()        
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')  
        with conn:
            c.execute("INSERT INTO users (fName, lName, email, password, timeCreated, signature, dept) VALUES \
            (%s, %s, %s, %s, %s, %s, %s)", (first, last, email, password, timestamp, sig, did)) 
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

    elif request.method == "PUT":
        data = request.form
        id = data['id']
        fName = data['fName']
        lName = data['lName']
        email = data['email']   
        dept = data['dept']
        file = request.files.getlist('signature')        
        with conn:
            c.execute("SELECT * FROM users WHERE id=%s", (id,))
            row = c.fetchone()
            try:
                password = data['password']
            except:
                password = row['password']
            if not file:
                sig = row['signature']
            else:
                user = re.sub('["@.]', '', email)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], user))
                sig = url_for('static', filename=user)
            c.execute("UPDATE users SET fName=%s, lName=%s, email=%s, password=%s, signature=%s, dept=%s WHERE id=%s", (fName, lName, email, password, sig, dept, id))
            c.execute("SELECT * FROM users WHERE id=%s", (id,))
            text = json.dumps(c.fetchone())   
        
    resp = Response(text)
    resp.headers = HEAD
    return resp

@app.route("/api/admins/", methods = ["GET", "POST", "DELETE", "PUT", "OPTIONS"])    
def getAdmins():
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)
    
    if request.method == "GET":
        name, action, password = request.args.getlist('adminName'), request.args.getlist('action'), request.args.getlist('password')
        ids = request.args.getlist('id')
        if len(action) > 0:            
            with conn:                
                c.execute("SELECT * FROM admins WHERE adminName=%s AND password=%s", (name[0], password[0]))
                if c.rowcount == 1:
                    row = c.fetchone()
                    id = row["id"]
                    text = json.dumps({"id":id, "status": "success"}) 
                else:
                    text = json.dumps({"id":-1, "status": "failed"}) 
        elif len(ids) > 0:
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
          
@app.route("/api/bonuses/", methods = ["GET", "POST", "DELETE", "PUT", "OPTIONS"])    
def getBonus():
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)
        
    if request.method == "GET":
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

@app.route("/api/divisions/", methods = ["GET", "POST", "DELETE", "PUT", "OPTIONS"])    
def getDivision():                
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)
        
    if request.method == "GET":
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
 
@app.route("/api/awards/", methods = ["GET", "POST", "DELETE", "PUT", "OPTIONS"])  
def getAwards():                
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)
        
    if request.method == "GET":        
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

@app.route("/api/userAwards/", methods = ["GET", "POST", "DELETE", "PUT", "OPTIONS"])  
def getUserAwards():                
    try:
        c, conn = connection()
    except Exception as e:        
        return json.dumps(e)

    if request.method == "GET":
        userID, aid = request.args.getlist('userID'), request.args.getlist('awardID')
        bid, did = request.args.getlist('bonusID'), request.args.getlist('deptID')
        if len(userID) > 0:
            with conn:
                c.execute("""SELECT UA.uaid, t1.fName AS recipientFName, t1.lName AS recipientLName, t2.fName AS giverFName,
                            t2.lName AS giverLName, UA.awardDate, title AS awardTitle, amount AS bonusAmount FROM userAwards
                            UA join users t1 on UA.recipient=t1.id join users t2 on UA.giver=t2.id INNER JOIN awards on 
                            UA.awardID=awards.aid INNER JOIN bonus on UA.bonusID=bonus.bid WHERE UA.giver=%s""", (userID[0], ))
                text = json.dumps(c.fetchall())
                
                
    resp = Response(text)
    resp.headers = HEAD
    return resp 
                
if __name__ == "__main__":
    app.run()
