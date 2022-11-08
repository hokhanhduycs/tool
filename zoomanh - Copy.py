from PIL import Image


import shutil
import os
dm = os.listdir('./pano')
for i in dm:
    img = Image.open('/i/thumb.jpg')  
    print(img) 
    # new_width = 300
    # new_height = int(new_width * img.height / img.width )
    # img = img.resize((new_width,new_height), Image.ANTIALIAS)
    # img = img.convert('RGB')
    # img.save('thumb.jpg') 
