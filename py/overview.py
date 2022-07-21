from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/personal")
def test():
    return {"participant": "python"}


# sync data from csv
@app.route("/overview/synccsv")
def syncFromCSV():
    pass

# sync data from db
@app.route("/overview/syncdb")
def syncFromDB():
    pass

# aggregate sync data
def aggregateSynced():
    pass

# return aggregated data
@app.route("/overview/getaggregated")
def returnAggregated():
    pass


if __name__ == "__main__":
    app.run(debug=True)