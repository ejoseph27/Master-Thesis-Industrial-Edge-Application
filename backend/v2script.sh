while getopts  a:n:w:e:p:r:i:y:t:u:s:c:z: flag

do 
	case "${flag}" in 
        a) APP_NAME=${OPTARG};;
        n) APP_ID=${OPTARG};;
        w) VERSION=${OPTARG};;
        e) APP_IMAGE=${OPTARG};;
        p) APP_DESCRIPTION=${OPTARG};;
        y) COMPOSE_PATH=${OPTARG};;
        r) APP_REPOSITORY=${OPTARG};;
        i) APP_ICON=${OPTARG};;
        t) REDIRECT_TYPE=${OPTARG};;
        u) REDIRECT_URL=${OPTARG};;
        s) REDIRECT_SECTION=${OPTARG};;
        c) LOG=${OPTARG};;
        z) REST_URL=${OPTARG};;
		#f) FLOW_PATH=${OPTARG};;
		esac
done

echo "APP-Name:$APP_NAME";
echo "APP-ID:$APP_ID";
echo "VERSION:$VERSION";
echo "APP_IMAGE:$APP_IMAGE";
echo "APP_DESCRIPTION:$APP_DESCRIPTION";
echo "COMPOSE-PATH:$COMPOSE_PATH";
echo "APP_REPOSITORY:$APP_REPOSITORY";
echo "APP_ICON:$APP_ICON";
echo "REDIRECT_TYPE:$REDIRECT_TYPE";
echo "REDIRECT_URL:$REDIRECT_URL";
echo "APP_ICON:$REDIRECT_SECTION";
echo "REDIRECT_TYPE:$LOG";
echo "REDIRECT_URL:$REST_URL";


CONTAINER_PATH_NO_WHITESPACE="$(echo ${APP_ID} | tr -d '[:space:]')"
#echo "FLOW-PATH:$FLOW_PATH";
cd ./containerWorkspace/containerCollection/"$CONTAINER_PATH_NO_WHITESPACE"

docker compose up -d
#docker save -o $APP_IMAGE.tar $APP_IMAGE


echo "**********************INIT WORKSPACE*****************************"
mkdir -p workspace 
iectl config add publisher --name "publisherdev"  --workspace workspace -u http://host.docker.internal:2375  #  http://127.0.0.1:2375   

iectl publisher workspace init
# IECTL environmental variables
export IE_SKIP_CERTIFICATE=true
export EDGE_SKIP_TLS=1

echo "-----------------------------------------Create .app file using tar------------------------------------------------"
#iectl publisher edgemanagement login -u $URL -e $EMAIL -p $PASS 
#iectl publisher standaloneapp create --reponame $APP_REPOSITORY --appdescription $APP_DESCRIPTION  --iconpath $APP_ICON --appname $APP_NAME  
#iectl publisher standaloneapp createversion  --appname $APP_NAME  -c "initial"  -y $COMPOSE_PATH  -s $REDIRECT_SECTION -t $REDIRECT_TYPE -u $REDIRECT_URL -r "" -j "{\"nodered\":\""$COMPOSE_PATH"/"$APP_ID".tar\"}" -w "0.0.1" 




echo "-----------------------------------------Create .app file------------------------------------------------"
iectl publisher sa cae -a $APP_NAME --appid $APP_ID -w $VERSION -e $APP_IMAGE -p $APP_DESCRIPTION -r $APP_REPOSITORY -i $APP_ICON -y $COMPOSE_PATH -t $REDIRECT_TYPE -u $REDIRECT_URL -s $REDIRECT_SECTION -c $LOG -z '$REST_URL' -v

docker kill $APP_NAME
docker rm $APP_NAME
#cd ..
#rm -r $APP_ID
#iectl publisher sa cae -a "Nodered_33099"  --appid "18a3710106944a4cbb3201f407a68742" -w "0.0.1" -e "/usr/src/app/containerWorkspace/containerCollection/18a3710106944a4cbb3201f407a68742" -p "Deplo" -y "/usr/src/app/containerWorkspace/containerCollection/18a3710106944a4cbb3201f407a68742/docker-compose.prod.yml" -r "18a3710106944a4cbb3201f407a68742" -i "/usr/src/app/appicon/icon.png" -t "FromBoxSpecificPort" -u "1880" -s "nodered" -c "change" -z " "