from flask import Flask
from flask import request
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
    file = open("./public/Accelerometer/daily_rowcount_res.csv")
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

# aggregate raw data and save as daily_rowcount_res.csv
def aggregateSynced():
    pass

# return aggregated data
@app.route("/overview/getaggregated", methods=['GET', 'POST'])
def returnAggregated():
    if request.method == "POST":
        dates = request.json["dates"]
        dataObj = syncFromCSV()
        data = dataObj["data"]
        snipData = []
        for d in data:
            for day in dates:
                if d["day"] == day["value"]:
                    snipData.append(d)
        return {"data": snipData}
    return {"data": []}


if __name__ == "__main__":
    app.run(debug=True)