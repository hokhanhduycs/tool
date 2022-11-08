@echo off
rmdir /S /Q tmp
echo "update new version ..."
curl http://192.168.10.200:8080/ratool/uetool/tool.zip --output tool.zip
tar -xf tool.zip
del tool.zip