import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/zh-cn';

// 扩展插件
dayjs.extend(relativeTime);
dayjs.extend(calendar);

// 设置语言
dayjs.locale('zh-cn');

export default dayjs; 