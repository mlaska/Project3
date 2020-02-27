//Global variables
window.origWeights = [];
window.multiplier = [];
window.nameList = [];
window.origValue = [];
window.yValue = [];
window.yAxis = 0;
window.yPos = [];
window.sizeRef = 0;


d3.select("#buttons").on("click", graphicChanged);

//Get ingredients info from seperate database

function findIngredients(varZ)
{
  //List of ingredients from recipe Object(varZ from optionChanged function)
  recipeList = varZ.recipe.ingredientLines;

  //console.log("findIngredients recipeList", recipeList[2]);

  //Empty list of dictionaries to store ingredients' nutrition data
  ingDict = [];

//Loops through each ingredient in recipeList, finds recipe in ingredient database,
//  adds ingredient nutrition object to list ingDict
  d3.json("data/AllIngredients.json").then((data) => {
    
    dataArray = data;
    //console.log("AllIngredients", data);
    for(i=0; i < recipeList.length; i++) {

      try {
      var data_filter = dataArray.filter( element => element.Orig_name ==recipeList[i].substring(0,76));
      ingDict.push(data_filter);
      }
      catch(err) {
        console.log("Failed to match ", recipeList[i]);
      }
    }
    //console.log("IngDict", ingDict);
     //List of ingredient weights (to be used for multiplier ratio)
     origWeights = [];
     for(i=0; i < ingDict.length; i++) {
        
      try{
         origWeights.push(ingDict[i][0].info.totalWeight);
      }
      catch(err) {
        window.alert("Incomplete Ingredients Data...select different recipe");
      }
     }

    //console.log("findIngredients ingDict", ingDict);
    //console.log("origWeights", origWeights);

    createIngredientsEdit();
    initChart();
    //Pass through ingDict to be used in other functions
    return ingDict;
    
    }); 
}; 

function createIngredientsEdit()
{
  //Ingredient list with key value pairs "name" : name, "weight": weight 
  var listDropdown = [];

  for(i=0; i < ingDict.length; i++) {
    
    try {
    var loopDict = {"name": ingDict[i][0].name, "weight": ingDict[i][0].info.totalWeight}
    listDropdown.push(loopDict);
    }
    catch(err) {
      window.alert("Complete recipe info coming soon...choose a different one! ", err);
      break;
    }
  };
 
  
  //enter update exit to populate Ingredient Info table (with text boxes!)
  PANEL = d3.select("#ingredient-metadata").selectAll("form")
            .data(listDropdown);

  PANEL.enter()
  .append("form")
  .attr("class", "form-control2")
  .merge(PANEL)
  .each(function(d,i) {

    SUBPANEL = d3.select(this);
    SUBPANEL.enter().append("h6")  //nested enter append #1
    .merge(SUBPANEL)
    .text(d.name);
    SUBPANEL.exit()
    .remove();
    SUBPANEL.append("input")   //nested enter append #2
    .merge(SUBPANEL)
    .attr("class", "form-control3")
    .attr("id", i) 
    .attr("name", "ingredient-form")
    .attr("type", "text")
    .attr("value", Math.round(parseFloat(d.weight)));
    SUBPANEL.exit()
    .remove();
    
    });
  PANEL.exit()
  .remove();
}

//Initial bubble chart.  Called only once
function initChart()
{
    
    var calorieInit = []; 
    nameList = [];
    //Generate lists for graph 
    for(i=0; i <ingDict.length; i++) {
        try {
            var cal = ingDict[i][0].info.totalNutrients.ENERC_KCAL.quantity;
            calorieInit.push(cal);
            }
            catch(err) {
               // console.log("No calorie info for ",ingDict[i][0].name, "pushed 0");
                calorieInit.push(0);
            }
        var name = ingDict[i][0].name;
            nameList.push(name); 
    }
    //console.log("Initial chart values", calorieInit);
   
    //sizeList adjusted bubble size for asthetics
    var sizeList = calorieInit.map(x =>x * 1.0);  //irrelevant now, using sizeref...
    
    var bubble_chart = {
        type: "scatter",  
        mode: "markers",
        x: nameList,
        y: calorieInit,
        text: calorieInit.map(x => x.toFixed(2)), 
        marker: {
        color: [70, 10, 20, 0, 18, 30 ,94, 1],
        colorscale: "Jet",
        cmin: 0,
        cmax: 30,
        size: sizeList,
        sizemode: 'area',
        sizeref: 2.*(Math.max(...sizeList))/(200.**2),
        sizemin: 4
        }
    };
    
    //Save size ref as gloabl value for graph changed functions
    sizeRef = bubble_chart.marker.sizeref;

    var bubble_data = [bubble_chart];

    var bubble_layout = {
        title: "Ingredient Calories (g)", 
        margin: {t : 20, b : 90 }, 
        hovermode: "closets",
        xaxis: { title: "Ingredients"}, 
        yaxis: { title: "Inital Amount"},
        margin: {t : 50, b : 90},
        font: { color: "green", family: "Arial", size:9},
    };

    //Plot inital bubble chart
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    //store values for global variables yPos yAxis and yValue (to use in update functions)
    var plot = document.getElementById("bubble");
   // console.log("plot info", plot.data);

    yPos = [];  //resets yPos list to zero (ycoordinate for each bubble)
    for(i=0; i < ingDict.length; i++) {
        var yCord = plot.data[0].y[i];
        yPos.push(yCord);
    }
    
    yAxis = plot.layout.yaxis.range[1];
    yValue = calorieInit;
    origValue = calorieInit;

}

// Call amountsChanged() when "Submit Updated Amounts" button clicked (onclick in HTML)

function amountsChanged()
{
  //JQuery!!!
  var newWeights = [];
  $("input[name='ingredient-form']").each(function() {
  newWeights.push($(this).val());
  });

 // console.log("New weights",newWeights);
 // console.log("Orig weights", origWeights);
  
  //multiplier to adjust mutrition info based off ingredient amount change
  multiplier = [];
  for(i=0;i<origWeights.length;i++) {
    if (origWeights[i] != 0)  {  
        var x = newWeights[i]/origWeights[i];
        multiplier.push(x);
        }

    else {multiplier.push(1);
        }
    }
   // console.log("multiplier", multiplier);

    updatePlot();
}


function updatePlot()
{
    // console.log("yValue before change", yValue)
    var newY = [];
    //Recalculate graph amounts by multiplier array
    for (i=0; i < origValue.length; i++){
      var x = origValue[i]*multiplier[i];
      newY.push(x);
    }
    //    console.log("new values", newY);

    var newText = newY.map(x => `Adjusted value ${x.toFixed(2)}`);
    var newSize = newY.map(x =>x * 1.0);        //irrelevant now using sizeref
    var newMarker = {
        color: [70, 10, 20, 0, 18, 30 ,94, 1, 80,97, 65, 3, 22, 56, 19],
        colorscale: "Jet",
        cmin: 0,
        cmax: 30,
        size: newSize,
        sizemode: 'area',
        sizeref: sizeRef,
        // sizeref: 2.*(Math.max(...newSize))/(200.**2),
        sizemin: 4
        };

    var newLayout = {
        yaxis: { title: "Amount", range: [0,yAxis]},
    };
   
    Plotly.restyle("bubble", "y", [yPos]); //could change back to newY
    Plotly.restyle("bubble", "text", [newText]);
    Plotly.restyle("bubble", "marker", [newMarker]);
    Plotly.relayout("bubble", newLayout)
    
}

//Generate "change bubble plot" buttons
var buttonList = ["Calories", "Fat", "Protein", "Sodium"];

d3.select("#buttons").selectAll("button")
  .data(buttonList)
  .enter()
  .append("button")
  // .attr("id", "button")
  // .attr("type", "button")
  .attr("class", "btn btn-default")
  // .attr("name", "graph buttons")
  .property("value", function(d){return d;})
  .text(function(d){return d;})
  .exit()
  .remove();


function graphicChanged() {
    
    //Generate multiplier list if one does not exist
    if (multiplier.length == 0) {

        for (i=0; i < ingDict.length; i++){
            multiplier.push(1);}
    }
    if (multiplier.length != ingDict.length) {
      for (i=0; i < ingDict.length; i++){
        multiplier.push(1);}
    }

    var calList = [];
    var protList = [];
    var fatList = [];
    var sodList = [];
  
    for(i=0; i <ingDict.length; i++) {

        try {
        var cal = ingDict[i][0].info.totalNutrients.ENERC_KCAL.quantity;
        calList.push(cal);
            }
        catch(err) {
            console.log("error in Calories for ",ingDict[i][0].name, "pushed 0");
            calList.push(0);
            }
        try {
            var prot = ingDict[i][0].info.totalNutrients.PROCNT.quantity;
            protList.push(prot);
            }
        catch(err) {
        console.log("error in Protein for ",ingDict[i][0].name, " pushed 0");
            protList.push(0);
            }
        try {
            var fat = ingDict[i][0].info.totalNutrients.FAT.quantity;
            fatList.push(fat);
            }
        catch(err) {
                console.log("error in Fat for ",ingDict[i][0].name, "pushed 0");
                fatList.push(0);
            }
        try {
            var sod = ingDict[i][0].info.totalNutrients.NA.quantity;
            sodList.push(sod); 
            }
        catch(err) {
                console.log("error in Sodium for ",ingDict[i][0].name, " pushed 0");
                sodList.push(0);
            }
    }

    // console.log("all graphs lists1", calList, fatList, protList, sodList);
   // console.log("multiplier current", multiplier);

    //Apply multiplier to new nutrition list
    var calList2 = [];
    var fatList2 = [];
    var protList2 = [];
    var sodList2 = [];

    for (i=0; i <ingDict.length; i++){
        var c = calList[i]*multiplier[i];
          calList2.push(c);
        var f = fatList[i]*multiplier[i];
          fatList2.push(f);
        var p = protList[i]*multiplier[i];
          protList2.push(p);
        var s = sodList[i]*multiplier[i];
          sodList2.push(s);
    };

    // console.log("all graphs lists2", calList2, fatList2, protList2, sodList2);

    //Captures which button was pushed by it's name
    var buttonValue = event.target.value;
    
    //switch-case function to determine which list of data to graph
    switch(buttonValue) {

      case "Calories": 
        newList = calList2;
        newTitle = "Ingredient Calories (g)";
        origValue = calList;
        break;

      case "Fat":
        newList = fatList2;
        newTitle = "Ingredient Fat (g)";
        origValue = fatList;
        break;
      
      case "Protein":
        newList = protList2;
        newTitle = "Ingredient Proteins (g)";
        origValue = protList;
        break;

      case "Sodium":
        newList = sodList2;
        newTitle = "Ingredient Sodium (mg)";
        origValue = sodList;
        break;

      default:
        console.log("Bad button, no nutrition data to graph");
    }

   // console.log("List for",buttonValue, newList);
    
    //sizeList adjusted bubble size for asthetics
    var sizeList = newList.map(x =>x * 1.0);    //irrelevant now using sizeref

    var bubble_chart = {
        type: "scatter",
        mode: "markers",
        x: nameList,
        y: newList,  //was newList
        
        marker: {
        color: [70, 10, 20, 0, 18, 30 ,94, 1, 80,97, 65, 3, 22, 56, 19],
        colorscale: "Jet",
        cmin: 0,
        cmax: 30,
        size: sizeList,
        sizemode: 'area',
        sizeref: 2.*(Math.max(...sizeList))/(200.**2),
        sizemin: 4
        }
    };
  
    //Save size ref as gloabl value for graph changed functions
    sizeRef = bubble_chart.marker.sizeref;

    var bubble_data = [bubble_chart];
    
    var bubble_layout = {
        title: newTitle, 
        margin: {t : 20}, 
        hovermode: "closets",
        xaxis: { title: "Ingredients"}, 
        yaxis: { title: "Initial Amount"},
        margin: {t : 50, b : 40},
        font: { color: "green", family: "Arial", size:9},
    };
  
    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    //store values for global variables yAxis and yValue (to use in update functions)
    var plot = document.getElementById("bubble");

    yPos = [];
    for(i=0; i < ingDict.length; i++) {
        var yCord = plot.data[0].y[i];
        yPos.push(yCord);
    }
    yAxis = plot.layout.yaxis.range[1];
    yValue = newList;
   // console.log("yValue after button click", yValue);
//   console.log("yPos for ", buttonValue, yPos);
//   console.log("yAxis for ", buttonValue, yAxis);
}