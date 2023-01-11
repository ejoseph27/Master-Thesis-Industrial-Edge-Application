
FROM nodered/node-red
WORKDIR /usr/src/node-red
USER root
RUN mkdir -p /usr/src/node-red
RUN chmod -R 777 /data

#ARG FPATH 


#RUN echo $FPATH

RUN mkdir ./file_system
RUN mkdir ./file_system/char_count   
RUN mkdir ./file_system/double_number   


#COPY ["./custom_nodes/char_counts", "./file_system/char_count"]   
#COPY ["./custom_nodes/doublenumber", "./file_system/double_number"]

#COPY ["./settings.js", "/usr/src/node-red/node_modules/node-red"]        
RUN cd file_system

#RUN npm update
#RUN npm install ./file_system/char_count
#RUN npm install ./file_system/double_number



#COPY  $FPATH ./



EXPOSE 1880

#ENV FLOWS=flow1.json
ENV NODE_PATH=/usr/src/node-red/node_modules:/data/node_modules

ENTRYPOINT [ "./entrypoint.sh" ] 





















