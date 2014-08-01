
var ocstackedbarchart = {

	/**
	 * allocated - the percentage allocated
	 * spent - the percentage spent
	 * overbudget - the percentage overbudget
	 * selector - the id of the element to 
	 * department - the label for the y axis
	 *
	 * e.g if a county budget allocated is 100M and they spent 20M
	 * ocstackedbarchart(100, 20, 0, '#divid', '%');
	 *
	 * e.g if a county budget allocated is 100M and they spent 125M
	 * ocstackedbarchart(100, 0, 25, '#div2id', '%');
	 *
	 */
	create: function(allocated, spent, overbudget, selector, department) {


		var dataset = [
			{
				data: [{
					dept: department,
					percent: spent	
				}],
				name: 'Spent'
			
			},
			{
				data: [{
					dept: department,
					percent: allocated	
				}],
				name: 'Allocated'
			
			},
			{
				data: [{
					dept: department,
					percent: overbudget	
				}],
				name: 'Over Budget'			
			}
		];

		var margins = {
	          	top: 20,
	        	left: 50,
	            right: 24,
	            bottom: 30
	        },
	        legendPanel = {
	          width: 180
	        },
        
            width = 900 - margins.left - margins.right - legendPanel.width,
            height = 100 - margins.top - margins.bottom,
            series = dataset.map(function (d) {
                return d.name;
            }),
            dataset = dataset.map(function (d) {
                return d.data.map(function (o, i) {
                    return {
                        y: o.percent,
                        x: o.dept
                    };
                });
            }),
            stack = d3.layout.stack();
            stack(dataset);

        var dataset = dataset.map(function (group) {
          return group.map(function (d) {
            // Invert the x and y values, and y0 becomes x0
            return {
              x: d.y,
              y: d.x,
              x0: d.y0
            };
          });
        });

        svg = d3.select(selector)
              .append('svg')
              .attr('width', width + margins.left + margins.right + legendPanel.width)
              .attr('height', height + margins.top + margins.bottom)
              .append('g')
              .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')'),
              xMax = d3.max(dataset, function (group) {
                  return d3.max(group, function (d) {
                      return d.x + d.x0;
                  });
              }),
              xScale = d3.scale.linear()
                  .domain([0, xMax])
                  .range([0, width]),
              months = dataset[0].map(function (d) {
                  return d.y;
              }),
              _ = console.log(months),
              yScale = d3.scale.ordinal()
                  .domain(months)
                  .rangeRoundBands([0, height], .1),
              xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient('bottom'),
              yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient('left'),
              //colours = d3.scale.category10(),
              colours = ["#77cf25","#f3f3f4", "#d1001e"],
              groups = svg.selectAll('g')
                  .data(dataset)
                  .enter()
                  .append('g')
                  .style('fill', function (d, i) {
                  return colours[i];
              }),
              rects = groups.selectAll('rect')
                  .data(function (d) {
                  return d;
              })
                  .enter()
                  .append('rect')
                  .attr('x', function (d) {
                  return xScale(d.x0);
              })
                  .attr('y', function (d, i) {
                  return yScale(d.y);
              })
                  .attr('height', function (d) {
                  return yScale.rangeBand();
              })
                  .attr('width', function (d) {
                  return xScale(d.x);
              })
                    

              svg.append('g')
                  .attr('class', 'axis')
                  .attr('transform', 'translate(0,' + height + ')')
                  .call(xAxis);

              svg.append('g')
                  .attr('class', 'axis')
                  .call(yAxis);

              svg.append('rect')
                .attr('fill', 'white')
                .attr('width', 160)
                .attr('height', 30 * dataset.length)
                .attr('x', width + margins.left)
                .attr('y', 0);

              series.forEach(function (s, i) {
                  svg.append('text')
                      .attr('fill', 'black')
                      .attr('x', width + margins.left + 8)
                      .attr('y', i * 24 + 24)
                      .text(s);
                  svg.append('rect')
                      .attr('fill', colours[i])
                      .attr('width', 60)
                      .attr('height', 20)
                      .attr('x', width + margins.left + 90)
                      .attr('y', i * 24 + 6);
              });

	}
}