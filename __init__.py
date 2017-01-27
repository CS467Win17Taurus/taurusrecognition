from flask import Flask, render_template, flash, request, url_for, redirect, json
from dbConnect import connection
from readImage import read_image
import datetime
import time
from shutil import copyfile
import re

app = Flask(__name__)


@app.route("/", methods = ['GET', 'POST'])
def hello():
    return render_template("main.html")
    
@app.errorhandler(404)
def page_not_found(e):
    return("404 error!")
    
@app.route("/errorByDesign/")
def errorByDesign():
    try:
        render_template("errorByDesign.html", word = Dict['noSuchDict'])
    except Exception as e:  
        flash("testing a flash!")
        flash("showing error logic in header")
        return render_template("500.html", error=e)

@app.route("/testIN/", methods = ["GET", "POST"])
def testIN():
    try:
        c, conn = connection()
    except Exception as e:
        flash(str(e))
        return render_template("500.html", error=e)     
     
    if request.method == "POST":        
        # data = request.stream.read()
        data = request.form
        user = data["email"]
        # user = request.form.get('email', 'nothing')
        # user = re.sub('[@.]', '', user)
        # ts = time.time()                
        # filepath = "var/www/FlaskApp/FlaskApp/static/images/"
        # complete_path= filepath + user
        # timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        # with open('var/www/FlaskApp/FlaskApp/mjb.jpg', 'wb') as temp:
            # temp.write(buff) 
        # copyfile('var/www/FlaskApp/FlaskApp/mjb.jpg', complete_path)
        # copyfile(file, complete_path)
        # c.execute("INSERT INTO users (fName, lName, email, password, timeCreated) VALUES \
        # (%s, %s, %s, %s, %s)", ('mike', 'bon', 'mbon', 'mbon', timestamp)) 
        # c.execute("DELETE FROM users WHERE lName='bon'")
        # conn.commit()
        
        return user
    else:
        return "not a post"
    
            
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

 
    
