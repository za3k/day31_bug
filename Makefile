run-debug:
	flask --debug run
run-demo:
	gunicorn3 -e SCRIPT_NAME=/hackaday/bug --bind 0.0.0.0:8031 app:app
