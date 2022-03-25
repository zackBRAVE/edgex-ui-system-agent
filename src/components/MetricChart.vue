<template>
  <v-chart class="chart" :option="option" :autoresize="autoresize" ref="chart" />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import VChart from 'vue-echarts'
import { ref, defineComponent } from 'vue'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  UniversalTransition,
])

export default defineComponent({
  name: 'MetricChart',
  components: {
    VChart,
  },
  props: {
    metricType: {
      type: String,
      required: true,
    },
    metricValue: {
      type: Array,
      required: true,
    },
    metricValue2: {
      type: Array,
      required: false,
    },
    timeArray: {
      type: Array,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  setup(props) {
    const autoresize = ref(true)
    const option = ref({
      tooltip: {
        show: true,
        trigger: 'axis',
        valueFormatter: value => value.toFixed(2) + '%',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#316ccc',
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.timeArray,
      },
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            margin: 2,
            formatter: '{value}%',
          },
        },
      ],
      grid: {
        left: 40,
        right: 20,
      },
      dataZoom: [
        {
          startValue: props.startTime,
        },
        {
          type: 'inside',
        },
      ],
      calculable: true,
      series: [
        {
          name: '',
          type: 'line',
          smooth: true,
          itemStyle: {
            color: '#518cee',
          },
          lineStyle: {
            color: '#518cee',
          },
          areaStyle: {
            color: '#316ccc',
          },
          data: props.metricValue,
        },
      ],
    })

    if (props.metricValue2) {
      option.value.series.push({
        name: '',
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#922C48',
        },
        lineStyle: {
          color: '#922C48',
        },
        areaStyle: {
          color: '#922C48',
        },
        data: props.metricValue2,
      })
    }

    return { autoresize, option }
  },
  created() {
    this.option.series[0].name = this.metricType
    this.option.series[0].data = this.metricValue
    this.option.xAxis.data = this.timeArray
  },
  mounted() {
    this.$refs.chart.chart.on('dataZoom', event => {
      if (event.batch) {
        this.option.dataZoom[0].end = event.batch[0].end
        this.option.dataZoom[0].start = event.batch[0].start
      } else {
        this.option.dataZoom[0].end = event.end
        this.option.dataZoom[0].start = event.start
      }
    })
  },
})
</script>

<style scoped>
.chart {
  height: 100%;
}
</style>
