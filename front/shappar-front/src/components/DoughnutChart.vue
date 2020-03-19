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
    console.log('mounted at')
    this.renderChart(this.chartData, {
      legend: {
        display: true, // 凡例の削除 → 全てのグラフ
        labels: {
          fontColor: 'white'
        },
        tooltips: {
          mode: 'index'
        }
      },
      responsive: true
    })
  }
}
</script>
