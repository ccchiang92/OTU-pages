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

        // Gauge plot, main just using documentation code
        // Could add a lot more like pointer, text on increment etc
        var data = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: subjectData.wfreq,
              title: { text: "Belly Button Wash Frequency", font: { size: 36 } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "green" },
                bar: { color: "#6495ED" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: '#FFFFFF' },
                  { range: [1, 2], color: "#EEEEFF" },
                  { range: [2, 3], color: "#DDDDFF" },
                  { range: [3, 4], color: "#CCCCFF" },
                  { range: [4, 5], color: "#AAAAFF" },
                  { range: [5, 6], color: "#8888FF" },
                  { range: [6, 7], color: "#6666FF" },
                  { range: [7, 8], color: "#4444FF" },
                  { range: [8, 9], color: "#1111FF" },
                ],
              }
            }
          ];
          var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "Gainsboro",
            font: { color: "Indigo", family: "Arial" }
          };
          Plotly.newPlot('gauge', data, layout);

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
        Plotly.restyle('bubble','x',[bubbleX]);
        Plotly.restyle('bubble','y',[bubbleY]);
        Plotly.restyle('bubble','text',[bubbleText]);
        Plotly.restyle('bubble',{"marker.color":[bubbleColor]});
        Plotly.restyle('bubble',{"marker.size":[bubbleY]});
        Plotly.relayout('bubble','title','ID ' + subjectData.id + ' Bubble Chart');
    }else{
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
        buildBar(sampleData[subjectNum]);
        // Bubble Change
        buildBubble(sampleData[subjectNum]);

        // Update wash frequency
        Plotly.restyle('gauge','value',[subjectData.wfreq]);
        

    });
  });
    

  
}

// call initiation 
init();

