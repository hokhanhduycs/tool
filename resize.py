from PIL import Image


import shutil
import os
dir ='./pano/'
out ='./pano-resize/'
os.mkdir(out)
listFolder = os.listdir(dir)
for i in listFolder:
    if(len(i) == 36):
       
        dirImg = os.listdir(f'{dir}{i}/')
        print(i)
        os.mkdir(f'{out}{i}')
        for j in dirImg:
            # print(j)
            # img = Image.open('./pano/'+i+'/thumb.jpg')  
            img = Image.open(f'{dir}{i}/{j}')  
            # print(img) 
            new_width = 512
            new_height = int(new_width * img.height / img.width )
            img = img.resize((new_width,new_height), Image.ANTIALIAS)
            img = img.convert('RGB')
            
            img.save(f'{out}{i}/{j}') 
