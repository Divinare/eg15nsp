FROM ubuntu:14.04
WORKDIR /data
RUN apt-get update && apt-get install -y mosquitto
ADD mosquitto.conf /data/
CMD /usr/sbin/mosquitto -c /data/mosquitto.conf
EXPOSE 1883
ENV LANG C.UTF-8
