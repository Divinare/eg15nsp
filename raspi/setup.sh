apt-get install -y python3-pip mosquitto
pip3 install -r $(dirname $0)/requirements-3.txt
pip install -r $(dirname $0)/requirements-2.txt
