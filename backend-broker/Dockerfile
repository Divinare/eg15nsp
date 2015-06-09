FROM ubuntu:14.04
WORKDIR /data
RUN apt-get update && apt-get install -y mosquitto
ADD mosquitto*.conf /etc/mosquitto/
RUN mkdir -p /var/run/mosquitto
CMD /usr/sbin/mosquitto -c /etc/mosquitto/mosquitto.conf
EXPOSE 1883
ENV LANG C.UTF-8
