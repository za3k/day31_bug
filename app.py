#!/bin/python3
import flask
from flask import url_for, request, render_template, redirect, send_from_directory, send_file
import json, random, hashlib, functools, string, re, io
from datetime import datetime
from db import DBDict, db_dicts

PREFIX="/hackaday/bug"
app = flask.Flask(__name__,
    static_url_path = PREFIX + "/static"
)

# -- Index page
bugs= DBDict("bug")
@app.route(PREFIX+"/report.js")
def js():
    return send_from_directory("static", "report.js")
@app.route(PREFIX+"/report", methods=["POST"])
def report():
    id = request.form.get("id", random.randint(0,1000000000))
    b = dict(request.form)
    b["screenshot"] = [{"data":screenshot.read(), "name": screenshot.filename, "mime": screenshot.content_type} for screenshot in request.files.getlist('screenshot')]
    bugs[id] = b
    return redirect(url_for("page_bug", bug_id=id))

@app.route(PREFIX+"/")
def page_bugs():
    return render_template("bugs.html", bugs=reversed(list(bugs.values())))
@app.route(PREFIX+"/bugs/<bug_id>")
def page_bug(bug_id):
    return render_template("bugs.html", bugs=[bugs[bug_id]], onebug=True)
@app.route(PREFIX+"/bugs/<bug_id>/fixed")
def bug_fixed(bug_id):
    bug = bugs[bug_id]
    bug["fixed"] = True
    bugs[bug_id] = bug
    return page_bugs()

@app.route(PREFIX+"/bugs/<bug_id>/screenshot/<int:screenshot>")
def screenshot(bug_id, screenshot):
    bug = bugs[bug_id]
    screenshot = bug["screenshot"][screenshot]
    return send_file(io.BytesIO(screenshot["data"]), mimetype=screenshot["mime"])

@app.route(PREFIX+"/dump")
def dump():
    global db_dicts
    s = "<pre>"
    s+="DICTS = {}\n".format(repr(sorted(db_dicts)))
    for d in sorted(db_dicts):
        db = DBDict(d, debug=True)
        s+="{}={{\n{}\n}}\n".format(d, "\n".join("  {}: {}".format(repr(k),repr(v)) for k,v in db.items()))
    s+="</pre>"
    return s
