from flask import Flask, request, Response

def optionResponse():
    resp = Response("ok")
    resp.status_code = 201
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = "GET, POST, OPTIONS, PUT, DELETE"
    resp.headers['Access-Control-Allow-Domain'] = '*'
    resp.headers['Access-Control-Allow-Credentials'] = True
    return resp