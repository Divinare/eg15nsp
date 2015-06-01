FROM ubuntu:14.04
WORKDIR /data
RUN apt-get update
ADD setup/ /data/setup/
RUN sh setup/setup.sh
ADD . /data/
CMD ./collector --broker broker --interval 30 --mock 1
ENV LANG C.UTF-8
