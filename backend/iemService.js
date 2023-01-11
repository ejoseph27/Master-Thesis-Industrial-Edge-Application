const { post, get } = require("./http");

const apiPath = `/portal/api/v1`;
//const apiPathProjectList = '/developer-applications'

// Function to fetch login credentials and login to IEM service

module.exports.login =(url,username, password) => {
    //console.log('login');

    return new Promise((resolve, reject) =>
        post(`${url}/${apiPath}/login/direct`,{ username, password })
            .then (async (resp) => { if (resp.status === 200) {
                //console.log("sucess");
            
                return resp.json();                                                 // convert the response to a json
                } else {
                   // console.log("fail");
                throw await resp.json()
                }    
            })
            .then(json => resolve(json.data))
            .catch(err => reject(err.errors)));
}

// method to get project list by passsing get request from client UI

module.exports.getProjectList=(url,token)=>{
     const promise = new Promise((resolve,reject)=>
     get(`${url}/${apiPath}/developer-applications`,token)
     .then(async (resp)=>{ if (resp.status === 200) {
        return resp.json();                                                 // a promise is returned                         
        } else {                                                            //How are responses handled in a promise?
        throw await resp.json()
        }    
    })
    .then(json => resolve(json.data))                                       //from the previous sucessfull promise its converted to json object
    .catch(err => reject(err.errors)));
     return promise;
}


