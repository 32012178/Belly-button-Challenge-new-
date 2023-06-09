// Set the URL of the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Load the data from the server and initialize the dashboard
function initDashboard() {
  d3.json(url).then(function(data) {
    // Get the list of sample IDs and add them to the dropdown menu
    let sampleIDs = data.samples.map(sample => sample.id);
    let dropdownMenu = d3.select("#selDataset");
    dropdownMenu.selectAll("option")
      .data(sampleIDs)
      .enter()
      .append("option")
      .text(id => id)
      .attr("value", id => id);

    // Update the charts and demographics panel with the first sample ID
    updateCharts(sampleIDs[0]);
    updateDemographics(sampleIDs[0]);
  });
}

// Update the charts and demographics panel when the user selects a new sample ID
function optionChanged(newID) {
  updateCharts(newID);
  updateDemographics(newID);
}

// Update the bar and bubble charts with the data for a new sample ID
function updateCharts(sampleID) {
  d3.json(url).then(function(data)  {
    let sample = data.samples.find(sample => sample.id == sampleID);
    let otuIDs = sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    let sampleValues = sample.sample_values.slice(0, 10);
    let otuLabels = sample.otu_labels.slice(0, 10);

    // build bar chart

    // set up the trace 1
    let trace1 = {
      x: sampleValues.reverse(),
      y: otuIDs.reverse(),
      text: otuLabels.reverse(),
      type: "bar",
      orientation: 'h'
    };

    //set up the layout
    let layout1 = {
      title: "Top 10 Bacterial Cultures Found"
    };
    Plotly.newPlot("bar", [trace1], layout1);

    // set up the bubble chart

    //create trace2
    let trace2 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      mode: 'markers',
      marker: {
        color: sample.otu_ids,
        size: sample.sample_values
      }
    };

    //set the layout for bubble chart
    let layout2 = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" }
    };
    Plotly.newPlot("bubble", [trace2], layout2);
  });
}

// Update the demographics panel with the metadata for a new sample ID

function updateDemographics(sampleID) {
  d3.json(url).then(function(data) {
    let metadata = data.metadata.find(sample => sample.id == sampleID);
    let panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append('p').text(`${key}: ${value}`);
    });
  });

  var wfreq = parseFloat(firstMetadata.wfreq);
  var guageData = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: wfreq,
    title: "Belly Button Washing Frequency",
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: {
        range: [0, 10], 
        tickwidth: 1, 
        tickcolor: "black"},
      bar: {color: "black"},
      steps: [
        {range: [0, 2], color: "red"},
        {range: [2, 4], color: "orange"},
        {range: [4, 6], color: "yellow"},
        {range: [6, 8], color: "lightgreen"},
        {range: [8, 10], color: "green"},
      ]}
  }];
  // Guage chart
  var guageLayout = {
    width: 500,
    height: 400,
    margin: {t: 0, r: 0, 1: 0, b: 0}
  };
  Plotly.newPlot("gauge", guageData, guageLayout)
}



// call the initialization functiion
initDashboard();