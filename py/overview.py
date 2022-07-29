from flask import Flask
from flask import request
from flask_cors import CORS
import csv
import platform

app = Flask(__name__)
CORS(app)


@app.route("/personal")
def test():
    return {"participant": "python"}

# sync data from csv
@app.route("/overview/synccsv")
def syncFromCSV():
    if platform.system() == "Windows":
        countFile = open("..\\public\\Accelerometer\\daily_rowcount_res.csv")
        valueFile = open("..\\public\\Accelerometer\\eval_total_agg_sparkline_28.csv")
    else:
        countFile = open("./public/Accelerometer/daily_rowcount_res.csv")
        valueFile = open("./public/Accelerometer/eval_total_agg_sparkline_28.csv")

    # read count data
    countCSVReader = csv.reader(countFile)
    countHeaders = []
    countHeaders = next(countCSVReader)
    countData = []
    for row in countCSVReader:
        rowObj = {}
        for h, r in zip(countHeaders, row):
            rowObj[h] = r
        countData.append(rowObj)

    # read value data
    valueCSVReader = csv.reader(valueFile)
    valueHeaders = []
    valueHeaders = next(valueCSVReader)
    valueData = []
    for row in valueCSVReader:
        rowObj = {}
        for h, r in zip(valueHeaders, row):
            rowObj[h] = r
        valueData.append(rowObj)

    return {"countData": countData, "valueData": valueData}

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
        data = dataObj["countData"]
        snipData = []
        for d in data:
            for day in dates:
                if d["day"] == day["value"]:
                    snipData.append(d)
        return {"data": snipData}
    return {"data": []}


if __name__ == "__main__":
    app.run(debug=True)