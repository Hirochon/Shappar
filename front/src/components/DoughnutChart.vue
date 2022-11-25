<script>
import { Doughnut, mixins } from 'vue-chartjs'
export default {
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  props: ['chartData'],
  methods: {
    render () {
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted () {
    // console.log('mounted at')
    this.renderChart(this.chartData, {
      legend: {
        labels: {
          fontColor: 'white'
        }
      },
      tooltips: {
        // enabled: false
        // position: 'average'
        callbacks: {
          title: function (tooltipItem, data) {
            return ''
          },
          afterBody (tooltipItem, data) {
            var total = 0
            // console.log(data.datasets[0].data)
            // console.log(tooltipItem)
            // console.log(data.datasets[0].data[tooltipItem[0].index])
            data.datasets[0].data.forEach(item => {
              total += item
            })
            // console.log(total)
            // console.log(data.datasets[0].data[tooltipItem[0].index] / total * 100)
            return Math.floor(data.datasets[0].data[tooltipItem[0].index] / total * 100) + '%'
          }
        }
      }
      // responsive: true
    })
  }
}
</script>
