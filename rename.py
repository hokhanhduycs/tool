import os
dir = './pano/'
list_d = os.listdir(dir)
for item in list_d:
    if(' copy.jpg' in item):
        # os.remove("demofile.txt")
        ten = item.replace(' copy.jpg', '.jpg')
        os.rename(dir+item, dir+ten)
