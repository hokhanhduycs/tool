import os
import json
dir = './thuthiemzeit/'
lang = 'vn'
name = ''
list_d = os.listdir(dir)
for item in list_d:
    if('.json' in item):
        item_open = open(dir+ item )
        data = json.load(item_open)
        data['name'] = data['name'] + lang
        data['fullname'] = data['fullname'] + lang
        print (data['name'])
        print (data['fullname'])
        with open(f'./{dir}/{lang}/{data["name"]}.json', 'x') as outfile:
            json.dump(data, outfile)
            # os.remove("demofile.txt")
            # ten = item.replace(' copy.jpg', '.jpg')
        # os.rename(dir+item, dir+data['name']+'.json')
