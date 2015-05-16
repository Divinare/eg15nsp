FROM ubuntu:14.04
WORKDIR /data
RUN apt-get update && apt-get install -y python3-pip
ADD requirements.txt /data/
RUN pip3 install -r requirements.txt
ADD collector /data/
CMD ./collector --broker broker --interval 30 --mock 1
ENV LANG C.UTF-8
