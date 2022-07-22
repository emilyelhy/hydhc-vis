from flask import Flask
from flask_cors import CORS
import csv

app = Flask(__name__)
CORS(app)

@app.route("/personal")
def test():
    return {"participant": "python"}

# sync data from csv
@app.route("/overview/synccsv")
def syncFromCSV():
    file = open("./public/Accelerometer/Accelerometer-test.csv")
    csvreader = csv.reader(file)
    headers = []
    headers = next(csvreader)
    fullData = []
    for row in csvreader:
        rowObj = {}
        for h, r in zip(headers, row):
            rowObj[h] = r
        fullData.append(rowObj)
    return {"data": fullData}

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