function survivor(){
    var castaways = "castaways.csv";
    var contestant_table = "contestant_table.csv";
    var vote_history = "vote_history.csv";
    vis1(contestant_table);
    vis2(castaways);
    vis3(contestant_table);
    vis4(contestant_table);
    vis5(vote_history, castaways);
}

var vis1=function(contestant_table){
    d3.csv(contestant_table).then(function(data){
        console.log(data);

        var width = 1000;
        var height = 700;
        var padding = 70;

        var svg = d3.select("#vis1_plot")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

        var xScale = d3.scaleLinear()
                        .domain([d3.min(data, d=>parseInt(d.age)), d3.max(data, d=>parseInt(d.age))+1])
                        .range([padding, width - padding]);
        svg.append("g")
            .attr("transform", "translate(0," + (height-padding) + ")")
            .call(d3.axisBottom(xScale));

        var yScale = d3.scaleLinear()
                        .domain([d3.min(data, d=>parseInt(d.votes_against)), d3.max(data, d=>parseInt(d.votes_against))+1])
                        .range([height-padding, padding]);
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale));

        svg.selectAll("#vis1_plot")
            .data(data).enter()
            .append("circle")
            .attr("cx", d => xScale(d.age))
            .attr("cy", d => yScale(d.votes_against))
            .attr("r", 5)
            .attr("opacity", 0.6)
            .attr("fill", "green");
        
        // add labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width/2)
            .attr("y", height-padding+50)
            .attr("text-anchor", "middle")
            .text("Age");
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", -width/2+padding*2)
            .attr("y", 10)
            .attr("dy", "0.75em")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Number of Votes Against");
        
        svg.append("text")
            .attr("class", "plot-title")
            .attr("x", width/2)
            .attr("y", padding/2)
            .attr("font-size", "25px")
            .attr("text-anchor", "middle")
            .text("Number of Votes Against Each Contestant vs. Their Age");
    });
}

var vis2=function(castaways){
    d3.csv(castaways).then(function(data){
        console.log(data);

        var past_merge = data.filter(function(d){
            return d.result == "Sole Survivor" | d.result.includes("Runner") | d.result.includes("runner-up") | d.jury_status != "NA";
        })
        var all_data = d3.sort(d3.rollup(past_merge, v => v.length, d => d.personality_type));
        console.log(all_data);

        var sorted_ascending = d3.sort(all_data, function(a, b){ return d3.ascending(a[1], b[1])});
        var sorted_descending = d3.sort(all_data, function(a, b){ return d3.descending(a[1], b[1])});

        var types = d3.map(all_data, d=>d[0]);

        var width = 1000;
        var height = 650;
        var padding = 70;

        var svg = d3.selectAll("#vis2_plot")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
        
        var yScale = d3.scaleBand()
                        .domain(types)
                        .range([height-padding, padding]);
        var y_axis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .attr("class", "y_scale")
            .call(y_axis);

        var xScale = d3.scaleLinear()
                        .domain([ 0, d3.max(all_data, d=>d[1])+5 ])
                        .range([padding, width - padding]);
        svg.append("g")
            .attr("transform", "translate(0," + (height-padding) + ")")
            .call(d3.axisBottom(xScale));
        
        // svg.selectAll("#vis2_plot")
        //     .data(all_data).enter()
        //     .append("rect")
        //     .attr("x", d=>padding)
        //     .attr("y", d => yScale(d[0])+2 )
        //     .attr("width", d => xScale(d[1]-4.5) )
        //     .attr("height", 25)
        //     .attr("fill", "darkseagreen");
        
        var numCols = d3.max(all_data, d=>d[1])
        
        var data = d3.range(numCols);

        for (var i=0; i<all_data.length; i++) {
            var d_ = all_data[i][1];
            
            svg.selectAll("ppl")
                .data(data)
                .enter()
                .append("use")
                .attr("class", "pic"+i)
                .attr("xlink:href", "#iconCustom")
                .attr('x', function(d){ return xScale(d%numCols) })
                .attr('y', function(d){ return yScale(types[i]) })
                .attr('fill', function(d){ return d < d_ ? "darkseagreen" : "transparent" })
                .attr('stroke', function(d){ return d < d_ ? "green" : "transparent" })
                .attr("stroke-width", 0.4);
        }
        
        
        var icon = svg.append("defs")
                        .append("g")
                        .attr("id","iconCustom")
                        .append("path")
                        .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z")
                        .attr("transform", "scale(3.5)");
        
        // add labels
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width/2)
            .attr("y", height-padding/3)
            .attr("text-anchor", "middle")
            .text("Number of Individuals that Made it to the Jury");
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", -width/2+padding*2.5)
            .attr("y", 0)
            .attr("dy", "0.75em")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Personality Type");
        
        svg.append("text")
            .attr("class", "plot-title")
            .attr("x", width/2)
            .attr("y", padding/2)
            .attr("font-size", "25px")
            .attr("text-anchor", "middle")
            .text("Number of Individuals that Made it to the Jury Per Personality Type");
        
        var sort_val = 0;
        d3.select('#sort_button')
            .on('click', function(){
                if (sort_val == 1) {
                    var cur_sort = sorted_descending;
                } else if (sort_val == 0) {
                    var cur_sort = sorted_ascending;
                } else {
                    var cur_sort = all_data;
                }
                var types = d3.map(cur_sort, d => d[0]);
                var yScale = d3.scaleBand()
                    .domain(types)
                    .range([height-padding, padding]);
                var y_axis = d3.axisLeft(yScale);
                d3.selectAll("g.y_scale")
                    .transition()
                    .duration(1000)
                    .call(y_axis);

                // d3.selectAll("rect")
                //     .data(cur_sort)
                //     .transition()
                //     .duration(1000)
                //     .attr("y", function(d, i) { return yScale(types[i])+2 })
                //     .attr("width", d => xScale(d[1]-4.5) );
        
                for (var i=0; i<cur_sort.length; i++) {
                    var d_ = cur_sort[i][1];

                    d3.selectAll(".pic"+i)
                        .data(data)
                        .transition()
                        .duration(1000)
                        .attr('fill', function(d){ return d < d_ ? "darkseagreen" : "transparent" })
                        .attr('stroke', function(d){ return d < d_ ? "green" : "transparent" })
                }

                if (sort_val == 2) {
                    sort_val = 0;
                } else {
                    sort_val += 1;
                }
            }); 
    });
}

var vis3=function(contestant_table){
    d3.csv(contestant_table).then(function(data){
        var colors = ["#b4b8d4", "#ffc8c0", "#ffd860", "#9c8c94", "#e89c80", "#e8ac20"];

        var both = d3.rollup(data, v=>d3.sum(v, d=>d.votes_against), d=>parseInt(d.num_season), function(d) {
            if (d.poc == "1") { return "POC" } else { return "White" } }, function(d) {
            if (d.gender == "M") { return "Male" } else if (d.gender == "F") { return "Female" } else { return "Other" } });

        var seasons = Array.from(both.keys());
        var poc_keys = ["White", "POC"];
        var both_keys = ["White Male", "White Female", "White Other", "POC Male", "POC Female", "POC Other"];
        
        var by_both = [];
        for (var i=1; i<=seasons.length; i++) {
            var cur_both = Object.fromEntries(Array.from(both)[i-1][1]);
            var cur = {"Season": i};
            for (var j=0; j<poc_keys.length; j++) {
                var label_poc = poc_keys[j];
                var gender = Object.fromEntries(cur_both[label_poc]);
                if (gender["Male"] == undefined) {
                    cur[label_poc + " Male"] = 0;
                } else {
                    cur[label_poc + " Male"] = gender["Male"];
                }

                if (gender["Female"] == undefined) {
                    cur[label_poc + " Female"] = 0;
                } else {
                    cur[label_poc + " Female"] = gender["Female"];
                }

                if (gender["Other"] == undefined) {
                    cur[label_poc + " Other"] = 0;
                } else {
                    cur[label_poc + " Other"] = gender["Other"];
                }
                
            }
            by_both.push(cur);
        }
        console.log(by_both);

        var height = 700;
        var width = 1200;
        var padding = 80;

        var series = d3.stack().keys(both_keys);
        var stacked = series(by_both);

        var svg = d3.selectAll("#vis3_plot")
                    .append("svg")
                    .attr("height", height)
                    .attr("width", width);
        
        var xScale = d3.scaleBand()
                        .domain(seasons)
                        .range([padding, width-padding])
                        .paddingInner(0.1);
        var x_axis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("transform", "translate(0," + (height-padding) + ")")
            .call(x_axis);
        
        var yScale = d3.scaleLinear()
                        .domain([0, d3.max(by_both, function(d) {
                            return d3.sum(Object.values(d)) - d.Season;
                        })+7])
                        .range([height-padding, padding]);
        var y_axis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(y_axis);
        
        var groups = svg.selectAll(".gbars")
                        .data(stacked).enter()
                        .append("g")
                        .attr("fill", function(d, i){return colors[i]})
                        .attr("class", "gbars");

        var rects = groups.selectAll("rect")
            .data(function(d){
                return d;
            }).enter().append("rect")
            .attr("x", function(d, i){
                return xScale(i+1);
            })
            .attr("y", function(d){
                return yScale(d[1]);
            })
            .attr("width", function(d){
                return xScale.bandwidth();
            })
            .attr("height", function(d){
                return yScale(d[0]) - yScale(d[1]);
            });
        
        var legend_circles = svg.selectAll("#vis3_plot")
                                .attr("class", "legend_circles")
                                .data(colors).enter()
                                .append("circle")
                                .attr("cx", padding*2-20)
                                .attr("cy", function(d,i){ return padding+7 + i*20})
                                .attr("r", 5)
                                .attr("fill", function(d){return d});
        
        var legend_labels = svg.selectAll("#vis3_plot")
                                .attr("class", "legend_labels")
                                .data(both_keys).enter()
                                .append("text")
                                .attr("x", padding*2-10)
                                .attr("y", function(d,i){ return padding + 12.5 + i*20})
                                .text(function(d){return d});
    
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width/2)
            .attr("y", height-padding/2.5)
            .attr("text-anchor", "middle")
            .text("Season");
        
        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", -width/2+padding*3)
            .attr("y", 10)
            .attr("dy", "0.75em")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Total Votes Against");
        
        var plot_title = svg.append("text")
                            .attr("class", "plot-title")
                            .attr("x", width/2)
                            .attr("y", padding/2)
                            .attr("font-size", "25px")
                            .attr("text-anchor", "middle")
                            .text("Total Votes Against Individuals Within Each Gender and Racial Group Per Season");

        var radio = d3.select("#radio").attr("name", "stacked")
                        .on("change", function(d) {
                            var cur = d.target.value;
                            if (cur == "Gender") {
                                var keys = ["White Male", "POC Male", "White Female", "POC Female", "White Other", "POC Other"];
                                var colors = ["cornflowerblue", "cornflowerblue", "lightpink", "lightpink", "gold", "gold"];
                                var label_keys = ["Male", "Female", "Other", "", "", ""];

                                legend_circles.data(colors)
                                    .attr("cy", function(d, i){return padding+7 + (i%3)*20})
                                    .attr("fill", function(d, i) {return colors[(i-3)+(i-3)]});
                            
                                legend_labels.data(label_keys)
                                    .text(function(d){return d});

                            } else if (cur == "Racial") {
                                var keys = ["POC Male", "POC Female", "POC Other", "White Male", "White Female", "White Other"];
                                var colors = ["peru", "peru", "peru", "peachpuff", "peachpuff", "peachpuff"];
                                var label_keys = ["POC", "White", "", "", "", ""];

                                legend_circles.data(colors)
                                    .attr("cy", function(d, i){return padding+7 + (i%2)*20})
                                    .attr("fill", function(d, i) {return colors[(i-3)+(i-3)]});
                            
                                legend_labels.data(label_keys)
                                    .text(function(d){return d});

                            } else {
                                var colors = ["#b4b8d4", "#ffc8c0", "#ffd860", "#9c8c94", "#e89c80", "#e8ac20"];
                                var keys = both_keys;
                                var label_keys = keys;

                                legend_circles.data(colors)
                                    .attr("cy", function(d, i){return padding+7 + i*20})
                                    .attr("fill", function(d) {return d});
                                
                                legend_labels.data(label_keys)
                                    .text(function(d){return d});
                            }

                            var series = d3.stack().keys(keys);
                            var stacked = series(by_both);

                            d3.selectAll(".gbars")
                                .data(stacked)
                                .transition()
                                .duration(1500)
                                .attr("fill", function(d, i){ return colors[i]});

                            rects.data(d=>d)
                                .transition()
                                .duration(1500)
                                .attr("x", function(d, i){
                                    return xScale(i+1);
                                })
                                .attr("y", function(d){
                                    return yScale(d[1]);
                                })
                                .attr("width", function(d){
                                    return xScale.bandwidth();
                                })
                                .attr("height", function(d){
                                    return yScale(d[0]) - yScale(d[1]);
                                });

                            plot_title.text("Total Votes Against Individuals Within Each " + cur + " Group Per Season");
                        });
    });
}

var vis4=function(contestant_table){
    d3.csv(contestant_table).then(function(data){
        var width = 1000;
        var height = 800;

        var winners = d3.filter(data, d=>d.finish=="1");
        for (var i=0; i<winners.length; i++) {
            if (winners[i].state == "Washington DC") {
                winners[i].state = "District of Columbia"
            }
        }
        var grouped = d3.rollup(winners, v=>v.length, d=>d.state);
        console.log(grouped);

        var svg = d3.select("#vis4_plot")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);
        
        var tooltip = d3.select("#vis4_plot")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip");
                    
        const projection  = d3.geoAlbersUsa().scale(1300).translate([width/2, height/2]);
        const pathgeo = d3.geoPath().projection(projection);
        
        const statesmap = d3.json("us-states.json");

        var colorScale = d3.scaleSequential(d3.interpolateGreens)
                            .domain([0, d3.max(grouped.values())])

        statesmap.then(function(map){
            console.log(map);
            svg.selectAll("#vis4_plot")
                .data(map.features).enter()
                .append("path")
                .attr("d",pathgeo)
                .attr("fill", function(d) {
                    var val = Object.fromEntries(grouped)[d.properties.name];
                    if (val == undefined) {
                        return colorScale(0);
                    } else {
                        return colorScale(val)
                    }
                })
                .attr("stroke", "black")
                .attr("stroke-width", 0.5)
                .on("mouseover", function (e, d) {
                    tooltip.transition().duration(50).style("opacity", 0.9);
                })
                .on("mousemove", function (e, d) {
                    var state = d.properties.name;
                    if (grouped.get(state) == undefined) {
                        var cur_count = 0;
                    } else {
                        var cur_count = grouped.get(state);
                    }
                    tooltip.text(state + ": " + cur_count)
                            .style("top", (e.pageY-10)+"px")
                            .style("left", (e.pageX+10)+"px")
                })
                .on("mouseout", function (e, d) {
                    tooltip.transition().duration(50).style("opacity", 0)
                });

                var legendColorScale = d3.scaleSequential(d3.interpolateGreens)
                                .domain([0, d3.max(grouped.values())])
                var legend = d3.legendColor()
                                .scale(legendColorScale);
                svg.append("g")
                    .attr("transform", "translate(900,500)")
                    .call(legend)
                    .selectAll("rect")
                    .attr("stroke", "black")
                    .attr("stroke-width", 0.5);
            
                svg.append("text")
                    .attr("class", "plot-title")
                    .attr("x", width/2)
                    .attr("y", height/10)
                    .attr("font-size", "25px")
                    .attr("text-anchor", "middle")
                    .text("Total Number of Winners Per US State");
                
                svg.append("text")
                    .attr("class", "subtitle")
                    .attr("x", width/2)
                    .attr("y", height/10+25)
                    .attr("text-anchor", "middle")
                    .text("*Not shown: 2 winners from Ontario, Canada");
        })
    });
}

var vis5=function(vote_history, castaways){
    d3.csv(vote_history).then(function(vote){
        d3.csv(castaways).then(function(contestant){
            console.log(vote);

            var correct_votes = d3.filter(vote, function(d) {return d.vote_id == d.voted_out_id});
            var ppl = d3.rollup(correct_votes, v=>v.length, d=>parseInt(d.season), d=>d.castaway);
            console.log(ppl);

            var all_data = [];

            for (var i=1; i<=Array.from(ppl).length; i++) {
                var season = i;
                var cur = Object.fromEntries(ppl)[i];

                var cur_season = d3.filter(contestant, d=>parseInt(d.season) == season);

                for (var j=0; j<Array.from(cur).length; j++) {
                    var player = Array.from(cur.keys())[j];
                    var player_correctVotes = cur.get(player);
                    for (var p in cur_season) {
                        var current_player = cur_season[p].castaway;
                        var current_result = cur_season[p].result;
                        var current_jury = cur_season[p].jury_status;
                        if ((current_player == player) & (current_result == "Sole Survivor")) {
                            all_data.push({"season": season, "castaway": player, "result": "Sole Survivor", "correct votes": player_correctVotes});
                        } else if ((current_player == player) & ((current_result.includes("Runner")) | (current_result.includes("runner-up")))) {
                            all_data.push({"season": season, "castaway": player, "result": "Runner-up", "correct votes": player_correctVotes});
                        } else if ((current_player == player) & (current_jury != "NA")) {
                            all_data.push({"season": season, "castaway": player, "result": "Jury Member", "correct votes": player_correctVotes});
                        } else if ((current_player == player) & (current_jury == "NA")) {
                            all_data.push({"season": season, "castaway": player, "result": "Not on Jury", "correct votes": player_correctVotes});
                        }
                        
                    }
                }
            }
            console.log(all_data);

            var width = 900;
            var height = 700;
            var padding = 50;

            var svg = d3.select("#vis5_plot")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

            var sumstat = Array.from(d3.group(all_data, d=>d["result"]).values())
                            .map(function(d) {
                                console.log(d)
                                q1 = d3.quantile(d.map(function(g) { return g["correct votes"];}).sort(d3.ascending),.25)
                                median = d3.quantile(d.map(function(g) { return g["correct votes"];}).sort(d3.ascending),.5)
                                q3 = d3.quantile(d.map(function(g) { return g["correct votes"];}).sort(d3.ascending),.75)
                                interQuantileRange = q3 - q1
                                min = q1 - 1.5 * interQuantileRange
                                max = q3 + 1.5 * interQuantileRange
                                return({"result": d[0].result, "q1": q1, "median": median, "q3": q3, "interQuantileRange": interQuantileRange, "min": min, "max": max})
                            });
            console.log(sumstat);

            var xScale = d3.scaleBand()
                    .range([ padding, width-padding ])
                    .domain(["Sole Survivor", "Runner-up", "Jury Member", "Not on Jury"]);

            svg.append("g")
                .attr("transform", "translate(0," + (height-padding) + ")")
                .call(d3.axisBottom(xScale));
            
            var yScale = d3.scaleLinear()
                .domain([-3, 16])
                .range([height-padding, padding])
            svg.append("g")
                .attr("transform", "translate(" + padding + ",0)")
                .call(d3.axisLeft(yScale));

            var offset = 93.5;
            
            svg.selectAll("vertLines")
                .data(sumstat)
                .enter()
                .append("line")
                  .attr("x1", function(d){ return xScale(d.result)+offset })
                  .attr("x2", function(d){ return xScale(d.result)+offset })
                  .attr("y1", function(d){ return yScale(d.min) })
                  .attr("y2", function(d){ return yScale(d.max) })
                  .attr("stroke", "black")
                  .style("width", 40);
            
            var boxWidth = 100;
            svg.selectAll("boxes")
                .data(sumstat)
                .enter()
                .append("rect")
                    .attr("x", function(d){ return xScale(d.result)-boxWidth/2+offset })
                    .attr("y", function(d){ return yScale(d.q3) })
                    .attr("height", function(d){ return yScale(d.q1)-yScale(d.q3) })
                    .attr("width", boxWidth )
                    .attr("stroke", "black")
                    .style("fill", "darkseagreen");
            
            svg.selectAll("medianLines")
                .data(sumstat)
                .enter()
                .append("line")
                    .attr("x1", function(d){return xScale(d.result)-boxWidth/2+offset })
                    .attr("x2", function(d){return xScale(d.result)+boxWidth/2+offset })
                    .attr("y1", function(d){return yScale(d.median) })
                    .attr("y2", function(d){return yScale(d.median) })
                    .attr("stroke", "black")
                    .style("width", 80);
                
            var jitterWidth = 50
            svg.selectAll("indPoints")
                .data(all_data)
                .enter()
                .append("circle")
                .attr("cx", function(d){return xScale(d.result) - jitterWidth/2 + Math.random()*jitterWidth + offset})
                .attr("cy", function(d){return yScale(d["correct votes"]) })
                .attr("r", 4)
                .style("fill", "green")
                .attr("opacity", 0.5)
                .attr("stroke", "black")
                .attr("stroke-width", 0.5)
            
            // add labels
            svg.append("text")
                .attr("class", "axis-label")
                .attr("x", width/2)
                .attr("y", height)
                .attr("text-anchor", "middle")
                .text("Result");
            
            svg.append("text")
                .attr("class", "axis-label")
                .attr("x", -width/2+100)
                .attr("y", 0)
                .attr("dy", "0.75em")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .text("Number of Correct Votes");
            
            svg.append("text")
                .attr("class", "plot-title")
                .attr("x", width/2)
                .attr("y", padding/2)
                .attr("font-size", "25px")
                .attr("text-anchor", "middle")
                .text("Number of Times an Individual Voted Correctly Per Result Category");
        });
    });
}