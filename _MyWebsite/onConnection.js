var name;
function askName(){
    //Existing user ?
    name = localStorage.getItem("username");
    if (name == "null"){
        //New User :
        name = prompt("Hello, what is your name ?");
        //Store
        localStorage.setItem("username", name);
    } else {
        //Existing User :
        alert("Welcome back " + name + " !");
    }
}