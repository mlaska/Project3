window.yesCount = 0;
window.totalCount = 0;


//name this a function? function initImages()---------------------------------------------

d3.json("data/gameRecipes.json").then((data) => {

    //Generate list of random index numbers
    var randomMax = data.length
    
    // randomly generated N = 6 length array 
    indexList = Array.from({length: 6}, () => 
            Math.floor(Math.random() * randomMax));

    //Create array of recipe objects picked from the random index
    var randomData =[]
    
    for (i=0; i<indexList.length; i++){
        randomData.push(data[indexList[i]])
    }
    
    console.log(randomData[0].recipe.image)

    var img = document.createElement('img'); 
    img.src =  randomData[0].recipe.image;
    document.getElementById('box0').appendChild(img); 
      
    var img1 = document.createElement('img'); 
    img1.src =  randomData[1].recipe.image;
    document.getElementById('box1').appendChild(img1); 

    var img2 = document.createElement('img'); 
    img2.src =  randomData[2].recipe.image;
    document.getElementById('box2').appendChild(img2); 
      

    var img3 = document.createElement('img'); 
    img3.src =  randomData[3].recipe.image;
    document.getElementById('box3').appendChild(img3); 
    
    var img4 = document.createElement('img'); 
    img4.src =  randomData[4].recipe.image;
    document.getElementById('box4').appendChild(img4); 
       
    var img5 = document.createElement('img'); 
    img5.src =  randomData[5].recipe.image;
    document.getElementById('box5').appendChild(img5); 
        
})//---------------------------------------------------------------------

//onClick model predict!

d3.selectAll(".image").on("click", initPredict);

function initPredict() {

    var clicked = event.target.src;
    var recipeObject = []
    d3.json("data/gameRecipes.json").then((data) => {

        //filters entire recipe list to grab the one that was clicked
        recipeObject = data.filter(d => d.recipe.image == clicked)

        var x = [] //list of values (X1, X2, X3...)

        //Generates x list. If nutrition value doesnt exist for recipe, enter a 0
        try{
            x.push(recipeObject[0].recipe.totalNutrients.ENERC_KCAL.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.FAT.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.FASAT.quantity )
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.FATRN.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.FAMS.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.FAPU.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.CHOCDF.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.FIBTG.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.SUGAR.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.PROCNT.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.CHOLE.quantity)
        }
        catch{
            x.push(0)
        }
        try{
            x.push(recipeObject[0].recipe.totalNutrients.NA.quantity)
        }
        catch{
            x.push(0)
        }
        
        //Standardize data by dividing nutrition values by the yield(servings) 
        newX = x.map(d => d / recipeObject[0].recipe.yield);
        
        modelPredict(newX);

    })
//------------------------------------------------------------------------------
    function modelPredict(newX) {

        //Check which model to use
        var modelName = d3.select("#selDataset").property("value") 
        console.log("model", modelName) 

        if (modelName == "david") {
            //model equation 1
            d3.json("models/davidModel2.json").then((model)=> {

                // logistic regression equation = 
                // e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
                var coeffs = model.coefficients; //list of coefficients (B1, B2, B3...)
                var inter = model.intercept  // intercept B0
            
                //Calculate (B1X1 + B2X2 + B3X3...BnXn)
                var BX_total = 0

                for(i=0; i < newX.length; i++) {

                    BX_total = coeffs[i]*newX[i] + BX_total

                }
                
                // P = e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
            var exp_total = +inter + +BX_total 
            
            var predict = Math.exp(exp_total) /(1+Math.exp(exp_total))
            var recipeName = recipeObject[0].recipe.label
            // if P >= 0.5 then recipe is healthy. else if p < 0.5 then recipe unhealthy
            

            if (predict >= 0.5) {
                swal("Yes!", `${recipeName} is HEALTHY`, "success");
                totalCount += 1;
                yesCount += 1;

                if (yesCount == 3) {
                    swal("Yes and You Win!", `${recipeName} is HEALTHY. Refresh page for more!`, "success");
                    yesCount = 0;
                    totalCount = 0;
                }
                if(totalCount == 6) {
                    swal("Yes!...but", `${recipeName} is the last recipe. Refresh page for more!`, "info")
                    yesCount = 0;
                    totalCount = 0;
                }

            }
            else{
                swal("No...", `${recipeName} is UNHEALTHY`, "error");
                totalCount += 1;

                if(totalCount == 6) {
                    swal("No...and", "These recipes are no good. Refresh page for more!", "info")
                    yesCount = 0;
                    totalCount = 0;
                }
            }
            
            console.log("David predict", recipeName, predict)
            console.log(totalCount, yesCount)
            })
        }
        
        if (modelName == "cindy") {
            //model equation 1
            d3.json("models/cindyModel.json").then((model)=> {

                // logistic regression equation = 
                // e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
                var coeffs = model.coefficients; //list of coefficients (B1, B2, B3...)
                var inter = model.intercept  // intercept B0
            
                //Calculate (B1X1 + B2X2 + B3X3...BnXn)
                var BX_total = 0

                for(i=0; i < newX.length; i++) {

                    BX_total = coeffs[i]*newX[i] + BX_total

                }
                
                // P = e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
            var exp_total = +inter + +BX_total 
            
            var predict = Math.exp(exp_total) /(1+Math.exp(exp_total))
            var recipeName = recipeObject[0].recipe.label
            // if P >= 0.5 then recipe is healthy. else if p < 0.5 then recipe unhealthy
            

            if (predict >= 0.5) {
                swal("Yes!", `${recipeName} is HEALTHY`, "success");
                totalCount += 1;
                yesCount += 1;

                if (yesCount == 3) {
                    swal("Yes and You Win!", `${recipeName} is HEALTHY. Refresh page for more!`, "success");
                    yesCount = 0;
                    totalCount = 0;
                }
                if(totalCount == 6) {
                    swal("Yes!...but", `${recipeName} is the last recipe. Refresh page for more!`, "info")
                    yesCount = 0;
                    totalCount = 0;
                }

            }
            else{
                swal("No...", `${recipeName} is UNHEALTHY`, "error");
                totalCount += 1;

                if(totalCount == 6) {
                    swal("No...and", "These recipes are no good. Refresh page for more!", "info")
                    yesCount = 0;
                    totalCount = 0;
                }
            }
            
            console.log("Cindy predict", recipeName, predict)
            console.log(totalCount, yesCount)
            })
        }
    }   
}
