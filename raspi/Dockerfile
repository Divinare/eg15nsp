FROM ubuntu:14.04
WORKDIR /data
ADD requirements-3.txt /data/
ADD requirements-2.txt /data/
RUN apt-get update && sh setup.sh
ADD collector /data/
ADD grove/ /data/
CMD ./collector --broker broker --interval 30 --mock 1
ENV LANG C.UTF-8
