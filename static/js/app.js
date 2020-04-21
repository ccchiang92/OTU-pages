// OTU Homework js
// Initialization function
// Load default data and plot
function init(){
    // load in sample.json
    d3.json("data/samples.json").then((data) => {
        // store data
        var IDs = data.names;
        var metaData = data.metadata;
        var sampleData= data.samples;
       
        //Add names to dropdown
        var DOM = d3.select('#selDataset')
        IDs.forEach((id,index) => {    
            var opt =  DOM.append('option');
            opt.text(id);
            opt.property("value", index)
        });

        // Init metaData
        var metaDiv = d3.select('#sample-metadata');
        metaDiv.append('p');
        var subjectData = metaData[0];
        Object.entries(subjectData).forEach((entry) =>{
            metaDiv.select('p').append('h6').text(entry[0]+': '+entry[1]);
        });

        // Init bar graph
        // From quick inspection sample values seems sorted, gonna assume it is
        // Grab first data point for default 
        var defaultSample = sampleData[0];
        // Call bar graph plotting function
        buildBar(defaultSample);

        // init bubble
        buildBubble(defaultSample);
        

  });

}

// Function to build bar chart
// @param subjectData {object} samples object from one single ID
function buildBar(subjectData){
     // Slice sorted data and reverse order
     var barValues = subjectData.sample_values.slice(0,10).reverse();
     var barLabels = subjectData.otu_ids.slice(0,10).reverse();
     var barHover = subjectData.otu_labels.slice(0,10).reverse();
     // Type Change labels to string
     barLabels = barLabels.map(label => 'OTU '+label);
     // Create trace and plot
     var trace1 = {
         type: 'bar',
         x : barValues,
         y : barLabels,
         orientation: 'h',
         text: barHover,
         marker: {
             color: 'rgb(255,25,25)',
             opacity: 0.8,
           }
     };
     var layout = {
         title: 'Top 10 OTUs of Subject '+ subjectData.id,
         xaxis: { title: "Sample Values"},
         yaxis: { title: "OTU IDs"}
       };
     var barData = [trace1];
    //  if chart exist restyle else plot new chart
     if (d3.select('#bar').text()){
        // console.log('restyle bar');
        Plotly.restyle('bar','x',[barValues]);
        Plotly.restyle('bar','y',[barLabels]);
        Plotly.restyle('bar','text',[barHover]);
        Plotly.relayout('bar','title','Top 10 OTUs of Subject '+ subjectData.id);
     }else{
        //  console.log('init bar');
         Plotly.newPlot('bar',barData,layout);
     }
}

// Function to build bubble chart
// @param subjectData {object} samples object from one single ID
function buildBubble(subjectData){
    // Store data
    var bubbleY = subjectData.sample_values;
    var bubbleX = subjectData.otu_ids;
    var bubbleColor = subjectData.otu_ids;
    var bubbleText =subjectData.otu_labels;
    // set up trace and layout
    var trace1 = {
        x: bubbleX,
        y: bubbleY,
        mode: 'markers',
        marker: {
            color: bubbleColor,
            size: bubbleY
          },
        text: bubbleText

    };
    var data = [trace1];

    var layout = {
        title: 'ID ' + subjectData.id + ' Bubble Chart',
        showlegend: false,
        height: 600,
        width: 1200
    };
    //  if chart exist restyle else plot new chart
    if (d3.select('#bubble').text()){
        console.log('restyle bubble');
        Plotly.restyle('bubble','x',[bubbleX]);
        Plotly.restyle('bubble','y',[bubbleY]);
        Plotly.restyle('bubble','text',[bubbleText]);
        // newMarker = {marker: {
        //     color: bubbleColor,
        //     size: bubbleY
        //   }};
        // Plotly.restyle('bubble','marker',[newMarker]);
        Plotly.restyle('bubble',{"marker.color":[bubbleColor]});
        Plotly.restyle('bubble',{"marker.size":[bubbleY]});
        Plotly.relayout('bubble','title','ID ' + subjectData.id + ' Bubble Chart');
    }else{
         console.log('init bubble');
        Plotly.newPlot('bubble',data,layout);
    }
}

// DOM Change response
d3.selectAll("#selDataset").on("change", switchSubject);

// Function called by DOM changes
function switchSubject() {
    // grab data again
    d3.json("data/samples.json").then((data) => {
        // store data
        var IDs = data.names;
        var metaData = data.metadata;
        var sampleData= data.samples
        
        // Grab value of DOM
        var DOM = d3.select("#selDataset");
        var subjectNum = DOM.property("value");

        // MetaData change
        var metaDiv = d3.select('#sample-metadata');
        // Remove old data
        metaDiv.select('p').text('');
        // Add new data
        var subjectData = metaData[subjectNum];
        Object.entries(subjectData).forEach((entry) =>{
            metaDiv.select('p').append('h6').text(entry[0]+': '+entry[1]);

        // Bar change
        // d3.select('#bar')
        buildBar(sampleData[subjectNum]);
        buildBubble(sampleData[subjectNum]);


    });
  });
    

  
}

// call initiation 
init();

