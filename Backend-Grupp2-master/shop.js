
//Function to fetch from strapi api onClick
async function getDataFromStrapi(){

    let url = "http://localhost:1337/api/products"

    let stringResponse = await fetch(url);
    let myObject = await stringResponse.json();

    console.log(myObject.data)

    let output = "";
    //Check if its 1 or more objects
    if(Array.isArray(myObject.data)){
           // Create a forEach loop for all elements in data array

    myObject.data.forEach(element => {
        let attr = element.attributes;
                
        //create output
        output += `<div>
                        <h1>${attr.title}</h1>
                        <img src=${attr.image} alt="" srcset="">
                        <p>${attr.description}</p>
                        <h3>${attr.price} SEK</h3>
                    </div>`; 
    });
    } else{
        let obj = myObject.data.attributes;
        for(x in obj){
            console.log(x + ": " + obj[x]) 
        }
        output += `<div>
                        <h1>${attr.title}<h1>
                        <h2>${attr.description}</h2>
                        <h3>${attr.price} SEK</h3>
                        <img src=${attr.image} alt="" srcset="">
                    </div>`;

    }

    document.getElementById("cactusFetch").innerHTML = output;
}
getDataFromStrapi()