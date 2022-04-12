//Function to get data from strapi
async function getDataFromStrapi() {
    //Url from strapi to get access to products api
    let url = "http://localhost:1337/api/products";

    let stringResponse = await fetch(url);
    let myObjekt = await stringResponse.json();

    console.log(myObjekt);

    let output = "";

    //Checking if one more objects get fetched
    if (Array.isArray(myObjekt.data)){

        //for each loop for all objects in array
        myObjekt.data.forEach(element => {
            
            let obj = element.attributes;

            //Output string
            output += `<div>
                            <h1>${obj.title}</h1>
                            <img src=${obj.image} alt="" srcset="">
                            <p>${obj.description}<p>
                            <h3>${obj.price} SEK</h3>

                        </div>`; 
            output += generateButton(obj, element.id, false);
        });
    } else {
        let obj = myObjekt.data.attributes;

        //Output string
        output += `<div>
                        <h1>${obj.title}</h1>
                        <img src=${obj.image} alt="" srcset="">
                        <p>${obj.description}</p>
                        <h3>${obj.price} SEK</h3>
                    </div>`; 
        output += generateButton(obj, myObjekt.data.id, false);
    }
    
    //outputs string to div
    document.getElementById("cactusFetched").innerHTML = output;
}

//function to get token from user
async function getToken() {

    let valid = true;

    //Validate username and password!
    if ( !validateLogin() ) valid = false;

    if (!valid) return null;

    //Url to strapi user list
    const urlUser = "http://localhost:1337/api/auth/local/";

    const user = document.getElementById("user").value;
    const pass = document.getElementById("pass").value;

    //Create a object of the username and password filled into the inputfield
    let userObject = {
        identifier : user,
        password : pass
    }

    //call API with login data.
    let userResponse = await fetch(urlUser,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userObject)
    });

    // API response JSON string
    let userJson = await userResponse.json();
    console.log(userJson);

    //Controls if object has Token
    if (userJson.jwt) return userJson.jwt;
    else {
        //login error message

        document.getElementById("userError").innerText = "Invalid password or username";

        return null;
    }
}

async function postData() {

    //calls on GetToken() to get login key
    let token = await getToken();
    if (!token) return;

    //url to strapi products "collection"
    const urlCactus = "http://localhost:1337/api/products/";

    // Hämtar data från fält
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    //Create an object with data included
    let cactusObjekt = {
        data : {
            title : title,
            description : description,
            price : price,
            image : image
        }
    };

    //call api with cactusObjekt
    let cactusResponse = await fetch(urlCactus,
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + token 
        },
        body: JSON.stringify(cactusObjekt)
    });

    let cactusJson = await cactusResponse.json();

    console.log(cactusJson);
}

//fuctions for username and password validation
//validation User Input
function userValidate(comp) {

    let valid = true;

    if (comp.value.length == 0) {
        //failed validation

        valid = false;
    }

    //checks if validation was successful
    if (!valid) {
        document.getElementById("userError").innerText = "Du måste fylla i ett användarnamn!";
        return false;
    } else {
        document.getElementById("userError").innerText = "";
        return true;
    }
}

//validation Password input
function passValidate(comp) {
    // checks if password is 5 characters or more 

    let valid = true;

    if (comp.value.length <= 4) {
        //failed validation
        valid = false;
    }

    //check if validation was successful
    if (!valid) {
        document.getElementById("passwordError").innerText = "Lösenordet måste vara minst 5 tecken långt!";
        return false;
    } else {
        document.getElementById("passwordError").innerText = "";
        return true;
    }
}

//function to check validation of login attempt 
function validateLogin() {
    let valid = true;

    //Validate username
    if (!userValidate(document.getElementById("user"))) {
        valid = false;
    }

    //Validate password
    if (!passValidate(document.getElementById("pass"))) {
        valid = false;
    }

    return valid;
}



function generateButton(obj, objId, header) {

    let output = "";

    //Create delete button and update button
    if (!header) {
        //URL for the object
        let postURL = `http://localhost:1337/api/products/${objId}`;

        output += `<td><button onclick="updatePost('${postURL}');">Update Post</button></td>`;
        output += `<td><button onclick="deletePost('${postURL}');">Delete Post</button></td>`;
    }
    return output;
}

async function updatePost(url) {

    //call Token from GetToken()
    // if no token is returned, cancel function
    let token = await getToken();
    if (!token) return;

    // get data from inputfield
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    //create object
    let cactusObjekt = {
        data : {}
    };

    
    if (title) cactusObjekt.data["title"] = title;
    if (description) cactusObjekt.data["description"] = description;
    if (price) cactusObjekt.data["price"] = price;
    if (image) cactusObjekt.data["image"] = image;


    await fetch(url,
    {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization" : "Bearer " + token 
        },
        body: JSON.stringify(cactusObjekt)
    });

    // next time "GetDataFromStrapi" gets called it shows updated data
    await getDataFromStrapi();
}

async function deletePost(url) {

    //call Token from GetToken()
    // if no token is returned, cancel function
    let token = await getToken();
    if (!token) return;

    //api call
    await fetch(url,
        {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + token 
            }
        });

     // Next time "GetDataFromStrapi" gets called it shows all the non deleted cactuses
    await getDataFromStrapi();

}