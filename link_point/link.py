
import json
dir = './ecolakes/vn/'
control_link = open('link.json')
data_control_link = json.load(control_link)

for item_link in data_control_link:
    file_link = open(dir +item_link+'.json')
    data_file_link = json.load(file_link)
    
    # print("==================")
    data_file_link["links"] = []
    for item_list_link in data_control_link[item_link]:
        
        file_list_link = open(dir + item_list_link+'.json')
        data_file_list_link = json.load(file_list_link)
        
        data ={}
        data["name"] = data_file_list_link["name"]
        data["pos"] = data_file_list_link["pos"]
        data['type'] = 3
        data_file_link["links"].append(data)
    print(item_list_link)
    with open(dir +item_link+'.json', 'w') as outfile:
        json.dump(data_file_link, outfile)