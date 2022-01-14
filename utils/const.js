// 维修状态
export const serviceStatus = [
    { name: '全部', value: 1 },
    { name: '待付款', value: 2 },
    { name: '派单中', value: 3 },
    { name: '待签到', value: 4 },
    { name: '维修中', value: 5 },
    { name: '已取消', value: 6 },
    { name: '已完工', value: 7 },
]

// 预警状态
export const warnStatus = [
    { name: '全部', value: null },
    { name: '忽略', value: -1 },
    { name: '未处理', value: 0 },
    { name: '已处理', value: 1 },
]

// 提醒方式
export const remindTypes = [
    { name: '运行时长', value: 1,unit:'小时' },
    { name: '按周', value: 2,unit:'周' },
    { name: '按月', value: 3,unit:'月' },
    { name: '按年', value: 4,unit:'年' },
]

// 学习资料类型
export const studyTypeList = [
    { name: '视频类', value: '1' },
    { name: '图片类', value: '2' },
    { name: '压缩包类', value: '3' },
    { name: 'PDF类', value: '4' },
    { name: 'office类', value: '5' }
]

export const cloudBoxWarnTypeList = [
    { name: '全部', value: null },
    { name: '忽略', value: -1 },
    { name: '待处理', value: 0 },
    { name: '已处理', value: 1 }
]
