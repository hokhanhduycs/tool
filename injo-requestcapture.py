import os
import json

dir = './pano/'
requestcapture = {  "reject": {
    "data": []}}
list_data = os.listdir(dir)
for item_data in list_data:
    if('.json' in item_data):
        print(item_data)
        open_data = open(dir + item_data)
        data = json.load(open_data)
        requestcapture["reject"]["data"].append(data)
with open('requestcapture.json', 'w') as outfile:
    json.dump(requestcapture, outfile)