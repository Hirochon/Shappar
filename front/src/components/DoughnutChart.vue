<script>
import { Doughnut, mixins } from 'vue-chartjs'
export default {
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.renderChart(this.chartData, {
      legend: {
        labels: {
          fontColor: 'white'
        }
      },
      tooltips: {
        callbacks: {
          title: function (tooltipItem, data) {
            return ''
          },
          afterBody (tooltipItem, data) {
            let total = 0
            data.datasets[0].data.forEach(item => {
              total += item
            })
            return Math.floor(data.datasets[0].data[tooltipItem[0].index] / total * 100) + '%'
          }
        }
      }
    })
  },
  methods: {
    render () {
      this.renderChart(this.chartData, this.options)
    }
  }
}
</script>
