from flask import Flask, render_template, flash, request, url_for, redirect, json, jsonify, Response
from dbConnect import connection
from optionsResponse import optionResponse
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

HEAD = {"Access-Control-Allow-Origin" : "*", "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS"}
text = ""

@app.route("/", methods = ['GET', 'POST'])
def hello():
    return render_template("main.html")

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
                c.execute("SELECT password FROM users WHERE email=%s AND active=1", (email[0],))
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
                c.execute("SELECT id FROM users WHERE email=%s AND password=%s AND active=1", (email[0], password[0]))                
                if c.rowcount == 1:                
                    row = c.fetchone()
                    id = row["id"]
                    text = json.dumps({"id":id, "status": "Success"})                  
                else:
                    text = json.dumps({"id":-1, "status": "Fail"})  

        elif len(ids) > 0:
            with conn:
                c.execute("SELECT * FROM users WHERE id=%s AND active=1", (ids[0],))
                text = json.dumps(c.fetchone())
                
        else:
            with conn:
                c.execute("SELECT U.id, U.fName, U.lName, U.email, U.password, U.timeCreated, U.signature, U.dept, \
                           D.name FROM users U INNER JOIN division D ON dept=did WHERE U.active=1")
                text = json.dumps(c.fetchall())
        
            
    elif request.method == "POST":                
        data = request.form
        last = data["lName"]
        email = data["email"] 
        first = data['fName']
        with conn:            
            c.execute("SELECT * FROM users WHERE fName=%s AND lName=%s AND email=%s", (first, last, email))          
            rows = c.rowcount                    
            if rows != 0:
                text = "User already exists" 
                resp = Response(text)
                resp.headers = HEAD
                return resp  
                
        user = re.sub('["@.]', '', email)        
        password = data['password']
        did = data['dept']        
        file = request.files['signature']        
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], user))          
        ts = time.time()        
        date = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d')  
        with conn:
            c.execute("INSERT INTO users (fName, lName, email, password, timeCreated, signature, dept) VALUES \
            (%s, %s, %s, %s, %s, %s, %s)", (first, last, email, password, date, user, did)) 
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
        try:
            active = data['active']
        except:
            active = 1
        
        if active == "0":
            with conn:                             
                c.execute("UPDATE users SET active=0 WHERE id=%s", (id,))
                if c.rowcount == 1:
                    text = json.dumps({"status" :"success"})
                else:
                    text = json.dumps({"status" :"failed"})
        else:             
            fName = data['fName']
            lName = data['lName']
            email = data['email']   
            dept = data['dept']            
            file = request.files.getlist('signature')              
            with conn:                
                c.execute("SELECT * FROM users WHERE fName=%s AND lName=%s AND email=%s AND id!=%s", (fName, lName, email, id))   #check to see if another user already has this name/email combination             
                if c.rowcount == 0:                   
                    c.execute("SELECT * FROM users WHERE id=%s", (id,))
                    row = c.fetchone()
                    try:
                        password = data['password']
                    except:
                        password = row['password']
                    if len(file) == 0:  
                        # return "no file"
                        user = row['signature']
                    else:     
                        return "im here"
                        user = re.sub('["@.]', '', email)
                        # os.remove(os.path.join(app.config['UPLOAD_FOLDER'], user)
                        file[0].save(os.path.join(app.config['UPLOAD_FOLDER'], user))                          
                    c.execute("UPDATE users SET fName=%s, lName=%s, email=%s, password=%s, signature=%s, dept=%s WHERE id=%s", (fName, lName, email, password, user, dept, id))
                    # c.execute("SELECT * FROM users WHERE id=%s", (id,))
                    text = json.dumps({"status": "success", "message": "User successfully updated"})                
                else:
                    text = json.dumps({"status": "failed", "message": "Error: user already exists"})                
                           
         
    elif request.method == "OPTIONS":        
        return optionResponse()
        
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
            c.execute("SELECT * FROM admins WHERE adminName=%s", (name,))
            if c.rowcount == 1:
                text = json.dumps({"status": "failed", "message":"Error: admin already exists"})
            else:
                c.execute("INSERT INTO admins (adminName, password) VALUES (%s, %s)", (name, pwd))
                if c.rowcount == 1:
                    c.execute("SELECT * FROM admins WHERE adminName=%s", (name,))
                    text = json.dumps({"status": "success", "message": "Admin successfully updated"})
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
        try:
            pwd = query["password"]
        except:
            with conn:
                c.execute("SELECT * FROM admins WHERE id=%s", (id, ))
                row = c.fetchone()
                pwd = row['password']
        with conn:
            c.execute("SELECT * FROM admins WHERE adminName=%s AND id!=%s", (name, id))
            if c.rowcount == 1:                
                text = json.dumps({"status": "failed", "message":"Error: admin already exists"})
            else:
                c.execute("UPDATE admins SET adminName=%s, password=%s WHERE id=%s", (name, pwd, id))
                if c.rowcount == 1:
                    # c.execute("SELECT * FROM admins WHERE id=%s", (id,))
                    # text = json.dumps(c.fetchone())
                    text = json.dumps({"status": "success", "message": "User successfully updated"})
                else:
                    text = json.dumps("There was an error with PUT")
                
    elif request.method == "OPTIONS":        
        return optionResponse()
                
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
        action = request.args.getlist("action")
        if len(action) == 1:
            with conn:
                c.execute("SELECT * FROM bonus")                
                text = json.dumps(c.fetchall())
        else:        
            with conn:
                c.execute("SELECT * FROM bonus WHERE active=1 ORDER BY amount")
                text = json.dumps(c.fetchall())
                
    elif request.method == "POST":
        query = request.get_json(force=True)
        amt = query["amount"]        
        with conn:
            c.execute("SELECT * FROM bonus WHERE amount=%s", (amt,))
            if c.rowcount == 1:
                row = c.fetchone()
                if row['active'] == 1:
                    text = json.dumps({"status": "failed", "message": "Error: Bonus amount already exists"})
                else:
                    c.execute("UPDATE bonus SET active=1 WHERE amount=%s", (amt,))
                    text = json.dumps({"status":"success","message":"Bonus amount now active"})
            else:
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
                text = json.dumps({"status":"success","message":"Bonus amount successfully deleted"})                
            else:
                text = json.dumps({"status":"failed","message":"Bonus amount not deleted"})  
                
    elif request.method == "PUT":
        data = request.form
        id = data["id"]
        with conn:
            c.execute("UPDATE bonus SET active=0 WHERE bid=%s", (id,))
            if c.rowcount == 1:
                text = json.dumps({"status":"success"})
            else:
                text = json.dumps({"status":"failed"})          
    

    elif request.method == "OPTIONS":        
        return optionResponse()
                
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
        action = request.args.getlist("action")
        if len(action) == 1:
            with conn:
                c.execute("SELECT * FROM division")                
                text = json.dumps(c.fetchall())
        else:        
            with conn:
                c.execute("SELECT * FROM division WHERE active=1")
                text = json.dumps(c.fetchall())
                
    elif request.method == "POST":
        query = request.get_json(force=True)
        name = query["name"]        
        with conn:
            c.execute("SELECT * FROM division WHERE name=%s", (name,))
            if c.rowcount == 1:
                row = c.fetchone()
                if row['active'] == 1:
                    text = json.dumps({"status": "failed", "message": "Error: Department already exists"})
                else:
                    c.execute("UPDATE division SET active=1 WHERE name=%s", (name,))
                    text = json.dumps({"status":"success","message":"Division now active"})
            else:
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
                text = json.dumps({"status":"success","message":"Division successfully deleted"})               
            else:
                text = json.dumps({"status":"failed","message":"Division not deleted"}) 
                
    elif request.method == "PUT":
        data = request.form
        id = data["id"]
        with conn:
            c.execute("UPDATE division SET active=0 WHERE did=%s", (id,))
            if c.rowcount == 1:
                text = json.dumps({"status":"success"})
            else:
                text = json.dumps({"status":"failed"})

    elif request.method == "OPTIONS":        
        return optionResponse()
                
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
        action = request.args.getlist("action")        
        if len(action) == 1:
            with conn:
                c.execute("SELECT * FROM awards")                
                text = json.dumps(c.fetchall())
        else:
            with conn:
                c.execute("SELECT * FROM awards WHERE active=1")                
                text = json.dumps(c.fetchall())                                
                
    elif request.method == "POST":
        query = request.get_json(force=True)
        title = query["title"]        
        with conn:
            c.execute("SELECT * FROM awards WHERE title=%s", (title,))
            if c.rowcount == 1:
                row = c.fetchone()
                if row['active'] == 1:
                    text = json.dumps({"status": "failed", "message":"Error: Award type already exists"})
                else:
                    c.execute("UPDATE awards SET active=1 WHERE title=%s", (title,))
                    text = json.dumps({"status":"success","message":"Award type now active"})
            else:
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
                text = json.dumps({"status":"success","message":"Award type successfully deleted"})              
            else:
                text = json.dumps({"status":"failed","message":"Award type not deleted"}) 
                
    elif request.method == "PUT":
        data = request.form
        id = data["id"]
        with conn:
            c.execute("UPDATE awards SET active=0 WHERE aid=%s", (id,))
            if c.rowcount == 1:
                text = json.dumps({"status":"success"})
            else:
                text = json.dumps({"status":"failed"})
                
    elif request.method == "OPTIONS":        
        return optionResponse()    
               
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
        userID, aid = request.args.getlist('userId'), request.args.getlist('awardId')
        bid, did = request.args.getlist('bonusId'), request.args.getlist('deptId')    
        with conn:                   
            sql = """SELECT UA.uaid, t1.fName AS recipientFName, t1.lName AS recipientLName, t2.fName AS giverFName,
                        t2.lName AS giverLName, UA.awardDate, title AS awardTitle, amount AS bonusAmount, bid AS bonusId,
                        aid AS awardId, t2.id AS giverId, t1.id AS recipientId , division.name AS recipientDeptName, 
                        division.did as recipientDeptId FROM userAwards UA join users t1 on 
                        UA.recipient=t1.id join users t2 on UA.giver=t2.id INNER JOIN awards on UA.awardID=awards.aid 
                        INNER JOIN bonus on UA.bonusID=bonus.bid INNER JOIN division ON t1.dept=division.did WHERE UA.giver"""
            if len(userID) == 1:                    #build sql statement piece by piece based on field present in query or not
                sql += "=%s"
                userID = userID[0]
            else:
                sql += " > %s"
                userID = -1
            
            if len(aid) == 1:
                sql += " AND UA.awardID =%s"
                aid = aid[0]
            else:
                sql += " AND UA.awardID > %s"
                aid = -1
            if len(bid) == 1:
                sql += " AND UA.bonusID = %s"
                bid = bid[0]
            else:
                sql += " AND UA.bonusID > %s"
                bid = -1
            if len(did) == 1:
                sql += " AND division.did = %s"
                did = did[0]
            else:
                sql += " AND division.did > %s"
                did = -1   
            sql += " ORDER BY UA.awardDate"    
            c.execute(sql, (userID, aid, bid, did ))            
            text = json.dumps(c.fetchall())
                
    elif request.method == "POST":
        query = request.form
        recipient = query["recipient"]
        giver = query["giver"]
        awardId = query["awardId"]
        bonusId = query["bonusId"]
        date = query["date"]
        with conn:
            c.execute("SELECT * FROM userAwards WHERE recipient=%s AND awardID=%s AND bonusID=%s and awardDate=%s", (recipient, awardId, bonusId, date))
            if c.rowcount == 1:
                text = json.dumps({"status": "failed", "message": "Error, award already exists"})
            else:
                c.execute("INSERT INTO userAwards (recipient, giver, awardID, bonusID, awardDate) VALUES (%s, %s, %s, %s, %s)", 
                (recipient, giver, awardId, bonusId, date))
                if c.rowcount == 1:
                    c.execute("SELECT * FROM userAwards WHERE uaid=%s", (c.lastrowid,))
                    text = json.dumps(c.fetchone())               
                else:
                    text = "Problem adding UA"  

    elif request.method == "DELETE":
        ids = request.args.getlist('id')
        id = ids[0] 
        with conn:
            c.execute("DELETE FROM userAwards WHERE uaid=%s", (id,))
            if c.rowcount == 1:
                text = json.dumps({"status":"success","message":"User award was successfully deleted"})
            else:
                text = json.dumps({"status": "failed","message": "Error: User award was not deleted."})
          
    elif request.method == "OPTIONS":        
        return optionResponse()
        
    resp = Response(text)
    resp.headers = HEAD
    return resp 
                
if __name__ == "__main__":
    app.run()
