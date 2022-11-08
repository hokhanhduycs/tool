import json
dir = './scene/'
scenes = ['1', '2', '3']
names = ['r2_ground_']
file = open(f'{dir}requestcapture.json')
data_file = json.load(file)

for i in range(len(scenes)):
    # print (scenes[i])
    # print (names[i])
    scene_file = open(f'{dir}mau.json')
    scene = json.load(scene_file)
    scene['map']['path'] = f'/scene/{scenes[i]}.png'
    for data in data_file['reject']['data']:
        # if(names[i] in data['name']):
        point = {}
        point['name'] = data['name']
        point['fullname'] = data['name']
        point['pos'] = data['pos']
        scene['points'].append(point)
    # print(scene['points'])
    with open(dir +scenes[i]+'.json', 'w') as outfile:
        json.dump(scene, outfile)
# for item_link in data_control_link:
#     file_link = open(dir +item_link+'.json')
#     data_file_link = json.load(file_link)
    
#     # print("==================")
#     data_file_link["links"] = []
#     for item_list_link in data_control_link[item_link]:
        
#         file_list_link = open(dir + item_list_link+'.json')
#         data_file_list_link = json.load(file_list_link)
        
#         data ={}
#         data["name"] = data_file_list_link["name"]
#         data["pos"] = data_file_list_link["pos"]
#         data['type'] = 3
#         data_file_link["links"].append(data)
#     print(item_list_link)
#     with open(dir +item_link+'.json', 'w') as outfile:
#         json.dump(data_file_link, outfile)