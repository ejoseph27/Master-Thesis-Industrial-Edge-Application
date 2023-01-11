

# Set envriroment variables 
while getopts u:n:p:a:c:f: flag

do 
	case "${flag}" in 
		u) IE_URL=${OPTARG};;
		n) IE_USER=${OPTARG};;
		p) IE_PASSWORD=${OPTARG};;
		a) APP_ID=${OPTARG};;
		c) COMPOSE_PATH=${OPTARG};;
		f) FLOW_PATH=${OPTARG};;
		
		esac
done
echo "Url:$IE_URL";
echo "Username:$IE_USER";
echo "Pass:$IE_PASSWORD";
echo "AppID:$APP_ID";
echo "Compose-path:$COMPOSE_PATH";
echo "FLOW-PATH:$FLOW_PATH";


#docker kill $(docker ps -q)

#docker rm $(docker ps -a -q)

#docker compose up -d

#FLOW_PATH_NO_WHITESPACE="$(echo ${FLOW_PATH} | tr -d '[:space:]')"
# Z command
docker compose build --build-arg FPATH="$FLOW_PATH_NO_WHITESPACE"

docker compose create

docker compose start




# List IE Publisher CLI version 
ie-app-publisher-linux -V

# Workspace initialization
echo "**********************INIT WORKSPACE*****************************"

mkdir workspace 

cd workspace 

ie-app-publisher-linux ws i

echo "**********************WORKSPACE INITIALIZED*****************************"

# Connection to docker engine 
echo "*****************************CONNECTING TO DOCKER ENGINE*********************************"
export IE_SKIP_CERTIFICATE=true # DO THIS IN TRUSTED ENVIROMENT ONLY!

ie-app-publisher-linux de c -u https://192.168.6.169:2375
ie-app-publisher-linux de c -u http://localhost:2375

echo "**********************DOCKER ENGINE CONNECTED*****************************"

# Portal login

echo "*****************************IEM LOGIN***********************************"

export IE_SKIP_CERTIFICATE=true # DO THIS IN TRUSTED ENVIROMENT ONLY! 

ie-app-publisher-linux em li -u $IE_URL -e $IE_USER -p $IE_PASSWORD


echo "**********************LOGGED-IN TO IEM*****************************"

echo "**********************UPLOAD APPLICATION TO IEM****************************"



inp=$(ie-app-publisher-linux em app dt -a $APP_ID -p)



echo "-----------------------------------------UPLOAD APP TO IEM------------------------------------------------"

# application version management
version=$(ie-app-publisher-linux em app dt -a $APP_ID -p | \
        python3 -c "import sys, json; print(json.load(sys.stdin)['versions'][0]['versionNumber'])")
        
        

echo "checking for version"

if [ -z "$version" ]
then
    version_new=0.0.1
    echo 'New application created with version: '$version_new
else
    echo 'old Version: '$version
    version_new=$(echo $version | awk -F. -v OFS=. 'NF==1{print ++$NF}; NF>1{if(length($NF+1)>length($NF))$(NF-1)++; $NF=sprintf("%0*d", length($NF), ($NF+1)%(10^length($NF))); print}')
    echo 'new Version: '$version_new
fi


# Create and upload application version to IEM 


ie-app-publisher-linux em app cuv -a $APP_ID -v $version_new -y $COMPOSE_PATH -r '' -s 'nodered' -u '1880' -t 'FromBoxSpecificPort' 

ie-app-publisher-linux em app uuv -a $APP_ID -v $version_new

#ng serve --proxy-config proxy.config.json

