#!/bin/bash -xe
apt-get install -y python-pip python-smbus python3-pip mosquitto python-dev build-essential
pip3 install -r $(dirname $0)/requirements-3.txt
pip2 install -r $(dirname $0)/requirements-2.txt
wget -O tmp006.tar.gz https://github.com/adafruit/Adafruit_Python_TMP/archive/master.tar.gz
tar xzvf tmp006.tar.gz
cd Adafruit_Python_TMP-master
python setup.py install
