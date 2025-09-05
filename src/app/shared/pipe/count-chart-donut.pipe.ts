import { Chart, ChartType } from 'chart.js';

const plugin = {
  id: 'centerText',
  afterDraw(chart: Chart) {
    const type = (chart.config as any).type as ChartType;

    if (type === 'doughnut') {
      const { ctx, data } = chart;
      const total = (data.datasets[0].data as number[])
        .reduce((a, b) => a + b, 0);

      const { width, height } = chart;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0f5096';

      ctx.font = 'bold 18px Arial';
      ctx.fillText(total.toString(), width / 2, height / 2.5);

      ctx.font = '13px Arial';
      ctx.fillText('phương tiện', width / 2, height / 2);

      ctx.restore();
    }
  }
};

export const centerTextPlugin = plugin;
