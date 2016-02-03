/* global Plotly:false */

suite('Plotly.plot', function() {

    benchmark('scatter', function() {

        Plotly.plot(this.graphDiv, [{
            x: [1, 2, 3],
            y: [2, 1, 2]
        }]);

    });

    benchmark('bar', function() {

        Plotly.plot(this.graphDiv, [{
            type: 'bar',
            x: [1, 2, 3],
            y: [2, 1, 2]
        }]);

    });

}, {

    setup: function() {
        this.graphDiv = document.createElement('div');
        document.body.appendChild(this.graphDiv);
    },
    teardown: function() {
        document.body.removeChild(this.graphDiv);
        this.graphDiv = null;
    }
});

// suite('Plotly.restyle', function() {
// 
//     benchmark('scatter', function() {
// 
//         Plotly.plot(this.graphDiv, [{
//             x: [1, 2, 3],
//             y: [2, 1, 2]
//         }])
//         .then(function() {
//             Plotly.restyle(this.graphDiv, 'marker.color', 'red')
//         })
// 
//     });
// 
//     benchmark('bar', function() {
// 
//         Plotly.plot(this.graphDiv, [{
//             type: 'bar',
//             x: [1, 2, 3],
//             y: [2, 1, 2]
//         }])
//         .then(function() {
//             Plotly.restyle(this.graphDiv, 'marker.color', 'red')
//         })
// 
//     });
// 
// }, {
// 
//     setup: function() {
//         this.graphDiv = document.createElement('div');
//         document.body.appendChild(this.graphDiv);
//     },
//     teardown: function() {
//         document.body.removeChild(this.graphDiv);
//         this.graphDiv = null;
//     }
// });
