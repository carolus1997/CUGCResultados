// http://www.chartjs.org/docs/#radar-chart-introduction

var data = {
    labels: ["Mando y Control", "Situación", "Decisión", "Comunicación"],
    datasets: [
        
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19]
        }
    ]
};

var ctx = document.getElementById("myChart").getContext("2d");
var myRadarChart = new Chart(ctx).Radar(data);
