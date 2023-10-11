//Use the D3 library to read in samples.json from the URL
const queryUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


// function to create bar charts (takes d3 data, and subject id (default 0))
// def and subject are functionally the same
function barChart(data, def){
    // BAR CHART

    // getting otu ids as strings
    let y = data.samples[def].otu_ids.map(String)
    // adding label to otu ids
    y = y.map((otu) => "OTU ".concat(otu))

    // creating data traces for bar chart
    let barTrace = {
        y: y,
        x: data.samples[def].sample_values,
        text: data.samples[def].otu_labels,
        type: "bar",
        //sorting bars
        transforms:[{
            type: 'sort',
            target: 'x',
            order: 'ascending'
        }],
        //changing graph to horizontal
        orientation: 'h'
    };

    // taking only top ten otu ids
    barTrace.x = barTrace.x.slice(0, 10)
    barTrace.y = barTrace.y.slice(0, 10)

    let barData = [barTrace]

    Plotly.newPlot("bar", barData);
}

// function to create bar charts
function bubbleChart(data, def){
        // BUBBLE CHART
        let trace = {
            x: data.samples[def].otu_ids,
            y: data.samples[def].sample_values,
            mode: 'markers',
            marker: {
                size: data.samples[def].sample_values,
                color: data.samples[def].otu_ids
            },
            text: data.samples[def].otu_labels
        }
        let bubbleData = [trace]
        Plotly.newPlot("bubble", bubbleData)
}

// function to create subject metadata card
function metadata(data, def){
    // SUBJECT METADATA
    let metadata = Object.values(data.metadata[def])


    let id = 'id: '.concat(String(metadata[0]), '</br>')

    let ethnicity = 'ethnicity: '.concat(String(metadata[1]), '</br>')
    let gender = 'gender: '.concat(String(metadata[2]), '</br>')
    let age = 'age: '.concat(String(metadata[3]), '</br>')
    let location = 'location: '.concat(String(metadata[4]), '</br>')
    let bbtype = 'bbtype: '.concat(String(metadata[5]), '</br>')
    let wfreq = 'wfreq: '.concat(String(metadata[6]))

    let output = id.concat(ethnicity, gender, age, location, bbtype, wfreq)

    d3.select("#sample-metadata").html(output)
}

function init(){
    d3.json(queryUrl).then(function(data, def = '0'){

        //initializing charts with default subject id of 0
        barChart(data, def)


        bubbleChart(data, def)


        metadata(data, def)





        // array to hold subject ids
        let dropdownIds = []

        //looping through all subject ids
        for(let i = 0; i < data.metadata.length; i++){
            dropdownIds.push(String(data.metadata[i].id))
        }
        // populating dropdown
        let dropDown = d3.select('#selDataset')
        let options = dropDown.selectAll('option').data(dropdownIds).enter().append('option')
        options.text(function(id){return id})
            .attr('value', function(id){return id})
        
    })

}

// function to update plotly charts based on user dropdown choice
function updatePlotly(subject){
    d3.json(queryUrl).then(function(data){

        //creating an array to hold all subject ids
        let dropdownIds = []

        //looping through all subject ids
        for(let i = 0; i < data.metadata.length; i++){
            dropdownIds.push(String(data.metadata[i].id))
        }
        // updating bar plotly charts using chosen subject id
        barChart(data, dropdownIds.indexOf(subject))
        bubbleChart(data, dropdownIds.indexOf(subject))
        metadata(data, dropdownIds.indexOf(subject))
    })
    
}

init()
