from PIL import Image


import shutil
import os
dir ='./pano/'
listFolder = os.listdir(dir)

for j in listFolder:
    if ('.jpg' in j):
        # print(j)
        # img = Image.open('./pano/'+i+'/thumb.jpg')  
        img = Image.open(f'{dir}/{j}')  
        # print(img) 
        new_width = 16384
        new_height = int(new_width * img.height / img.width )
        img = img.resize((new_width,new_height), Image.ANTIALIAS)
        img = img.convert('RGB')
        img.save(f'{dir}{j}') 
