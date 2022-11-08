from PIL import Image


import shutil
import os
dm = os.listdir('./pano/img1/')
for i in dm:
    img = Image.open('./pano/'+i+'/thumb.jpg')  
    print(img) 
    new_width = 300
    new_height = int(new_width * img.height / img.width )
    img = img.resize((new_width,new_height), Image.ANTIALIAS)
    img = img.convert('RGB')
    img.save('./pano/'+i+'/thumb.jpg') 
