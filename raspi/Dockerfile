FROM ubuntu:14.04
WORKDIR /data
RUN apt-get update
ADD setup/ /data/setup/
RUN ./setup/setup.sh
ADD . /data/
CMD ./collector --broker broker --broker-user raspi --broker-password Zi9koochiDah --interval 30 --mock 1 --debug
ENV LANG C.UTF-8
