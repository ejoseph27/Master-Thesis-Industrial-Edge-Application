//class to represent the sign In data

export class SignInData{
    private iemUrl: string;
    private email: string;
    private password: string;
   

constructor(iemUrl: string,email: string,password:string){
// assiging the class variable to the constructor method

    this.iemUrl=iemUrl;
    this.email = email;
    this.password=password;

}

// getter function since properties are private

getIemUrl():string{
    return this.iemUrl;
}
getEmail():string{
    return this.email;
}
getPassword():string{
    return this.password;
}


}