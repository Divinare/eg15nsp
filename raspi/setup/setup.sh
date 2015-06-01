apt-get install -y python-pip python-smbus python3-pip mosquitto
pip3 install -r $(dirname $0)/requirements-3.txt
pip2 install -r $(dirname $0)/requirements-2.txt
