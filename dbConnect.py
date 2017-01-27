import MySQLdb

def connection():
    conn = MySQLdb.connect(host="localhost", user= "root", passwd = "467password", db = "467project")
    
    c = conn.cursor(MySQLdb.cursors.DictCursor)
    
    return c, conn
    