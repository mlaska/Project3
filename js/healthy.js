window.result1 = '';
window.result2 = '';

function displayHealth(recipeObject)
{

    var x = [] //list of values (X1, X2, X3...)

    //Generates x list. If nutrition value doesnt exist for recipe, enter a 0
    try{
         x.push(recipeObject.recipe.totalNutrients.ENERC_KCAL.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.FAT.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.FASAT.quantity )
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.FATRN.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.FAMS.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.FAPU.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.CHOCDF.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.FIBTG.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.SUGAR.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.PROCNT.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.CHOLE.quantity)
    }
    catch{
        x.push(0)
    }
    try{
        x.push(recipeObject.recipe.totalNutrients.NA.quantity)
    }
    catch{
        x.push(0)
    }
    

    //model equation 1
    d3.json("models/davidModel2.json").then((model)=> {

        // logistic regression equation = 
        // e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
        var coeffs = model.coefficients; //list of coefficients (B1, B2, B3...)
        var inter = model.intercept  // intercept B0
       
        //Calculate (B1X1 + B2X2 + B3X3...BnXn)
        var BX_total = 0

        for(i=0; i < x.length; i++) {

            BX_total = coeffs[i]*x[i] + BX_total

        }
        
        // P = e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
       var exp_total = +inter + +BX_total 
       
       var predict = Math.exp(exp_total) /(1+Math.exp(exp_total))

       // if P >= 0.5 then recipe is healthy. else if p < 0.5 then recipe unhealthy

       if (predict >= 0.5) {
            result1 = "Recommended"
       }
       else{
           result1 = "Not Good for You"
       }
    
        console.log("David predict", result1)
        
    })

     //model equation 2
     d3.json("models/cindyModel.json").then((model)=> {

        // logistic regression equation = 
        // e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
        var coeffs = model.coefficients; //list of coefficients (B1, B2, B3...)
        var inter = model.intercept  // intercept B0
       
        //Calculate (B1X1 + B2X2 + B3X3...BnXn)
        var BX_total = 0

        for(i=0; i < x.length; i++) {

            BX_total = coeffs[i]*x[i] + BX_total

        }
        
        // P = e^(B0 + B1X1 + B2X2 + B3X3...)/1 + e^(B0 + B1X1 + B2X2 + B3X3...)
       var exp_total = +inter + +BX_total 
       
       var predict = Math.exp(exp_total) /(1+Math.exp(exp_total))

       // if P >= 0.5 then recipe is healthy. else if p < 0.5 then recipe unhealthy
        
       if (predict >= 0.5) {
           result2 = "Recommended"
           swal("Congrats!", "This recipe is Healthy", "success");
       }
       else{
           result2 = "Not Good for You"
           swal("Ehhh...", "This recipe is Unhealthy", "warning");
       }
    
        console.log("Cindy predict", result2)
    })

    
}

