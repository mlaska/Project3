d3.json("data/AllRecipes.json").then((data)=> {
    
    var recipe_names = data.map(l => l.recipe.label);
    

    $(function(){
        $("#input").autocomplete({
            source: recipe_names
        });
        console.log(recipe_names)
    });
});



