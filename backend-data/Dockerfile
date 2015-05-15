FROM ubuntu:14.04
WORKDIR /data
RUN apt-get update && apt-get install -y python3-pip
ADD requirements.txt /data/
RUN pip3 install -r requirements.txt
ADD storer /data/
CMD ./storer --broker broker --database ${STORER_DB}
